'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, PlusCircle, Save } from 'lucide-react';

// Define types for our content
interface GetInvolvedContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  sections: Array<{
    id: string;
    title: string;
    description: string;
    secondaryDescription?: string;
    cards: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    benefits?: string[];
    requirements?: string[];
    donations?: Array<{
      amount: string;
      description: string;
    }>;
    ctaText: string;
    ctaLink: string;
  }>;
}

export default function GetInvolvedEditor() {
  const [content, setContent] = useState<GetInvolvedContent | null>(null);
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
        const response = await fetch('/api/get-involved');
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
      const response = await fetch('/api/get-involved', {
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
        // Handle array access, e.g. sections[0]
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
          <h1 className="text-3xl font-bold mb-6">Get Involved Page Content Editor</h1>
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
          <h1 className="text-3xl font-bold mb-6">Get Involved Page Content Editor</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-red-500">Error loading content. Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  const partnerId = content.sections.findIndex(s => s.id === 'partner');
  const ambassadorId = content.sections.findIndex(s => s.id === 'ambassador');
  const fundraisingId = content.sections.findIndex(s => s.id === 'fundraising');

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
        
      case 'partner':
        if (partnerId === -1) return <p>Partner section not found</p>;
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Partner Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.sections[partnerId].title}
                onChange={(e) => handleChange('partner', `sections[${partnerId}].title`, e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.sections[partnerId].description}
                onChange={(e) => handleChange('partner', `sections[${partnerId}].description`, e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.sections[partnerId].secondaryDescription || ''}
                onChange={(e) => handleChange('partner', `sections[${partnerId}].secondaryDescription`, e.target.value)}
              />
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Partner Cards</h3>
                <button
                  type="button"
                  className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                  onClick={() => handleAddItem('partner', `sections.${partnerId}.cards`, {
                    title: 'New Card',
                    description: 'Enter description here',
                    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' // Plus icon path
                  })}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Card
                </button>
              </div>
              
              {content.sections[partnerId].cards.map((card, cardIndex) => (
                <div key={cardIndex} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Card {cardIndex + 1}</h4>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem('partner', `sections.${partnerId}.cards`, cardIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        value={card.title}
                        onChange={(e) => handleChange('partner', `sections[${partnerId}].cards[${cardIndex}].title`, e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="w-full border rounded-md p-2"
                        value={card.description}
                        onChange={(e) => handleChange('partner', `sections[${partnerId}].cards[${cardIndex}].description`, e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon (SVG Path)</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2 font-mono text-sm"
                        value={card.icon}
                        onChange={(e) => handleChange('partner', `sections[${partnerId}].cards[${cardIndex}].icon`, e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        SVG path data (d="...") for the icon. Find icons at <a href="https://heroicons.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">heroicons.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Benefits List</h3>
                <button
                  type="button"
                  className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                  onClick={() => handleAddItem('partner', `sections.${partnerId}.benefits`, 'New benefit item')}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Benefit
                </button>
              </div>
              
              {content.sections[partnerId].benefits?.map((benefit, benefitIndex) => (
                <div key={benefitIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-md p-2"
                    value={benefit}
                    onChange={(e) => handleChange('partner', `sections[${partnerId}].benefits[${benefitIndex}]`, e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('partner', `sections.${partnerId}.benefits`, benefitIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.sections[partnerId].ctaText}
                  onChange={(e) => handleChange('partner', `sections[${partnerId}].ctaText`, e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Link</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.sections[partnerId].ctaLink}
                  onChange={(e) => handleChange('partner', `sections[${partnerId}].ctaLink`, e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'ambassador':
        if (ambassadorId === -1) return <p>Ambassador section not found</p>;
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Ambassador Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.sections[ambassadorId].title}
                onChange={(e) => handleChange('ambassador', `sections[${ambassadorId}].title`, e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.sections[ambassadorId].description}
                onChange={(e) => handleChange('ambassador', `sections[${ambassadorId}].description`, e.target.value)}
              />
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Ambassador Cards</h3>
                <button
                  type="button"
                  className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                  onClick={() => handleAddItem('ambassador', `sections.${ambassadorId}.cards`, {
                    title: 'New Card',
                    description: 'Enter description here',
                    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' // Plus icon path
                  })}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Card
                </button>
              </div>
              
              {content.sections[ambassadorId].cards.map((card, cardIndex) => (
                <div key={cardIndex} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Card {cardIndex + 1}</h4>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem('ambassador', `sections.${ambassadorId}.cards`, cardIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        value={card.title}
                        onChange={(e) => handleChange('ambassador', `sections[${ambassadorId}].cards[${cardIndex}].title`, e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="w-full border rounded-md p-2"
                        value={card.description}
                        onChange={(e) => handleChange('ambassador', `sections[${ambassadorId}].cards[${cardIndex}].description`, e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon (SVG Path)</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2 font-mono text-sm"
                        value={card.icon}
                        onChange={(e) => handleChange('ambassador', `sections[${ambassadorId}].cards[${cardIndex}].icon`, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Requirements List</h3>
                <button
                  type="button"
                  className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                  onClick={() => handleAddItem('ambassador', `sections.${ambassadorId}.requirements`, 'New requirement')}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Requirement
                </button>
              </div>
              
              {content.sections[ambassadorId].requirements?.map((requirement, reqIndex) => (
                <div key={reqIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 border rounded-md p-2"
                    value={requirement}
                    onChange={(e) => handleChange('ambassador', `sections[${ambassadorId}].requirements[${reqIndex}]`, e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem('ambassador', `sections.${ambassadorId}.requirements`, reqIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.sections[ambassadorId].ctaText}
                  onChange={(e) => handleChange('ambassador', `sections[${ambassadorId}].ctaText`, e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Link</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.sections[ambassadorId].ctaLink}
                  onChange={(e) => handleChange('ambassador', `sections[${ambassadorId}].ctaLink`, e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'fundraising':
        if (fundraisingId === -1) return <p>Fundraising section not found</p>;
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Fundraising Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.sections[fundraisingId].title}
                onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].title`, e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={content.sections[fundraisingId].description}
                onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].description`, e.target.value)}
              />
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Fundraising Cards</h3>
                <button
                  type="button"
                  className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                  onClick={() => handleAddItem('fundraising', `sections.${fundraisingId}.cards`, {
                    title: 'New Card',
                    description: 'Enter description here',
                    icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6' // Plus icon path
                  })}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Card
                </button>
              </div>
              
              {content.sections[fundraisingId].cards.map((card, cardIndex) => (
                <div key={cardIndex} className="border p-4 rounded-md mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Card {cardIndex + 1}</h4>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem('fundraising', `sections.${fundraisingId}.cards`, cardIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2"
                        value={card.title}
                        onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].cards[${cardIndex}].title`, e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        className="w-full border rounded-md p-2"
                        value={card.description}
                        onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].cards[${cardIndex}].description`, e.target.value)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon (SVG Path)</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2 font-mono text-sm"
                        value={card.icon}
                        onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].cards[${cardIndex}].icon`, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Donation Items</h3>
                <button
                  type="button"
                  className="flex items-center text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100"
                  onClick={() => handleAddItem('fundraising', `sections.${fundraisingId}.donations`, {
                    amount: '$100',
                    description: 'New donation description'
                  })}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Donation Item
                </button>
              </div>
              
              {content.sections[fundraisingId].donations?.map((donation, donationIndex) => (
                <div key={donationIndex} className="grid grid-cols-4 gap-2 mb-2 items-center">
                  <div className="col-span-1">
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={donation.amount}
                      onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].donations[${donationIndex}].amount`, e.target.value)}
                      placeholder="Amount"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      className="w-full border rounded-md p-2"
                      value={donation.description}
                      onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].donations[${donationIndex}].description`, e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem('fundraising', `sections.${fundraisingId}.donations`, donationIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.sections[fundraisingId].ctaText}
                  onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].ctaText`, e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Link</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.sections[fundraisingId].ctaLink}
                  onChange={(e) => handleChange('fundraising', `sections[${fundraisingId}].ctaLink`, e.target.value)}
                />
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
          <h1 className="text-3xl font-bold">Get Involved Page Editor</h1>
          
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
          <div className="grid grid-cols-4 bg-gray-100">
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'hero' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('hero')}
            >
              Hero
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'partner' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('partner')}
            >
              Partner
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'ambassador' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('ambassador')}
            >
              Ambassador
            </button>
            <button
              type="button"
              className={`py-3 px-4 text-center font-medium ${activeSection === 'fundraising' ? 'bg-white text-[#1D942C]' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setActiveSection('fundraising')}
            >
              Fundraising
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
