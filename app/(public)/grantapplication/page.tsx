'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiCheck, FiEdit } from 'react-icons/fi';
import { BsBuilding, BsPerson, BsCalendar } from 'react-icons/bs';
import PageHeader from '@/app/components/PageHeader';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Grant applicant types and their required documents
const applicantTypes = [
  {
    id: 'community',
    label: 'Community Organization',
    documents: [
      { id: 'registration', label: 'Organization Registration Certificate' },
      { id: 'proposal', label: 'Project Proposal Document' },
      { id: 'budget', label: 'Detailed Budget Plan' },
    ]
  },
  {
    id: 'school',
    label: 'School/Educational Institution',
    documents: [
      { id: 'accreditation', label: 'Accreditation Certificate' },
      { id: 'proposal', label: 'Project Proposal Document' },
      { id: 'budget', label: 'Detailed Budget Plan' },
      { id: 'impact', label: 'Expected Impact Statement' },
    ]
  },
  {
    id: 'healthcare',
    label: 'Healthcare Initiative',
    documents: [
      { id: 'registration', label: 'Organization Registration' },
      { id: 'proposal', label: 'Healthcare Project Proposal' },
      { id: 'budget', label: 'Detailed Budget Plan' },
      { id: 'licenses', label: 'Professional Licenses (if applicable)' },
    ]
  },
  {
    id: 'ngo',
    label: 'Non-Governmental Organization',
    documents: [
      { id: 'registration', label: 'NGO Registration Certificate' },
      { id: 'proposal', label: 'Project Proposal Document' },
      { id: 'budget', label: 'Detailed Budget Plan' },
      { id: 'pastProjects', label: 'Past Projects Portfolio' },
    ]
  },
  {
    id: 'individual',
    label: 'Individual Project',
    documents: [
      { id: 'identification', label: 'Government-Issued ID' },
      { id: 'proposal', label: 'Project Proposal Document' },
      { id: 'budget', label: 'Budget Estimate' },
      { id: 'timeline', label: 'Project Timeline' },
    ]
  }
];

