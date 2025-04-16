import { NextResponse } from 'next/server';

// PesaPal Configuration
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || 'dAuxF1mPZ48IkdCbQIskajhhcQtyq2XO';
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || 'kl48WutzfDiLtFxz4LwsGEPWsMs=';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// The correct API URLs for PesaPal
const PESAPAL_API_URL = IS_PRODUCTION 
  ? 'https://pay.pesapal.com/v3'  // Production URL
  : 'https://cybqa.pesapal.com/v3'; // Sandbox URL

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, frequency, donorInfo } = body;

    // Generate a unique order ID
    const orderId = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    console.log('Using PesaPal credentials:', {
      consumer_key: PESAPAL_CONSUMER_KEY,
      url: PESAPAL_API_URL
    });

    // First, get the auth token
    const authResponse = await fetch(`${PESAPAL_API_URL}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET
      })
    });

    // Check if the response is valid JSON
    const contentType = authResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await authResponse.text();
      console.error('Non-JSON response from PesaPal Auth:', textResponse.substring(0, 200));
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid response from payment provider',
        error: 'Received non-JSON response'
      });
    }

    const authData = await authResponse.json();
    console.log('Auth Response:', authData);

    if (!authData.token) {
      console.error('PesaPal Auth Error:', authData);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to authenticate with PesaPal. Please check API credentials.',
        error: authData 
      });
    }

    // Create order with the token
    const orderPayload = {
      id: orderId,
      currency: 'USD',
      amount: amount.toString(),
      description: `${frequency === 'one-time' ? 'One-time' : 'Monthly'} donation to Roberto Save Dreams Foundation`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://robertosavedreamsfoundation.org'}/donate/thank-you`,
      notification_id: `notify-${orderId}`,
      billing_address: {
        email_address: donorInfo.email,
        phone_number: donorInfo.phone,
        country_code: donorInfo.country,
        first_name: donorInfo.name.split(' ')[0],
        last_name: donorInfo.name.split(' ').slice(1).join(' ') || '-',
      }
    };

    console.log('Submitting order:', orderPayload);

    const orderResponse = await fetch(`${PESAPAL_API_URL}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${authData.token}`
      },
      body: JSON.stringify(orderPayload)
    });

    // Check if the order response is valid JSON
    const orderContentType = orderResponse.headers.get('content-type');
    if (!orderContentType || !orderContentType.includes('application/json')) {
      const textResponse = await orderResponse.text();
      console.error('Non-JSON response from PesaPal Order:', textResponse.substring(0, 200));
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid order response from payment provider',
        error: 'Received non-JSON response'
      });
    }

    const orderData = await orderResponse.json();
    console.log('Order Response:', orderData);

    if (orderData.redirect_url) {
      return NextResponse.json({
        success: true,
        redirectUrl: orderData.redirect_url,
        orderId: orderId
      });
    } else {
      console.error('PesaPal Order Error:', orderData);
      return NextResponse.json({
        success: false,
        message: 'Failed to create payment order',
        error: orderData
      });
    }
  } catch (error) {
    console.error('PesaPal payment error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 