'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatAmount } from '@/app/lib/lenco';

function MockPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const reference = searchParams.get('ref') || '';
  const amountInCents = Number(searchParams.get('amount') || 0);
  const amount = amountInCents / 100; // Convert from cents to dollars
  
  const handleCompletePayment = () => {
    if (isProcessing || isComplete) return;
    
    setIsProcessing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // If we have the original amount from localStorage, use that instead of the URL parameter
      const originalAmount = localStorage.getItem('donationAmount');
      const finalAmount = originalAmount ? Number(originalAmount) : amount;
      
      // Save the reference and amount to localStorage to be picked up by the success page
      localStorage.setItem('lastDonationReference', `mock_${reference}`);
      localStorage.setItem('donationAmount', finalAmount.toString());
      
      setIsComplete(true);
      
      // Redirect to success page
      router.push(`/donate/success?reference=mock_${reference}`);
    }, 1500);
  };
  
  // If no reference is provided, redirect to donate page
  useEffect(() => {
    if (!reference) {
      router.push('/donate');
    }
  }, [reference, router]);
  
  if (!reference) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#1D942C] to-[#167623] p-6">
          <h1 className="text-2xl font-bold text-white text-center">Mock Payment Page</h1>
          <p className="text-white/80 text-center mt-1">This is a simulation of a payment gateway</p>
        </div>
        
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="inline-block p-3 bg-[#1D942C]/10 rounded-full mb-3">
              <svg className="w-8 h-8 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Donation Payment</h2>
            <p className="text-gray-600 text-sm">Reference: {reference}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="text-2xl font-bold text-gray-900">{formatAmount(amount, 'USD')}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg flex flex-col items-center">
                <span className="font-medium text-gray-800">Credit Card</span>
                <div className="flex space-x-2 mt-2">
                  <svg className="w-8 h-5" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="4" fill="#016FD0"/>
                    <path d="M22.0322 26.6729H25.9174V15.3271H22.0322V26.6729Z" fill="white"/>
                    <path d="M22.2931 21.0001C22.2931 19.1562 23.2336 17.5209 24.7095 16.6729C24.0261 16.0729 23.1421 15.7188 22.1724 15.7188C19.8151 15.7188 17.9033 18.0938 17.9033 21.0001C17.9033 23.9063 19.8151 26.2812 22.1724 26.2812C23.1421 26.2812 24.0261 25.9271 24.7095 25.3271C23.2336 24.4791 22.2931 22.8438 22.2931 21.0001Z" fill="white"/>
                    <path d="M31.4247 21.0001C31.4247 23.9063 29.5136 26.2812 27.1561 26.2812C26.1863 26.2812 25.3028 25.9271 24.6194 25.3271C26.0953 24.4791 27.0354 22.8438 27.0354 21.0001C27.0354 19.1562 26.0953 17.5209 24.6194 16.6729C25.3028 16.0729 26.1863 15.7188 27.1561 15.7188C29.5136 15.7188 31.4247 18.0938 31.4247 21.0001Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M31.7724 26.6729V26.0208H31.578L31.4108 26.4167L31.2437 26.0208H31.0493V26.6729H31.1881V26.1771L31.3445 26.5521H31.4771L31.6334 26.1771V26.6729H31.7724ZM30.6607 26.6729V26.1458H30.8745V26.0208H30.2833V26.1458H30.4971V26.6729H30.6607Z" fill="white"/>
                  </svg>
                  <svg className="w-8 h-5" viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="4" fill="#EB001B" fillOpacity="0.15"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.4362 31.7273H30.5812V16.2727H17.4362V31.7273Z" fill="#FF5F00"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.2134 24C18.2134 20.7511 19.76 17.8789 22.1347 16.2727C20.5427 15.0444 18.5439 14.3337 16.3639 14.3337C10.5798 14.3337 5.9082 18.7229 5.9082 24C5.9082 29.2771 10.5798 33.6664 16.3639 33.6664C18.5439 33.6664 20.5427 32.9556 22.1347 31.7273C19.76 30.1211 18.2134 27.2489 18.2134 24Z" fill="#EB001B"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M42.0908 24C42.0908 29.2771 37.4192 33.6664 31.6351 33.6664C29.4551 33.6664 27.4563 32.9556 25.8643 31.7273C28.239 30.1211 29.7856 27.2489 29.7856 24C29.7856 20.7511 28.239 17.8789 25.8643 16.2727C27.4563 15.0444 29.4551 14.3337 31.6351 14.3337C37.4192 14.3337 42.0908 18.7229 42.0908 24Z" fill="#F79E1B"/>
                  </svg>
                </div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg flex flex-col items-center">
                <span className="font-medium text-gray-800">Secured</span>
                <svg className="w-8 h-8 text-green-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={handleCompletePayment}
              disabled={isProcessing || isComplete}
              className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                isProcessing || isComplete
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#1D942C] hover:bg-[#167623]'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Complete Donation'
              )}
            </button>
            
            <Link 
              href="/donate" 
              className="block w-full py-3 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>This is a mock payment page for demonstration purposes.</p>
            <p>No real payment will be processed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap component with Suspense to fix searchParams error
export default function MockPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#1D942C]/30 border-t-[#1D942C] rounded-full animate-spin"></div>
      </div>
    }>
      <MockPayment />
    </Suspense>
  );
} 