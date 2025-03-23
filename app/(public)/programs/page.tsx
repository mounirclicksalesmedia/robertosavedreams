'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const programs = [
  {
    id: 'microloans',
    title: 'Microloans & Entrepreneurship',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Access to capital is one of the greatest barriers preventing women from achieving financial independence.',
    benefits: [
      'Seed capital for startups',
      'Expansion funding',
      'Financial education',
      'Networking opportunities'
    ],
    eligibility: [
      'Women aged 18–40',
      'Entrepreneurs with sustainable business plans',
      'Applications reviewed through internal approval system'
    ],
    cta: {
      text: 'Apply for a Loan Now',
      link: '/loanapplication'
    }
  },
  {
    id: 'education',
    title: 'Education & Mentorship',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    description: 'Education is the key to breaking the cycle of poverty and creating opportunities for young girls.',
    benefits: [
      'Full and partial scholarships',
      'Mentorship programs',
      'Vocational training',
      'Access to learning materials'
    ],
    cta: {
      text: 'Support a Scholarship Program Today',
      link: '/support-scholarship'
    }
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Wellness',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    description: "Women's health is a fundamental human right, yet many women in Africa lack access to essential healthcare services.",
    services: [
      'Maternal healthcare',
      'Reproductive health education',
      'Mobile health clinics',
      'Wellness programs'
    ],
    cta: {
      text: "Support Women's Healthcare Initiatives",
      link: '/support-healthcare'
    }
  },
  {
    id: 'advocacy',
    title: 'Gender Equality Advocacy',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    description: 'Despite significant progress, gender inequality remains a critical issue in many parts of the world.',
    initiatives: [
      'Awareness campaigns',
      'Workshops and training',
      'Policy collaboration',
      'Legal aid support'
    ],
    cta: {
      text: 'Join Our Advocacy Efforts',
      link: '/join-advocacy'
    }
  },
  {
    id: 'sports',
    title: 'Sports for Empowerment',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'Sports are more than just games—they are powerful tools for empowerment, self-confidence, and leadership development.',
    benefits: [
      'Leadership & Teamwork',
      'Physical & Mental Well-being',
      'Community Building',
      'Breaking Gender Stereotypes'
    ],
    cta: {
      text: 'Support Our Sports Empowerment Programs',
      link: '/support-sports'
    }
  }
];

