'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiDownload, FiChevronDown, FiChevronUp, FiCalendar, FiDollarSign, FiPercent } from 'react-icons/fi';
import PageHeader from '@/app/components/PageHeader';

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
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanTerm, setLoanTerm] = useState(12);
  const [interestRate] = useState(4.68);

  // Toggle grant expansion
  const toggleGrant = (id: string) => {
    if (expandedGrant === id) {
      setExpandedGrant(null);
    } else {
      setExpandedGrant(id);
    }
  };

  // Calculate monthly payment for loan calculator
  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const payments = loanTerm;
    
    const x = Math.pow(1 + monthlyRate, payments);
    const monthly = (principal * x * monthlyRate) / (x - 1);
    
    return isFinite(monthly) ? monthly.toFixed(2) : '0.00';
  };

  // Calculate total repayment
  const calculateTotalRepayment = () => {
    const monthlyPayment = parseFloat(calculateMonthlyPayment());
    const totalRepayment = monthlyPayment * loanTerm;
    return isFinite(totalRepayment) ? totalRepayment.toFixed(2) : '0.00';
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
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Grant Programs"
        description="Funding opportunities to support transformative community initiatives"
        image="/images/hero-bg.jpg"
      />
      
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
          <Link href="/grantapplication" className="inline-flex items-center justify-center px-6 py-3 bg-[#1D942C] text-white font-medium rounded-lg hover:bg-[#167623] transition-colors">
            Apply for a Grant
          </Link>
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
        
        {/* Loan Calculator Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Loan Calculator</h2>
          <p className="text-gray-700 mb-8">
            In addition to grants, we also offer low-interest loans to qualified organizations and individuals. 
            Use our calculator to estimate monthly payments and total repayment amounts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FiDollarSign className="mr-2" />
                    Loan Amount
                  </div>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="1000000"
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">$5,000</span>
                  <span className="text-sm font-medium text-gray-900">${loanAmount.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">$1,000,000</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    Loan Term (months)
                  </div>
                </label>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">6 months</span>
                  <span className="text-sm font-medium text-gray-900">{loanTerm} months</span>
                  <span className="text-sm text-gray-500">60 months</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <FiPercent className="mr-2" />
                    Interest Rate
                  </div>
                </label>
                <div className="flex items-center">
                  <span className="text-lg font-medium text-gray-900">{interestRate}%</span>
                  <span className="ml-2 text-sm text-gray-500">Fixed rate for all qualified applicants</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Loan Amount:</span>
                  <span className="font-medium text-gray-900">${loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Loan Term:</span>
                  <span className="font-medium text-gray-900">{loanTerm} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Interest Rate:</span>
                  <span className="font-medium text-gray-900">{interestRate}%</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Monthly Payment:</span>
                    <span className="font-bold text-xl text-gray-900">${calculateMonthlyPayment()}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-700">Total Repayment:</span>
                    <span className="font-medium text-gray-900">${calculateTotalRepayment()}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/loanapplication" className="w-full inline-flex items-center justify-center px-6 py-3 bg-[#1D942C] text-white font-medium rounded-lg hover:bg-[#167623] transition-colors">
                  Apply for a Loan
                </Link>
              </div>
            </div>
          </div>
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
