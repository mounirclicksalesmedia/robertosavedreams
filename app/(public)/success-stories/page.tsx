'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Define the type for our content
interface SuccessStoriesContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  featuredStory: {
    image: string;
    name: string;
    location: string;
    story: string;
    ctaText: string;
    ctaLink: string;
  };
  impactNumbers: Array<{
    number: string;
    label: string;
  }>;
  stories: Array<{
    name: string;
    location: string;
    category: string;
    story: string;
  }>;
  callToAction: {
    title: string;
    description: string;
    primaryCta: {
      text: string;
      link: string;
    };
    secondaryCta: {
      text: string;
      link: string;
    };
  };
}

export default function SuccessStoriesPage() {
  const [content, setContent] = useState<SuccessStoriesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/success-stories');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error('Error fetching success stories content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1D942C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error || 'Failed to load content'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="bg-gradient-to-br from-[#1D942C]/5 to-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <Image
                  src={content.featuredStory.image}
                  alt="Featured Success Story"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="inline-block bg-[#ffc500]/10 text-[#1D942C] px-4 py-2 rounded-full text-sm font-medium mb-4">Featured Story</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.featuredStory.name}</h2>
                <p className="text-gray-600 mb-6">
                  "{content.featuredStory.story}"
                </p>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{content.featuredStory.name}</h3>
                    <p className="text-gray-600">{content.featuredStory.location}</p>
                  </div>
                </div>
                <Link
                  href={content.featuredStory.ctaLink}
                  className="inline-flex items-center space-x-2 bg-[#1D942C] text-white px-6 py-3 rounded-xl hover:bg-[#167623] transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span>{content.featuredStory.ctaText}</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Impact Numbers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {content.impactNumbers.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-[#1D942C]/5 to-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
                <div className="text-3xl md:text-4xl font-bold text-[#1D942C] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Success Stories Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-[#1D942C] mb-12 text-center">More Success Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.stories.map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-[#1D942C]/5 to-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <span className="inline-block bg-[#ffc500]/10 text-[#1D942C] px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {story.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                <p className="text-gray-600 mb-4">{story.story}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{story.location}</span>
                  <Link
                    href="#"
                    className="text-[#1D942C] hover:text-[#167623] font-medium text-sm flex items-center space-x-1"
                  >
                    <span>Read More</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.callToAction.title}</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                {content.callToAction.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href={content.callToAction.primaryCta.link}
                  className="inline-block bg-[#ffc500] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300"
                >
                  {content.callToAction.primaryCta.text}
                </Link>
                <Link 
                  href={content.callToAction.secondaryCta.link}
                  className="inline-block bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300"
                >
                  {content.callToAction.secondaryCta.text}
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
