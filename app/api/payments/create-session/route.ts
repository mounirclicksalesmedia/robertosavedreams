import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, customer, frequency, metadata } = body;

    // Generate a unique reference
    const reference = `DON_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create payment session with Lenco
    const response = await fetch('https://api.lenco.co/v1/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LENCO_API_SECRET}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        reference,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        metadata: {
          ...metadata,
          frequency,
          customer_country: customer.country,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment session');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      reference: data.reference,
      authorization_url: data.authorization_url,
    });
  } catch (error) {
    console.error('Payment session creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create payment session'
      },
      { status: 500 }
    );
  }
} 