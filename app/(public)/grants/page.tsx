'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { GrantsData, InvestmentOpportunity, ProcessStep, ImpactMetric } from '@/app/types/grants';
import defaultData from '@/app/data/grants.json';
import LencoPayment from '@/app/components/LencoPayment';

const investmentFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  organization: z.string().min(2, 'Organization name is required'),
  investmentAmount: z.string().min(1, 'Investment amount is required'),
  investmentType: z.enum(['impact-fund', 'angel-partnership', 'innovation-fund']),
  message: z.string().optional(),
});

type InvestmentFormData = z.infer<typeof investmentFormSchema>;

const getGrantsData = (): GrantsData => {
  try {
    // Import the data directly from the JSON file
    const importedData = defaultData as GrantsData;
    
    // Validate that we have all the required sections
    if (!importedData.grants || !importedData.applicationProcess || !importedData.faqs) {
      console.error('Missing required sections in grants data');
    }

    return importedData;
  } catch (error) {
    console.error('Error loading grants data:', error);
    // Return a minimal default structure if there's an error
    return {
      hero: {
        title: "Investment Opportunities",
        subtitle: "Partner in Impact",
        description: "Join us in creating sustainable change across Africa by investing in our mission-driven initiatives"
      },
      overview: {
        title: "Why Invest With Us",
        description: "Roberto Save Dreams Foundation offers unique opportunities for impact investors and angel capitals to create meaningful change while achieving sustainable returns through social impact."
      },
      impactMetrics: {
        metrics: []
      },
      investmentOpportunities: [],
      investmentProcess: {
        title: "Investment Process",
        steps: []
      },
      grants: [],
      applicationProcess: {
        title: "Application Process",
        steps: []
      },
      faqs: []
    };
  }
};

// Use the function to get the data
const grantsData = getGrantsData();

