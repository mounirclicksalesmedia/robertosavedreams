import { NextRequest, NextResponse } from 'next/server';
import { createPaymentLink, formatAmount } from '@/app/lib/lenco';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      amount, 
      firstName, 
      lastName, 
      email, 
      phone, 
      donationFrequency,
      metadata 
    } = body;

    if (!amount || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      );
    }

    // Generate a unique reference for this payment
    const reference = `donation_${uuidv4()}`;
    
    // Create payment link with Lenco
    const paymentData = {
      amount: Math.round(numericAmount * 100), // Convert to smallest currency unit (kobo/cents) and ensure it's an integer
      currency: 'NGN', // Nigerian Naira as default
      email,
      firstName,
      lastName,
      phone,
      reference,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/donate/success`,
      metadata: {
        donationFrequency,
        originalAmount: numericAmount, // Store the original amount for reference
        formattedAmount: formatAmount(numericAmount, 'USD'),
        ...metadata
      }
    };

    console.log('Initializing payment with Lenco:', {
      amount: numericAmount,
      amountInKobo: paymentData.amount,
      email,
      reference,
      callbackUrl: paymentData.callbackUrl
    });

    try {
      const paymentResponse = await createPaymentLink(paymentData);

      if (!paymentResponse || !paymentResponse.data) {
        console.error('Invalid response from Lenco API:', paymentResponse);
        return NextResponse.json(
          { error: 'Invalid response from payment provider' },
          { status: 502 }
        );
      }

      // Log successful payment initialization
      console.log('Payment initialized successfully:', {
        reference: paymentResponse.data.reference,
        paymentUrl: paymentResponse.data.paymentUrl,
        amount: numericAmount
      });

      return NextResponse.json({
        success: true,
        paymentUrl: paymentResponse.data.paymentUrl,
        reference: paymentResponse.data.reference,
        paymentReference: paymentResponse.data.paymentReference,
        amount: numericAmount,
        formattedAmount: formatAmount(numericAmount, 'USD')
      });
    } catch (lencoError: any) {
      console.error('Lenco API error:', lencoError);
      
      // Provide more detailed error information
      const errorMessage = typeof lencoError === 'object' && lencoError.message 
        ? lencoError.message 
        : 'Failed to connect to payment provider';
        
      return NextResponse.json(
        { 
          error: `Payment error: ${errorMessage}`,
          details: lencoError
        },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to initialize payment',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 