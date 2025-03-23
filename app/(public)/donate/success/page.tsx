'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DonationSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    async function verifyPayment() {
      if (!reference) {
        setError('Invalid payment reference');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Verifying payment on success page:', { reference });
        const response = await fetch(`/api/donations/verify?reference=${reference}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify payment');
        }
        
        setPaymentDetails(data);
        console.log('Payment details retrieved:', data);
      } catch (err: any) {
        console.error('Payment verification error on success page:', err);
        setError(err.message || 'Failed to verify payment status');
      } finally {
        setIsLoading(false);
      }
    }
    
    verifyPayment();
  }, [reference]);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gradient-to-br from-[#1D942C] to-[#167623] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Thank You
              <span className="block text-[#ffc500] mt-2">For Your Donation</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-[#1D942C]/30 border-t-[#1D942C] rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-xl font-medium text-gray-700">Verifying your donation...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
              <p className="text-gray-600 mb-8">{error}</p>
              <Link href="/donate" className="inline-block px-6 py-3 bg-[#1D942C] text-white rounded-lg font-medium hover:bg-[#167623] transition-colors">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Donation Successful!</h2>
                <p className="text-xl text-gray-600">Your contribution will make a real difference</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium text-gray-900">{reference}</span>
                  </div>
                  {paymentDetails && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-gray-900">{paymentDetails.formattedAmount || '$0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">Completed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium text-gray-900">
                          {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="text-center space-y-6">
                <p className="text-gray-700">
                  We've sent a receipt to your email address. Thank you for your generosity and for helping us make dreams come true!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/" className="px-6 py-3 bg-[#1D942C] text-white rounded-lg font-medium hover:bg-[#167623] transition-colors">
                    Return to Home
                  </Link>
                  <Link href="/impact" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    See Your Impact
                  </Link>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Have questions about your donation? Contact us at <a href="mailto:support@robertosavedreams.org" className="text-[#1D942C] hover:underline">support@robertosavedreams.org</a>
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
} 