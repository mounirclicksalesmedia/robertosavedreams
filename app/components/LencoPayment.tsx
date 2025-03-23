import { useState } from 'react';

interface LencoPaymentProps {
  amount: number;
  frequency: string;
  donorInfo: {
    name: string;
    email: string;
    phone: string;
    country: string;
  };
  onSuccess: (reference: string) => void;
  onError: (error: string) => void;
}

export default function LencoPayment({ amount, frequency, donorInfo, onSuccess, onError }: LencoPaymentProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create payment session
      const response = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to kobo/cents
          currency: 'NGN',
          customer: {
            name: donorInfo.name,
            email: donorInfo.email,
            phone: donorInfo.phone,
            country: donorInfo.country
          },
          frequency: frequency,
          metadata: {
            type: 'donation'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const data = await response.json();
      
      // Initialize Lenco payment
      const lenco = (window as any).Lenco;
      if (!lenco) {
        throw new Error('Lenco SDK not loaded');
      }

      lenco.initialize({
        key: process.env.NEXT_PUBLIC_LENCO_PUBLIC_KEY,
        amount: amount * 100,
        currency: 'NGN',
        reference: data.reference,
        email: donorInfo.email,
        onSuccess: (response: any) => {
          setLoading(false);
          onSuccess(response.reference);
        },
        onError: (error: any) => {
          setLoading(false);
          onError(error.message || 'Payment failed');
        },
        onClose: () => {
          setLoading(false);
        }
      });
    } catch (error) {
      setLoading(false);
      onError(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-4 px-6 ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#1D942C] hover:bg-[#167623]'
        } text-white rounded-lg shadow-md transition-colors duration-200 text-lg font-medium flex items-center justify-center`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </button>
    </div>
  );
} 