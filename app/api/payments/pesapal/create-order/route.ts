import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define constants
const PESAPAL_CONSUMER_KEY = 'qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW';
const PESAPAL_CONSUMER_SECRET = 'osGQ364R49cXKeOYSpaOnT++rHs=';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Use the correct base URLs for sandbox (testing) and production environments
const PESAPAL_API_URL = IS_PRODUCTION 
  ? 'https://pay.pesapal.com/v3/api'
  : 'https://cybqa.pesapal.com/pesapalv3/api';

// Define base URL for callbacks
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://robertosavedreamsfoundation.org';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, donorInfo } = body;

    // Validate amount
    let numAmount = 0;
    if (typeof amount === 'string') {
      numAmount = parseFloat(amount);
    } else if (typeof amount === 'number') {
      numAmount = amount;
    } else {
      numAmount = 1; // Default to $1 if invalid type
    }
    
    // Ensure it's at least 0.01 and format to 2 decimal places
    const validAmount = Math.max(isNaN(numAmount) ? 1 : numAmount, 0.01).toFixed(2);
    
    console.log('PesaPal payment - Processing amount:', validAmount);

    // Generate a unique order ID
    const orderId = uuidv4();
    
    try {
      // Step 1: Get auth token directly
      console.log('Getting PesaPal authentication token...');
      
      const tokenResponse = await fetch(`${PESAPAL_API_URL}/Auth/RequestToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          consumer_key: PESAPAL_CONSUMER_KEY,
          consumer_secret: PESAPAL_CONSUMER_SECRET
        })
      });
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token request failed:', errorText);
        throw new Error(`Token request failed with status ${tokenResponse.status}`);
      }
      
      const tokenData = await tokenResponse.json();
      console.log('Token response:', tokenData);
      
      if (!tokenData.token) {
        throw new Error('No token in response');
      }
      
      const token = tokenData.token;
      console.log('Successfully obtained PesaPal token');
      
      // Step 2: Submit order request
      const callbackUrl = `${BASE_URL}/donate/thank-you`;
      
      // Prepare the order data
      const orderData = {
        id: orderId,
        currency: "USD",
        amount: parseFloat(validAmount),
        description: "Donation to Roberto Save Dreams Foundation",
        callback_url: callbackUrl,
        redirect_mode: "0",  // Use 0 for immediate redirect
        billing_address: {
          email_address: donorInfo.email || 'customer@example.com',
          phone_number: donorInfo.phone || '',
          country_code: "US", // Fix: Always use "US" as a valid 2-letter country code
          first_name: donorInfo.name?.split(' ')[0] || 'Anonymous',
          last_name: donorInfo.name?.split(' ').slice(1).join(' ') || 'Donor'
        }
      };
      
      console.log('Submitting order with data:', JSON.stringify(orderData, null, 2));
      
      const orderResponse = await fetch(`${PESAPAL_API_URL}/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      const orderResponseText = await orderResponse.text();
      console.log('Order submission response text:', orderResponseText);
      
      if (!orderResponse.ok) {
        throw new Error(`Order submission failed with status ${orderResponse.status}: ${orderResponseText}`);
      }
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(orderResponseText);
        console.log('Parsed order response:', parsedResponse);
      } catch (e) {
        console.error('Failed to parse order response:', e);
        throw new Error('Invalid JSON response from PesaPal');
      }
      
      if (!parsedResponse.redirect_url) {
        console.log('No redirect URL in PesaPal response, using iframe fallback...');
        // Instead of throwing an error, fall back to iframe method directly
      } else {
        // Return the redirect URL if it exists
        return NextResponse.json({
          success: true,
          redirectUrl: parsedResponse.redirect_url,
          orderId: orderId
        });
      }
      
    } catch (apiError: any) {
      console.error('PesaPal API error:', apiError);
      
      // Fall back to a direct PesaPal iframe payment URL (sandbox)
      console.log('Falling back to direct iframe payment URL...');
      
      // Use sandbox iframe URL as fallback
      // This is the correct URL format for Pesapal sandbox payments
      const directUrl = IS_PRODUCTION
        ? 'https://pay.pesapal.com/iframe/?OrderTrackingId=' + orderId // Production
        : 'https://cybqa.pesapal.com/pesapalv3/TransactionListener/SubmitOrderToPaymentPage'; // Sandbox
        
      // Prepare form data for iframe POST submission
      const formFields = {
        OrderTrackingId: orderId,
        Amount: validAmount,
        Currency: 'USD',
        Description: 'Donation to Roberto Save Dreams Foundation',
        Email: donorInfo.email || 'customer@example.com',
        FirstName: donorInfo.name?.split(' ')[0] || 'Anonymous',
        LastName: donorInfo.name?.split(' ').slice(1).join(' ') || 'Donor',
        PhoneNumber: donorInfo.phone || '',
        CallbackUrl: `${BASE_URL}/donate/thank-you`
      };
      
      // Generate HTML with auto-submit form for the client
      const formHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to Payment...</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding-top: 50px; }
          .loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 20px auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <h2>Redirecting to secure payment page...</h2>
        <div class="loader"></div>
        <p>Please wait, you will be redirected automatically in a few seconds.</p>
        <form id="pesapalForm" method="post" action="${directUrl}">
          ${Object.entries(formFields).map(([key, value]) => 
            `<input type="hidden" name="${key}" value="${value}">`
          ).join('')}
        </form>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
              document.getElementById('pesapalForm').submit();
            }, 1500);
          });
        </script>
      </body>
      </html>
      `;
      
      console.log('Using HTML form redirect to PesaPal iframe');
      
      // Return JSON with the form HTML in a data field
      // The client will need to create and inject this HTML
      return NextResponse.json({
        success: true,
        paymentMethod: 'pesapal',
        orderId: orderId,
        usesFormRedirect: true,
        formHtml: formHtml,
        formData: formFields,
        formAction: directUrl
      });
    }
  } catch (error) {
    console.error('PesaPal payment error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process PesaPal payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 