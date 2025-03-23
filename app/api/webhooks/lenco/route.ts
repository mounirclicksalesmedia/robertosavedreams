import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Signature key from Lenco for webhook verification
const LENCO_WEBHOOK_SECRET = process.env.LENCO_WEBHOOK_SECRET || 'ada0af5d32718376d26ba840febf8c1a5ca6902a38e6a651498cfd2d289c3b28';

/**
 * Verify that the webhook request is coming from Lenco using the signature
 */
function verifyLencoWebhook(payload: string, signature: string): boolean {
  try {
    // Calculate HMAC using the webhook secret
    const hmac = crypto.createHmac('sha256', LENCO_WEBHOOK_SECRET);
    const calculatedSignature = hmac.update(payload).digest('hex');
    
    // Compare calculated signature with the one from the header
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch (error) {
    console.error('Error verifying Lenco webhook signature:', error);
    return false;
  }
}

/**
 * Process webhook notifications from Lenco
 */
export async function POST(request: NextRequest) {
  try {
    // Get signature from header
    const signature = request.headers.get('x-lenco-signature') || '';
    
    if (!signature) {
      console.error('Missing signature in Lenco webhook request');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }
    
    // Get raw request body as text
    const payload = await request.text();
    
    // Verify webhook signature
    if (!verifyLencoWebhook(payload, signature)) {
      console.error('Invalid signature in Lenco webhook request');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Parse the payload into JSON
    const data = JSON.parse(payload);
    console.log('Received valid Lenco webhook:', data);
    
    // Handle different event types
    const event = data.event;
    const reference = data.data?.reference;
    
    switch (event) {
      case 'payment.successful':
        await handleSuccessfulPayment(data);
        break;
        
      case 'payment.failed':
        await handleFailedPayment(data);
        break;
        
      default:
        console.log(`Received unhandled Lenco webhook event type: ${event}`);
    }
    
    // Always respond with 200 to acknowledge receipt
    return NextResponse.json({ received: true });
    
  } catch (error: any) {
    console.error('Error processing Lenco webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment notification
 */
async function handleSuccessfulPayment(data: any) {
  try {
    const { reference, amount, status, paidAt } = data.data || {};
    
    console.log(`Payment successful: ${reference} - ${amount} - ${status}`);
    
    // Update payment status in your database
    // await updatePaymentStatus(reference, 'success', amount);
    
    // Send confirmation email to the donor
    // await sendPaymentConfirmationEmail(data.data.customer.email);
    
  } catch (error) {
    console.error('Error handling successful payment webhook:', error);
  }
}

/**
 * Handle failed payment notification
 */
async function handleFailedPayment(data: any) {
  try {
    const { reference, amount, status, failureReason } = data.data || {};
    
    console.log(`Payment failed: ${reference} - ${amount} - ${status} - Reason: ${failureReason}`);
    
    // Update payment status in your database
    // await updatePaymentStatus(reference, 'failed', amount, failureReason);
    
  } catch (error) {
    console.error('Error handling failed payment webhook:', error);
  }
} 