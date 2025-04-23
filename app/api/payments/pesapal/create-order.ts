import { NextResponse } from 'next/server';

// PesaPal Configuration
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || 'dAuxF1mPZ48IkdCbQIskajhhcQtyq2XO';
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || 'kl48WutzfDiLtFxz4LwsGEPWsMs=';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const PESAPAL_API_URL = IS_PRODUCTION 
  ? 'https://pay.pesapal.com/pesapalv3'
  : 'https://cybqa.pesapal.com/pesapalv3';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, frequency, donorInfo } = body;

    // Generate a unique order ID
    const orderId = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

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

    const authData = await authResponse.json();
    console.log('Auth Response:', authData);

    if (!authData.token) {
      console.error('PesaPal Auth Error:', authData);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to authenticate with PesaPal',
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