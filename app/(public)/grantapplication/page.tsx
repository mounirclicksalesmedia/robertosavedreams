'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiCheck, FiEdit } from 'react-icons/fi';
import { BsBuilding, BsPerson, BsCalendar } from 'react-icons/bs';
import PageHeader from '@/app/components/PageHeader';

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
      <PageHeader
        title="Grant Application"
        description="Apply for funding for your community project or initiative."
        image="/images/hero-bg.jpg"
      />
      
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
