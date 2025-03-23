'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { formatAmount } from '@/app/lib/lenco';

// Define interface for the content
interface DonateContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  stats: Array<{
    number: string;
    label: string;
    color: string;
  }>;
  levels: Array<{
    amount: number;
    label: string;
  }>;
  impact: {
    title: string;
    description: string;
    metrics: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    calculations: {
      studentCost: number;
      microloanCost: number;
      healthcareCost: number;
      communityCost: number;
    };
  };
}

export default function DonatePage() {
  const [content, setContent] = useState<DonateContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form and payment handling
  const [donationAmount, setDonationAmount] = useState<number>(50);
  const [donationFrequency, setDonationFrequency] = useState('one-time');
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/donate');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load the donate page content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Handle preset donation amount selection
  const handlePresetAmount = (amount: number | string) => {
    if (amount === 'Custom') {
      // Focus on custom input
      document.getElementById('customAmount')?.focus();
    } else {
      setDonationAmount(amount as number);
      setCustomAmount('');
    }
  };

  // Handle custom donation amount
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setDonationAmount(numValue);
      }
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'phone') setPhone(value);
  };

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!donationAmount) {
      setErrorMessage('Please select a donation amount');
      return;
    }
    
    setIsProcessing(true);
    setErrorMessage('');
    
    try {
      // Integrate with Lenco payment here
      // This is where you'll add the actual payment processing logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsPaymentComplete(true);
      setCurrentStep(4);
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate impact
  const calculateImpact = (amount: number) => {
    if (!amount || !content) return { students: 0, microloans: 0, healthcare: 0, communities: 0 };
    
    const { studentCost, microloanCost, healthcareCost, communityCost } = content.impact.calculations;
    
    return {
      students: Math.floor(amount / studentCost),
      microloans: Math.floor(amount / microloanCost),
      healthcare: Math.floor(amount / healthcareCost),
      communities: Math.floor(amount / communityCost)
    };
  };
  
  const impact = calculateImpact(donationAmount);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#1D942C] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
        <p className="text-gray-700 mb-6">{error || 'Could not load the donate page content.'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-[#1D942C] text-white rounded-md hover:bg-[#167623] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-br from-[#1D942C] to-[#167623] overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#ffc500]/20 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3],
              rotate: [0, 45, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#1D942C]/20 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {content.hero.title}
              <span className="block text-[#ffc500] mt-2">{content.hero.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {content.hero.description}
            </p>
            <motion.a
              href="#donate-form"
              className="inline-block mt-8 px-8 py-4 bg-[#ffc500] text-[#1D942C] rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Donate Now
            </motion.a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex items-center justify-center"
          >
            <motion.div
              animate={{ height: [6, 14, 6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 bg-white/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Donation Section - Styled like home page */}
      <section id="donate-form" className="py-20 bg-gradient-to-br from-[#1D942C]/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Make a Difference Today</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Your donation helps us empower communities and create lasting change across Africa.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 relative"
          >
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ffc500]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C]/5 blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
              <div className="lg:col-span-3">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Donation Amount</h3>
                
                {/* Preset Amounts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {content.levels.map((level, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePresetAmount(level.amount)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        level.amount === donationAmount && customAmount === ''
                          ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                      }`}
                    >
                      <span className="block text-2xl font-bold text-[#1D942C]">${level.amount}</span>
                      <span className="text-sm text-gray-600">{level.label}</span>
                    </button>
                  ))}
                </div>
                
                {/* Custom Amount Input */}
                <div className="mb-8">
                  <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="customAmount"
                      id="customAmount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="block w-full rounded-lg border-gray-300 pl-7 pr-12 focus:border-[#1D942C] focus:ring-[#1D942C]"
                      placeholder="0.00"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 sm:text-sm">USD</span>
                    </div>
                  </div>
                </div>
                
                {/* Donation Frequency */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donation Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDonationFrequency('one-time')}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        donationFrequency === 'one-time'
                          ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                      }`}
                    >
                      One-time
                    </button>
                    <button
                      type="button"
                      onClick={() => setDonationFrequency('monthly')}
                      className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                        donationFrequency === 'monthly'
                          ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                          : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4 mb-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D942C] focus:border-[#1D942C]"
                      placeholder="John Doe"
                      value={name}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D942C] focus:border-[#1D942C]"
                      placeholder="you@example.com"
                      value={email}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#1D942C] focus:border-[#1D942C]"
                      placeholder="(123) 456-7890"
                      value={phone}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
                    {errorMessage}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 bg-[#1D942C] text-white rounded-lg shadow-md hover:bg-[#167623] transition-colors duration-200 text-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    donationFrequency === 'one-time' ? 'Complete Donation' : 'Start Monthly Donation'
                  )}
                </button>
              </div>
              
              <div className="lg:col-span-2 bg-gradient-to-br from-[#ffc500]/5 to-white rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Impact</h3>
                
                <div className="space-y-4 mb-6">
                  {impact.students > 0 && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Support {impact.students} student{impact.students !== 1 ? 's' : ''}</p>
                        <p className="text-sm text-gray-600">with education</p>
                      </div>
                    </div>
                  )}
                  
                  {impact.microloans > 0 && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[#ffc500]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#ffc500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Fund {impact.microloans} microloan{impact.microloans !== 1 ? 's' : ''}</p>
                        <p className="text-sm text-gray-600">for entrepreneurs</p>
                      </div>
                    </div>
                  )}
                  
                  {impact.healthcare > 0 && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Provide healthcare for {impact.healthcare}</p>
                        <p className="text-sm text-gray-600">individual{impact.healthcare !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-[#1D942C]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">100% of donations go directly to our programs</p>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-[#1D942C]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Tax-deductible in the US, UK, and Nigeria</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">{content.impact.title}</h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-16 text-gray-600">
            {content.impact.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {content.impact.metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#1D942C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{metric.title}</h3>
                <p className="text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