export default function GrantApplicationPage() {
  const router = useRouter();
  const fileInputRef = React.useRef<Record<string, HTMLInputElement | null>>({});
  
  // Form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: '',
    applicantType: '',
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    projectDescription: '',
    grantAmount: '',
    projectDuration: '',
    projectImpact: '',
    documents: {} as {[key: string]: File}
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: {name: string, size: number}}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Progress bar width calculation
  const progress = step === 1 ? 50 : 100;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileSelect = (documentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentId]: file
        }
      }));
      
      setUploadedFiles(prev => ({
        ...prev,
        [documentId]: {
          name: file.name,
          size: file.size
        }
      }));
    }
  };
  
  const handleFileButtonClick = (docType: string) => {
    if (fileInputRef.current[docType]) {
      fileInputRef.current[docType]?.click();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Step 1 validation
    if (step === 1) {
      if (!formData.projectName || !formData.applicantType || !formData.organizationName || 
          !formData.contactPerson || !formData.email || !formData.phone || 
          !formData.projectDescription || !formData.grantAmount) {
        setError('Please fill in all required fields');
        return;
      }
      
      setError('');
      setStep(2);
      return;
    }
    
    // Step 2 validation - check if required documents are uploaded
    const requiredDocuments = applicantTypes.find(type => type.id === formData.applicantType)?.documents || [];
    const missingDocuments = requiredDocuments.filter(doc => !formData.documents[doc.id]);
    
    if (missingDocuments.length > 0) {
      setError(`Please upload all required documents: ${missingDocuments.map(d => d.label).join(', ')}`);
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'documents') {
          submitData.append(key, value.toString());
        }
      });
      
      // Add documents
      Object.entries(formData.documents).forEach(([key, file]) => {
        submitData.append(key, file);
      });
      
      // Submit the form
      const response = await fetch('/api/grant-applications', {
        method: 'POST',
        body: submitData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }
      
      setSuccessMessage('Your grant application has been submitted successfully! We will contact you soon.');
      setTimeout(() => {
        router.push('/');
      }, 5000);
      
    } catch (error: any) {
      setError(error.message || 'An error occurred while submitting your application');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-[#1D942C] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] rounded-full bg-white/10 blur-3xl"
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
            className="absolute -bottom-16 -left-16 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-white/10 blur-3xl"
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

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-12 py-12 md:py-0 md:pt-14">
            {/* Text Content */}
            <motion.div 
              className="w-full md:w-1/2 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6">
                  Grant <span className="block text-[#ffc500]">Application</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-6 sm:mb-8">
                  Apply for funding for your community project or initiative. Complete the form below to submit your application.
                </p>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <a 
                  href="https://qrwse.s3.us-east-1.amazonaws.com/RSDF+-+MICROLOANS+AND+GRANTS+-+REQUIREMENTS+AND+CRITERIA+(2).pdf"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#1D942C] border-2 border-white rounded-lg shadow-lg hover:bg-opacity-90 transform hover:-translate-y-1 transition-all duration-300 text-base sm:text-lg w-full sm:w-auto text-center"
                >
                  View Requirements
                </a>
              </motion.div>
            </motion.div>

            {/* Hero Image/Stats */}
            <motion.div 
              className="w-full md:w-1/2 px-4 sm:px-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/grant/grant.jpeg"
                  alt="Grant Application"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                
                {/* Floating Stats - Updated for better mobile visibility */}
                <motion.div 
                  className="absolute top-4 right-4 bg-white rounded-xl p-3 sm:p-4 shadow-lg"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <p className="text-2xl sm:text-3xl font-bold text-[#1D942C]">5</p>
                  <p className="text-xs sm:text-sm text-gray-600">Grant Types</p>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-4 left-4 bg-white rounded-xl p-3 sm:p-4 shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Typical Review Time</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#1D942C]">7-14 Days</p>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-4 right-4 bg-white rounded-xl p-3 sm:p-4 shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-[#ffc500]">40%</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex items-center justify-center bg-white/10"
          >
            <motion.div
              animate={{ height: [6, 14, 6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {successMessage ? (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <FiCheck className="text-green-500 text-3xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">Application Submitted!</h2>
            <p className="text-center text-gray-600 mb-6">{successMessage}</p>
            <p className="text-center text-gray-500">You will be redirected to the home page shortly...</p>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <div className={`${step >= 1 ? 'text-blue-600 font-medium' : ''}`}>Step 1: Project Details</div>
                <div className={`${step >= 2 ? 'text-blue-600 font-medium' : ''}`}>Step 2: Document Upload</div>
              </div>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
              {step === 1 && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Project Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-2" htmlFor="projectName">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter project name"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-2" htmlFor="applicantType">
                        Applicant Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="applicantType"
                        name="applicantType"
                        value={formData.applicantType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Applicant Type</option>
                        {applicantTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="organizationName">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                          <BsBuilding />
                        </span>
                        <input
                          type="text"
                          id="organizationName"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Organization name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="contactPerson">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                          <BsPerson />
                        </span>
                        <input
                          type="text"
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Full name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="phone">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-2" htmlFor="address">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full address"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-2" htmlFor="projectDescription">
                        Project Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="projectDescription"
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your project and its objectives"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="grantAmount">
                        Requested Grant Amount (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="grantAmount"
                        name="grantAmount"
                        value={formData.grantAmount}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="projectDuration">
                        Project Duration (months)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">
                          <BsCalendar />
                        </span>
                        <input
                          type="number"
                          id="projectDuration"
                          name="projectDuration"
                          value={formData.projectDuration}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Number of months"
                          min="1"
                        />
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-2" htmlFor="projectImpact">
                        Expected Impact
                      </label>
                      <textarea
                        id="projectImpact"
                        name="projectImpact"
                        value={formData.projectImpact}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the expected impact of your project"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Document Upload</h2>
                  <p className="text-gray-600 mb-6">
                    Please upload the following documents based on your applicant type. All documents should be in PDF, JPG, or PNG format.
                  </p>
                  
                  <div className="space-y-6">
                    {formData.applicantType && applicantTypes.find(type => type.id === formData.applicantType)?.documents.map(doc => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{doc.label} <span className="text-red-500">*</span></h3>
                          {uploadedFiles[doc.id] ? (
                            <span className="text-green-600 flex items-center">
                              <FiCheck className="mr-1" /> Uploaded
                            </span>
                          ) : (
                            <span className="text-gray-400">Not uploaded</span>
                          )}
                        </div>
                        
                        <input
                          type="file"
                          id={`file-${doc.id}`}
                          className="hidden"
                          onChange={(e) => handleFileSelect(doc.id, e)}
                          ref={(el) => { fileInputRef.current[doc.id] = el; }}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        
                        {uploadedFiles[doc.id] ? (
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div className="flex-1 truncate">
                              <p className="font-medium truncate">{uploadedFiles[doc.id].name}</p>
                              <p className="text-xs text-gray-500">
                                {(uploadedFiles[doc.id].size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileButtonClick(doc.id)}
                              className="ml-4 p-2 text-blue-600 hover:text-blue-800"
                            >
                              <FiEdit />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleFileButtonClick(doc.id)}
                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-500 transition duration-150"
                          >
                            <FiUpload className="mr-2" />
                            Upload {doc.label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="px-6 py-4 bg-gray-50 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Back
                  </button>
                )}
                
                <div className="ml-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : step < 2 ? 'Next' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
