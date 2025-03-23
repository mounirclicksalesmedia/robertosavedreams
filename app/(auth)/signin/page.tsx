'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

function SignInForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const persistLog = (message: string) => {
      console.log(message);
      // Store log in localStorage for persistence
      const logs = JSON.parse(localStorage.getItem('auth_logs') || '[]');
      logs.push({ timestamp: new Date().toISOString(), message });
      localStorage.setItem('auth_logs', JSON.stringify(logs));
    };

    persistLog(`Authentication Status: ${status}`);
    persistLog(`Session Data: ${JSON.stringify(session)}`);
    persistLog(`Callback URL: ${callbackUrl}`);

    if (status === "authenticated" && !isRedirecting) {
      persistLog("User is authenticated, attempting redirect");
      setIsRedirecting(true);
      
      try {
        persistLog(`Redirecting to: ${callbackUrl}`);
        window.location.href = callbackUrl;
      } catch (error) {
        persistLog(`Redirect error: ${error}`);
        setIsRedirecting(false);
      }
    }
  }, [status, session, callbackUrl, isRedirecting]);

  useEffect(() => {
    const errorParam = searchParams?.get('error');
    if (errorParam) {
      if (errorParam === 'CredentialsSignin') {
        setError('Invalid email or password');
      } else {
        setError('An error occurred during sign in');
      }
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    const persistLog = (message: string) => {
      console.log(message);
      const logs = JSON.parse(localStorage.getItem('auth_logs') || '[]');
      logs.push({ timestamp: new Date().toISOString(), message });
      localStorage.setItem('auth_logs', JSON.stringify(logs));
    };

    try {
      persistLog("Starting sign-in process");
      persistLog(`Attempting sign-in for email: ${data.email}`);
      
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      persistLog(`Sign-in result: ${JSON.stringify(result)}`);

      if (result?.error) {
        persistLog(`Sign-in error: ${result.error}`);
        setError(result.error);
        return;
      }

      if (result?.url) {
        persistLog(`Sign-in successful, redirecting to: ${result.url}`);
        window.location.href = result.url;
      }
    } catch (error) {
      persistLog(`Sign-in error: ${error}`);
      setError("An error occurred during sign-in");
    }
  };

  // If we're already authenticated or redirecting, show a loading state
  if (status === 'authenticated' || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1D942C] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold tracking-tight text-[#1D942C]"
        >
          Welcome Back
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-600"
        >
          Sign in to your account to continue
        </motion.p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]'} rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none sm:text-sm`}
              placeholder="you@example.com"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-[#1D942C] focus:border-[#1D942C]'} rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none sm:text-sm`}
              placeholder="••••••••"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-[#1D942C] focus:ring-[#1D942C]"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-[#1D942C] hover:text-[#167623] transition-colors duration-200"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#1D942C] to-[#167623] hover:from-[#167623] hover:to-[#0e5518] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D942C] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/signup"
            className="w-full flex justify-center py-3 px-4 border border-[#1D942C] rounded-lg shadow-sm text-sm font-medium text-[#1D942C] bg-white hover:bg-[#1D942C]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D942C] transition-all duration-200"
          >
            Create a new account
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1D942C]"></div>
    </div>}>
      <SignInForm />
    </Suspense>
  );
}