const WaveArrow = ({ isActive }: { isActive: boolean }) => (
  <motion.div
    initial={false}
    animate={{ rotate: isActive ? 180 : 0 }}
    transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
    className="absolute right-8 top-8"
  >
    <svg 
      className="w-6 h-6 text-[#3eb54d]" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <motion.path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
        initial={false}
        animate={{
          d: isActive 
            ? "M19 15l-7-7-7 7"
            : "M19 9l-7 7-7-7"
        }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  </motion.div>
);

export default function ProgramsPage() {
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

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
              Programs & Initiatives
              <span className="block text-[#ffc500] mt-2">Empowering Through Action</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Empowering women and girls through comprehensive support and opportunities
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

      {/* Detailed Program Sections */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Microloans Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-32"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/programs/loan.jpeg"
                  alt="Women entrepreneurs"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900">500+ Women Entrepreneurs Supported</p>
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Empowering Through Microloans
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Access to capital is one of the greatest barriers preventing women from achieving financial independence. 
                  Our microloan program provides affordable financing options coupled with comprehensive business development support.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="w-12 h-12 bg-[#3eb54d]/10 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-[#3eb54d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Financial Support</h3>
                    <p className="text-gray-600">Providing seed capital and expansion funding for sustainable business growth.</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <div className="w-12 h-12 bg-[#3eb54d]/10 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-[#3eb54d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Development</h3>
                    <p className="text-gray-600">Training and mentorship to build successful enterprises.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Education Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-32"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Education & Mentorship Programs
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Education is the key to breaking the cycle of poverty and creating opportunities for young girls. 
                  Through strategic partnerships and donor funding, we provide comprehensive educational support.
                </p>
                <div className="space-y-6 mb-8">
                  {[
                    {
                      title: 'Scholarships',
                      description: 'Full and partial scholarships for primary, secondary, and higher education.'
                    },
                    {
                      title: 'Mentorship',
                      description: 'Connecting girls with successful female professionals in various fields.'
                    },
                    {
                      title: 'Skills Training',
                      description: 'Vocational and skills training for employment and entrepreneurship.'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#3eb54d]/10 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-5 h-5 text-[#3eb54d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/programs/education.jpeg"
                  alt="Education programs"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900">200+ Students Supported Annually</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Healthcare Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-32"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/programs/health.jpeg"
                  alt="Healthcare services"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900">5000+ Women Received Healthcare Support</p>
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Healthcare & Wellness Initiatives
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Women's health is a fundamental human right. We prioritize maternal and reproductive health, 
                  ensuring women and young girls receive essential medical support for healthy lives.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    'Maternal healthcare',
                    'Reproductive health education',
                    'Mobile health clinics',
                    'Wellness programs'
                  ].map((service, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                      <div className="w-12 h-12 bg-[#3eb54d]/10 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-[#3eb54d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{service}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sports Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Sports for Empowerment
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Sports are powerful tools for empowerment, self-confidence, and leadership development. 
                  Our program uses athletics to help young girls build essential life skills and break stereotypes.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Leadership',
                      description: 'Building confidence and resilience through team sports'
                    },
                    {
                      title: 'Well-being',
                      description: 'Promoting physical and mental health through activity'
                    },
                    {
                      title: 'Community',
                      description: 'Creating safe spaces for growth and connection'
                    },
                    {
                      title: 'Breaking Barriers',
                      description: 'Challenging gender stereotypes in sports'
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2 relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/programs/sport.jpeg"
                  alt="Sports programs"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900">300+ Girls in Sports Programs</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid with Dropdowns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
        >
          Explore Our Programs in Detail
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden group"
            >
              <div 
                className={`p-8 cursor-pointer transition-all duration-300 ${
                  activeProgram === program.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveProgram(activeProgram === program.id ? null : program.id)}
              >
                <WaveArrow isActive={activeProgram === program.id} />
                
                <div className="w-16 h-16 bg-[#3eb54d]/10 rounded-full flex items-center justify-center mb-6 text-[#3eb54d]">
                  {program.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pr-12">{program.title}</h2>
                <p className="text-gray-600 mb-6">{program.description}</p>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: activeProgram === program.id ? 'auto' : 0,
                    opacity: activeProgram === program.id ? 1 : 0
                  }}
                  transition={{
                    height: { duration: 0.3 },
                    opacity: { duration: 0.2, delay: activeProgram === program.id ? 0.1 : 0 }
                  }}
                  className="overflow-hidden"
                >
                  {program.benefits && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Benefits:</h3>
                      <ul className="space-y-2">
                        {program.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-[#3eb54d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {program.eligibility && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Eligibility:</h3>
                      <ul className="space-y-2">
                        {program.eligibility.map((item, i) => (
                          <li key={i} className="flex items-center text-gray-600">
                            <span className="text-[#3eb54d] mr-2">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {program.services && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Services:</h3>
                      <ul className="space-y-2">
                        {program.services.map((service, i) => (
                          <li key={i} className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-[#3eb54d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {program.initiatives && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Initiatives:</h3>
                      <ul className="space-y-2">
                        {program.initiatives.map((initiative, i) => (
                          <li key={i} className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 text-[#3eb54d] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {initiative}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{
                    y: activeProgram === program.id ? 10 : 0,
                    opacity: activeProgram === program.id ? 1 : 0.9
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col space-y-3"
                >
                  <Link
                    href={program.cta.link}
                    className="inline-block w-full text-center px-6 py-3 bg-[#3eb54d] text-white rounded-md hover:bg-[#2d8a3a] transition-colors duration-200"
                  >
                    {program.cta.text}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Impact Stats Section */}
      <section className="py-20 bg-[#3eb54d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-white/90">Making a difference in communities across Africa</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Women Entrepreneurs' },
              { number: '1000+', label: 'Students Educated' },
              { number: '5000+', label: 'Healthcare Recipients' },
              { number: '300+', label: 'Athletes Supported' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</p>
                <p className="text-lg text-white/90">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Join Us in Making a Difference
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Together, we can create lasting change and empower more women and girls across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/donate"
                className="px-8 py-4 bg-[#3eb54d] text-white rounded-lg shadow-lg hover:bg-[#2d8a3a] transition-all duration-300 text-lg font-medium"
              >
                Make a Donation
              </Link>
              <Link
                href="/get-involved"
                className="px-8 py-4 bg-white text-[#3eb54d] border-2 border-[#3eb54d] rounded-lg shadow-lg hover:bg-[#3eb54d]/5 transition-all duration-300 text-lg font-medium"
              >
                Get Involved
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
