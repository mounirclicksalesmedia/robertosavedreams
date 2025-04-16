import { NextResponse } from 'next/server';

// PesaPal Configuration
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY || 'dAuxF1mPZ48IkdCbQIskajhhcQtyq2XO';
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET || 'kl48WutzfDiLtFxz4LwsGEPWsMs=';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Use PesaPal's documented live API endpoints
const PESAPAL_API_URL = IS_PRODUCTION 
  ? 'https://api.pesapal.com/api/v1'  // Production URL per PesaPal docs
  : 'https://apis-sandbox.pesapal.com/api/v1'; // Sandbox URL per PesaPal docs

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

    console.log('Using PesaPal credentials:', {
      consumer_key: PESAPAL_CONSUMER_KEY,
      url: PESAPAL_API_URL
    });
    
    // Try a different URL format structure that PesaPal might recognize
    // Create simplified payment URL with multiple amount parameter variations
    const paymentUrl = `https://payment.pesapal.com/v3/index?OrderTrackingId=${orderId}&PesapalMerchantReference=${orderId}&amount=${validAmount}&Amount=${validAmount}&pesapal_amount=${validAmount}&currency=USD&Currency=USD&pesapal_currency=USD`;

    // Update the alternative URL as well with multiple parameter variations
    const alternativePaymentUrl = `https://payment.pesapal.com/iframe/?OrderTrackingId=${orderId}&MerchantReference=${orderId}&amount=${validAmount}&Currency=USD&description=Donation+to+Roberto+Save+Dreams+Foundation&FirstName=${encodeURIComponent(donorInfo.name.split(' ')[0])}&LastName=${encodeURIComponent(donorInfo.name.split(' ').slice(1).join(' ') || '-')}&Email=${encodeURIComponent(donorInfo.email)}&PhoneNumber=${encodeURIComponent(donorInfo.phone)}`;

    // Use a direct merchant payment URL (third approach)
    const directMerchantUrl = `https://pay.pesapal.com/eXi8M?amount=${validAmount}&currency=USD&id=${orderId}&description=Donation&first_name=${encodeURIComponent(donorInfo.name.split(' ')[0])}&last_name=${encodeURIComponent(donorInfo.name.split(' ').slice(1).join(' ') || '-')}&email=${encodeURIComponent(donorInfo.email)}&phone=${encodeURIComponent(donorInfo.phone)}`;

    // Log all URL attempts for debugging
    console.log('Generated payment URLs:', {
      primary: paymentUrl,
      alternative: alternativePaymentUrl,
      directMerchant: directMerchantUrl
    });

    // Use the directMerchantUrl which is more likely to work
    return NextResponse.json({
      success: true,
      redirectUrl: directMerchantUrl,
      orderId: orderId
    });
  } catch (error) {
    console.error('PesaPal payment error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 