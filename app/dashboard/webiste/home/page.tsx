'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for our content
interface HomeContent {
  hero: {
    title: string;
    description: string;
    buttons: Array<{
      text: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
  missionVision: {
    title: string;
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
  };
  programs: {
    title: string;
    description: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      image: string;
    }>;
  };
  impact: {
    title: string;
    description: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  testimonials: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      role: string;
      quote: string;
      image: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    button: {
      text: string;
      url: string;
    };
  };
  loanCalculator: {
    title: string;
    description: string;
    interestRate: number;
  };
}

export default function HomeContentEditor() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    // Fetch content from our JSON file
    const fetchContent = async () => {
      try {
        const response = await fetch('/data/home-content.json');
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
      // In a real implementation, you would use an API route to write to the file
      // For this example, we'll simulate saving
      const response = await fetch('/api/website/save-home-content', {
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
      
      // Refresh the page to reflect changes
      router.refresh();
      
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
        // Handle array access, e.g. items[0]
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Home Page Content Editor</h1>
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
          <h1 className="text-3xl font-bold mb-6">Home Page Content Editor</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (HTML supported)</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.hero.title}
                onChange={(e) => handleChange('hero', 'hero.title', e.target.value)}
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
            
            {content.hero.buttons.map((button, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-medium mb-2">Button {index + 1}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={button.text}
                      onChange={(e) => handleChange('hero', `hero.buttons[${index}].text`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={button.url}
                      onChange={(e) => handleChange('hero', `hero.buttons[${index}].url`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={button.isPrimary}
                      onChange={(e) => handleChange('hero', `hero.buttons[${index}].isPrimary`, e.target.checked)}
                    />
                    <span className="ml-2 text-sm text-gray-700">Primary Button</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'missionVision':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Mission & Vision Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.missionVision.title}
                onChange={(e) => handleChange('missionVision', 'missionVision.title', e.target.value)}
              />
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">Mission</h3>
              
              <div className="form-group mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.missionVision.mission.title}
                  onChange={(e) => handleChange('missionVision', 'missionVision.mission.title', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  value={content.missionVision.mission.description}
                  onChange={(e) => handleChange('missionVision', 'missionVision.mission.description', e.target.value)}
                />
              </div>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">Vision</h3>
              
              <div className="form-group mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.missionVision.vision.title}
                  onChange={(e) => handleChange('missionVision', 'missionVision.vision.title', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border rounded-md p-2 min-h-[100px]"
                  value={content.missionVision.vision.description}
                  onChange={(e) => handleChange('missionVision', 'missionVision.vision.description', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'programs':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Programs Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.programs.title}
                onChange={(e) => handleChange('programs', 'programs.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[80px]"
                value={content.programs.description}
                onChange={(e) => handleChange('programs', 'programs.description', e.target.value)}
              />
            </div>
            
            {content.programs.items.map((program, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-medium mb-2">Program {index + 1}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={program.id}
                      onChange={(e) => handleChange('programs', `programs.items[${index}].id`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={program.title}
                      onChange={(e) => handleChange('programs', `programs.items[${index}].title`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[80px]"
                    value={program.description}
                    onChange={(e) => handleChange('programs', `programs.items[${index}].description`, e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={program.icon}
                      onChange={(e) => handleChange('programs', `programs.items[${index}].icon`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image Path</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={program.image}
                      onChange={(e) => handleChange('programs', `programs.items[${index}].image`, e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
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
                className="w-full border rounded-md p-2 min-h-[80px]"
                value={content.impact.description}
                onChange={(e) => handleChange('impact', 'impact.description', e.target.value)}
              />
            </div>
            
            <h3 className="font-medium">Impact Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {content.impact.stats.map((stat, index) => (
                <div key={index} className="border p-4 rounded-md">
                  <div className="form-group mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={stat.value}
                      onChange={(e) => handleChange('impact', `impact.stats[${index}].value`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={stat.label}
                      onChange={(e) => handleChange('impact', `impact.stats[${index}].label`, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'testimonials':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Testimonials Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.testimonials.title}
                onChange={(e) => handleChange('testimonials', 'testimonials.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[80px]"
                value={content.testimonials.description}
                onChange={(e) => handleChange('testimonials', 'testimonials.description', e.target.value)}
              />
            </div>
            
            {content.testimonials.items.map((testimonial, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="font-medium mb-2">Testimonial {index + 1}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={testimonial.name}
                      onChange={(e) => handleChange('testimonials', `testimonials.items[${index}].name`, e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={testimonial.role}
                      onChange={(e) => handleChange('testimonials', `testimonials.items[${index}].role`, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[80px]"
                    value={testimonial.quote}
                    onChange={(e) => handleChange('testimonials', `testimonials.items[${index}].quote`, e.target.value)}
                  />
                </div>
                
                <div className="form-group mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Path</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={testimonial.image}
                    onChange={(e) => handleChange('testimonials', `testimonials.items[${index}].image`, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'cta':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Call-to-Action Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.cta.title}
                onChange={(e) => handleChange('cta', 'cta.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[80px]"
                value={content.cta.description}
                onChange={(e) => handleChange('cta', 'cta.description', e.target.value)}
              />
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">Button</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={content.cta.button.text}
                    onChange={(e) => handleChange('cta', 'cta.button.text', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={content.cta.button.url}
                    onChange={(e) => handleChange('cta', 'cta.button.url', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'loanCalculator':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Loan Calculator Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.loanCalculator.title}
                onChange={(e) => handleChange('loanCalculator', 'loanCalculator.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[80px]"
                value={content.loanCalculator.description}
                onChange={(e) => handleChange('loanCalculator', 'loanCalculator.description', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded-md p-2"
                value={content.loanCalculator.interestRate}
                onChange={(e) => handleChange('loanCalculator', 'loanCalculator.interestRate', parseFloat(e.target.value))}
              />
            </div>
          </div>
        );
        
      default:
        return <div>Select a section to edit</div>;
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Home Page Content Editor</h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={() => window.open('/', '_blank')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Website
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-md text-white font-medium ${saving ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'}`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            {errorMessage}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <div className="w-1/4 border-r min-h-[500px] p-4">
              <h2 className="font-medium mb-4">Page Sections</h2>
              <nav className="space-y-1">
                {['hero', 'missionVision', 'programs', 'impact', 'testimonials', 'cta', 'loanCalculator'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      activeSection === section
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="w-3/4 p-6">
              {renderEditor()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
