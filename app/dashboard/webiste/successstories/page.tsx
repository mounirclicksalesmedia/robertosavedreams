'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle, Save } from 'lucide-react';

// Define types for our content
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

export default function SuccessStoriesEditor() {
  const [content, setContent] = useState<SuccessStoriesContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    // Fetch content from our API
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/success-stories');
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
      const response = await fetch('/api/success-stories', {
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
        // Handle array access, e.g. stories[0]
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
          <h1 className="text-3xl font-bold mb-6">Success Stories Content Editor</h1>
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
          <h1 className="text-3xl font-bold mb-6">Success Stories Content Editor</h1>
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
        
      case 'featuredStory':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Featured Story</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Path</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.featuredStory.image}
                onChange={(e) => handleChange('featuredStory', 'featuredStory.image', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Path to the image, e.g. /images/success-stories/successstory.jpg
              </p>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.featuredStory.name}
                onChange={(e) => handleChange('featuredStory', 'featuredStory.name', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.featuredStory.location}
                onChange={(e) => handleChange('featuredStory', 'featuredStory.location', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Story</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[150px]"
                value={content.featuredStory.story}
                onChange={(e) => handleChange('featuredStory', 'featuredStory.story', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.featuredStory.ctaText}
                  onChange={(e) => handleChange('featuredStory', 'featuredStory.ctaText', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.featuredStory.ctaLink}
                  onChange={(e) => handleChange('featuredStory', 'featuredStory.ctaLink', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'impactNumbers':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">Impact Numbers</h2>
              <button
                type="button"
                className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                onClick={() => handleAddItem('impactNumbers', 'impactNumbers', {
                  number: '0',
                  label: 'New Statistic'
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Impact Number
              </button>
            </div>
            
            {content.impactNumbers.map((item, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Impact Number {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('impactNumbers', 'impactNumbers', index)}
                    disabled={content.impactNumbers.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={item.number}
                      onChange={(e) => handleChange('impactNumbers', `impactNumbers[${index}].number`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={item.label}
                      onChange={(e) => handleChange('impactNumbers', `impactNumbers[${index}].label`, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'stories':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-medium">Success Stories</h2>
              <button
                type="button"
                className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                onClick={() => handleAddItem('stories', 'stories', {
                  name: 'New Success Story',
                  location: 'Location',
                  category: 'Category',
                  story: 'Story description'
                })}
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Story
              </button>
            </div>
            
            {content.stories.map((story, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Story {index + 1}</h4>
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('stories', 'stories', index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={story.name}
                      onChange={(e) => handleChange('stories', `stories[${index}].name`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={story.location}
                      onChange={(e) => handleChange('stories', `stories[${index}].location`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={story.category}
                    onChange={(e) => handleChange('stories', `stories[${index}].category`, e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Story</label>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[100px]"
                    value={story.story}
                    onChange={(e) => handleChange('stories', `stories[${index}].story`, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'callToAction':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Call to Action Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.callToAction.title}
                onChange={(e) => handleChange('callToAction', 'callToAction.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.callToAction.description}
                onChange={(e) => handleChange('callToAction', 'callToAction.description', e.target.value)}
              />
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-3">Primary CTA Button</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={content.callToAction.primaryCta.text}
                    onChange={(e) => handleChange('callToAction', 'callToAction.primaryCta.text', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={content.callToAction.primaryCta.link}
                    onChange={(e) => handleChange('callToAction', 'callToAction.primaryCta.link', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-3">Secondary CTA Button</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={content.callToAction.secondaryCta.text}
                    onChange={(e) => handleChange('callToAction', 'callToAction.secondaryCta.text', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={content.callToAction.secondaryCta.link}
                    onChange={(e) => handleChange('callToAction', 'callToAction.secondaryCta.link', e.target.value)}
                  />
                </div>
              </div>
            </div>
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
          <h1 className="text-3xl font-bold">Success Stories Editor</h1>
          
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
              className={`py-3 px-4 text-center font-medium ${activeSection === 'featuredStory' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('featuredStory')}
            >
              Featured Story
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'impactNumbers' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('impactNumbers')}
            >
              Impact Numbers
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'stories' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('stories')}
            >
              Stories
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'callToAction' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('callToAction')}
            >
              Call to Action
            </button>
          </div>
          
          <div className="p-6">
            {renderEditor()}
          </div>
        </div>
      </div>
    </div>
  );
}
