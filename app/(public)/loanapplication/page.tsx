'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Loading component for Suspense fallback
function LoadingLoanApplication() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#1D942C]/5 flex items-center justify-center">
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-[#1D942C] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-xl text-gray-600">Loading loan application form...</p>
      </div>
    </div>
  );
}

// Main content component that uses useSearchParams
function LoanApplicationContent() {
  const searchParams = useSearchParams();
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  const [interestRate] = useState<number>(4.68); // Fixed interest rate at 4.68%
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalRepayment, setTotalRepayment] = useState<number>(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    employmentStatus: 'employed',
    monthlyIncome: '',
    loanPurpose: 'business',
    businessDescription: '',
    agreeToTerms: false
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicantType, setApplicantType] = useState<string>('');
  const [documents, setDocuments] = useState<{[key: string]: File | null}>({
    businessPlan: null,
    registration: null,
    identification: null,
    financialStatements: null,
    proofOfIncome: null,
    proofOfLandOwnership: null,
    proofOfEnrollment: null,
    proofOfEmployment: null
  });
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  // Get loan amount from URL parameters
  useEffect(() => {
    const amount = searchParams.get('amount');
    const term = searchParams.get('term');
    
    if (amount) {
      setLoanAmount(Number(amount));
    }
    
    if (term) {
      setLoanTerm(Number(term));
    }
  }, [searchParams]);

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

  // Function to calculate monthly payment
  const calculateMonthlyPayment = (principal: number, term: number, rate: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term;
    const monthlyPayment = 
      principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleApplicantTypeChange = (type: string) => {
    setApplicantType(type);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({
        ...documents,
        [docType]: e.target.files[0]
      });
      
      setUploadProgress({
        ...uploadProgress,
        [docType]: 0
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Calculate monthly payment and total repayment
    const calculatedMonthlyPayment = calculateMonthlyPayment(loanAmount, loanTerm, interestRate);
    const calculatedTotalRepayment = calculatedMonthlyPayment * loanTerm;
    
    // Prepare the data to submit
    const applicationData = {
      ...formData,
      loanAmount,
      loanTerm,
      interestRate,
      monthlyPayment: calculatedMonthlyPayment,
      totalRepayment: calculatedTotalRepayment,
      applicantType,
    };
    
    console.log('Submitting application data:', applicationData);
    
    // Create FormData object to handle file uploads
    const formDataToSend = new FormData();
    
    // Add all text fields to FormData
    Object.entries(applicationData).forEach(([key, value]) => {
      formDataToSend.append(key, String(value));
    });
    
    // Add all files to FormData
    Object.entries(documents).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });
    
    // Submit data to the API
    fetch('/api/loan-applications', {
      method: 'POST',
      body: formDataToSend,
    })
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Response data:', data);
        setIsSubmitting(false);
        if (data.success) {
          setIsSubmitted(true);
        } else {
          // Handle submission error
          console.error('Error submitting application:', data.message);
        }
      })
      .catch(error => {
        console.error('Error submitting application:', error);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#1D942C]/5">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#1D942C] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-white/10 blur-3xl"
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
            className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Microloan Application
            <span className="block text-[#ffc500] mt-2">Empowering Your Dreams</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Complete the form below to apply for a microloan and start your journey towards financial independence.
          </motion.p>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Progress Bar */}
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Application Progress</span>
                  <span className="text-sm font-medium text-[#1D942C]">{currentStep} of 4</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1D942C] rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Loan Summary */}
              <div className="bg-gradient-to-r from-[#1D942C]/10 to-white p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Loan Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="text-xl font-bold text-[#1D942C]">${loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Term</p>
                    <p className="text-xl font-bold text-[#1D942C]">{loanTerm} months</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="text-xl font-bold text-[#1D942C]">{interestRate}%</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Monthly Payment</p>
                    <p className="text-xl font-bold text-[#1D942C]">${monthlyPayment.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                          Zip/Postal Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                      />
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-[#1D942C] text-white rounded-lg font-medium hover:bg-[#167623] transition-colors shadow-md"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Applicant Type & Required Documents */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Applicant Type & Required Documents</h2>
                    
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Your Category
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['Women', 'Civil Servants', 'Entrepreneurs', 'Students', 'Farmers'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleApplicantTypeChange(type)}
                            className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                              applicantType === type
                                ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                                : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {applicantType && (
                      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-lg text-gray-900 mb-3">
                          Requirements for {applicantType}
                        </h3>
                        
                        <div className="text-sm text-gray-700 space-y-2 mb-6">
                          <p className="font-medium text-[#1D942C] mt-3">Description:</p>
                          {applicantType === 'Women' && (
                            <p>Women may be eligible for microloans and grants to start or expand their own businesses, or to support their education and training.</p>
                          )}
                          {applicantType === 'Civil Servants' && (
                            <p>Civil servants may be eligible for microloans and grants to start their own businesses or to support their education and training.</p>
                          )}
                          {applicantType === 'Entrepreneurs' && (
                            <p>Entrepreneurs may be eligible for microloans and grants to start or expand their own businesses.</p>
                          )}
                          {applicantType === 'Students' && (
                            <p>Students may be eligible for microloans and grants to support their education and training.</p>
                          )}
                          {applicantType === 'Farmers' && (
                            <p>Farmers may be eligible for microloans and grants to improve their farming practices, purchase equipment, or to support their education and training.</p>
                          )}
                          
                          <p className="font-medium text-[#1D942C] mt-3">Required Documents:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {/* Women Requirements */}
                            {applicantType === 'Women' && (
                              <>
                                <li>Business plan</li>
                                <li>Proof of business registration (if applicable)</li>
                                <li>Identification</li>
                                <li>Financial statements</li>
                                <li>Proof of income</li>
                              </>
                            )}
                            
                            {/* Civil Servants Requirements */}
                            {applicantType === 'Civil Servants' && (
                              <>
                                <li>Business plan</li>
                                <li>Proof of employment</li>
                                <li>Identification</li>
                                <li>Financial statements</li>
                                <li>Proof of income</li>
                              </>
                            )}
                            
                            {/* Entrepreneurs Requirements */}
                            {applicantType === 'Entrepreneurs' && (
                              <>
                                <li>Business plan</li>
                                <li>Proof of business registration</li>
                                <li>Identification</li>
                                <li>Financial statements</li>
                                <li>Proof of income</li>
                              </>
                            )}
                            
                            {/* Students Requirements */}
                            {applicantType === 'Students' && (
                              <>
                                <li>Proof of enrollment</li>
                                <li>Identification</li>
                                <li>Financial statements</li>
                                <li>Proof of income</li>
                              </>
                            )}
                            
                            {/* Farmers Requirements */}
                            {applicantType === 'Farmers' && (
                              <>
                                <li>Business plan</li>
                                <li>Proof of land ownership</li>
                                <li>Identification</li>
                                <li>Financial statements</li>
                                <li>Proof of income</li>
                              </>
                            )}
                          </ul>
                        </div>
                        
                        {/* Document Upload Section */}
                        <div className="space-y-4 mt-6">
                          <h4 className="font-semibold text-lg text-gray-900">Upload Required Documents</h4>
                          
                          {/* Business Plan - for all except Students */}
                          {applicantType !== 'Students' && (
                            <div className="border border-gray-200 rounded-lg p-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Business Plan</label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'businessPlan')}
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-[#1D942C]/10 file:text-[#1D942C]
                                    hover:file:bg-[#1D942C]/20"
                                  accept=".pdf,.doc,.docx"
                                />
                                {uploadProgress.businessPlan !== undefined && uploadProgress.businessPlan > 0 && (
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-[#1D942C] h-2.5 rounded-full" style={{ width: `${uploadProgress.businessPlan}%` }}></div>
                                  </div>
                                )}
                                {documents.businessPlan && (
                                  <span className="text-sm text-[#1D942C]">✓ Uploaded</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Proof of Business Registration - for Women and Entrepreneurs */}
                          {(applicantType === 'Women' || applicantType === 'Entrepreneurs') && (
                            <div className="border border-gray-200 rounded-lg p-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Business Registration</label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'registration')}
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-[#1D942C]/10 file:text-[#1D942C]
                                    hover:file:bg-[#1D942C]/20"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                {uploadProgress.registration !== undefined && uploadProgress.registration > 0 && (
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-[#1D942C] h-2.5 rounded-full" style={{ width: `${uploadProgress.registration}%` }}></div>
                                  </div>
                                )}
                                {documents.registration && (
                                  <span className="text-sm text-[#1D942C]">✓ Uploaded</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Proof of Employment - for Civil Servants */}
                          {applicantType === 'Civil Servants' && (
                            <div className="border border-gray-200 rounded-lg p-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Employment</label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'proofOfEmployment')}
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-[#1D942C]/10 file:text-[#1D942C]
                                    hover:file:bg-[#1D942C]/20"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                {uploadProgress.proofOfEmployment !== undefined && uploadProgress.proofOfEmployment > 0 && (
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-[#1D942C] h-2.5 rounded-full" style={{ width: `${uploadProgress.proofOfEmployment}%` }}></div>
                                  </div>
                                )}
                                {documents.proofOfEmployment && (
                                  <span className="text-sm text-[#1D942C]">✓ Uploaded</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Proof of Enrollment - for Students */}
                          {applicantType === 'Students' && (
                            <div className="border border-gray-200 rounded-lg p-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Enrollment</label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'proofOfEnrollment')}
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-[#1D942C]/10 file:text-[#1D942C]
                                    hover:file:bg-[#1D942C]/20"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                {uploadProgress.proofOfEnrollment !== undefined && uploadProgress.proofOfEnrollment > 0 && (
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-[#1D942C] h-2.5 rounded-full" style={{ width: `${uploadProgress.proofOfEnrollment}%` }}></div>
                                  </div>
                                )}
                                {documents.proofOfEnrollment && (
                                  <span className="text-sm text-[#1D942C]">✓ Uploaded</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Proof of Land Ownership - for Farmers */}
                          {applicantType === 'Farmers' && (
                            <div className="border border-gray-200 rounded-lg p-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Land Ownership</label>
                              <div className="flex items-center gap-4">
                                <input
                                  type="file"
                                  onChange={(e) => handleFileChange(e, 'proofOfLandOwnership')}
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-lg file:border-0
                                    file:text-sm file:font-medium
                                    file:bg-[#1D942C]/10 file:text-[#1D942C]
                                    hover:file:bg-[#1D942C]/20"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                {uploadProgress.proofOfLandOwnership !== undefined && uploadProgress.proofOfLandOwnership > 0 && (
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-[#1D942C] h-2.5 rounded-full" style={{ width: `${uploadProgress.proofOfLandOwnership}%` }}></div>
                                  </div>
                                )}
                                {documents.proofOfLandOwnership && (
                                  <span className="text-sm text-[#1D942C]">✓ Uploaded</span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Identification - for all */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Identification</label>
                            <div className="flex items-center gap-4">
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'identification')}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-medium
                                  file:bg-[#1D942C]/10 file:text-[#1D942C]
                                  hover:file:bg-[#1D942C]/20"
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                              {uploadProgress.identification !== undefined && uploadProgress.identification > 0 && (
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-[#1D942C] h-2.5 rounded-full" style={{ width: `${uploadProgress.identification}%` }}></div>
                                </div>
                              )}
                              {documents.identification && (
                                <span className="text-sm text-[#1D942C]">✓ Uploaded</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Financial Statements - for all */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Financial Statements</label>
                            <div className="flex items-center gap-4">
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'financialStatements')}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-medium
                                  file:bg-[#1D942C]/10 file:text-[#1D942C]
                                  hover:file:bg-[#1D942C]/20"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                              />
                              {uploadProgress.financialStatements !== undefined && uploadProgress.financialStatements > 0 && (
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-[#1D942C] h-2.5 rounded-full" style={{ width: `${uploadProgress.financialStatements}%` }}></div>
                                </div>
                              )}
                              {documents.financialStatements && (
                                <span className="text-sm text-[#1D942C]">✓ Uploaded</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Proof of Income - for all */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Income</label>
                            <div className="flex items-center gap-4">
                              <input
                                type="file"
                                onChange={(e) => handleFileChange(e, 'proofOfIncome')}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-medium
                                  file:bg-[#1D942C]/10 file:text-[#1D942C]
                                  hover:file:bg-[#1D942C]/20"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              />
                              {uploadProgress.proofOfIncome !== undefined && uploadProgress.proofOfIncome > 0 && (
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div className="bg-[#1D942C] h-2.5 rounded-full" style={{ width: `${uploadProgress.proofOfIncome}%` }}></div>
                                </div>
                              )}
                              {documents.proofOfIncome && (
                                <span className="text-sm text-[#1D942C]">✓ Uploaded</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Previous Step
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!applicantType}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors shadow-md ${
                          !applicantType 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-[#1D942C] text-white hover:bg-[#167623]'
                        }`}
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Financial Information */}
                {currentStep === 3 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Information</h3>
                    
                    <div className="mb-6">
                      <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status *
                      </label>
                      <select
                        id="employmentStatus"
                        name="employmentStatus"
                        value={formData.employmentStatus}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                      >
                        <option value="employed">Employed</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="student">Student</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income (USD) *
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="monthlyIncome"
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleInputChange}
                          required
                          min="0"
                          step="0.01"
                          className="w-full pl-7 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]"
                          placeholder="0.00"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#ffc500]/10 p-6 rounded-lg mb-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-[#ffc500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-800">Important Information</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Your financial information is used solely for loan eligibility assessment and will be kept confidential. We may require verification documents at a later stage.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Previous Step
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-[#1D942C] text-white rounded-lg font-medium hover:bg-[#167623] transition-colors shadow-md"
                      >
                        Next Step
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Review & Submit</h3>
                    
                    <div className="bg-gradient-to-r from-[#1D942C]/10 to-white p-6 rounded-lg mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Loan Amount</p>
                          <p className="text-xl font-bold text-[#1D942C]">${loanAmount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Term</p>
                          <p className="text-xl font-bold text-[#1D942C]">{loanTerm} months</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Interest Rate</p>
                          <p className="text-xl font-bold text-[#1D942C]">{interestRate}%</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm text-gray-500">Monthly Payment</p>
                          <p className="text-xl font-bold text-[#1D942C]">${monthlyPayment.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Applicant Type</h4>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="font-medium text-[#1D942C]">{applicantType}</p>
                    </div>
                      </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center">
                          <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={handleInputChange}
                            required
                          className="h-5 w-5 text-[#1D942C] focus:ring-[#1D942C]"
                        />
                        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                          I agree to the <a href="#" className="text-[#1D942C] hover:underline">terms and conditions</a> and <a href="#" className="text-[#1D942C] hover:underline">privacy policy</a>. *
                          </label>
                        </div>
                      </div>

                <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Previous Step
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.agreeToTerms}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors shadow-md ${
                          isSubmitting || !formData.agreeToTerms
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#1D942C] text-white hover:bg-[#167623]'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                </div>
                  </div>
                )}
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-[#1D942C]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for applying for a microloan with Roberto Save Dreams Foundation. We have received your application and will review it shortly.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Next Steps</h3>
                <ol className="text-left list-decimal pl-5 space-y-2 text-gray-600">
                  <li>Our team will review your application within 3-5 business days.</li>
                  <li>You will receive an email confirmation with your application reference number.</li>
                  <li>We may contact you for additional information or documentation.</li>
                  <li>Once approved, you will be invited for a brief orientation session.</li>
                </ol>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="px-8 py-4 bg-[#1D942C] text-white rounded-lg hover:bg-[#167623] transition-colors duration-200"
                >
                  Return to Home
                </Link>
                <Link 
                  href="/programs"
                  className="px-8 py-4 bg-white text-[#1D942C] border-2 border-[#1D942C] rounded-lg hover:bg-[#1D942C]/5 transition-colors duration-200"
                >
                  Explore Our Programs
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "Who is eligible for a microloan?",
                answer: "Our microloans are primarily designed for women entrepreneurs aged 18-40 with sustainable business plans. Applicants must demonstrate the ability to repay the loan and show how the funds will be used to generate income."
              },
              {
                question: "How long does the application process take?",
                answer: "The initial review takes 3-5 business days. If approved, disbursement typically occurs within 1-2 weeks after completing all required documentation and orientation."
              },
              {
                question: "What is the repayment schedule?",
                answer: "Repayments are made monthly over the term of the loan. We offer flexible terms of 6, 12, or 24 months depending on the loan amount and purpose."
              },
              {
                question: "Is there any training or support provided?",
                answer: "Yes, all loan recipients receive business development training, financial literacy education, and ongoing mentorship to maximize the impact of their loan."
              },
              {
                question: "What can the loan be used for?",
                answer: "Loans can be used for business startup costs, expansion, equipment purchase, inventory, or other productive business purposes. Loans cannot be used for personal expenses, debt repayment, or non-business activities."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function LoanApplicationPage() {
  return (
    <Suspense fallback={<LoadingLoanApplication />}>
      <LoanApplicationContent />
    </Suspense>
  );
}
