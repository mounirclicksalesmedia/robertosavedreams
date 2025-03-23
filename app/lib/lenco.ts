// Lenco Payment API Integration
// Documentation: https://lenco-api.readme.io/reference/introduction

// Correct URL structure from Lenco documentation
const LENCO_BASE_URL = 'https://api.lenco.co';
// API keys
const LENCO_SECRET_KEY = process.env.LENCO_API_SECRET || '861945cc1a41ce0c48cf7755058cd49c72e30538d15ba338184638880221bdeb';
const LENCO_API_KEY = process.env.LENCO_API_KEY || 'pub-8610c85908dfae3c88fea280d7936f7bd3755238d902bc34';

// Disable mock mode for real payment processing
const MOCK_MODE = false;

interface LencoPaymentRequest {
  amount: number;
  currency: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

interface LencoPaymentResponse {
  status: boolean;
  message: string;
  data: {
    reference: string;
    amount: number;
    paymentUrl: string;
    paymentReference: string;
  };
}

export async function createPaymentLink(paymentData: LencoPaymentRequest): Promise<LencoPaymentResponse> {
  try {
    console.log('Creating payment link with Lenco:', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      email: paymentData.email,
      reference: paymentData.reference
    });
    
    // Use mock response in test mode
    if (MOCK_MODE) {
      console.log('MOCK MODE: Returning mock payment response');
      // Ensure we're using the full URL to the mock payment page
      const mockPaymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/mock-payment?ref=${paymentData.reference}&amount=${paymentData.amount}`;
      console.log('Mock payment URL:', mockPaymentUrl);
      
      return {
        status: true,
        message: "Payment link created successfully",
        data: {
          reference: paymentData.reference,
          amount: paymentData.amount,
          paymentUrl: mockPaymentUrl,
          paymentReference: `mock_${paymentData.reference}`
        }
      };
    }
    
    // Real payment integration with Lenco API
    // Based on Lenco's API documentation
    const apiEndpoint = '/access/v2/payments/initialize';
    console.log('Sending payment request to Lenco API:', `${LENCO_BASE_URL}${apiEndpoint}`);
    
    // Prepare the payment data according to Lenco documentation
    const paymentRequestData = {
      amount: paymentData.amount,
      currency: paymentData.currency,
      email: paymentData.email,
      first_name: paymentData.firstName,
      last_name: paymentData.lastName,
      phone: paymentData.phone || '',
      reference: paymentData.reference,
      callback_url: paymentData.callbackUrl,
      metadata: paymentData.metadata || {},
      webhook_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhooks/lenco`
    };
    
    // Log full request for debugging
    console.log('Lenco payment request data:', JSON.stringify(paymentRequestData, null, 2));
    
    const response = await fetch(`${LENCO_BASE_URL}${apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LENCO_SECRET_KEY}`,
        'x-api-key': LENCO_API_KEY
      },
      body: JSON.stringify(paymentRequestData)
    });
    
    // Log response status for debugging
    console.log('Lenco API response status:', response.status, response.statusText);
    
    if (!response.ok) {
      // Check content type to handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('Lenco API error (JSON):', errorData);
        throw new Error(errorData.message || `Failed to create payment link: ${response.status} ${response.statusText}`);
      } else {
        // Handle non-JSON responses (like HTML error pages)
        const errorText = await response.text();
        console.error('Lenco API error (non-JSON):', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          errorTextPreview: errorText.substring(0, 200) + '...'
        });
        throw new Error(`Failed to create payment link: ${response.status} ${response.statusText}`);
      }
    }

    // Parse the successful response
    const responseData = await response.json();
    console.log('Lenco payment link created successfully:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error creating Lenco payment link:', error);
    throw error;
  }
}

export async function verifyPayment(reference: string): Promise<any> {
  try {
    console.log('Verifying payment with Lenco:', { reference });
    
    // Use mock response in test mode
    if (MOCK_MODE) {
      console.log('MOCK MODE: Returning mock verification response');
      return {
        status: true,
        message: "Payment verified successfully",
        data: {
          reference: reference,
          amount: 10000, // Example amount
          status: "success",
          paidAt: new Date().toISOString()
        }
      };
    }
    
    // Real verification integration with Lenco API
    const apiEndpoint = `/access/v2/payments/verify/${reference}`;
    console.log('Sending verification request to Lenco API:', `${LENCO_BASE_URL}${apiEndpoint}`);
    
    const response = await fetch(`${LENCO_BASE_URL}${apiEndpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LENCO_SECRET_KEY}`,
        'x-api-key': LENCO_API_KEY
      }
    });
    
    // Log response status for debugging
    console.log('Lenco verification API response status:', response.status, response.statusText);

    if (!response.ok) {
      // Check content type to handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('Lenco verification API error (JSON):', errorData);
        throw new Error(errorData.message || `Failed to verify payment: ${response.status} ${response.statusText}`);
      } else {
        // Handle non-JSON responses (like HTML error pages)
        const errorText = await response.text();
        console.error('Lenco verification API error (non-JSON):', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          errorTextPreview: errorText.substring(0, 200) + '...'
        });
        throw new Error(`Failed to verify payment: ${response.status} ${response.statusText}`);
      }
    }

    const responseData = await response.json();
    console.log('Lenco payment verification successful:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error verifying Lenco payment:', error);
    throw error;
  }
}

// Helper function to format amount for display
export function formatAmount(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
} 