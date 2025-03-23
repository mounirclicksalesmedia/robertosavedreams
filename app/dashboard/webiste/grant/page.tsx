'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle, Save } from 'lucide-react';
import { TwitterPicker } from 'react-color';

// Define types for our content
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

export default function GrantsEditor() {
  const [content, setContent] = useState<GrantsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showColorPicker, setShowColorPicker] = useState<number | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Fetch content from our API
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/grants');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error loading content:', error);
        setErrorMessage('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/grants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error('Failed to save content');
      }

      setSuccessMessage('Content saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setErrorMessage('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    if (!content) return;

    const newContent = { ...content };
    
    const parts = field.split('.');
    let current: any = newContent;
    
    // Navigate to the nested property
    for (let i = 0; i < parts.length - 1; i++) {
      if (parts[i].includes('[')) {
        // Handle array access, e.g. grants[0]
        const arrPart = parts[i].split('[');
        const arrName = arrPart[0];
        const index = parseInt(arrPart[1].replace(']', ''));
        current = current[arrName][index];
      } else {
        current = current[parts[i]];
      }
    }
    
    // Set the value
    const lastPart = parts[parts.length - 1];
    if (lastPart.includes('[')) {
      const arrPart = lastPart.split('[');
      const arrName = arrPart[0];
      const index = parseInt(arrPart[1].replace(']', ''));
      current[arrName][index] = value;
    } else {
      current[lastPart] = value;
    }
    
    setContent(newContent);
  };

  // Add a new item to an array
  const handleAddItem = (section: string, arrayPath: string, newItem: any) => {
    if (!content) return;
    
    const newContent = { ...content };
    const parts = arrayPath.split('.');
    
    let current: any = newContent;
    for (const part of parts) {
      current = current[part as keyof typeof current];
    }
    
    if (Array.isArray(current)) {
      current.push(newItem);
      setContent(newContent);
    }
  };

  // Remove an item from an array
  const handleRemoveItem = (section: string, arrayPath: string, index: number) => {
    if (!content) return;
    
    const newContent = { ...content };
    const parts = arrayPath.split('.');
    
    let current: any = newContent;
    for (const part of parts) {
      current = current[part as keyof typeof current];
    }
    
    if (Array.isArray(current)) {
      current.splice(index, 1);
      setContent(newContent);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Grants Content Editor</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="p-8">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Grants Content Editor</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-red-500">Error loading content. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderEditor = () => {
    switch (activeSection) {
      case 'hero':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Hero Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.hero.title}
                onChange={(e) => handleChange('hero', 'hero.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.hero.subtitle}
                onChange={(e) => handleChange('hero', 'hero.subtitle', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.hero.description}
                onChange={(e) => handleChange('hero', 'hero.description', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'overview':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Overview Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.overview.title}
                onChange={(e) => handleChange('overview', 'overview.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.overview.description}
                onChange={(e) => handleChange('overview', 'overview.description', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'grants':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">Grant Programs</h2>
              <button
                type="button"
                className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                onClick={() => handleAddItem('grants', 'grants', {
                  id: `grant-${Date.now()}`,
                  title: 'New Grant Program',
                  amount: '$1,000 - $5,000',
                  deadline: 'December 31, 2024',
                  description: 'Description of the grant program',
                  icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
                  iconColor: '#1D942C',
                  requirements: ['Requirement 1', 'Requirement 2']
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Grant Program
              </button>
            </div>
            
            {content.grants.map((grant, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Grant Program {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('grants', 'grants', index)}
                    disabled={content.grants.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={grant.id}
                      onChange={(e) => handleChange('grants', `grants[${index}].id`, e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Unique identifier for this grant (no spaces)
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={grant.title}
                      onChange={(e) => handleChange('grants', `grants[${index}].title`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={grant.amount}
                      onChange={(e) => handleChange('grants', `grants[${index}].amount`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={grant.deadline}
                      onChange={(e) => handleChange('grants', `grants[${index}].deadline`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-md p-2"
                    value={grant.description}
                    onChange={(e) => handleChange('grants', `grants[${index}].description`, e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (SVG Path)</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 font-mono text-sm"
                      value={grant.icon}
                      onChange={(e) => handleChange('grants', `grants[${index}].icon`, e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      SVG path data for the icon. Find icons at <a href="https://heroicons.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">heroicons.com</a>
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                    <div className="relative">
                      <div 
                        className="w-full h-10 rounded-md border flex items-center px-3 cursor-pointer"
                        style={{ backgroundColor: grant.iconColor }}
                        onClick={() => setShowColorPicker(showColorPicker === index ? null : index)}
                      >
                        <span 
                          className="font-mono" 
                          style={{ 
                            color: grant.iconColor === '#ffffff' ? 'black' : 'white' 
                          }}
                        >
                          {grant.iconColor}
                        </span>
                      </div>
                      {showColorPicker === index && (
                        <div className="absolute z-10 mt-1">
                          <div className="fixed inset-0" onClick={() => setShowColorPicker(null)} />
                          <div className="relative">
                            <TwitterPicker 
                              color={grant.iconColor}
                              onChange={(color) => {
                                handleChange('grants', `grants[${index}].iconColor`, color.hex);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Requirements</label>
                    <button
                      type="button"
                      className="flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100"
                      onClick={() => {
                        const newRequirements = [...grant.requirements, 'New requirement'];
                        handleChange('grants', `grants[${index}].requirements`, newRequirements);
                      }}
                    >
                      <PlusCircle className="w-3 h-3 mr-1" />
                      Add Requirement
                    </button>
                  </div>
                  
                  {grant.requirements.map((req, reqIndex) => (
                    <div key={reqIndex} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 border rounded-md p-2"
                        value={req}
                        onChange={(e) => {
                          const newRequirements = [...grant.requirements];
                          newRequirements[reqIndex] = e.target.value;
                          handleChange('grants', `grants[${index}].requirements`, newRequirements);
                        }}
                      />
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const newRequirements = [...grant.requirements];
                          newRequirements.splice(reqIndex, 1);
                          handleChange('grants', `grants[${index}].requirements`, newRequirements);
                        }}
                        disabled={grant.requirements.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'applicationProcess':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Application Process</h2>
            
            <div className="form-group mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.applicationProcess.title}
                onChange={(e) => handleChange('applicationProcess', 'applicationProcess.title', e.target.value)}
              />
            </div>
            
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Process Steps</h3>
              <button
                type="button"
                className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                onClick={() => handleAddItem('applicationProcess', 'applicationProcess.steps', {
                  title: 'New Step',
                  description: 'Description of the step',
                  icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Step
              </button>
            </div>
            
            {content.applicationProcess.steps.map((step, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Step {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('applicationProcess', 'applicationProcess.steps', index)}
                    disabled={content.applicationProcess.steps.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={step.title}
                      onChange={(e) => handleChange('applicationProcess', `applicationProcess.steps[${index}].title`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (SVG Path)</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 font-mono text-sm"
                      value={step.icon}
                      onChange={(e) => handleChange('applicationProcess', `applicationProcess.steps[${index}].icon`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-md p-2"
                    value={step.description}
                    onChange={(e) => handleChange('applicationProcess', `applicationProcess.steps[${index}].description`, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'faqs':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">Frequently Asked Questions</h2>
              <button
                type="button"
                className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                onClick={() => handleAddItem('faqs', 'faqs', {
                  question: 'New Question',
                  answer: 'Answer to the question'
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add FAQ
              </button>
            </div>
            
            {content.faqs.map((faq, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">FAQ {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('faqs', 'faqs', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={faq.question}
                    onChange={(e) => handleChange('faqs', `faqs[${index}].question`, e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[100px]"
                    value={faq.answer}
                    onChange={(e) => handleChange('faqs', `faqs[${index}].answer`, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <p>Please select a section to edit</p>;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Grants Editor</h1>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center px-4 py-2 rounded-md ${saving ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1D942C] hover:bg-[#167623]'} text-white`}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-5 bg-gray-100">
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'hero' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('hero')}
            >
              Hero
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'overview' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'grants' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('grants')}
            >
              Grants
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'applicationProcess' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('applicationProcess')}
            >
              Process
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'faqs' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('faqs')}
            >
              FAQs
            </button>
          </div>
          
          <div className="p-6">
            {renderEditor()}
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Icons can be found at <a href="https://heroicons.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">heroicons.com</a>.
            To use an icon, copy the SVG path data (d="...") and paste it in the icon field.
          </p>
        </div>
      </div>
    </div>
  );
}
