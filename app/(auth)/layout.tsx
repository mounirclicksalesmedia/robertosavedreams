'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-[#1D942C]/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-[#ffc500] blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1D942C] blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-10 pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link href="/" className="flex items-center group">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1D942C] to-[#167623] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              R
            </div>
            <span className="ml-3 text-2xl font-caveat font-bold text-[#1D942C] group-hover:text-[#167623] transition-colors duration-300">Roberto Save Dreams</span>
          </Link>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100 backdrop-blur-sm"
        >
          {children}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          <p>© {new Date().getFullYear()} Roberto Save Dreams Foundation. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
} 