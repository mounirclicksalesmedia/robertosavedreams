import { NextResponse } from 'next/server';

// PesaPal Configuration
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || 'dAuxF1mPZ48IkdCbQIskajhhcQtyq2XO';
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || 'kl48WutzfDiLtFxz4LwsGEPWsMs=';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Use PesaPal API 3.0 endpoints as per documentation
const PESAPAL_API_URL = IS_PRODUCTION 
  ? 'https://pay.pesapal.com/v3/api'  // Production URL
  : 'https://cybqa.pesapal.com/pesapalv3/api'; // Sandbox URL

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

    // Step 1: Get auth token
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
      console.error('PesaPal token request failed:', tokenError);
      throw new Error(`Failed to get PesaPal token: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.token;

    console.log('Successfully obtained PesaPal auth token');

    // Step 2: Submit order
    const orderRequest = {
      id: orderId,
      currency: "USD",
      amount: validAmount,
      description: "Donation to Roberto Save Dreams Foundation",
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://robertosavedreamsfoundation.org'}/donate/thank-you`,
      notification_id: "ipn_notification_id", // You should register an IPN and use its ID
      billing_address: {
        email_address: donorInfo.email,
        phone_number: donorInfo.phone || "",
        country_code: donorInfo.country || "US",
        first_name: donorInfo.name.split(' ')[0] || "",
        middle_name: "",
        last_name: donorInfo.name.split(' ').slice(1).join(' ') || "",
        line_1: "",
        line_2: "",
        city: "",
        state: "",
        postal_code: "",
        zip_code: ""
      }
    };

    const orderResponse = await fetch(`${PESAPAL_API_URL}/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderRequest)
    });

    if (!orderResponse.ok) {
      const orderError = await orderResponse.text();
      console.error('PesaPal order submission failed:', orderError);
      throw new Error(`Failed to submit PesaPal order: ${orderResponse.status}`);
    }

    const orderData = await orderResponse.json();
    
    console.log('PesaPal order successfully submitted:', orderData);

    // Return the redirect URL from PesaPal response
    return NextResponse.json({
      success: true,
      redirectUrl: orderData.redirect_url,
      orderId: orderId
    });
  } catch (error) {
    console.error('PesaPal payment error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process PesaPal payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 