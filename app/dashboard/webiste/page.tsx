'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function WebsiteDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Website Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Home Page */}
        <Link 
          href="/dashboard/webiste/home"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D942C]/10 to-[#ffc500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-[#1D942C]/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1D942C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 group-hover:text-[#1D942C] transition-colors duration-300">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mt-4">Home Page</h3>
            <p className="text-gray-600 mt-2">Edit your home page content</p>
          </div>
        </Link>

        {/* About Page */}
        <Link 
          href="/dashboard/webiste/about"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D942C]/10 to-[#ffc500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-[#1D942C]/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1D942C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 group-hover:text-[#1D942C] transition-colors duration-300">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mt-4">About Page</h3>
            <p className="text-gray-600 mt-2">Edit your about page content</p>
          </div>
        </Link>

        {/* Programs Page */}
        <Link 
          href="/dashboard/webiste/programs"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D942C]/10 to-[#ffc500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-[#1D942C]/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1D942C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 group-hover:text-[#1D942C] transition-colors duration-300">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mt-4">Programs Page</h3>
            <p className="text-gray-600 mt-2">Edit your programs page content</p>
          </div>
        </Link>

        {/* Gallery Page */}
        <Link 
          href="/dashboard/webiste/gallery"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D942C]/10 to-[#ffc500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-[#1D942C]/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1D942C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 group-hover:text-[#1D942C] transition-colors duration-300">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mt-4">Gallery Page</h3>
            <p className="text-gray-600 mt-2">Manage your gallery images and categories</p>
          </div>
        </Link>

        {/* Get Involved Page */}
        <Link 
          href="/dashboard/webiste/get-involved"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D942C]/10 to-[#ffc500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-[#1D942C]/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1D942C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 group-hover:text-[#1D942C] transition-colors duration-300">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mt-4">Get Involved Page</h3>
            <p className="text-gray-600 mt-2">Edit your get involved page content</p>
          </div>
        </Link>

        {/* Success Stories Page */}
        <Link 
          href="/dashboard/webiste/successstories"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D942C]/10 to-[#ffc500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-[#1D942C]/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1D942C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 group-hover:text-[#1D942C] transition-colors duration-300">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mt-4">Success Stories</h3>
            <p className="text-gray-600 mt-2">Edit success stories content</p>
          </div>
        </Link>
        
        {/* Grants Page */}
        <Link 
          href="/dashboard/webiste/grant"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D942C]/10 to-[#ffc500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-[#1D942C]/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1D942C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 group-hover:text-[#1D942C] transition-colors duration-300">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mt-4">Grants</h3>
            <p className="text-gray-600 mt-2">Edit grants page content</p>
          </div>
        </Link>
        
        {/* Donate Page */}
        <Link 
          href="/dashboard/webiste/donate"
          className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D942C]/10 to-[#ffc500]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-[#1D942C]/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1D942C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400 group-hover:text-[#1D942C] transition-colors duration-300">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mt-4">Donate</h3>
            <p className="text-gray-600 mt-2">Edit donate page content</p>
          </div>
        </Link>

      </div>
    </div>
  );
} 