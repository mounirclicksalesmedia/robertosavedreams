'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for our content
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

export default function AboutContentEditor() {
  const [content, setContent] = useState<AboutContent | null>(null);
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
        const response = await fetch('/data/about-content.json');
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
      // Using the same API endpoint as the home page but sending different content
      const response = await fetch('/api/website/save-about-content', {
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

  const handleArrayAddItem = (field: string, template: any) => {
    if (!content) return;

    const newContent = { ...content };
    
    const parts = field.split('.');
    let current: any = newContent;
    
    // Navigate to the array
    for (let i = 0; i < parts.length; i++) {
      current = current[parts[i]];
    }
    
    // Add new item
    current.push(template);
    
    setContent(newContent);
  };

  const handleArrayRemoveItem = (field: string, index: number) => {
    if (!content) return;

    const newContent = { ...content };
    
    const parts = field.split('.');
    let current: any = newContent;
    
    // Navigate to the array
    for (let i = 0; i < parts.length; i++) {
      current = current[parts[i]];
    }
    
    // Remove item
    current.splice(index, 1);
    
    setContent(newContent);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">About Page Content Editor</h1>
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
          <h1 className="text-3xl font-bold mb-6">About Page Content Editor</h1>
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
                className="w-full border rounded-md p-2 min-h-[80px]"
                value={content.hero.description}
                onChange={(e) => handleChange('hero', 'hero.description', e.target.value)}
              />
            </div>
          </div>
        );
        
      case 'introduction':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Introduction Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.introduction.title}
                onChange={(e) => handleChange('introduction', 'introduction.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[150px]"
                value={content.introduction.description}
                onChange={(e) => handleChange('introduction', 'introduction.description', e.target.value)}
              />
            </div>
          </div>
        );
        
      case 'missionVision':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Mission & Vision Section</h2>
            
            <div className="border p-4 rounded-md mb-4">
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

      case 'founder':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Founder Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.founder.name}
                onChange={(e) => handleChange('founder', 'founder.name', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.founder.role}
                onChange={(e) => handleChange('founder', 'founder.role', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Path</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.founder.image}
                onChange={(e) => handleChange('founder', 'founder.image', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraphs</label>
              {content.founder.description.map((paragraph, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[80px]"
                    value={paragraph}
                    onChange={(e) => handleChange('founder', `founder.description[${index}]`, e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => handleArrayRemoveItem('founder.description', index)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAddItem('founder.description', '')}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Add Paragraph
              </button>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
              {content.founder.qualifications.map((qualification, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={qualification}
                    onChange={(e) => handleChange('founder', `founder.qualifications[${index}]`, e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => handleArrayRemoveItem('founder.qualifications', index)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAddItem('founder.qualifications', '')}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Add Qualification
              </button>
            </div>
          </div>
        );
        
      case 'team':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Team Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.team.title}
                onChange={(e) => handleChange('team', 'team.title', e.target.value)}
              />
            </div>
            
            <h3 className="font-medium mt-4 mb-2">Team Members</h3>
            {content.team.members.map((member, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Member {index + 1}</h4>
                  <button 
                    type="button"
                    onClick={() => handleArrayRemoveItem('team.members', index)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="form-group mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={member.name}
                    onChange={(e) => handleChange('team', `team.members[${index}].name`, e.target.value)}
                  />
                </div>
                
                <div className="form-group mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={member.role}
                    onChange={(e) => handleChange('team', `team.members[${index}].role`, e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image Path</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={member.image}
                    onChange={(e) => handleChange('team', `team.members[${index}].image`, e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAddItem('team.members', { name: '', role: '', image: '' })}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add Team Member
            </button>
          </div>
        );
        
      case 'strategicGoalsObjectives':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Strategic Goals & Objectives</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.strategicGoalsObjectives.title}
                onChange={(e) => handleChange('strategicGoalsObjectives', 'strategicGoalsObjectives.title', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Goals</label>
              {content.strategicGoalsObjectives.goals.map((goal, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={goal}
                    onChange={(e) => handleChange('strategicGoalsObjectives', `strategicGoalsObjectives.goals[${index}]`, e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => handleArrayRemoveItem('strategicGoalsObjectives.goals', index)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAddItem('strategicGoalsObjectives.goals', '')}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Add Goal
              </button>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Objectives</label>
              {content.strategicGoalsObjectives.objectives.map((objective, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={objective}
                    onChange={(e) => handleChange('strategicGoalsObjectives', `strategicGoalsObjectives.objectives[${index}]`, e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => handleArrayRemoveItem('strategicGoalsObjectives.objectives', index)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleArrayAddItem('strategicGoalsObjectives.objectives', '')}
                className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Add Objective
              </button>
            </div>
          </div>
        );
        
      case 'coreValues':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Core Values Section</h2>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                className="w-full border rounded-md p-2"
                value={content.coreValues.title}
                onChange={(e) => handleChange('coreValues', 'coreValues.title', e.target.value)}
              />
            </div>
            
            <h3 className="font-medium mt-4 mb-2">Values</h3>
            {content.coreValues.values.map((value, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Value {index + 1}</h4>
                  <button 
                    type="button"
                    onClick={() => handleArrayRemoveItem('coreValues.values', index)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="form-group mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    value={value.title}
                    onChange={(e) => handleChange('coreValues', `coreValues.values[${index}].title`, e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-md p-2 min-h-[80px]"
                    value={value.description}
                    onChange={(e) => handleChange('coreValues', `coreValues.values[${index}].description`, e.target.value)}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleArrayAddItem('coreValues.values', { title: '', description: '' })}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add Value
            </button>
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
                className="w-full border rounded-md p-2 min-h-[80px]"
                value={content.callToAction.description}
                onChange={(e) => handleChange('callToAction', 'callToAction.description', e.target.value)}
              />
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-2">Button</h3>
              
              <div className="form-group mb-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.callToAction.button.text}
                  onChange={(e) => handleChange('callToAction', 'callToAction.button.text', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  value={content.callToAction.button.url}
                  onChange={(e) => handleChange('callToAction', 'callToAction.button.url', e.target.value)}
                />
              </div>
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
          <h1 className="text-2xl sm:text-3xl font-bold">About Page Content Editor</h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={() => window.open('/about', '_blank')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View About Page
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
            <div className="w-1/4 border-r min-h-[600px] p-4">
              <h2 className="font-medium mb-4">Page Sections</h2>
              <nav className="space-y-1">
                {[
                  'hero', 
                  'introduction', 
                  'missionVision', 
                  'founder', 
                  'team', 
                  'strategicGoalsObjectives', 
                  'coreValues', 
                  'callToAction'
                ].map((section) => (
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
            
            <div className="w-3/4 p-6 overflow-y-auto max-h-[80vh]">
              {renderEditor()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
