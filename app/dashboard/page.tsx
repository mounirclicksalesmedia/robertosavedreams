'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Stats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
}

type Role = 'ADMIN' | 'MANAGER' | 'STAFF' | 'USER' | 'INVESTOR';
type AccessArea = 'overview' | 'loans' | 'grants' | 'investments' | 'contact' | 'website' | 'users' | 'settings';

// Role-based access mapping
const roleAccess: Record<Role, AccessArea[]> = {
  ADMIN: ['overview', 'loans', 'grants', 'investments', 'contact', 'website', 'users', 'settings'],
  MANAGER: ['overview', 'loans', 'grants', 'investments', 'contact', 'website'],
  STAFF: ['overview', 'contact', 'website'],
  USER: [],
  INVESTOR: ['overview', 'investments'],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0
  });
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) || 'USER';

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/contact/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching contact stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (hasAccess('contact')) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [userRole]);

  // Check if user has access to a specific area
  const hasAccess = (area: AccessArea) => {
    return roleAccess[userRole]?.includes(area) || false;
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {hasAccess('contact') && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Messages Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 font-medium">Total</p>
                <p className="text-2xl font-bold mt-2">
                  {loading ? (
                    <span className="inline-block w-12 h-7 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    stats.total
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col">
                <p className="text-sm text-blue-500 font-medium">Unread</p>
                <p className="text-2xl font-bold mt-2">
                  {loading ? (
                    <span className="inline-block w-12 h-7 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    stats.unread
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col">
                <p className="text-sm text-green-500 font-medium">Read</p>
                <p className="text-2xl font-bold mt-2">
                  {loading ? (
                    <span className="inline-block w-12 h-7 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    stats.read
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col">
                <p className="text-sm text-purple-500 font-medium">Replied</p>
                <p className="text-2xl font-bold mt-2">
                  {loading ? (
                    <span className="inline-block w-12 h-7 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    stats.replied
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 font-medium">Archived</p>
                <p className="text-2xl font-bold mt-2">
                  {loading ? (
                    <span className="inline-block w-12 h-7 bg-gray-200 animate-pulse rounded"></span>
                  ) : (
                    stats.archived
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasAccess('contact') && (
          <Link href="/dashboard/contact" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Manage Contact Messages</h3>
                <p className="text-gray-500">View and respond to contact form submissions</p>
              </div>
            </div>
          </Link>
        )}
        
        {hasAccess('loans') && (
          <Link href="/dashboard/loanapplications" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Loan Applications</h3>
                <p className="text-gray-500">Review and process loan applications</p>
              </div>
            </div>
          </Link>
        )}

        {hasAccess('grants') && (
          <Link href="/dashboard/grantapplications" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Grant Applications</h3>
                <p className="text-gray-500">Review and process grant applications</p>
              </div>
            </div>
          </Link>
        )}

        {hasAccess('investments') && (
          <Link href="/dashboard/investments" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-lg">Investment Applications</h3>
                <p className="text-gray-500">Review and process investment applications</p>
              </div>
            </div>
          </Link>
        )}
      </div>
      
      {hasAccess('website') && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Website Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/webiste/home" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Home Page Content</h3>
                  <p className="text-gray-500">Edit home page sections and content</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/webiste/about" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">About Page</h3>
                  <p className="text-gray-500">Edit about page content</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/webiste/programs" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Programs</h3>
                  <p className="text-gray-500">Edit programs content</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {hasAccess('users') && (
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/users" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">User Management</h3>
                  <p className="text-gray-500">Manage users and their roles</p>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/settings" className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Settings</h3>
                  <p className="text-gray-500">Configure system settings</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
