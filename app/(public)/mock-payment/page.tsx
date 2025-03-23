'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatAmount } from '@/app/lib/lenco';

export default function MockPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [navigateTo, setNavigateTo] = useState<string | null>(null);
  
  const reference = searchParams.get('ref') || '';
  const amount = Number(searchParams.get('amount') || 0);
  
  // Handle navigation in useEffect
  useEffect(() => {
    if (navigateTo) {
      router.push(navigateTo);
    }
  }, [navigateTo, router]);
  
  // Handle countdown and redirect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isProcessing) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            setNavigateTo(`/donate/success?reference=${reference}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, reference]);
  
  const handleCompletePayment = () => {
    setIsProcessing(true);
  };
  
  const handleCancelPayment = () => {
    setNavigateTo('/donate?status=cancelled');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#1D942C]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mock Payment Page</h1>
          <p className="text-gray-600 mt-2">This is a simulated payment page for testing</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-gray-900">{formatAmount(amount/100, 'USD')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Reference:</span>
            <span className="text-gray-900">{reference}</span>
          </div>
        </div>
        
        {isProcessing ? (
          <div className="text-center p-6">
            <div className="w-12 h-12 border-4 border-[#1D942C]/30 border-t-[#1D942C] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-900">Processing Payment</p>
            <p className="text-gray-600 mt-2">Redirecting in {countdown} seconds...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleCompletePayment}
              className="w-full py-3 bg-[#1D942C] text-white rounded-lg font-medium hover:bg-[#167623] transition-colors"
            >
              Complete Payment
            </button>
            <button
              onClick={handleCancelPayment}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            This is a mock payment page for testing purposes only.
            <br />No actual payment will be processed.
          </p>
        </div>
      </div>
    </div>
  );
} 