'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiDownload, FiChevronDown, FiChevronUp, FiCalendar, FiDollarSign, FiPercent } from 'react-icons/fi';

// Define the types of grants available
const availableGrants = [
  {
    id: 'community',
    title: 'Community Development Grants',
    description: 'Funding for community-based organizations focused on improving local infrastructure, educational facilities, and public spaces.',
    amount: '$5,000 - $50,000',
    eligibility: [
      'Registered community organizations',
      'Minimum 2 years of operational history',
      'Clear project proposal with measurable outcomes',
      'Community support and involvement'
    ],
    icon: '/images/icons/community.svg',
    documents: [
      'Organization registration certificate',
      'Detailed project proposal',
      'Budget plan',
      'Community impact assessment'
    ]
  },
  {
    id: 'education',
    title: 'Educational Grants',
    description: 'Support for schools, educational institutions, and initiatives that promote access to quality education, educational resources, and innovative teaching methods.',
    amount: '$10,000 - $100,000',
    eligibility: [
      'Accredited educational institutions',
      'Non-profit educational organizations',
      'Documented educational outcomes',
      'Focus on underserved communities'
    ],
    icon: '/images/icons/education.svg',
    documents: [
      'Accreditation certificate',
      'Project proposal',
      'Budget plan',
      'Impact statement',
      'Prior educational achievements'
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare Grants',
    description: 'Funding for healthcare facilities, medical outreach programs, and health education initiatives to improve healthcare access and outcomes.',
    amount: '$15,000 - $150,000',
    eligibility: [
      'Licensed healthcare providers',
      'Community health organizations',
      'Health-focused NGOs',
      'Evidence-based healthcare programs'
    ],
    icon: '/images/icons/healthcare.svg',
    documents: [
      'Organization registration',
      'Healthcare project proposal',
      'Budget plan',
      'Professional licenses',
      'Healthcare impact metrics'
    ]
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship Grants',
    description: 'Support for small businesses, startups, and entrepreneurial initiatives that create jobs and stimulate economic growth in underserved communities.',
    amount: '$5,000 - $75,000',
    eligibility: [
      'Local small businesses',
      'Entrepreneurs with viable business plans',
      'Job creation potential',
      'Sustainable business model'
    ],
    icon: '/images/icons/business.svg',
    documents: [
      'Business registration',
      'Business plan',
      'Financial projections',
      'Market analysis',
      'Owner credentials'
    ]
  }
];

export default function GrantsPage() {
  const [expandedGrant, setExpandedGrant] = useState<string | null>(null);
  const [grantAmount, setGrantAmount] = useState(25000);
  const [projectDuration, setProjectDuration] = useState(12);
  const [impactScore, setImpactScore] = useState(7);

  // Toggle grant expansion
  const toggleGrant = (id: string) => {
    if (expandedGrant === id) {
      setExpandedGrant(null);
    } else {
      setExpandedGrant(id);
    }
  };

  // Calculate estimated impact for grant calculator
  const calculateEstimatedImpact = () => {
    const baseImpact = grantAmount / 500; // Base impact measured in people helped
    const durationFactor = Math.sqrt(projectDuration) / 2;
    const impactMultiplier = impactScore / 5;
    
    const totalImpact = baseImpact * durationFactor * impactMultiplier;
    
    return Math.round(totalImpact);
  };

  // Calculate sustainability score
  const calculateSustainabilityScore = () => {
    const base = (projectDuration / 12) * 2.5;
    const modifier = (impactScore / 10) * 1.5;
    const score = base + modifier;
    return Math.min(Math.max(score, 1), 10).toFixed(1);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
              Grant Programs
              <span className="block text-[#ffc500] mt-2">Funding For Impact</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Supporting initiatives that create lasting positive change in communities
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/grantapplication" className="mt-8 inline-block bg-[#ffc500] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300">
                Apply for a Grant
              </Link>
            </motion.div>
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

      <div className="container mx-auto px-4 py-16">
        {/* Introduction Section */}
          <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
                variants={fadeIn}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Empowering Communities Through Strategic Funding</h2>
          <p className="text-lg text-gray-700 mb-8">
            The Roberto Save Dreams Foundation is committed to providing financial support to initiatives that create lasting positive change. 
            Our grant programs are designed to empower communities, foster innovation, and address critical social challenges.
                </p>
              </motion.div>
        
        {/* Requirements Download Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-8 mb-16 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Grant Requirements Document</h3>
              <p className="text-gray-700">
                Download our comprehensive guide to grant eligibility, application process, and documentation requirements.
              </p>
            </div>
            <a 
              href="https://qrwse.s3.amazonaws.com/rsdf-requirement.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#1D942C] text-white font-medium rounded-lg hover:bg-[#167623] transition-colors"
            >
              <FiDownload className="mr-2" />
              Download Requirements
            </a>
          </div>
        </motion.div>
        
        {/* Available Grants Section */}
              <motion.div
          className="mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold text-center mb-10">Available Grant Programs</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {availableGrants.map((grant) => (
              <motion.div 
                key={grant.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden"
                variants={fadeIn}
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleGrant(grant.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">{grant.title}</h3>
                    <div className="flex items-center">
                      <span className="text-[#1D942C] font-semibold mr-4">{grant.amount}</span>
                      {expandedGrant === grant.id ? (
                        <FiChevronUp className="text-gray-500" />
                      ) : (
                        <FiChevronDown className="text-gray-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{grant.description}</p>
                </div>
                
                {expandedGrant === grant.id && (
                  <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Eligibility Criteria</h4>
                        <ul className="space-y-2">
                          {grant.eligibility.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-[#1D942C] mr-2">•</span>
                              <span className="text-gray-700">{item}</span>
                      </li>
                            ))}
                          </ul>
                </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Documents</h4>
                        <ul className="space-y-2">
                          {grant.documents.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-[#1D942C] mr-2">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
          </div>
        </div>
                    <div className="mt-6 text-center">
                      <Link href="/grantapplication" className="inline-flex items-center justify-center px-6 py-3 bg-[#1D942C] text-white font-medium rounded-lg hover:bg-[#167623] transition-colors">
                        Apply for this Grant
                      </Link>
                    </div>
                  </div>
                )}
                </motion.div>
              ))}
            </div>
        </motion.div>
        
        {/* Grant Calculator Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
          viewport={{ once: true }}
            variants={fadeIn}
        >
          <h2 className="text-3xl font-bold text-center my-10">Funding Calculator</h2>
          <p className="text-center text-lg text-gray-700 mb-10 max-w-3xl mx-auto">
            Explore our funding options to empower entrepreneurs and communities across Africa.
          </p>
          
          {/* Grant Calculator Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.7 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 bg-gradient-to-br from-[#1D942C]/5 to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ffc500]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                {/* Grant Amount Slider */}
                <div className="mb-8 relative z-10">
                  <label htmlFor="grantAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Grant Amount
                  </label>
                  <input
                    type="range"
                    id="grantAmount"
                    min={50000}
                    max={250000}
                    step={10000}
                    value={grantAmount}
                    onChange={(e) => setGrantAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#1D942C] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:bg-[#1D942C]"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-500">$50,000</span>
                    <span className="text-lg font-semibold text-[#1D942C]">${grantAmount.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">$250,000</span>
                    </div>
                </div>

                {/* Grant Duration Field */}
                <div className="mb-8 relative z-10">
                  <label htmlFor="grantDuration" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Duration (Months)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[12, 24, 36].map((months) => (
                        <button
                        key={months}
                          type="button"
                        onClick={() => setProjectDuration(months)}
                        className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
                          months === projectDuration
                              ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                              : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                          }`}
                        >
                        {months} months
                        </button>
                      ))}
                  </div>
                    </div>
                    
                {/* Membership Fee */}
                <div className="mb-8 relative z-10">
                  <label htmlFor="membershipFee" className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Fee
                      </label>
                  <div className="relative">
                    <div className="block w-full rounded-lg border-gray-300 bg-white py-2 px-3 shadow-sm">
                      $450 (Non-refundable)
                        </div>
                      </div>
                    </div>
                    
                {/* Eligibility & Requirements Section */}
                <div className="mt-8 p-6 rounded-xl bg-white border border-gray-100 relative z-10">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">
                    Grant Requirements
                  </h3>
                  
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-medium text-[#1D942C]">Eligibility:</p>
                    <p>Open to individuals and organizations in African countries, including:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>NGOs and non-profits</li>
                      <li>Community groups</li>
                      <li>Private companies</li>
                      <li>Social enterprises</li>
                    </ul>
                    <p className="font-medium text-[#1D942C] mt-3">Required Documents:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Project proposal with implementation timeline</li>
                      <li>Organization registration documents</li>
                      <li>Financial reports (last 2 years)</li>
                      <li>Detailed budget breakdown</li>
                      <li>Team composition and qualifications</li>
                      <li>Sustainability plan</li>
                    </ul>
                    <p className="mt-3"><span className="font-medium">Membership fee:</span> $450</p>
                    
                    <div className="bg-[#1D942C]/5 p-4 rounded-lg mt-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-[#1D942C]">Document uploads:</span> During application, you'll need to upload all required documents. Our portal supports multiple file formats including PDF, DOC, and XLS files.
                      </p>
                    </div>
                    
                    <div className="flex justify-end items-center mt-4 pt-3 border-t border-gray-100">
                      <Link 
                        href="https://qrwse.s3.us-east-1.amazonaws.com/RSDF+-+MICROLOANS+AND+GRANTS+-+REQUIREMENTS+AND+CRITERIA+(2).pdf" 
                        className="text-[#1D942C] flex items-center hover:underline"
                        target="_blank"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                        Download Requirements
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-12 bg-gradient-to-br from-[#ffc500]/5 to-white relative">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C]/5 blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">
                  Grant Summary
                </h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Grant Amount</p>
                    <p className="text-3xl font-bold text-[#1D942C]">${grantAmount.toLocaleString()}</p>
                    </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Membership Fee</p>
                    <p className="text-3xl font-bold text-[#1D942C]">$450</p>
                  </div>
                  
                  <div className="bg-[#1D942C]/5 p-6 rounded-xl border border-[#1D942C]/10">
                    <p className="text-sm text-[#1D942C] mb-1">Potential Impact</p>
                    <p className="text-3xl font-bold text-[#1D942C]">
                      {Math.ceil(grantAmount / 25000)}-{Math.ceil(grantAmount / 15000)} Projects
                    </p>
                  </div>
                  
                  <div className="bg-[#ffc500]/5 p-6 rounded-xl border border-[#ffc500]/10">
                    <p className="text-sm text-[#1D942C] mb-1">Communities Served</p>
                    <p className="text-3xl font-bold text-[#ffc500]">
                      {Math.ceil(grantAmount / 35000)}-{Math.ceil(grantAmount / 25000)} Communities
                    </p>
                  </div>

                  <Link 
                    href={`/grantapplication?amount=${grantAmount}`}
                    className="block w-full text-center px-8 py-4 bg-[#1D942C] text-white rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply for This Grant
                  </Link>
                </div>
                
                <div className="mt-8 p-6 rounded-xl bg-gray-50 border border-gray-100 relative z-10">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1D942C] mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    <p className="ml-2 text-sm text-gray-600">
                      Grant applications are reviewed on a quarterly basis. The membership fee supports our administrative costs and ensures serious applications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Application Process Section */}
        <motion.div 
          className="max-w-4xl mx-auto mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold text-center mb-10">Application Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md relative"
              variants={fadeIn}
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#1D942C] text-white flex items-center justify-center font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-2">Submit Application</h3>
              <p className="text-gray-700">
                Complete the online application form with your project details, budget, and required documentation.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md relative"
              variants={fadeIn}
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#1D942C] text-white flex items-center justify-center font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-2">Review Process</h3>
              <p className="text-gray-700">
                Our team reviews your application, conducts due diligence, and evaluates the project's potential impact.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md relative"
              variants={fadeIn}
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#1D942C] text-white flex items-center justify-center font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 mt-2">Funding Decision</h3>
              <p className="text-gray-700">
                Receive notification of the funding decision, including amount awarded and disbursement timeline.
              </p>
            </motion.div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/grantapplication" className="inline-flex items-center justify-center px-8 py-4 bg-[#1D942C] text-white font-medium rounded-lg hover:bg-[#167623] transition-colors text-lg">
              Start Your Application
            </Link>
            </div>
          </motion.div>
      </div>
    </div>
  );
}
