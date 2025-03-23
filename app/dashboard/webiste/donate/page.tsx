'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle, Save } from 'lucide-react';
import { TwitterPicker } from 'react-color';

// Define types for our content
interface DonateContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  stats: Array<{
    number: string;
    label: string;
    color: string;
  }>;
  levels: Array<{
    amount: number;
    label: string;
  }>;
  impact: {
    title: string;
    description: string;
    metrics: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    calculations: {
      studentCost: number;
      microloanCost: number;
      healthcareCost: number;
      communityCost: number;
    };
  };
  testimonials: Array<{
    quote: string;
    name: string;
    role: string;
    image: string;
  }>;
  frequentlyAskedQuestions: Array<{
    question: string;
    answer: string;
  }>;
}

export default function DonateEditor() {
  const [content, setContent] = useState<DonateContent | null>(null);
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
        const response = await fetch('/api/donate');
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
      const response = await fetch('/api/donate', {
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
        // Handle array access, e.g. stats[0]
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
          <h1 className="text-3xl font-bold mb-6">Donate Page Editor</h1>
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
          <h1 className="text-3xl font-bold mb-6">Donate Page Editor</h1>
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
      
      case 'stats':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">Statistics</h2>
              <button
                type="button"
                className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                onClick={() => handleAddItem('stats', 'stats', {
                  number: "0",
                  label: "New Statistic",
                  color: "from-[#1D942C]/10"
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Statistic
              </button>
            </div>
            
            {content.stats.map((stat, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Statistic {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('stats', 'stats', index)}
                    disabled={content.stats.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={stat.number}
                      onChange={(e) => handleChange('stats', `stats[${index}].number`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={stat.label}
                      onChange={(e) => handleChange('stats', `stats[${index}].label`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={stat.color}
                      onChange={(e) => handleChange('stats', `stats[${index}].color`, e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use Tailwind gradient format, e.g. from-[#1D942C]/10
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'levels':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">Donation Levels</h2>
              <button
                type="button"
                className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                onClick={() => handleAddItem('levels', 'levels', {
                  amount: 0,
                  label: "New Level"
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Level
              </button>
            </div>
            
            {content.levels.map((level, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Donation Level {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('levels', 'levels', index)}
                    disabled={content.levels.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      className="w-full border rounded-md p-2"
                      value={level.amount}
                      onChange={(e) => handleChange('levels', `levels[${index}].amount`, parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={level.label}
                      onChange={(e) => handleChange('levels', `levels[${index}].label`, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'impact':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Impact Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.impact.title}
                onChange={(e) => handleChange('impact', 'impact.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.impact.description}
                onChange={(e) => handleChange('impact', 'impact.description', e.target.value)}
              />
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Impact Metrics</h3>
                <button
                  type="button"
                  className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                  onClick={() => handleAddItem('impact', 'impact.metrics', {
                    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
                    title: "New Impact Area",
                    description: "Description of the impact"
                  })}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Impact Metric
                </button>
              </div>
              
              {content.impact.metrics.map((metric, index) => (
                <div key={index} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Impact Area {index + 1}</h4>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem('impact', 'impact.metrics', index)}
                      disabled={content.impact.metrics.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="form-group mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={metric.title}
                      onChange={(e) => handleChange('impact', `impact.metrics[${index}].title`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full border rounded-md p-2"
                      value={metric.description}
                      onChange={(e) => handleChange('impact', `impact.metrics[${index}].description`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (SVG Path)</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 font-mono text-sm"
                      value={metric.icon}
                      onChange={(e) => handleChange('impact', `impact.metrics[${index}].icon`, e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      SVG path data for the icon. Find icons at <a href="https://heroicons.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">heroicons.com</a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border p-4 rounded-md">
              <h3 className="text-lg font-medium mb-4">Impact Calculations</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Cost ($)</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={content.impact.calculations.studentCost}
                    onChange={(e) => handleChange('impact', 'impact.calculations.studentCost', parseInt(e.target.value))}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cost to educate one student
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Microloan Cost ($)</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={content.impact.calculations.microloanCost}
                    onChange={(e) => handleChange('impact', 'impact.calculations.microloanCost', parseInt(e.target.value))}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cost for one microloan
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Healthcare Cost ($)</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={content.impact.calculations.healthcareCost}
                    onChange={(e) => handleChange('impact', 'impact.calculations.healthcareCost', parseInt(e.target.value))}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cost for healthcare support
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Community Cost ($)</label>
                  <input
                    type="number"
                    className="w-full border rounded-md p-2"
                    value={content.impact.calculations.communityCost}
                    onChange={(e) => handleChange('impact', 'impact.calculations.communityCost', parseInt(e.target.value))}
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cost to impact one community
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'testimonials':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">Testimonials</h2>
              <button
                type="button"
                className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                onClick={() => handleAddItem('testimonials', 'testimonials', {
                  quote: "New testimonial quote",
                  name: "John Doe",
                  role: "Program Participant",
                  image: "/images/testimonials/default.jpg"
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Testimonial
              </button>
            </div>
            
            {content.testimonials.map((testimonial, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Testimonial {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('testimonials', 'testimonials', index)}
                    disabled={content.testimonials.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[100px]"
                    value={testimonial.quote}
                    onChange={(e) => handleChange('testimonials', `testimonials[${index}].quote`, e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={testimonial.name}
                      onChange={(e) => handleChange('testimonials', `testimonials[${index}].name`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={testimonial.role}
                      onChange={(e) => handleChange('testimonials', `testimonials[${index}].role`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Path</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={testimonial.image}
                    onChange={(e) => handleChange('testimonials', `testimonials[${index}].image`, e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Path to the testimonial image (e.g. /images/testimonials/person1.jpg)
                  </p>
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
                onClick={() => handleAddItem('faqs', 'frequentlyAskedQuestions', {
                  question: "New Question",
                  answer: "Answer to the question"
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add FAQ
              </button>
            </div>
            
            {content.frequentlyAskedQuestions.map((faq, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">FAQ {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('faqs', 'frequentlyAskedQuestions', index)}
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
                    onChange={(e) => handleChange('faqs', `frequentlyAskedQuestions[${index}].question`, e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[100px]"
                    value={faq.answer}
                    onChange={(e) => handleChange('faqs', `frequentlyAskedQuestions[${index}].answer`, e.target.value)}
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
          <h1 className="text-3xl font-bold">Donate Page Editor</h1>
          
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
          <div className="grid grid-cols-6 bg-gray-100">
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'hero' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('hero')}
            >
              Hero
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'stats' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('stats')}
            >
              Stats
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'levels' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('levels')}
            >
              Levels
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'impact' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('impact')}
            >
              Impact
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'testimonials' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('testimonials')}
            >
              Testimonials
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
