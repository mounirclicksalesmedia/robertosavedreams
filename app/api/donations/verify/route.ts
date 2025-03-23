import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment, formatAmount } from '@/app/lib/lenco';

// Handle POST requests from Lenco webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    console.log('Received webhook from Lenco:', body);

    // Verify the payment with Lenco
    const verificationResponse = await verifyPayment(reference);

    // Check if payment was successful
    if (verificationResponse.status && verificationResponse.data.status === 'success') {
      // Here you would update your database to mark the donation as completed
      console.log('Payment verified successfully via webhook:', {
        reference,
        status: verificationResponse.data.status,
        amount: verificationResponse.data.amount
      });
      
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        data: verificationResponse.data
      });
    } else {
      console.log('Payment verification failed via webhook:', {
        reference,
        status: verificationResponse.data?.status || 'unknown'
      });
      
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed',
        data: verificationResponse.data
      });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

// Handle GET requests for client-side verification
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reference = searchParams.get('reference');
    
    if (!reference) {
      return NextResponse.json(
        { error: 'Missing payment reference' },
        { status: 400 }
      );
    }
    
    console.log('Verifying payment from client:', { reference });
    
    try {
      const verificationResponse = await verifyPayment(reference);
      
      if (!verificationResponse || !verificationResponse.data) {
        console.error('Invalid verification response:', verificationResponse);
        return NextResponse.json(
          { error: 'Invalid response from payment provider' },
          { status: 502 }
        );
      }
      
      const paymentData = verificationResponse.data;
      
      // Check if payment was successful
      if (paymentData.status !== 'success') {
        console.log('Payment verification failed from client:', {
          reference,
          status: paymentData.status
        });
        
        return NextResponse.json(
          { 
            error: `Payment verification failed: ${paymentData.status}`,
            status: paymentData.status,
            reference: paymentData.reference
          },
          { status: 400 }
        );
      }
      
      console.log('Payment verified successfully from client:', {
        reference,
        status: paymentData.status,
        amount: paymentData.amount
      });
      
      // Return successful verification
      return NextResponse.json({
        success: true,
        reference: paymentData.reference,
        amount: paymentData.amount / 100, // Convert from smallest currency unit
        formattedAmount: formatAmount(paymentData.amount / 100, 'USD'),
        status: paymentData.status,
        paidAt: paymentData.paidAt || new Date().toISOString()
      });
    } catch (verifyError: any) {
      console.error('Payment verification error:', verifyError);
      
      return NextResponse.json(
        { 
          error: `Verification error: ${verifyError.message}`,
          details: verifyError
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('Payment verification request error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to verify payment',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 