'use client';

import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {session?.user?.name}!</h2>
          <p className="text-gray-600">
            This is your personal dashboard where you can manage your applications, view your donations, and update your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-2">Your Applications</h3>
            <p className="text-gray-600 mb-4">
              Track and manage your applications for grants, loans, and programs.
            </p>
            <div className="text-primary font-medium">0 Active Applications</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-2">Your Donations</h3>
            <p className="text-gray-600 mb-4">
              View your donation history and impact.
            </p>
            <div className="text-primary font-medium">0 Donations Made</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-2">Your Profile</h3>
            <p className="text-gray-600 mb-4">
              Update your personal information and preferences.
            </p>
            <div className="text-primary font-medium">Profile Complete</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}