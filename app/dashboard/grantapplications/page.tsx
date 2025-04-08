'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the grant application type based on the form data
interface GrantApplication {
  id: string;
  projectName: string;
  applicantType: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  projectDescription: string;
  grantAmount: string;
  projectDuration: string;
  projectImpact: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  documents: {
    [key: string]: string;
  };
}

export default function GrantApplicationsPage() {
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<GrantApplication | null>(null);

  // Fetch grant applications from the API
  useEffect(() => {
    fetchApplications();
  }, []);

  // Function to fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/grant-applications');
      const data = await response.json();
      
      if (response.ok) {
        setApplications(Array.isArray(data) ? data : []);
      } else {
        console.error('Error fetching applications:', data?.message || 'Unknown error');
        // Fallback to empty array if API fails
        setApplications([]);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter applications based on search term and status
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Toggle expanded row
  const toggleExpand = (id: string) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Update application status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/grant-applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        // Update local state after successful API call
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.id === id ? { ...app, status: newStatus, updatedAt: new Date().toISOString() } : app
          )
        );
      } else {
        const error = await response.json();
        console.error('Error updating application status:', error?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to update application status:', error);
      // Revert the UI change if the API call fails
      fetchApplications();
    }
  };

  // Handle view application
  const handleViewApplication = (application: GrantApplication) => {
    setSelectedApplication(application);
  };

  // Handle update status
  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateStatus(id, newStatus);
    setSelectedApplication(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Grant Applications</h1>
        <p className="text-gray-600">Manage and review grant applications</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1D942C] focus:border-[#1D942C]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#1D942C] focus:border-[#1D942C]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="text-gray-600">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1D942C]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grant Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.projectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.organizationName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.contactPerson}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(application.grantAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            application.status.toLowerCase() === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : application.status.toLowerCase() === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {application.applicantType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.documents && Object.keys(application.documents).length > 0 ? (
                          <div className="flex space-x-1">
                            {Object.entries(application.documents).map(([key, url], index) => {
                              if (!url) return null;
                              
                              let icon = '📄';
                              let color = 'text-blue-600';
                              let title = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                              
                              if (key === 'proposal') {
                                icon = '📋';
                                color = 'text-green-600';
                              } else if (key === 'identification') {
                                icon = '🪪';
                                color = 'text-purple-600';
                              } else if (key === 'budget') {
                                icon = '📊';
                                color = 'text-yellow-600';
                              }
                              
                              return (
                                <a 
                                  key={key}
                                  href={url.toString()} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 ${color}`}
                                  title={title}
                                >
                                  <span>{icon}</span>
                                </a>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-gray-400">No documents</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewApplication(application)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(application.id, 'approved')}
                            className={`text-green-600 hover:text-green-900 ${application.status.toLowerCase() === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={application.status.toLowerCase() === 'approved'}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(application.id, 'rejected')}
                            className={`text-red-600 hover:text-red-900 ${application.status.toLowerCase() === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={application.status.toLowerCase() === 'rejected'}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">
                  Grant Application Details
                </h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Organization Name</span>
                      <p className="mt-1">{selectedApplication.organizationName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contact Person</span>
                      <p className="mt-1">{selectedApplication.contactPerson}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email</span>
                      <p className="mt-1">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone</span>
                      <p className="mt-1">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Address</span>
                      <p className="mt-1">{selectedApplication.address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Applicant Type</span>
                      <p className="mt-1">
                        <span className="px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {selectedApplication.applicantType}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Project Name</span>
                      <p className="mt-1">{selectedApplication.projectName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Project Description</span>
                      <p className="mt-1">{selectedApplication.projectDescription}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Grant Amount</span>
                      <p className="mt-1">{formatCurrency(selectedApplication.grantAmount)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Project Duration</span>
                      <p className="mt-1">{selectedApplication.projectDuration}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Expected Impact</span>
                      <p className="mt-1">{selectedApplication.projectImpact}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status</span>
                      <p className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedApplication.status.toLowerCase() === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : selectedApplication.status.toLowerCase() === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {selectedApplication.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Documents Section */}
              {selectedApplication.documents && Object.values(selectedApplication.documents).some(doc => doc) && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(selectedApplication.documents).map(([key, url]) => {
                      if (!url) return null;
                      
                      let title = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
                      let fileType = url.toString().split('.').pop()?.toUpperCase() || 'FILE';
                      
                      return (
                        <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{title}</h4>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                              {fileType}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <a 
                              href={url.toString()} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Download
                            </a>
                            <a 
                              href={url.toString()} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplication.id, 'approved')}
                  className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 ${
                    selectedApplication.status.toLowerCase() === 'approved' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={selectedApplication.status.toLowerCase() === 'approved'}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                  className={`px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ${
                    selectedApplication.status.toLowerCase() === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={selectedApplication.status.toLowerCase() === 'rejected'}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 