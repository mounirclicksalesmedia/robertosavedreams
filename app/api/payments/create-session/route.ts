import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, customer, frequency, metadata, paymentProvider } = body;

    // Generate a unique reference
    const reference = `DON_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Check for required fields
    if (!amount || !customer || !customer.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Default to PesaPal if not specified
    const provider = paymentProvider || 'pesapal';

    // Handle based on payment provider
    if (provider === 'pesapal') {
      // Redirect to our PesaPal endpoint
      return NextResponse.json({
        success: true,
        useCustomEndpoint: true,
        endpoint: '/api/payments/pesapal/create-order'
      });
    } else if (provider === 'lenco') {
      // Lenco payment flow
      try {
        // Ensure Lenco API secret exists
        if (!process.env.LENCO_API_SECRET) {
          console.error('Missing Lenco API Secret');
          throw new Error('Payment gateway configuration error');
        }

        // Create payment session with Lenco
        const response = await fetch('https://api.lenco.co/v1/payments/initialize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LENCO_API_SECRET}`,
          },
          body: JSON.stringify({
            amount,
            currency: currency || 'USD',
            reference,
            customer: {
              name: customer.name,
              email: customer.email,
              phone: customer.phone || '',
            },
            metadata: {
              ...metadata,
              frequency,
              customer_country: customer.country || '',
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Lenco API error:', errorData);
          throw new Error(errorData.message || 'Failed to create payment session');
        }

        const data = await response.json();

        return NextResponse.json({
          success: true,
          reference: data.reference,
          authorization_url: data.authorization_url,
        });
      } catch (error) {
        console.error('Lenco payment session error:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: error instanceof Error ? error.message : 'Failed to create payment session'
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported payment provider' },
        { status: 400 }
      );
    }
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