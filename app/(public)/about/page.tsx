'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Define content interface
interface AboutContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  introduction: {
    title: string;
    description: string;
  };
  missionVision: {
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
  };
  founder: {
    name: string;
    role: string;
    image: string;
    description: string[];
    qualifications: string[];
  };
  team: {
    title: string;
    members: Array<{
      name: string;
      role: string;
      image: string;
    }>;
  };
  strategicGoalsObjectives: {
    title: string;
    goals: string[];
    objectives: string[];
  };
  coreValues: {
    title: string;
    values: Array<{
      title: string;
      description: string;
    }>;
  };
  callToAction: {
    title: string;
    description: string;
    button: {
      text: string;
      url: string;
    };
  };
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  // Content state
  const [content, setContent] = useState<AboutContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  
  // Fetch content from JSON file
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Add cache-busting timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/data/about-content.json?t=${timestamp}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        console.log('About content loaded:', data); // Log content for debugging
        setContent(data);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, []);

  // If content is loading, show a loading state
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
              {content?.hero.title || "Who We Are"}
              <span className="block text-[#ffc500] mt-2">{content?.hero.subtitle || "Our Story, Our Mission"}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {content?.hero.description || "Empowering women and girls to create lasting change in their communities"}
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
        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-[#1D942C]/5 to-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#ffc500]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1D942C] mb-6">{content?.introduction.title || "ROBERTO SAVE DREAMS FOUNDATION"}</h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
                {content?.introduction.description || "Humanitarian women's organisation is dedicated to empowering and uplifting women and girls in underserved communities around the world. We believe that by providing access to education, healthcare, and economic opportunities, we can help women break the cycle of poverty and become active agents of change in their own lives and in their communities."}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-[#1D942C]/20 transition-all duration-300">
            <div className="w-16 h-16 bg-[#1D942C]/10 rounded-full flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#1D942C] mb-4">{content?.missionVision.mission.title || "Our Mission"}</h3>
            <p className="text-gray-600">
              {content?.missionVision.mission.description || "Our mission is to create a world where every woman and girl has the opportunity to reach her full potential, to lead a healthy and fulfilling life, and to participate fully in the economic, social, and political life of her country."}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-[#ffc500]/20 transition-all duration-300">
            <div className="w-16 h-16 bg-[#ffc500]/10 rounded-full flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-[#ffc500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#ffc500] mb-4">{content?.missionVision.vision.title || "Our Vision"}</h3>
            <p className="text-gray-600">
              {content?.missionVision.vision.description || "Empowering Women, Transforming the World."}
            </p>
          </div>
        </motion.section>

        {/* Founder Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D942C] mb-8">Our Founder</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/3">
                <div className="relative h-64 w-64 mx-auto rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={content?.founder.image || "/images/about/dr-roberto.jpg"}
                    alt={content?.founder.name || "Dr. Roberto Cacoma Chiteta"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-[#1D942C] mb-2">{content?.founder.name || "Dr. Roberto Cacoma Chiteta"}</h3>
                  <p className="text-[#ffc500] font-medium">{content?.founder.role || "Founder & CEO"}</p>
                </div>
              </div>
              <div className="md:w-2/3">
                {content?.founder.description?.map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {paragraph}
                  </p>
                )) || (
                  <>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      Dr. Roberto Cacoma Chiteta is a forward-thinking entrepreneur who holds dual citizenship in Angola and Zambia. He is primarily based in Luanda Nova cidade Kilamba. With over 11 years of experience in leadership training roles, Dr. Chiteta has designed and delivered educational programs globally, spanning regions such as the UK, Europe, Africa, Australia, Hong Kong, and China.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Currently, Dr. Chiteta serves as the CEO and Founder at Roberto Save Dreams Foundation (2024-Present), where he continues to lead impactful leadership development programs.
                    </p>
                  </>
                )}
                <div className="bg-gradient-to-br from-[#1D942C]/5 to-white p-6 rounded-xl">
                  <h4 className="font-semibold text-[#1D942C] mb-4 text-lg">Education & Qualifications</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {content?.founder.qualifications?.map((qualification, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-[#ffc500]" />
                        <span className="text-gray-600">{qualification}</span>
                      </div>
                    )) || (
                      <>
                        {[
                          "Master's in Leadership",
                          "PhD in Philosophy",
                          "PhD in Justice and Criminology",
                          "Certificate Pedagogy Course in English Language",
                          "PDA International qualifications in management and talent development",
                          "Diploma in Project Planning and Management"
                        ].map((qualification, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-[#ffc500]" />
                            <span className="text-gray-600">{qualification}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D942C] mb-8">{content?.team.title || "Our Team"}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {content?.team.members?.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-[#1D942C]/20 transition-all duration-300"
              >
                <div className="relative h-48 w-48 mx-auto rounded-2xl overflow-hidden mb-6 shadow-xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#1D942C] mb-2">{member.name}</h3>
                  <p className="text-[#ffc500] font-medium">{member.role}</p>
                </div>
              </motion.div>
            )) || (
              <>
                {[
                  {
                    name: "Christine Chilangwa",
                    role: "Country Director (Zambia - Angola)",
                    image: "/images/team/christian.jpg"
                  },
                  {
                    name: "Jennifer Chinyere Osakwe",
                    role: "President of RSDF Global",
                    image: "/images/team/jennifer.jpg"
                  }
                ].map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-[#1D942C]/20 transition-all duration-300"
                  >
                    <div className="relative h-48 w-48 mx-auto rounded-2xl overflow-hidden mb-6 shadow-xl">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-[#1D942C] mb-2">{member.name}</h3>
                      <p className="text-[#ffc500] font-medium">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </motion.section>

        {/* Strategic Goals & Objectives */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D942C] mb-8">{content?.strategicGoalsObjectives.title || "Strategic Goals & Objectives"}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#1D942C]/5 to-white rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#ffc500]/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-[#1D942C] mb-6">Strategic Goals</h3>
                <div className="space-y-4">
                  {content?.strategicGoalsObjectives.goals?.map((goal, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1D942C]/10 flex items-center justify-center mt-1">
                        <svg className="h-4 w-4 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600">{goal}</span>
                    </div>
                  )) || (
                    <>
                      {[
                        "Provide access to quality education for women and girls",
                        "Improve access to healthcare and reproductive health services",
                        "Support women's economic empowerment",
                        "Advocate for women's rights and gender equality"
                      ].map((goal, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1D942C]/10 flex items-center justify-center mt-1">
                            <svg className="h-4 w-4 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-600">{goal}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#ffc500]/5 to-white rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1D942C]/5 blur-3xl -translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-[#ffc500] mb-6">Objectives</h3>
                <div className="space-y-4">
                  {content?.strategicGoalsObjectives.objectives?.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ffc500]/10 flex items-center justify-center mt-1">
                        <svg className="h-4 w-4 text-[#ffc500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600">{objective}</span>
                    </div>
                  )) || (
                    <>
                      {[
                        "Establish network of women's centers",
                        "Train and empower new women leaders",
                        "Advocate for policy changes promoting women's rights"
                      ].map((objective, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ffc500]/10 flex items-center justify-center mt-1">
                            <svg className="h-4 w-4 text-[#ffc500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-600">{objective}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Core Values */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D942C] mb-8">{content?.coreValues.title || "Core Values"}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content?.coreValues.values?.map((value, index) => {
              const icons = [
                <path key="icon1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                <path key="icon2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
                <path key="icon3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              ];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-[#1D942C]/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1D942C]/10 to-[#ffc500]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="h-8 w-8 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {icons[index % icons.length]}
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1D942C] mb-4 text-center">{value.title}</h3>
                  <p className="text-gray-600 text-center">
                    {value.description}
                  </p>
                </motion.div>
              );
            }) || (
              <>
                {[
                  {
                    title: "Empowerment",
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    ),
                    description: "We believe that women and girls have the right to make decisions about their own lives and to have the skills and resources necessary to achieve their goals."
                  },
                  {
                    title: "Inclusion",
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    ),
                    description: "We are committed to reaching the most marginalized and excluded women and girls, particularly those living in poverty, those affected by conflict or crisis, and those living with disabilities."
                  },
                  {
                    title: "Sustainability",
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    ),
                    description: "We work to build sustainable, community-led solutions that will outlast our initial support and continue to empower women and girls for generations to come."
                  }
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-[#1D942C]/20 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1D942C]/10 to-[#ffc500]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="h-8 w-8 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {value.icon}
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1D942C] mb-4 text-center">{value.title}</h3>
                    <p className="text-gray-600 text-center">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center bg-gradient-to-br from-[#1D942C] to-[#167623] rounded-2xl shadow-xl p-12 text-white relative overflow-hidden"
        >
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
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{content?.callToAction.title || "Building a Better World"}</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              {content?.callToAction.description || "We rely on the generosity of donors and supporters to fund our work. Join us in making a difference."}
            </p>
            <Link
              href={content?.callToAction.button.url || "/donate"}
              className="inline-block bg-[#ffc500] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300"
            >
              {content?.callToAction.button.text || "Make a Donation"}
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
