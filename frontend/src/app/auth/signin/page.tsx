/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/api';
import { 
  FaRocket, 
  FaChartLine, 
  FaMoneyBillWave,
  FaLightbulb,
  FaBriefcase,
  FaHandshake,
  FaPiggyBank,
  FaChartBar,
  FaCoffee,
  FaLaptopCode,
  FaBusinessTime,
  FaSeedling
} from 'react-icons/fa';

/**
 * SignIn Page Component
 * Handles user authentication and login flow
 */
export default function SignIn() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Send login request to API
      const response = await fetch(API_ROUTES.AUTH.SIGNIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Decode JWT token to get user info
        const decodedToken = parseJwt(data.token);
        
        // Redirect based on account type
        if (decodedToken?.user?.accountType === 'entrepreneur') {
          router.push('/entrepreneur/home');
        } else if (decodedToken?.user?.accountType === 'investor') {
          router.push('/investor/home');
        } else {
          setError('Invalid account type');
        }
      } else {
        // Handle API error responses
        setError(data.message || 'Sign-in failed. Please check your credentials.');
      }
    } catch (error) {
      // Handle network/unexpected errors
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Parse JWT token
   * @param {string} token - JWT token
   * @returns {object|null} Decoded token payload or null
   */
  const parseJwt = (token: string): any => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  /**
   * Dynamic background with startup-themed icons
   */
  const DoodleBackground = useCallback(() => {
    // Create random doodle data only on client-side
    const [doodleData, setDoodleData] = useState<Array<{
      rotate: number;
      duration: number;
      iconIndex: number;
    }>>([]);

    useEffect(() => {
      // Initialize doodle data only once
      setDoodleData(Array(30).fill(null).map(() => ({
        rotate: Math.random() * 360,
        duration: Math.random() * 10 + 20, 
        iconIndex: Math.floor(Math.random() * 12),
      })));
    }, []);

    const icons = [
      <FaRocket key="rocket" className="w-8 h-8 md:w-12 md:h-12 transform rotate-45" aria-hidden="true" />,
      <FaChartLine key="chart" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaMoneyBillWave key="money" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaLightbulb key="idea" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaBriefcase key="business" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaHandshake key="partnership" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaPiggyBank key="savings" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaChartBar key="stats" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaCoffee key="coffee" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaLaptopCode key="tech" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaBusinessTime key="time" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />,
      <FaSeedling key="growth" className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />
    ];

    return (
      <div className="fixed inset-0 z-0 opacity-[0.03]" aria-hidden="true">
        <div className="absolute inset-0 flex flex-wrap gap-10 md:gap-20 p-4 md:p-8">
          {doodleData.map((data, i) => (
            <div
              key={i}
              className="transform animate-float"
              style={{
                transform: `rotate(${data.rotate}deg)`,
                animationDuration: `${data.duration}s`,
              }}
            >
              {icons[data.iconIndex]}
            </div>
          ))}
        </div>
      </div>
    );
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <DoodleBackground />
      
      {/* Logo and Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2" aria-label="Go to home page">
          <Image 
            src="/logo.png" 
            alt="StartNet Logo" 
            width={40} 
            height={40}
            className="w-10 h-10"
            priority
          />
          <span className="text-2xl font-bold text-foreground">StartNet</span>
        </Link>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
      </div>

      {/* Sign In Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div 
                className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-md text-center" 
                role="alert"
              >
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground dark:text-gray-200">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-border dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2 text-foreground dark:text-gray-200 placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your email"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground dark:text-gray-200">
                  Password
                </label>
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-foreground hover:text-opacity-80 dark:text-gray-300 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-border dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2 text-foreground dark:text-gray-200 placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your password"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center rounded-md bg-foreground dark:bg-indigo-600 px-4 py-2 text-sm font-semibold text-background dark:text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
                aria-busy={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6">
            <div className="text-center text-sm">
              <span className="text-secondaryText dark:text-gray-400">Don&apos;t have an account? </span>
              <Link href="/auth/signup" className="font-medium text-foreground dark:text-indigo-400 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}