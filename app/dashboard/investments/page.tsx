'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiDollarSign, FiUser, FiCalendar, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

interface InvestmentApplication {
  id: string;
  name: string;
  email: string;
  organization: string;
  phone: string;
  investmentAmount: number;
  investmentType: string;
  message: string;
  status: string;
  submittedAt: string;
  metadata: {
    highlights: string[];
    metrics: {
      projectsSupported: string;
      averageReturn: string;
      impactReach: string;
    };
  };
}

export default function InvestmentApplicationsPage() {
  const [applications, setApplications] = useState<InvestmentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<InvestmentApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/investment-applications');
      const data = await response.json();
      
      if (data.success) {
        setApplications(data.applications);
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <FiXCircle className="w-5 h-5" />;
      case 'pending':
      default:
        return <FiClock className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
      >
        Investment Applications
      </motion.h1>

      <div className="grid grid-cols-1 gap-6">
        {applications.map((application) => (
          <motion.div
            key={application.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{application.name}</h3>
                  <p className="text-gray-600">{application.organization}</p>
                </div>
              </div>

              <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                <span className="capitalize">{application.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <FiDollarSign className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Investment Amount: ${application.investmentAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Submitted: {format(new Date(application.submittedAt), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  Type: {application.investmentType}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-2">Investment Details</h4>
              <p className="text-gray-600">{application.message}</p>
              
              {application.metadata && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium text-sm text-gray-500">Projects Supported</h5>
                      <p>{application.metadata.metrics.projectsSupported}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-500">Average Return</h5>
                      <p>{application.metadata.metrics.averageReturn}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm text-gray-500">Impact Reach</h5>
                      <p>{application.metadata.metrics.impactReach}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 