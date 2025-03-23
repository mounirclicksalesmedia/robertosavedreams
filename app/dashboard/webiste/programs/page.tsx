'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Program {
  title: string;
  description: string;
  image: string;
  benefits: string[];
  eligibility: string[];
  cta: {
    text: string;
    link: string;
  };
}

interface ProgramsContent {
  title: string;
  description: string;
  programs: Program[];
}

export default function ProgramsContentEditor() {
  const router = useRouter();
  const [content, setContent] = useState<ProgramsContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function fetchContent() {
      try {
        // Add timestamp to prevent caching
        const response = await fetch(`/data/programs-content.json?t=${new Date().getTime()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContent();
  }, []);

  const handleContentChange = (field: keyof ProgramsContent, value: any) => {
    if (content) {
      setContent({
        ...content,
        [field]: value
      });
    }
  };

  const handleProgramChange = (index: number, field: keyof Program, value: any) => {
    if (content) {
      const updatedPrograms = [...content.programs];
      updatedPrograms[index] = {
        ...updatedPrograms[index],
        [field]: value
      };
      
      setContent({
        ...content,
        programs: updatedPrograms
      });
    }
  };

  const handleProgramCtaChange = (index: number, field: 'text' | 'link', value: string) => {
    if (content) {
      const updatedPrograms = [...content.programs];
      updatedPrograms[index] = {
        ...updatedPrograms[index],
        cta: {
          ...updatedPrograms[index].cta,
          [field]: value
        }
      };
      
      setContent({
        ...content,
        programs: updatedPrograms
      });
    }
  };

  const handleBenefitChange = (programIndex: number, benefitIndex: number, value: string) => {
    if (content) {
      const updatedPrograms = [...content.programs];
      const benefits = [...updatedPrograms[programIndex].benefits];
      benefits[benefitIndex] = value;
      
      updatedPrograms[programIndex] = {
        ...updatedPrograms[programIndex],
        benefits
      };
      
      setContent({
        ...content,
        programs: updatedPrograms
      });
    }
  };

  const handleEligibilityChange = (programIndex: number, eligibilityIndex: number, value: string) => {
    if (content) {
      const updatedPrograms = [...content.programs];
      const eligibility = [...updatedPrograms[programIndex].eligibility];
      eligibility[eligibilityIndex] = value;
      
      updatedPrograms[programIndex] = {
        ...updatedPrograms[programIndex],
        eligibility
      };
      
      setContent({
        ...content,
        programs: updatedPrograms
      });
    }
  };

  const addBenefit = (programIndex: number) => {
    if (content) {
      const updatedPrograms = [...content.programs];
      updatedPrograms[programIndex] = {
        ...updatedPrograms[programIndex],
        benefits: [...updatedPrograms[programIndex].benefits, '']
      };
      
      setContent({
        ...content,
        programs: updatedPrograms
      });
    }
  };

  const removeBenefit = (programIndex: number, benefitIndex: number) => {
    if (content) {
      const updatedPrograms = [...content.programs];
      const benefits = [...updatedPrograms[programIndex].benefits];
      benefits.splice(benefitIndex, 1);
      
      updatedPrograms[programIndex] = {
        ...updatedPrograms[programIndex],
        benefits
      };
      
      setContent({
        ...content,
        programs: updatedPrograms
      });
    }
  };

  const addEligibility = (programIndex: number) => {
    if (content) {
      const updatedPrograms = [...content.programs];
      updatedPrograms[programIndex] = {
        ...updatedPrograms[programIndex],
        eligibility: [...updatedPrograms[programIndex].eligibility, '']
      };
      
      setContent({
        ...content,
        programs: updatedPrograms
      });
    }
  };

  const removeEligibility = (programIndex: number, eligibilityIndex: number) => {
    if (content) {
      const updatedPrograms = [...content.programs];
      const eligibility = [...updatedPrograms[programIndex].eligibility];
      eligibility.splice(eligibilityIndex, 1);
      
      updatedPrograms[programIndex] = {
        ...updatedPrograms[programIndex],
        eligibility
      };
      
      setContent({
        ...content,
        programs: updatedPrograms
      });
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/website/save-programs-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      setSaveStatus('success');
      
      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading content</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Unable to load the programs content. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Programs Page Content</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/programs"
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Page
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSaving ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
        
        {saveStatus === 'success' && (
          <div className="mb-6 bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Changes saved successfully!</p>
              </div>
            </div>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="mb-6 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">Failed to save changes. Please try again.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Page Header</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="page-title" className="block text-sm font-medium text-gray-700">
                Page Title
              </label>
              <input
                type="text"
                id="page-title"
                value={content.title}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="page-description" className="block text-sm font-medium text-gray-700">
                Page Description
              </label>
              <textarea
                id="page-description"
                rows={3}
                value={content.description}
                onChange={(e) => handleContentChange('description', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        {content.programs.map((program, programIndex) => (
          <div key={programIndex} className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Program {programIndex + 1}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor={`program-${programIndex}-title`} className="block text-sm font-medium text-gray-700">
                  Program Title
                </label>
                <input
                  type="text"
                  id={`program-${programIndex}-title`}
                  value={program.title}
                  onChange={(e) => handleProgramChange(programIndex, 'title', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor={`program-${programIndex}-description`} className="block text-sm font-medium text-gray-700">
                  Program Description
                </label>
                <textarea
                  id={`program-${programIndex}-description`}
                  rows={3}
                  value={program.description}
                  onChange={(e) => handleProgramChange(programIndex, 'description', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor={`program-${programIndex}-image`} className="block text-sm font-medium text-gray-700">
                  Program Image URL
                </label>
                <input
                  type="text"
                  id={`program-${programIndex}-image`}
                  value={program.image}
                  onChange={(e) => handleProgramChange(programIndex, 'image', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits
                </label>
                {program.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(programIndex, benefitIndex, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeBenefit(programIndex, benefitIndex)}
                      className="ml-2 inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addBenefit(programIndex)}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Benefit
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Criteria
                </label>
                {program.eligibility.map((criterion, eligibilityIndex) => (
                  <div key={eligibilityIndex} className="flex mb-2">
                    <input
                      type="text"
                      value={criterion}
                      onChange={(e) => handleEligibilityChange(programIndex, eligibilityIndex, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeEligibility(programIndex, eligibilityIndex)}
                      className="ml-2 inline-flex items-center p-1.5 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addEligibility(programIndex)}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Eligibility Criterion
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Call to Action</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`program-${programIndex}-cta-text`} className="block text-sm font-medium text-gray-700">
                      Button Text
                    </label>
                    <input
                      type="text"
                      id={`program-${programIndex}-cta-text`}
                      value={program.cta.text}
                      onChange={(e) => handleProgramCtaChange(programIndex, 'text', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`program-${programIndex}-cta-link`} className="block text-sm font-medium text-gray-700">
                      Button Link
                    </label>
                    <input
                      type="text"
                      id={`program-${programIndex}-cta-link`}
                      value={program.cta.link}
                      onChange={(e) => handleProgramCtaChange(programIndex, 'link', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSaving ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
