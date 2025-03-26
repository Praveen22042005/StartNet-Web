"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { API_ROUTES } from '@/config/api';
import { toast } from 'react-toastify';

/**
 * SignUp Component
 * Handles new user registration with form validation
 */
export default function SignUp() {
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("entrepreneur");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ""
  });
  
  const router = useRouter();

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, message: "" });
      return;
    }

    // Check password strength
    let score = 0;
    let message = "";

    // Length check
    if (password.length >= 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Set message based on score
    if (score === 0) message = "Very weak password";
    else if (score === 1) message = "Weak password";
    else if (score === 2) message = "Fair password";
    else if (score === 3) message = "Good password";
    else message = "Strong password";

    setPasswordStrength({ score, message });
  }, [password]);

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is email valid
   */
  const isValidEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  /**
   * Handle form submission
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    // Clear previous errors and start loading
    setError("");
    setIsLoading(true);

    const formData = { fullName, email, password, accountType };

    try {
      const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle API error responses
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }
      
      // Store authentication data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Account created successfully!');
      
      // Parse token to get user info
      try {
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        
        // Redirect based on account type
        if (decodedToken.user.accountType === 'entrepreneur') {
          router.push('/entrepreneur/home');
        } else if (decodedToken.user.accountType === 'investor') {
          router.push('/investor/home');
        } else {
          setError('Invalid account type');
        }
      } catch (tokenError) {
        setError('Authentication error. Please try signing in.');
      }
    } catch (error) {
      // Handle network errors
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get password strength color
   * @returns {string} Tailwind color class
   */
  const getPasswordStrengthColor = (): string => {
    switch(passwordStrength.score) {
      case 0: return 'text-gray-400';
      case 1: return 'text-red-500';
      case 2: return 'text-yellow-500';
      case 3: return 'text-blue-500';
      case 4: return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2" aria-label="Go to home page">
          <Image 
            src="/logo.png" 
            alt="StartNet Logo" 
            width={40} 
            height={40}
            className="w-10 h-10"
            priority
          />
          <span className="text-2xl font-bold text-foreground dark:text-white">StartNet</span>
        </Link>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground dark:text-white">
          Create your account
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div 
                className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-md text-center" 
                role="alert"
              >
                {error}
              </div>
            )}
            
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-md border border-border dark:border-gray-700 bg-inputBg dark:bg-gray-900 px-3 py-2 text-foreground dark:text-gray-300 placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your full name"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground dark:text-gray-300">
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
                  className="block w-full rounded-md border border-border dark:border-gray-700 bg-inputBg dark:bg-gray-900 px-3 py-2 text-foreground dark:text-gray-300 placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your email"
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-border dark:border-gray-700 bg-inputBg dark:bg-gray-900 px-3 py-2 text-foreground dark:text-gray-300 placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  placeholder="Enter your password"
                  aria-required="true"
                  aria-describedby="password-strength"
                />
                {password && (
                  <p 
                    id="password-strength" 
                    className={`mt-1 text-xs ${getPasswordStrengthColor()}`}
                  >
                    {passwordStrength.message}
                  </p>
                )}
              </div>
            </div>

            {/* Account Type Field */}
            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-foreground dark:text-gray-300">
                I am an
              </label>
              <div className="mt-1">
                <select
                  id="accountType"
                  name="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="block w-full rounded-md border border-border dark:border-gray-700 bg-inputBg dark:bg-gray-900 px-3 py-2 text-foreground dark:text-gray-300 placeholder:text-secondaryText focus:border-focus focus:outline-none focus:ring-1 focus:ring-focus"
                  aria-required="true"
                >
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="investor">Investor</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                aria-busy={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6">
            <div className="text-center text-sm">
              <span className="text-secondaryText dark:text-gray-400">Already have an account? </span>
              <Link href="/auth/signin" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}