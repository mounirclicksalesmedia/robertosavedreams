'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

interface GalleryContent {
  title: string;
  description: string;
  categories: string[];
  images: GalleryImage[];
}

export default function GalleryContentEditor() {
  const router = useRouter();
  const [content, setContent] = useState<GalleryContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newCategory, setNewCategory] = useState('');
  const [newImage, setNewImage] = useState<Omit<GalleryImage, 'id'> & { id?: number }>({
    src: '',
    alt: '',
    category: '',
  });
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        // Add timestamp to prevent caching
        const response = await fetch(`/data/gallery-content.json?t=${new Date().getTime()}`);
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

  const handleContentChange = (field: keyof GalleryContent, value: any) => {
    if (content) {
      setContent({
        ...content,
        [field]: value
      });
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim() || !content) return;
    
    if (!content.categories.includes(newCategory)) {
      const updatedCategories = [...content.categories, newCategory];
      handleContentChange('categories', updatedCategories);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    if (!content) return;
    
    // Don't allow removing 'All' category
    if (categoryToRemove === 'All') return;
    
    const updatedCategories = content.categories.filter(
      category => category !== categoryToRemove
    );
    
    // Update images that had this category
    const updatedImages = content.images.map(image => {
      if (image.category === categoryToRemove) {
        return { ...image, category: 'All' };
      }
      return image;
    });
    
    setContent({
      ...content,
      categories: updatedCategories,
      images: updatedImages
    });
  };

  const handleNewImageChange = (field: keyof Omit<GalleryImage, 'id'>, value: string) => {
    setNewImage({
      ...newImage,
      [field]: value
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to upload image');
      }
      
      // Set the image src to the uploaded file path
      handleNewImageChange('src', result.path);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddImage = () => {
    if (!content || !newImage.src || !newImage.alt || !newImage.category) return;
    
    const nextId = Math.max(0, ...content.images.map(img => img.id)) + 1;
    
    const updatedImages = [
      ...content.images,
      {
        id: nextId,
        src: newImage.src,
        alt: newImage.alt,
        category: newImage.category
      }
    ];
    
    handleContentChange('images', updatedImages);
    
    // Reset form
    setNewImage({
      src: '',
      alt: '',
      category: '',
    });
  };

  const handleEditImage = (imageId: number) => {
    if (!content) return;
    
    const imageToEdit = content.images.find(img => img.id === imageId);
    if (!imageToEdit) return;
    
    setNewImage({
      id: imageToEdit.id,
      src: imageToEdit.src,
      alt: imageToEdit.alt,
      category: imageToEdit.category
    });
    
    setEditingImageId(imageId);
  };

  const handleUpdateImage = () => {
    if (!content || !editingImageId || !newImage.src || !newImage.alt || !newImage.category) return;
    
    const updatedImages = content.images.map(image => {
      if (image.id === editingImageId) {
        return {
          ...image,
          src: newImage.src,
          alt: newImage.alt,
          category: newImage.category
        };
      }
      return image;
    });
    
    handleContentChange('images', updatedImages);
    
    // Reset form
    setNewImage({
      src: '',
      alt: '',
      category: '',
    });
    setEditingImageId(null);
  };

  const handleDeleteImage = (imageId: number) => {
    if (!content) return;
    
    const updatedImages = content.images.filter(image => image.id !== imageId);
    handleContentChange('images', updatedImages);
  };

  const handleCancelEdit = () => {
    setNewImage({
      src: '',
      alt: '',
      category: '',
    });
    setEditingImageId(null);
  };

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/website/save-gallery-content', {
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
                  <p>Unable to load the gallery content. Please try again later.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Gallery Content</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/gallery"
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Gallery
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

        {/* Page Title and Description */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gallery Page Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="gallery-title" className="block text-sm font-medium text-gray-700">
                Page Title
              </label>
              <input
                type="text"
                id="gallery-title"
                value={content.title}
                onChange={(e) => handleContentChange('title', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="gallery-description" className="block text-sm font-medium text-gray-700">
                Page Description
              </label>
              <textarea
                id="gallery-description"
                rows={3}
                value={content.description}
                onChange={(e) => handleContentChange('description', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Categories Management */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {content.categories.map((category) => (
                <div 
                  key={category} 
                  className={`bg-gray-100 px-3 py-1.5 rounded-full flex items-center ${
                    category === 'All' ? 'bg-primary/10' : ''
                  }`}
                >
                  <span className="text-sm font-medium">{category}</span>
                  {category !== 'All' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-2 text-gray-500 hover:text-red-500"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Add
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Note: The 'All' category is reserved and cannot be removed. Images from deleted categories will be moved to 'All'.
            </div>
          </div>
        </div>

        {/* Add/Edit Image Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingImageId ? 'Edit Image' : 'Add New Image'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Upload
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  disabled={isUploading}
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                    isUploading 
                      ? 'text-gray-400 bg-gray-100' 
                      : 'text-gray-700 bg-white hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Choose File
                    </>
                  )}
                </button>
                <span className="text-sm text-gray-500">
                  {newImage.src 
                    ? newImage.src.split('/').pop() 
                    : 'No file chosen'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              {uploadError && (
                <p className="mt-1 text-sm text-red-600">{uploadError}</p>
              )}
              {newImage.src && (
                <div className="mt-2 relative h-40 w-40 rounded-md overflow-hidden border border-gray-300">
                  <Image
                    src={newImage.src}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div>
              <label htmlFor="image-src" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                id="image-src"
                value={newImage.src}
                onChange={(e) => handleNewImageChange('src', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="/images/gallery/example.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can either upload an image or provide a URL directly.
              </p>
            </div>
            <div>
              <label htmlFor="image-alt" className="block text-sm font-medium text-gray-700">
                Image Description (Alt Text)
              </label>
              <input
                type="text"
                id="image-alt"
                value={newImage.alt}
                onChange={(e) => handleNewImageChange('alt', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Describe the image"
              />
            </div>
            <div>
              <label htmlFor="image-category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="image-category"
                value={newImage.category}
                onChange={(e) => handleNewImageChange('category', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">Select a category</option>
                {content.categories.filter(category => category !== 'All').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-2 flex justify-end space-x-3">
              {editingImageId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={editingImageId ? handleUpdateImage : handleAddImage}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {editingImageId ? 'Update Image' : 'Add Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Images List */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gallery Images</h2>
          {content.images.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new image.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {content.images.map((image) => (
                <div key={image.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditImage(image.id)}
                        className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        className="bg-white p-2 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {image.category}
                    </span>
                    <p className="mt-2 text-sm font-medium text-gray-900 truncate">{image.alt}</p>
                    <p className="text-xs text-gray-500 truncate">{image.src}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
