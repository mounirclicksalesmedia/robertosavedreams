import { NextResponse } from 'next/server';

// PesaPal Configuration
const PESAPAL_BUSINESS_LINK = 'https://pay.pesapal.com/eXi8M'; // Your merchant-specific link from PesaPal dashboard

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, donorInfo } = body;

    // More robust amount validation
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
    const orderId = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Create direct payment URL with merchant link
    // This is the most reliable approach as it uses PesaPal's direct payment page
    const directPaymentUrl = `${PESAPAL_BUSINESS_LINK}?` + new URLSearchParams({
      amount: validAmount,
      currency: 'USD',
      id: orderId,
      description: 'Donation to Roberto Save Dreams Foundation',
      first_name: donorInfo.name.split(' ')[0] || '',
      last_name: donorInfo.name.split(' ').slice(1).join(' ') || '',
      email: donorInfo.email || '',
      phone: donorInfo.phone || ''
    }).toString();
    
    console.log('Using direct PesaPal payment URL:', directPaymentUrl);
    
    return NextResponse.json({
      success: true,
      redirectUrl: directPaymentUrl,
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