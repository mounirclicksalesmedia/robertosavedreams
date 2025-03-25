'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import VideoPlayer from './components/ui/VideoPlayer';
import LencoPayment from './components/LencoPayment';

// Define content interface
interface HomeContent {
  hero: {
    title: string;
    description: string;
    buttons: Array<{
      text: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
  missionVision: {
    title: string;
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
  };
  programs: {
    title: string;
    description: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      image: string;
    }>;
  };
  impact: {
    title: string;
    description: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  testimonials: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      role: string;
      quote: string;
      image: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    button: {
      text: string;
      url: string;
    };
  };
  loanCalculator: {
    title: string;
    description: string;
    interestRate: number;
  };
}

export default function Home() {
  // Content state
  const [content, setContent] = useState<HomeContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  
  // Loan calculator state
  const [loanAmount, setLoanAmount] = useState(1000);
  const [loanTerm, setLoanTerm] = useState(12);
  const [interestRate, setInterestRate] = useState(4.68); // Default until content loads
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  
  // Donation state
  const [donationAmount, setDonationAmount] = useState(50);
  const [donationFrequency, setDonationFrequency] = useState('one-time');
  const [customAmount, setCustomAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  });
  
  // Fetch content from JSON file
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Add cache-busting timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/home-content.json?t=${timestamp}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        console.log('Content loaded:', data); // Log content for debugging
        setContent(data);
        // Update interest rate from content
        if (data.loanCalculator && data.loanCalculator.interestRate) {
          setInterestRate(data.loanCalculator.interestRate);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, []);
  
