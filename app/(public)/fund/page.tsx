"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiDollarSign, FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiCreditCard, FiBriefcase } from 'react-icons/fi';

// Define investment options
const investmentOptions = [
  {
    id: 'women_empowerment',
    title: 'Women Empowerment Fund',
    description: 'Support initiatives that empower women through education, entrepreneurship, and leadership development.',
    minAmount: 1000,
    impact: [
      'Skills training for women',
      'Business startup support',
      'Leadership development programs',
      'Educational scholarships'
    ],
    icon: '/images/icons/women.svg'
  },
  {
    id: 'sustainable_development',
    title: 'Sustainable Development Fund',
    description: 'Invest in projects that promote sustainable development and environmental conservation in African communities.',
    minAmount: 2000,
    impact: [
      'Renewable energy projects',
      'Sustainable agriculture',
      'Clean water initiatives',
      'Environmental conservation'
    ],
    icon: '/images/icons/sustainability.svg'
  },
  {
    id: 'education',
    title: 'Education Innovation Fund',
    description: 'Support educational initiatives that improve access to quality education in underserved communities.',
    minAmount: 1500,
    impact: [
      'School infrastructure',
      'Educational technology',
      'Teacher training',
      'Student support programs'
    ],
    icon: '/images/icons/education.svg'
  }
];

export default function FundPage() {
  const [step, setStep] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    investmentAmount: '',
    message: '',
    paymentMethod: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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
              Investment & Partnership
              <span className="block text-[#ffc500] mt-2">Fund African Development</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Join us in empowering communities and creating sustainable change across Africa
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                onClick={() => document.getElementById('investment-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 inline-block bg-[#ffc500] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300"
              >
                Invest Now
              </button>
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

      {/* Investment Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Investment Opportunities</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Choose from our carefully curated investment funds designed to create maximum impact
              in women empowerment and sustainable development across Africa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {investmentOptions.map((option) => (
              <motion.div
                key={option.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className={`bg-white rounded-xl shadow-lg p-8 cursor-pointer transition-all duration-300 hover:shadow-xl
                  ${selectedOption === option.id ? 'ring-2 ring-[#1D942C]' : ''}`}
                onClick={() => setSelectedOption(option.id)}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{option.title}</h3>
                <p className="text-gray-600 mb-6">{option.description}</p>
                <div className="text-sm text-gray-500">
                  <p className="font-semibold mb-2">Impact Areas:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {option.impact.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    Minimum Investment: <span className="font-bold">${option.minAmount.toLocaleString()}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Form */}
      <section id="investment-form" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {step === 1 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Start Your Investment Journey</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D942C] focus:border-transparent"
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiMail className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D942C] focus:border-transparent"
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiPhone className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D942C] focus:border-transparent"
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiDollarSign className="inline mr-2" />
                      Investment Amount
                    </label>
                    <input
                      type="number"
                      name="investmentAmount"
                      value={formData.investmentAmount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D942C] focus:border-transparent"
                      required
                      placeholder="Enter amount in USD"
                      min="1000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiMapPin className="inline mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D942C] focus:border-transparent"
                    required
                    placeholder="Enter your address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FiFileText className="inline mr-2" />
                    Additional Information
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D942C] focus:border-transparent"
                    rows={4}
                    placeholder="Tell us about your investment goals and interests"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#1D942C] to-[#167623] text-white py-4 px-6 rounded-lg font-semibold hover:from-[#167623] hover:to-[#1D942C] transition-all duration-300 shadow-lg"
                >
                  Proceed to Payment
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Choose Payment Method</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => setFormData({ ...formData, paymentMethod: 'bank' })}
                  className={`p-6 rounded-xl transition-all duration-300 flex flex-col items-center
                    ${formData.paymentMethod === 'bank' 
                      ? 'bg-[#1D942C]/10 border-2 border-[#1D942C]' 
                      : 'border-2 border-gray-200 hover:border-[#1D942C]/50'}`}
                >
                  <FiBriefcase className="text-4xl mb-4 text-[#1D942C]" />
                  <div className="text-xl font-semibold text-gray-900 mb-2">Bank Transfer</div>
                  <p className="text-gray-600 text-sm text-center">
                    Secure direct bank transfer to our foundation account
                  </p>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-6 rounded-xl transition-all duration-300 flex flex-col items-center
                    ${formData.paymentMethod === 'card' 
                      ? 'bg-[#1D942C]/10 border-2 border-[#1D942C]' 
                      : 'border-2 border-gray-200 hover:border-[#1D942C]/50'}`}
                >
                  <FiCreditCard className="text-4xl mb-4 text-[#1D942C]" />
                  <div className="text-xl font-semibold text-gray-900 mb-2">Credit Card</div>
                  <p className="text-gray-600 text-sm text-center">
                    Quick and secure payment via credit card
                  </p>
                </button>
              </div>
              {formData.paymentMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={() => alert('Processing payment...')}
                    className="bg-[#ffc500] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300"
                  >
                    Complete Investment
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
