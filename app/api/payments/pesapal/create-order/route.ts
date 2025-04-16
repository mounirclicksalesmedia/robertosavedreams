import { NextResponse } from 'next/server';

// PesaPal Configuration
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || 'dAuxF1mPZ48IkdCbQIskajhhcQtyq2XO';
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || 'kl48WutzfDiLtFxz4LwsGEPWsMs=';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Use PesaPal API 3.0 endpoints as per documentation
const PESAPAL_API_URL = IS_PRODUCTION 
  ? 'https://pay.pesapal.com/v3/api'  // Production URL
  : 'https://cybqa.pesapal.com/pesapalv3/api'; // Sandbox URL

// Fallback to direct merchant URL in case API integration fails
const MERCHANT_URL = 'https://pay.pesapal.com/eXi8M'; // Your merchant-specific link from PesaPal dashboard

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, frequency, donorInfo } = body;

    // More robust amount validation with detailed logging
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
    
    console.log('PesaPal API - Received amount:', amount, 
                'Type:', typeof amount, 
                'Parsed amount:', numAmount,
                'Final valid amount:', validAmount);

    // Generate a unique order ID
    const orderId = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      // Step 1: Get auth token
      console.log('Attempting to get PesaPal auth token...');
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
        const tokenError = await tokenResponse.text();
        console.error('PesaPal token request failed:', tokenError, 'Status:', tokenResponse.status);
        throw new Error(`Failed to get PesaPal token: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.token) {
        console.error('No token in PesaPal response:', tokenData);
        throw new Error('Invalid token response from PesaPal');
      }
      
      const token = tokenData.token;
      console.log('Successfully obtained PesaPal auth token');

      // Step 2: Submit order
      console.log('Preparing order submission...');
      const orderRequest = {
        id: orderId,
        currency: "USD",
        amount: parseFloat(validAmount),
        description: "Donation to Roberto Save Dreams Foundation",
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://robertosavedreamsfoundation.org'}/donate/thank-you`,
        redirect_mode: "0", // Redirect back to application
        billing_address: {
          email_address: donorInfo.email,
          phone_number: donorInfo.phone || "",
          country_code: donorInfo.country || "US",
          first_name: donorInfo.name.split(' ')[0] || "",
          last_name: donorInfo.name.split(' ').slice(1).join(' ') || ""
        }
      };

      console.log('Submitting order to PesaPal:', orderRequest);
      const orderResponse = await fetch(`${PESAPAL_API_URL}/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderRequest)
      });

      // Get full response content for debugging
      const orderResponseText = await orderResponse.text();
      
      if (!orderResponse.ok) {
        console.error('PesaPal order submission failed:', orderResponseText, 'Status:', orderResponse.status);
        throw new Error(`Failed to submit order: ${orderResponse.status} - ${orderResponseText}`);
      }

      let orderData;
      try {
        // Try to parse the response as JSON
        orderData = JSON.parse(orderResponseText);
        console.log('PesaPal order successfully submitted:', orderData);
        
        if (orderData.redirect_url) {
          return NextResponse.json({
            success: true,
            redirectUrl: orderData.redirect_url,
            orderId: orderId
          });
        }
      } catch (parseError) {
        console.error('Failed to parse PesaPal response:', parseError);
      }
      
      // If we reached here, something went wrong with the response or it's not in the expected format
      throw new Error('Invalid or unexpected response from PesaPal');
      
    } catch (apiError) {
      // API integration failed, fall back to direct merchant URL
      console.error('PesaPal API integration failed, falling back to direct merchant URL:', apiError);
      
      // Build fallback URL with basic parameters
      const fallbackUrl = `${MERCHANT_URL}?amount=${validAmount}&currency=USD&id=${orderId}&description=Donation&first_name=${encodeURIComponent(donorInfo.name.split(' ')[0] || '')}&last_name=${encodeURIComponent(donorInfo.name.split(' ').slice(1).join(' ') || '')}&email=${encodeURIComponent(donorInfo.email || '')}&phone=${encodeURIComponent(donorInfo.phone || '')}`;
      
      console.log('Using fallback URL:', fallbackUrl);
      
      return NextResponse.json({
        success: true,
        redirectUrl: fallbackUrl,
        orderId: orderId,
        fallback: true
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