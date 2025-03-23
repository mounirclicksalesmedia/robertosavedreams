'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Define the content type
interface GrantsContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  overview: {
    title: string;
    description: string;
  };
  grants: Array<{
    id: string;
    title: string;
    amount: string;
    deadline: string;
    description: string;
    icon: string;
    iconColor: string;
    requirements: string[];
  }>;
  applicationProcess: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export default function GrantsPage() {
  const [selectedGrant, setSelectedGrant] = useState<string | null>(null);
  const [content, setContent] = useState<GrantsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/grants');
        
        if (!response.ok) {
          throw new Error('Failed to fetch grants content');
        }
        
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error('Error fetching grants content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#1D942C] border-[#1D942C]/20 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading grants information...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Content</h2>
          <p className="text-gray-600 mb-4">{error || 'Unable to load grants information'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#1D942C] hover:bg-[#167623] text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        {/* Overview Section */}
        <motion.section
          {...fadeInUp}
          className="mb-16"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#1D942C] mb-4">{content.overview.title}</h2>
            <div className="w-20 h-1 bg-[#1D942C] mx-auto rounded-full mb-4" />
            <p className="text-lg text-gray-600">
              {content.overview.description}
            </p>
          </div>
        </motion.section>

        {/* Grants Grid */}
        <motion.section
          {...fadeInUp}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {content.grants.map((grant, index) => (
              <motion.div
                key={grant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div
                  className={`bg-white rounded-2xl p-8 shadow-lg border border-[#1D942C]/10 cursor-pointer transition-all duration-300 hover:shadow-2xl relative overflow-hidden ${
                    selectedGrant === grant.id ? 'ring-2 ring-[#1D942C]' : ''
                  }`}
                  onClick={() => setSelectedGrant(selectedGrant === grant.id ? null : grant.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1D942C]/5 via-transparent to-[#ffc500]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-[#1D942C]/10">
                      <svg 
                        className="h-8 w-8" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke={grant.iconColor}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={grant.icon} />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1D942C] mb-2">{grant.title}</h3>
                    <div className="text-[#1D942C] font-semibold mb-2">{grant.amount}</div>
                    <div className="text-sm text-gray-500 mb-4">Deadline: {grant.deadline}</div>
                    <p className="text-gray-600 mb-4">{grant.description}</p>
                    
                    <AnimatePresence>
                      {selectedGrant === grant.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4"
                        >
                          <h4 className="font-semibold text-[#1D942C] mb-2">Requirements:</h4>
                          <ul className="space-y-2">
                            {grant.requirements.map((req, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center space-x-2 text-gray-600"
                              >
                                <svg className="w-5 h-5 text-[#1D942C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{req}</span>
                              </motion.li>
                            ))}
                          </ul>
                          <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 w-full bg-gradient-to-r from-[#1D942C] to-[#167623] text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                          >
                            Apply Now
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Application Process */}
        <motion.section
          {...fadeInUp}
          className="mb-16 bg-white rounded-2xl p-8 shadow-lg border border-[#1D942C]/10"
        >
          <h2 className="text-3xl font-bold text-[#1D942C] mb-4 text-center">{content.applicationProcess.title}</h2>
          <div className="w-20 h-1 bg-[#1D942C] mx-auto rounded-full mb-8" />
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 w-full h-1 bg-[#1D942C]/10 hidden md:block">
              <motion.div
                className="h-full bg-[#1D942C]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>

            {/* Steps */}
            <div className="relative grid md:grid-cols-4 gap-8">
              {content.applicationProcess.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative group"
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 border-2 border-[#1D942C] group-hover:scale-110 transition-transform duration-300">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                        className="w-12 h-12 bg-[#1D942C] rounded-full flex items-center justify-center text-white"
                      >
                        <span className="text-xl font-bold">{index + 1}</span>
                      </motion.div>
                    </div>
                    <div className="text-center group-hover:-translate-y-1 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-[#1D942C]/10"
        >
          <h2 className="text-3xl font-bold text-[#1D942C] mb-4 text-center">Frequently Asked Questions</h2>
          <div className="w-20 h-1 bg-[#1D942C] mx-auto rounded-full mb-8" />
          
          <div className="grid md:grid-cols-2 gap-8">
            {content.faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#1D942C]/10"
              >
                <h3 className="text-lg font-semibold text-[#1D942C] mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
