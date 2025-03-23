'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setError('No payment reference found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/donations/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment');
        }

        setPaymentDetails(data.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while verifying your payment');
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#1D942C]/5 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-[#1D942C] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xl text-gray-600">Verifying your donation...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h1>
              <p className="text-xl text-gray-600 mb-8">{error}</p>
              <Link 
                href="/donate" 
                className="inline-block bg-[#1D942C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300"
              >
                Try Again
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-[#1D942C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Thank You for Your Donation!</h1>
                <p className="text-xl text-gray-600">
                  Your generous contribution will help us make a difference in the lives of many.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Donation Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">
                      {paymentDetails?.currency || 'NGN'} {((paymentDetails?.amount || 0) / 100).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium text-gray-900">{paymentDetails?.reference || reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Successful</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {paymentDetails?.paidAt 
                        ? new Date(paymentDetails.paidAt).toLocaleString() 
                        : new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-6">
                <p className="text-gray-600">
                  We've sent a receipt to your email. If you have any questions about your donation, 
                  please contact our support team.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/" 
                    className="inline-block bg-[#1D942C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Return to Home
                  </Link>
                  <Link 
                    href="/impact" 
                    className="inline-block bg-white border-2 border-[#1D942C] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#1D942C]/5 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    See Your Impact
                  </Link>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
} 