export default function InvestmentPage() {
  const [activeTab, setActiveTab] = useState('impact-fund');
  const [showForm, setShowForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<InvestmentOpportunity | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState('');
  const [investorInfo, setInvestorInfo] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePresetAmount = (amount: number | string) => {
    if (amount === 'Custom') {
      document.getElementById('customAmount')?.focus();
    } else {
      setInvestmentAmount(amount as number);
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setInvestmentAmount(numValue);
    }
  };

  const handleInvestorInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvestorInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1 && investmentAmount > 0) {
      setCurrentStep(2);
    } else if (currentStep === 2 && 
      investorInfo.name && 
      investorInfo.email && 
      investorInfo.organization && 
      investorInfo.phone && 
      investorInfo.country) {
      setCurrentStep(3);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSuccess = (reference: string) => {
    // Redirect to success page with reference
    window.location.href = `/grants/success?reference=${reference}`;
  };

  const handlePaymentError = (error: string) => {
    // Show error message
    alert(error);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentFormSchema)
  });

  const onSubmit = async (data: InvestmentFormData) => {
    try {
      // TODO: Implement form submission
      console.log('Form data:', data);
      // Reset form and show success message
      reset();
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stagger = {
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
              {grantsData.hero.title}
              <span className="block text-[#ffc500] mt-2">{grantsData.hero.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {grantsData.hero.description}
            </p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => {
                setShowForm(true);
                setSelectedOpportunity(grantsData.investmentOpportunities[0]);
              }}
              className="mt-8 bg-[#ffc500] text-[#1D942C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#ffd23d] transform hover:-translate-y-1 transition-all duration-300"
            >
              Become an Investor
            </motion.button>
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

      {/* Impact Metrics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {grantsData?.impactMetrics?.metrics?.map((metric: ImpactMetric, index: number) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-shadow"
              >
                <h3 className="text-4xl font-bold text-[#1D942C] mb-2">
                  {metric.number}
                </h3>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  {metric.label}
                </p>
                <p className="text-gray-600">
                  {metric.description}
                </p>
              </motion.div>
            )) || (
              // Fallback metrics if data is not available
              <>
                <motion.div variants={fadeIn} className="text-center p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-4xl font-bold text-[#1D942C] mb-2">50+</h3>
                  <p className="text-xl font-semibold text-gray-800 mb-2">Businesses Supported</p>
                  <p className="text-gray-600">Small and medium enterprises empowered through our programs</p>
                </motion.div>
                <motion.div variants={fadeIn} className="text-center p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-4xl font-bold text-[#1D942C] mb-2">1000+</h3>
                  <p className="text-xl font-semibold text-gray-800 mb-2">Jobs Created</p>
                  <p className="text-gray-600">Direct and indirect employment opportunities generated</p>
                </motion.div>
                <motion.div variants={fadeIn} className="text-center p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-4xl font-bold text-[#1D942C] mb-2">25K+</h3>
                  <p className="text-xl font-semibold text-gray-800 mb-2">Community Members</p>
                  <p className="text-gray-600">Lives positively impacted through our initiatives</p>
                </motion.div>
                <motion.div variants={fadeIn} className="text-center p-6 rounded-xl bg-white shadow-xl hover:shadow-2xl transition-shadow">
                  <h3 className="text-4xl font-bold text-[#1D942C] mb-2">$2M+</h3>
                  <p className="text-xl font-semibold text-gray-800 mb-2">Investment Impact</p>
                  <p className="text-gray-600">Total investment deployed in sustainable projects</p>
                </motion.div>
              </>
            )}
          </motion.div>
          </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl font-bold text-center mb-16"
          >
            Investment Opportunities
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(grantsData.investmentOpportunities || [
              {
                id: "impact-fund",
                title: "Impact Investment Fund",
                targetAmount: "$500,000",
                currentRaise: "$250,000",
                description: "Join our flagship impact investment fund focused on sustainable development projects across Africa.",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                iconColor: "#1D942C",
                highlights: [
                  "Portfolio diversification",
                  "Quarterly impact reports",
                  "Advisory board access",
                  "Co-investment rights"
                ],
                metrics: {
                  projectsSupported: "25+ active projects",
                  averageReturn: "12-15% target IRR",
                  impactReach: "100,000+ beneficiaries"
                }
              }
            ]).map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-[#1D942C]/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-[#1D942C]"
                        fill="none" 
                      stroke="currentColor"
                        viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={opportunity.icon}
                      />
                      </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{opportunity.title}</h3>
                  <p className="text-gray-600 mb-4">{opportunity.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-semibold">
                        {opportunity.currentRaise} / {opportunity.targetAmount}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#1D942C] h-2 rounded-full"
                        style={{
                          width: `${(parseInt(opportunity.currentRaise.replace(/\$|,/g, '')) / 
                            parseInt(opportunity.targetAmount.replace(/\$|,/g, ''))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {opportunity.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 text-[#1D942C] mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                                </svg>
                        {highlight}
                      </li>
                            ))}
                          </ul>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setSelectedOpportunity(opportunity);
                    }}
                    className="w-full bg-[#1D942C] text-white py-3 rounded-lg hover:bg-[#167623] transition-colors"
                  >
                    Invest Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{grantsData.investmentProcess.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {grantsData.investmentProcess.steps.map((step: ProcessStep, index: number) => (
                <motion.div
                  key={index}
                variants={fadeIn}
                className="text-center p-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-6 relative z-10">
                  <div className="w-12 h-12 bg-[#1D942C]/10 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-[#1D942C]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={step.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < grantsData.investmentProcess.steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-gray-200 transform translate-y-[-50%] z-0" />
                )}
                </motion.div>
              ))}
            </div>
          </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
          viewport={{ once: true }}
            variants={fadeIn}
            className="text-4xl font-bold text-center mb-16"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="max-w-3xl mx-auto">
            {grantsData.faqs.map((faq: { question: string; answer: string }, index: number) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: index * 0.1 }}
                className="mb-6"
              >
                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Investment Application</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Investment Amount</h3>
                    
                    {/* Preset Amounts */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                      {[50000, 100000, 250000, 500000, 1000000, 2000000, 5000000, 'Custom'].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handlePresetAmount(amount)}
                          className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                            amount === investmentAmount && customAmount === ''
                              ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                              : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                          }`}
                        >
                          {amount === 'Custom' ? 'Custom' : `$${amount.toLocaleString()}`}
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
                    
                    {/* Investment Type */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Investment Type
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Impact Fund', 'Angel Partnership', 'Innovation Fund'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setActiveTab(type.toLowerCase().replace(' ', '-'))}
                            className={`py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                              activeTab === type.toLowerCase().replace(' ', '-')
                                ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                                : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
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
                          value={investorInfo.name}
                          onChange={handleInvestorInfoChange}
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
                          value={investorInfo.email}
                          onChange={handleInvestorInfoChange}
                          className="block w-full rounded-lg border-gray-300 focus:border-[#1D942C] focus:ring-[#1D942C]"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                          Organization
                        </label>
                        <input
                          type="text"
                          id="organization"
                          name="organization"
                          value={investorInfo.organization}
                          onChange={handleInvestorInfoChange}
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
                          value={investorInfo.phone}
                          onChange={handleInvestorInfoChange}
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
                          value={investorInfo.country}
                          onChange={handleInvestorInfoChange}
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
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Investment Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium text-gray-900">${investmentAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Investment Type:</span>
                          <span className="font-medium text-gray-900">{activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium text-gray-900">{investorInfo.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Organization:</span>
                          <span className="font-medium text-gray-900">{investorInfo.organization}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
                      
                      {/* Payment Method Toggle */}
                      <div className="flex space-x-4 mb-6">
                        <button
                          onClick={() => setPaymentMethod('card')}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                            paymentMethod === 'card'
                              ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                              : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Credit Card
                          </div>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('bank')}
                          className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                            paymentMethod === 'bank'
                              ? 'border-[#1D942C] bg-[#1D942C]/10 text-[#1D942C] font-medium'
                              : 'border-gray-200 text-gray-700 hover:border-[#1D942C]/20'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            Bank Transfer
                          </div>
                        </button>
                      </div>

                      {/* Payment Forms */}
                      {paymentMethod === 'card' ? (
                        <div>
                          <LencoPayment
                            amount={investmentAmount}
                            frequency="one-time"
                            donorInfo={investorInfo}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                          />
                          <p className="text-gray-600 text-sm mt-4">
                            Your payment will be processed securely through Lenco Payment Gateway.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="text-blue-900 font-medium mb-2">Bank Transfer Instructions</h5>
                            <p className="text-blue-800 text-sm mb-4">
                              Please transfer the investment amount to the following bank account. Include your name and organization in the transfer reference.
                            </p>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Bank Name:</span>
                                <span className="font-medium text-blue-900">Roberto Save Dreams Bank</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Account Name:</span>
                                <span className="font-medium text-blue-900">Roberto Save Dreams Foundation</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Account Number:</span>
                                <span className="font-medium text-blue-900">1234567890</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">Routing Number:</span>
                                <span className="font-medium text-blue-900">021000021</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-blue-700">SWIFT Code:</span>
                                <span className="font-medium text-blue-900">RSDBUS33</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              <p className="text-yellow-800 text-sm">
                                After making the transfer, please email a copy of the transfer receipt to <span className="font-medium">investments@robertosavedreams.org</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
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
                  
                  {currentStep < 3 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 bg-[#1D942C] text-white rounded-lg font-medium hover:bg-[#167623] transition-colors ml-auto"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-2 bg-gradient-to-br from-[#ffc500]/5 to-white rounded-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Impact</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">${investmentAmount.toLocaleString()} investment can:</p>
                      <p className="text-sm text-gray-600">Support {Math.floor(investmentAmount / 10000)} small businesses</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#ffc500]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ffc500]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Create job opportunities</p>
                      <p className="text-sm text-gray-600">Estimated {Math.floor(investmentAmount / 5000)} new jobs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-[#1D942C]/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#1D942C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Community Impact</p>
                      <p className="text-sm text-gray-600">Benefit {Math.floor(investmentAmount / 1000)} community members</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1D942C]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Secure investment process</p>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1D942C]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">Regular impact reports</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </div>
      )}
    </div>
  );
}
