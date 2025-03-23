'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Types for the JSON data structure
type Card = {
  title: string;
  description: string;
  icon: string;
};

type Donation = {
  amount: string;
  description: string;
};

type Section = {
  id: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  cards: Card[];
  benefits?: string[];
  requirements?: string[];
  donations?: Donation[];
  ctaText: string;
  ctaLink: string;
};

type GetInvolvedData = {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  sections: Section[];
};

export default function GetInvolvedPage() {
  const [data, setData] = useState<GetInvolvedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-involved');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to static content would be here if needed
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#1D942C] rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    // If data fails to load, you could have a fallback UI or redirect
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Failed to load content</h1>
          <p className="text-gray-600 mb-6">We're having trouble loading this page. Please try again later.</p>
          <Link href="/" className="inline-block bg-[#1D942C] text-white px-6 py-3 rounded-lg">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Get sections by ID
  const partnerSection = data.sections.find(section => section.id === 'partner');
  const ambassadorSection = data.sections.find(section => section.id === 'ambassador');
  const fundraisingSection = data.sections.find(section => section.id === 'fundraising');

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
              {data.hero.title}
              <span className="block text-[#ffc500] mt-2">{data.hero.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {data.hero.description}
            </p>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Partner with Us Section */}
        {partnerSection && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <h2 className="text-3xl font-bold text-[#1D942C] mb-6">{partnerSection.title}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {partnerSection.description}
              </p>
              {partnerSection.secondaryDescription && (
                <p className="text-lg text-gray-600 mb-12">
                  {partnerSection.secondaryDescription}
                </p>
              )}

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {partnerSection.cards.map((card, index) => (
                  <div key={index} className="bg-gradient-to-br from-[#1D942C]/5 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>

              {partnerSection.benefits && partnerSection.benefits.length > 0 && (
                <div className="bg-gradient-to-br from-[#ffc500]/10 to-white p-8 rounded-xl mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Benefits of Partnering with Us:</h3>
                  <ul className="space-y-3">
                    {partnerSection.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-[#1D942C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-center">
                <Link
                  href={partnerSection.ctaLink}
                  className="inline-block bg-[#1D942C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300"
                >
                  {partnerSection.ctaText}
                </Link>
              </div>
            </div>
          </motion.section>
        )}

        {/* Ambassador Section */}
        {ambassadorSection && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <h2 className="text-3xl font-bold text-[#1D942C] mb-6">{ambassadorSection.title}</h2>
              <p className="text-lg text-gray-600 mb-12">
                {ambassadorSection.description}
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {ambassadorSection.cards.map((card, index) => (
                  <div key={index} className="bg-gradient-to-br from-[#1D942C]/5 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>

              {ambassadorSection.requirements && ambassadorSection.requirements.length > 0 && (
                <div className="bg-gradient-to-br from-[#ffc500]/10 to-white p-8 rounded-xl mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Who Can Become an Ambassador?</h3>
                  <ul className="space-y-3">
                    {ambassadorSection.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-[#1D942C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-center">
                <Link
                  href={ambassadorSection.ctaLink}
                  className="inline-block bg-[#1D942C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300"
                >
                  {ambassadorSection.ctaText}
                </Link>
              </div>
            </div>
          </motion.section>
        )}

        {/* Fundraising Section */}
        {fundraisingSection && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <h2 className="text-3xl font-bold text-[#1D942C] mb-6">{fundraisingSection.title}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {fundraisingSection.description}
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {fundraisingSection.cards.map((card, index) => (
                  <div key={index} className="bg-gradient-to-br from-[#1D942C]/5 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>

              {fundraisingSection.donations && fundraisingSection.donations.length > 0 && (
                <div className="bg-gradient-to-br from-[#ffc500]/10 to-white p-8 rounded-xl mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Where Your Donations Go:</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fundraisingSection.donations.map((donation, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-4 shadow-sm">
                        <span className="text-[#1D942C] font-bold text-lg">{donation.amount}</span>
                        <span className="text-gray-600">{donation.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <Link
                  href={fundraisingSection.ctaLink}
                  className="inline-block bg-[#1D942C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300"
                >
                  {fundraisingSection.ctaText}
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
