'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PesapalPaymentProps {
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

const PesapalPayment: React.FC<PesapalPaymentProps> = ({
  amount,
  frequency,
  donorInfo,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  
  // Clear any previous form HTML
  useEffect(() => {
    return () => {
      if (formContainerRef.current) {
        formContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Validate the amount before sending to the API
      const validAmount = Math.max(parseFloat(amount.toString()) || 1, 0.01);
      console.log('PesapalPayment - Processing amount:', amount, 'Validated amount:', validAmount);

      // First check with create-session endpoint
      const sessionResponse = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: validAmount,
          currency: 'USD',
          customer: donorInfo,
          frequency,
          metadata: {
            donationType: 'website',
            source: 'homepage'
          },
          paymentProvider: 'pesapal'
        }),
      });

      const sessionData = await sessionResponse.json();
      console.log('Session Response:', sessionData);

      if (sessionData.success && sessionData.useCustomEndpoint) {
        // Now call the PesaPal-specific endpoint
        const response = await fetch(sessionData.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: validAmount,
            frequency,
            donorInfo,
          }),
        });

        const data = await response.json();
        console.log('PesaPal Response:', data);

        if (data.success) {
          // Store order ID in session storage for reference
          if (data.orderId) {
            sessionStorage.setItem('pesapal_order_id', data.orderId);
          }
          
          // Handle form redirect if necessary
          if (data.usesFormRedirect && data.formHtml) {
            console.log('Using form redirect');
            
            // Create a container for the form
            const formContainer = document.createElement('div');
            formContainer.style.display = 'none';
            formContainer.innerHTML = data.formHtml;
            document.body.appendChild(formContainer);
            
            // Submit the form after a short delay
            setTimeout(() => {
              const form = formContainer.querySelector('form');
              if (form) {
                form.submit();
              } else {
                setErrorMessage('Payment form not found');
                onError('Payment form not found');
                setIsLoading(false);
              }
            }, 500);
            
            return; // Return early as we're handling the redirect
          } else if (data.redirectUrl) {
            // Standard redirect
            window.location.href = data.redirectUrl;
          } else {
            setErrorMessage('No redirect URL provided');
            onError('No redirect URL provided');
          }
        } else {
          const error = data.error ? JSON.stringify(data.error) : data.message;
          setErrorMessage(data.message || 'Payment initialization failed');
          onError(error || 'Payment initialization failed');
        }
      } else if (!sessionData.success) {
        setErrorMessage(sessionData.error || 'Payment initialization failed');
        onError(sessionData.error || 'Payment initialization failed');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to initialize payment';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-[#1D942C] hover:bg-[#167623] text-white'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Pay Now</span>
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </>
        )}
      </button>
      
      {/* Hidden container for form injection */}
      <div ref={formContainerRef} style={{ display: 'none' }}></div>
    </div>
  );
};

export default PesapalPayment; 