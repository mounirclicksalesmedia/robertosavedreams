import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define constants - PRODUCTION CREDENTIALS
// These are live production credentials
const PESAPAL_CONSUMER_KEY = '4OgxPPOapZTKJfowFM+eJ+LAFYQwdEK4';  // Replace with actual live key
const PESAPAL_CONSUMER_SECRET = 'YeVQDJHM7xBM/oPh9j+YPkLwfz4=';   // Replace with actual live secret
const IS_PRODUCTION = true;

// Use the correct production URL
const PESAPAL_API_URL = 'https://pay.pesapal.com/pesapalv3/api';

// Define base URL for callbacks
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://robertosavedreamsfoundation.org';

// Define IPN URL
const IPN_URL = `${BASE_URL}/api/payments/pesapal/ipn-handler`;

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
      
      // Step 1.5: Register IPN (needed for proper API operation)
      let notificationId = "production_donation"; // Default fallback
      
      try {
        console.log('Registering IPN with PesaPal production API...');
        const ipnResponse = await fetch(`${PESAPAL_API_URL}/URLSetup/RegisterIPN`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            url: IPN_URL,
            ipn_notification_type: 'GET'
          })
        });
        
        const ipnResponseText = await ipnResponse.text();
        console.log('IPN registration response:', ipnResponseText);
        
        if (ipnResponse.ok) {
          try {
            const ipnData = JSON.parse(ipnResponseText);
            console.log('IPN registration successful, ID:', ipnData.ipn_id);
            if (ipnData.ipn_id) {
              notificationId = ipnData.ipn_id;
            }
          } catch (e) {
            console.error('Failed to parse IPN response');
          }
        } else {
          console.warn('IPN registration failed, using default notification ID');
        }
      } catch (ipnError) {
        console.error('IPN registration error:', ipnError);
        // Continue with default notification ID
      }
      
      // Step 2: Submit order request
      const callbackUrl = `${BASE_URL}/donate/thank-you`;
      
      // Prepare the order data with proper production parameters
      const orderData = {
        id: orderId,
        currency: "USD",
        amount: parseFloat(validAmount),
        description: "Donation to Roberto Save Dreams Foundation",
        callback_url: callbackUrl,
        notification_id: notificationId,
        redirect_mode: "1",  // Use 1 for production
        billing_address: {
          email_address: donorInfo.email || 'customer@example.com',
          phone_number: donorInfo.phone || '',
          country_code: donorInfo.country ? donorInfo.country.substring(0, 2).toUpperCase() : "US",
          first_name: donorInfo.name?.split(' ')[0] || 'Anonymous',
          last_name: donorInfo.name?.split(' ').slice(1).join(' ') || 'Donor',
          line_1: "",
          line_2: "",
          city: "",
          state: "",
          postal_code: "",
          zip_code: ""
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
        console.error('Order submission error details:', orderResponseText);
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
        
        // Fall back to a direct PesaPal iframe payment URL (sandbox)
        console.log('Falling back to direct iframe payment URL...');
        
        // Use iframe URL directly - try a simpler approach
        // For production, use the /iframe direct URL which should work for live payments
        const directUrl = 'https://pay.pesapal.com/iframe'; // Always use production iframe
        
        // Generate a simple form with minimal parameters
        const formFields = {
          OrderTrackingId: orderId,
          Amount: validAmount,
          Currency: 'USD',
          Description: 'Donation to Roberto Save Dreams Foundation',
          Email: donorInfo.email || 'customer@example.com',
          FirstName: donorInfo.name?.split(' ')[0] || 'Anonymous',
          LastName: donorInfo.name?.split(' ').slice(1).join(' ') || 'Donor',
          PhoneNumber: donorInfo.phone || '',
          CallbackUrl: callbackUrl
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
      
      // Fall back to a direct PesaPal iframe payment URL due to API error...
      
      // Use iframe URL directly - try a simpler approach
      // This is the correct URL format for Pesapal payments
      const directUrl = 'https://pay.pesapal.com/iframe'; // Always use production iframe
      
      // Define callback URL
      const callbackUrl = `${BASE_URL}/donate/thank-you`;
      
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
        CallbackUrl: callbackUrl
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
      
      console.log('Using HTML form redirect to PesaPal iframe due to API error');
      
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