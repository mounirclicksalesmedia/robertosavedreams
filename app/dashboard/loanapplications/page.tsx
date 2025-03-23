'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the loan application type based on the form data
interface LoanApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  employmentStatus: string;
  monthlyIncome: string;
  loanPurpose: string;
  businessDescription: string;
  loanAmount: number;
  loanTerm: number;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function LoanApplicationsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch loan applications from the API
  useEffect(() => {
    fetchApplications();
  }, []);

  // Function to fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/loan-applications');
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.applications);
      } else {
        console.error('Error fetching applications:', data.message);
        // Fallback to mock data if API fails
        setApplications([
          {
            id: '1001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            address: '123 Main St',
            city: 'Lusaka',
            state: 'Lusaka Province',
            zipCode: '10101',
            dateOfBirth: '1985-05-15',
            employmentStatus: 'employed',
            monthlyIncome: '2500',
            loanPurpose: 'business',
            businessDescription: 'Small grocery store expansion',
            loanAmount: 2000,
            loanTerm: 12,
            interestRate: 4.68,
            monthlyPayment: 172.15,
            totalRepayment: 2065.80,
            status: 'pending',
            submittedAt: '2023-03-10T14:30:00Z'
          },
          {
            id: '1002',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            phone: '+2345678901',
            address: '456 Oak Ave',
            city: 'Ndola',
            state: 'Copperbelt Province',
            zipCode: '20202',
            dateOfBirth: '1990-08-22',
            employmentStatus: 'self-employed',
            monthlyIncome: '3000',
            loanPurpose: 'business',
            businessDescription: 'Tailoring shop startup',
            loanAmount: 3500,
            loanTerm: 24,
            interestRate: 4.68,
            monthlyPayment: 153.20,
            totalRepayment: 3676.80,
            status: 'approved',
            submittedAt: '2023-03-05T09:15:00Z'
          },
          {
            id: '1003',
            firstName: 'Michael',
            lastName: 'Johnson',
            email: 'michael.j@example.com',
            phone: '+3456789012',
            address: '789 Pine Rd',
            city: 'Livingstone',
            state: 'Southern Province',
            zipCode: '30303',
            dateOfBirth: '1978-12-03',
            employmentStatus: 'employed',
            monthlyIncome: '2200',
            loanPurpose: 'education',
            businessDescription: 'Funding for vocational training program',
            loanAmount: 1500,
            loanTerm: 12,
            interestRate: 4.68,
            monthlyPayment: 129.11,
            totalRepayment: 1549.32,
            status: 'rejected',
            submittedAt: '2023-03-08T16:45:00Z'
          }
        ]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Fallback to mock data if API fails
      setApplications([
        // Same mock data as above...
        {
          id: '1001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          address: '123 Main St',
          city: 'Lusaka',
          state: 'Lusaka Province',
          zipCode: '10101',
          dateOfBirth: '1985-05-15',
          employmentStatus: 'employed',
          monthlyIncome: '2500',
          loanPurpose: 'business',
          businessDescription: 'Small grocery store expansion',
          loanAmount: 2000,
          loanTerm: 12,
          interestRate: 4.68,
          monthlyPayment: 172.15,
          totalRepayment: 2065.80,
          status: 'pending',
          submittedAt: '2023-03-10T14:30:00Z'
        },
        // Rest of mock data...
      ]);
      setLoading(false);
    }
  };

  // Toggle expanded row
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Update application status
  const updateStatus = (id: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    // Optimistically update the UI
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    
    // Call the API to update the status in the database
    fetch(`/api/loan-applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          console.error('Error updating application status:', data.message);
          // Revert the optimistic update if the API call fails
          fetchApplications();
        }
      })
      .catch(error => {
        console.error('Error updating application status:', error);
        // Revert the optimistic update if the API call fails
        fetchApplications();
      });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loan Applications</h1>
        <p className="text-gray-600">Manage and review loan applications</p>
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
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <React.Fragment key={application.id}>
                      <tr className={`hover:bg-gray-50 ${expandedId === application.id ? 'bg-gray-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#1D942C] rounded-full flex items-center justify-center">
                              <span className="text-white font-medium">
                                {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.firstName} {application.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(application.loanAmount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.loanTerm} months at {application.interestRate}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${application.status === 'approved' ? 'bg-green-100 text-green-800' : 
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(application.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleExpand(application.id)}
                            className="text-[#1D942C] hover:text-[#167623] flex items-center"
                          >
                            <span>Details</span>
                            {expandedId === application.id ? (
                              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedId === application.id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td colSpan={5} className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Personal Information */}
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-sm text-gray-500">Full Name:</span>
                                      <p className="text-sm font-medium text-gray-900">{application.firstName} {application.lastName}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Email:</span>
                                      <p className="text-sm font-medium text-gray-900">{application.email}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Phone:</span>
                                      <p className="text-sm font-medium text-gray-900">{application.phone}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Address:</span>
                                      <p className="text-sm font-medium text-gray-900">
                                        {application.address}, {application.city}, {application.state} {application.zipCode}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Date of Birth:</span>
                                      <p className="text-sm font-medium text-gray-900">{application.dateOfBirth}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Employment Status:</span>
                                      <p className="text-sm font-medium text-gray-900">
                                        {application.employmentStatus.charAt(0).toUpperCase() + application.employmentStatus.slice(1)}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Monthly Income:</span>
                                      <p className="text-sm font-medium text-gray-900">{formatCurrency(Number(application.monthlyIncome))}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Loan Information */}
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-3">Loan Information</h3>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-sm text-gray-500">Loan Purpose:</span>
                                      <p className="text-sm font-medium text-gray-900">
                                        {application.loanPurpose.charAt(0).toUpperCase() + application.loanPurpose.slice(1)}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Business Description:</span>
                                      <p className="text-sm font-medium text-gray-900">{application.businessDescription}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Loan Amount:</span>
                                      <p className="text-sm font-medium text-gray-900">{formatCurrency(application.loanAmount)}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Loan Term:</span>
                                      <p className="text-sm font-medium text-gray-900">{application.loanTerm} months</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Interest Rate:</span>
                                      <p className="text-sm font-medium text-gray-900">{application.interestRate}%</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Monthly Payment:</span>
                                      <p className="text-sm font-medium text-gray-900">{formatCurrency(application.monthlyPayment)}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Total Repayment:</span>
                                      <p className="text-sm font-medium text-gray-900">{formatCurrency(application.totalRepayment)}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Actions */}
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 mb-3">Application Status</h3>
                                  <div className="space-y-4">
                                    <div>
                                      <span className="text-sm text-gray-500">Current Status:</span>
                                      <p className={`text-sm font-medium mt-1 ${
                                        application.status === 'approved' ? 'text-green-600' : 
                                        application.status === 'rejected' ? 'text-red-600' : 
                                        'text-yellow-600'
                                      }`}>
                                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                      </p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">Submitted On:</span>
                                      <p className="text-sm font-medium text-gray-900">{formatDate(application.submittedAt)}</p>
                                    </div>
                                    
                                    <div className="pt-4">
                                      <span className="text-sm text-gray-500 mb-2 block">Update Status:</span>
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={() => updateStatus(application.id, 'approved')}
                                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            application.status === 'approved'
                                              ? 'bg-green-100 text-green-800 cursor-default'
                                              : 'bg-white border border-green-600 text-green-600 hover:bg-green-50'
                                          }`}
                                          disabled={application.status === 'approved'}
                                        >
                                          <svg className="h-4 w-4 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => updateStatus(application.id, 'rejected')}
                                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            application.status === 'rejected'
                                              ? 'bg-red-100 text-red-800 cursor-default'
                                              : 'bg-white border border-red-600 text-red-600 hover:bg-red-50'
                                          }`}
                                          disabled={application.status === 'rejected'}
                                        >
                                          <svg className="h-4 w-4 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                          Reject
                                        </button>
                                        <button
                                          onClick={() => updateStatus(application.id, 'pending')}
                                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            application.status === 'pending'
                                              ? 'bg-yellow-100 text-yellow-800 cursor-default'
                                              : 'bg-white border border-yellow-600 text-yellow-600 hover:bg-yellow-50'
                                          }`}
                                          disabled={application.status === 'pending'}
                                        >
                                          Reset to Pending
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
