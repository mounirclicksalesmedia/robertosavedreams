'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0
  });
  const [loading, setLoading] = useState(true);

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

    fetchStats();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      
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
        </div>
      </div>
    </div>
  );
}