  // Calculate loan repayment
  useEffect(() => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;
    const monthlyPayment = 
      loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    setMonthlyPayment(isNaN(monthlyPayment) ? 0 : monthlyPayment);
    setTotalRepayment(monthlyPayment * numPayments);
  }, [loanAmount, loanTerm, interestRate]);
  
  // Handle preset donation amount selection
  const handlePresetAmount = (amount: number | string) => {
    if (amount === 'Custom') {
      document.getElementById('customAmount')?.focus();
    } else {
      setDonationAmount(amount as number);
      setCustomAmount('');
    }
  };
  
  // Handle custom donation amount
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setDonationAmount(numValue);
    }
  };

  // Handle donor info changes
  const handleDonorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1 && donationAmount > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2 && 
      donorInfo.name && 
      donorInfo.email && 
      donorInfo.phone && 
      donorInfo.country) {
      setCurrentStep(3);
    }
  };

  // Handle back step
  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add these handlers in the Home component
  const handlePaymentSuccess = (reference: string) => {
    // Redirect to success page with reference
    window.location.href = `/donate/success?reference=${reference}`;
  };

  const handlePaymentError = (error: string) => {
    // Show error message
    alert(error);
  };

  // If content is loading, we could show a loading state
  if (contentLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render the home page with content
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-[#1D942C] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full bg-white/10 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.05, 0.1],
              rotate: [0, 45, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-16 -left-16 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-white/10 blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-12 py-12 md:py-0 md:pt-14">
            {/* Text Content */}
            <motion.div 
              className="w-full md:w-1/2 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6"
                    dangerouslySetInnerHTML={{ __html: content?.hero.title || 'Empowering Dreams<br/>Building Futures' }}
                />
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-6 sm:mb-8">
                  {content?.hero.description || 'The Roberto Save Dreams Foundation is dedicated to transforming lives through education, microloans, and sustainable development initiatives.'}
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {content?.hero.buttons.map((button, index) => (
                  <Link 
                    key={index}
                    href={button.url} 
                    className={`px-6 sm:px-8 py-3 sm:py-4 ${button.isPrimary ? 
                      'bg-[#ffc500] text-[#1D942C] font-bold' : 
                      'bg-white text-[#1D942C] border-2 border-white'} 
                      rounded-lg shadow-lg hover:bg-opacity-90 transform hover:-translate-y-1 transition-all duration-300 text-base sm:text-lg w-full sm:w-auto text-center`}
                  >
                    {button.text}
                  </Link>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image/Stats */}
            <motion.div 
              className="w-full md:w-1/2 px-4 sm:px-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero/hero.jpg"
                  alt="Empowering communities"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                
                {/* Floating Stats - Updated for better mobile visibility */}
                <motion.div 
                  className="absolute top-4 right-4 bg-white rounded-xl p-3 sm:p-4 shadow-lg"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <p className="text-2xl sm:text-3xl font-bold text-[#1D942C]">10+</p>
                  <p className="text-xs sm:text-sm text-gray-600">Years of Impact</p>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-4 left-4 bg-white rounded-xl p-3 sm:p-4 shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Communities Supported</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#1D942C]">500+</p>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-4 right-4 bg-white rounded-xl p-3 sm:p-4 shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Lives Changed</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#ffc500]">5000+</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex items-center justify-center bg-white/10"
          >
            <motion.div
              animate={{ height: [6, 14, 6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Update background to be lighter */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-[#1D942C]/5">
          <div className="absolute inset-0">
            <motion.div 
              className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#ffc500]/5 blur-[80px]"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.1, 0.2],
                rotate: [0, 45, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C]/5 blur-[80px]"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{content?.missionVision.title || 'Our Purpose'}</h2>
            <div className="w-20 h-1 bg-[#1D942C] mx-auto rounded-full mb-4" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dedicated to empowering communities and transforming lives across Africa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-100 h-full transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1D942C]/5 via-transparent to-[#ffc500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#1D942C]/10 flex items-center justify-center mr-4 group-hover:bg-[#1D942C]/20 transition-colors duration-300">
                      <svg className="w-6 h-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{content?.missionVision.mission.title || 'Our Mission'}</h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {content?.missionVision.mission.description || 'We empower women and young girls in Zambia and Angola by providing them with the resources to overcome poverty, discrimination, and lack of access to education and healthcare.'}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#1D942C]/5 to-transparent rounded-xl p-4 group-hover:from-[#1D942C]/10 transition-colors duration-300">
                      <div className="text-[#1D942C] font-semibold mb-2">Education</div>
                      <div className="text-sm text-gray-600">Providing access to quality education</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#ffc500]/5 to-transparent rounded-xl p-4 group-hover:from-[#ffc500]/10 transition-colors duration-300">
                      <div className="text-[#1D942C] font-semibold mb-2">Healthcare</div>
                      <div className="text-sm text-gray-600">Ensuring access to essential healthcare</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-gray-100 h-full transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffc500]/5 via-transparent to-[#1D942C]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#ffc500]/10 flex items-center justify-center mr-4 group-hover:bg-[#ffc500]/20 transition-colors duration-300">
                      <svg className="w-6 h-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    A future where every woman and girl can rise above challenges and fulfill her potential.
                  </p>
                  <div className="space-y-4">
                    {['Equal Opportunities', 'Economic Independence', 'Community Leadership'].map((item, index) => (
                      <div key={item} className="flex items-center space-x-3 group-hover:translate-x-1 transition-transform duration-300">
                        <div className="w-2 h-2 rounded-full bg-[#1D942C]" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* About Us Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link 
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1D942C] to-[#167623] text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <span className="text-lg font-semibold">Learn More About Us</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Loan Calculator Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Microloan Impact Calculator</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              See how your contribution can empower entrepreneurs and communities across Africa.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 bg-gradient-to-br from-[#1D942C]/5 to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ffc500]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Impact</h3>
                
                {/* Loan Amount Slider */}
                <div className="mb-8 relative z-10">
                  <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount
                  </label>
                  <input
                    type="range"
                    id="loanAmount"
                    min="100"
                    max="5000"
                    step="100"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1D942C] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:bg-[#1D942C]"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">$100</span>
                    <span className="text-lg font-semibold text-[#1D942C]">${loanAmount.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">$5,000</span>
                  </div>
                </div>
                
                {/* Loan Term Selector */}
                <div className="mb-8 relative z-10">
                  <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (Months)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[6, 12, 24].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setLoanTerm(months)}
                        className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
                          months === loanTerm
                            ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                            : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                        }`}
                      >
                        {months} months
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Interest Rate */}
                <div className="mb-8 relative z-10">
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate
                  </label>
                  <div className="relative">
                    <div className="block w-full rounded-lg border-gray-300 bg-white py-2 px-3 shadow-sm">
                      4.68% (Fixed Rate)
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-12 bg-gradient-to-br from-[#ffc500]/5 to-white relative">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C]/5 blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">Your Impact Summary</h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Monthly Repayment</p>
                    <p className="text-3xl font-bold text-[#1D942C]">${monthlyPayment.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Repayment</p>
                    <p className="text-3xl font-bold text-[#1D942C]">${totalRepayment.toFixed(2)}</p>
                  </div>
                  
                  <div className="bg-[#1D942C]/5 p-6 rounded-xl border border-[#1D942C]/10">
                    <p className="text-sm text-[#1D942C] mb-1">Potential Entrepreneurs Supported</p>
                    <p className="text-3xl font-bold text-[#1D942C]">
                      {Math.ceil(loanAmount / 500)}-{Math.ceil(loanAmount / 300)} Businesses
                    </p>
                  </div>
                  
                  <div className="bg-[#ffc500]/5 p-6 rounded-xl border border-[#ffc500]/10">
                    <p className="text-sm text-[#1D942C] mb-1">Estimated Jobs Created</p>
                    <p className="text-3xl font-bold text-[#ffc500]">
                      {Math.ceil(loanAmount / 200)}-{Math.ceil(loanAmount / 150)} Jobs
                    </p>
                  </div>

                  <Link 
                    href={`/loanapplication?amount=${loanAmount}&term=${loanTerm}`}
                    className="block w-full text-center px-8 py-4 bg-[#1D942C] text-white rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply for This Loan
                  </Link>
                </div>
                
                <div className="mt-8 p-6 rounded-xl bg-gray-50 border border-gray-100 relative z-10">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1D942C] mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="ml-2 text-sm text-gray-600">
                      This calculator provides estimates based on our historical data. Actual impact may vary based on local economic conditions and individual business performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Video Section */}
      <section className="py-20 relative overflow-hidden bg-[#1D942C]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent mix-blend-multiply z-10" />
          <video 
            className="w-full h-full object-cover opacity-30"
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src="/videos/impact.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                See Our Impact <br />
                <span className="text-[#ffc500]">In Action</span>
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Watch how your support transforms lives and builds stronger communities across Africa. Every contribution creates ripples of positive change.
              </p>
              <div className="flex items-center gap-6">
                <button 
                  className="flex items-center gap-3 group"
                  onClick={() => {
                    // Add video play logic here
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-[#ffc500] flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
                    <svg className="w-6 h-6 text-[#1D942C] transform translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-white group-hover:text-[#ffc500] transition-colors duration-300">
                    Watch Video
                  </span>
                </button>
                <Link
                  href="/impact"
                  className="text-lg font-medium text-white/80 hover:text-white flex items-center gap-2 group"
                >
                  Learn More
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <VideoPlayer 
                videoSrc="/videos/impact.mp4"
                thumbnailSrc="/images/videos/thumbnail.jpg"
                thumbnailAlt="NGO Roberto save dreams foundation"
                className="bg-white/10 border border-white/20"
              />

              {/* Video Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <p className="text-[#ffc500] text-3xl font-bold mb-1">2M+</p>
                  <p className="text-white/80 text-sm">Views</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                  <p className="text-[#ffc500] text-3xl font-bold mb-1">50+</p>
                  <p className="text-white/80 text-sm">Success Stories</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-gradient-to-br from-[#1D942C]/5 to-white">
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
                <div className="flex items-center mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === currentStep
                          ? 'bg-[#1D942C] text-white'
                          : step < currentStep
                          ? 'bg-[#1D942C]/20 text-[#1D942C]'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-1 mx-2 ${
                          step < currentStep ? 'bg-[#1D942C]' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {currentStep === 1 && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Donation Amount</h3>
                    
                    {/* Preset Amounts */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                      {[10, 25, 50, 100, 250, 500, 1000, 'Custom'].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handlePresetAmount(amount)}
                          className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                            amount === donationAmount && customAmount === ''
                              ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                              : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                          }`}
                        >
                          {amount === 'Custom' ? 'Custom' : `$${amount}`}
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
                          aria-describedby="price-currency"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm" id="price-currency">USD</span>
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
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={donorInfo.name}
                          onChange={handleDonorInfoChange}
                          className="block w-full rounded-lg border-gray-300 focus:border-[#1D942C] focus:ring-[#1D942C]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={donorInfo.email}
                          onChange={handleDonorInfoChange}
                          className="block w-full rounded-lg border-gray-300 focus:border-[#1D942C] focus:ring-[#1D942C]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={donorInfo.phone}
                          onChange={handleDonorInfoChange}
                          className="block w-full rounded-lg border-gray-300 focus:border-[#1D942C] focus:ring-[#1D942C]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={donorInfo.country}
                          onChange={handleDonorInfoChange}
                          className="block w-full rounded-lg border-gray-300 focus:border-[#1D942C] focus:ring-[#1D942C]"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h3>
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Donation Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium text-gray-900">${donationAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium text-gray-900">{donationFrequency === 'one-time' ? 'One-time' : 'Monthly'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">{donorInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">{donorInfo.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Secure Payment</h4>
                      <LencoPayment
                        amount={donationAmount}
                        frequency={donationFrequency}
                        donorInfo={donorInfo}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                      <p className="text-gray-600 text-sm mt-4">
                        Your payment will be processed securely through Lenco Payment Gateway.
                      </p>
                    </div>
                  </>
                )}

                <div className="mt-8 flex justify-between">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBackStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`px-6 py-3 ${
                      currentStep === 3
                        ? 'bg-[#1D942C] text-white'
                        : 'bg-[#1D942C] text-white'
                    } rounded-lg font-medium hover:bg-[#167623] transition-colors ml-auto`}
                  >
                    {currentStep === 3 ? 'Complete Donation' : 'Continue'}
                  </button>
                </div>
              </div>
              
              <div className="lg:col-span-2 bg-gradient-to-br from-[#ffc500]/5 to-white rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Impact</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">${donationAmount < 50 ? donationAmount : 50} provides</p>
                      <p className="text-sm text-gray-600">Educational supplies for {Math.max(1, Math.floor(donationAmount / 10))} students</p>
                    </div>
                  </div>
                  
                  {donationAmount >= 50 && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[#ffc500]/10 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffc500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">${donationAmount < 250 ? donationAmount : 250} provides</p>
                        <p className="text-sm text-gray-600">
                          {donationAmount >= 250 
                            ? 'A microloan for a small business' 
                            : 'Partial funding for a small business'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {donationAmount >= 250 && (
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">${donationAmount < 1000 ? donationAmount : 1000} provides</p>
                        <p className="text-sm text-gray-600">
                          {donationAmount >= 1000 
                            ? 'Clean water access for a community' 
                            : 'Partial funding for clean water access'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1D942C]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">100% of donations go directly to our programs</p>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1D942C]" viewBox="0 0 20 20" fill="currentColor">
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

      {/* Impact Stats */}
      <section className="py-20 relative overflow-hidden">
        {/* Update animated background to be lighter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#ffc500] blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-10" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C] blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-10" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{content?.impact.title || "Our Impact"}</h2>
            <div className="w-20 h-1 bg-[#1D942C] mx-auto rounded-full mb-4" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content?.impact.description || "Together, we're creating lasting change in communities across Africa"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Impact Stats */}
            {content?.impact.stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1D942C]/5 via-transparent to-[#ffc500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold text-[#1D942C] mb-2">{stat.value}</h3>
                  <p className="text-gray-700">{stat.label}</p>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#1D942C]/5 rounded-full -mb-16 -mr-16 group-hover:bg-[#1D942C]/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-gradient-to-br from-white to-[#1D942C]/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#ffc500]/5 blur-[80px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.05, 0.1],
              rotate: [0, 45, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C]/5 blur-[80px]"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <div className="w-20 h-1 bg-[#1D942C] mx-auto rounded-full mb-4" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We focus on sustainable solutions that empower individuals and communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full">
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src="/images/programs/education.jpeg"
                    alt="Education Program"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1D942C] transition-colors duration-300">Education</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Providing access to quality education and learning resources for children and adults.
                  </p>
                  <Link 
                    href="/programs#education" 
                    className="inline-flex items-center text-[#1D942C] font-medium group-hover:text-[#167623] transition-colors duration-300"
                  >
                    Learn more 
                    <svg 
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full">
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src="/images/programs/loan.jpeg"
                    alt="Microloans Program"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1D942C] transition-colors duration-300">Microloans</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Empowering entrepreneurs with small loans to start or grow their businesses.
                  </p>
                  <Link 
                    href="/programs#microloans" 
                    className="inline-flex items-center text-[#1D942C] font-medium group-hover:text-[#167623] transition-colors duration-300"
                  >
                    Learn more 
                    <svg 
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full">
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src="/images/programs/health.jpeg"
                    alt="Sustainable Development Program"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#1D942C] transition-colors duration-300">Sustainable Development</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Creating long-term solutions for community growth and environmental sustainability.
                  </p>
                  <Link 
                    href="/programs#sustainable" 
                    className="inline-flex items-center text-[#1D942C] font-medium group-hover:text-[#167623] transition-colors duration-300"
                  >
                    Learn more 
                    <svg 
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link
              href="/programs"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#1D942C] text-white rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View All Programs
              <svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-20 bg-gradient-to-br from-[#1D942C]/5 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#ffc500]/5 blur-[80px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.05, 0.1],
              rotate: [0, 45, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C]/5 blur-[80px]"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{content?.testimonials.title || "Success Stories"}</h2>
            <div className="w-20 h-1 bg-[#1D942C] mx-auto rounded-full mb-4" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {content?.testimonials.description || "Hear from the people whose lives have been impacted by our programs"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {content?.testimonials.items.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="p-8 md:p-10 relative">
                  <div className="absolute top-4 left-4 text-[#1D942C]/10 z-0">
                    <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-[#1D942C]/10 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-[#1D942C]">
                          {testimonial.name.split(' ').map(name => name[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-[#1D942C]">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-6 text-lg">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 text-[#ffc500]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              href="/success-stories"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#1D942C] text-white rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Read More Stories
              <svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#1D942C] to-[#167623] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <motion.div 
                className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ffc500]/20 blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.1, 0.2],
                  rotate: [0, 45, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content?.cta.title || "Help Write the Next Success Story"}</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {content?.cta.description || "Your support can help create more inspiring stories of transformation and empowerment across Africa."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {content?.cta.button ? (
                  <Link 
                    href={content.cta.button.url}
                    className="inline-block bg-[#ffc500] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300"
                  >
                    {content.cta.button.text}
                  </Link>
                ) : (
                  <Link 
                    href="/donate"
                    className="inline-block bg-[#ffc500] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Make a Donation
                  </Link>
                )}
                <Link 
                  href="/get-involved"
                  className="inline-block bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Get Involved
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}