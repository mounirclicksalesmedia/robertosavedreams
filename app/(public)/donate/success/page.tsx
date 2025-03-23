'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatAmount } from '@/app/lib/lenco';

interface PaymentVerificationResult {
  success: boolean;
  reference: string;
  amount: number;
  formattedAmount: string;
  status: string;
  error?: string;
  orderId?: string;
}

function DonationSuccess() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentVerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const reference = searchParams.get('reference') || '';
  
  // Verify the payment status when the page loads
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Use reference from URL or localStorage
        const paymentReference = reference || localStorage.getItem('lastDonationReference') || '';
        
        if (!paymentReference) {
          setError('No payment reference was provided');
          setLoading(false);
          return;
        }
        
        // For mock payments, handle locally with data from localStorage
        if (paymentReference.startsWith('mock_')) {
          const storedAmount = Number(localStorage.getItem('donationAmount') || 0);
          
          setPaymentData({
            success: true,
            reference: paymentReference,
            amount: storedAmount,
            formattedAmount: formatAmount(storedAmount, 'USD'),
            status: 'Mock Payment Completed'
          });
          
          // Remove stored values once used
          localStorage.removeItem('lastDonationReference');
          localStorage.removeItem('donationAmount');
          
          setLoading(false);
          return;
        }
        
        // Verify with API for real payments
        const response = await fetch(`/api/donations/verify?reference=${paymentReference}`, {
          method: 'GET',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment');
        }
        
        setPaymentData(data);
        
        // Clear stored data after successful verification
        localStorage.removeItem('lastDonationReference');
        localStorage.removeItem('donationAmount');
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setError(error.message || 'There was an error verifying your payment.');
      } finally {
        setLoading(false);
      }
    };
    
    verifyPayment();
  }, [reference]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 border-4 border-[#1D942C]/30 border-t-[#1D942C] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800">Verifying your donation...</h2>
          <p className="text-gray-600 mt-2">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }
  
  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error || 'We could not verify your payment at this time.'}</p>
          <div className="space-y-4">
            <Link 
              href="/donate"
              className="block w-full py-3 bg-[#1D942C] text-white rounded-lg font-medium hover:bg-[#167623] transition-colors text-center"
            >
              Try Again
            </Link>
            <Link 
              href="/"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-[#1D942C] to-[#167623] p-8 text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Thank You for Your Donation!</h1>
            <p className="text-white/80 text-lg mt-2">Your contribution will make a real difference.</p>
          </div>
          
          <div className="p-8">
            <div className="mb-8 bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Donation Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-gray-900 text-xl">{paymentData.formattedAmount}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Reference:</span>
                  <span className="text-gray-900">{paymentData.reference}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {paymentData.status || 'Successful'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Impact</h3>
                <p className="text-gray-600">
                  Your donation will help provide education, healthcare, and economic opportunities to those in need.
                </p>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  You will receive an email confirmation with details of your donation shortly.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/donate"
                    className="py-3 px-6 bg-[#1D942C] text-white rounded-lg font-medium hover:bg-[#167623] transition-colors"
                  >
                    Donate Again
                  </Link>
                  
                  <Link 
                    href="/"
                    className="py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Return Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the component with Suspense to fix the searchParams error
export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 border-4 border-[#1D942C]/30 border-t-[#1D942C] rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800">Loading...</h2>
        </div>
      </div>
    }>
      <DonationSuccess />
    </Suspense>
  );
} 