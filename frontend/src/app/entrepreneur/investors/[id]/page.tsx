"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeftIcon, 
  GlobeIcon, 
  EnvelopeClosedIcon, 
  LinkedInLogoIcon,
  PieChartIcon,
  BarChartIcon,
  LightningBoltIcon,
  RocketIcon,
  CheckCircledIcon
} from '@radix-ui/react-icons';
import { toast } from 'react-hot-toast';
import { API_ROUTES } from '@/config/api';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

/**
 * Investor interface
 */
interface Investor {
  _id: string;
  fullName: string;
  location: string;
  profilePicture: string;
  bio: string;
  portfolioSize: string;
  investmentRange: {
    min: number;
    max: number;
  };
  skills: Array<{ name: string }>;
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  phone: string;
  email: string;
  investmentPreferences: string[];
}

/**
 * ApiError interface
 */
interface ApiError {
  message: string;
}

/**
 * InvestorDetailsPage Component
 * Displays detailed information about a specific investor
 */
const InvestorDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * Fetch investor details from API
   */
  const fetchInvestorDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token missing. Please sign in again.');
      }

      const response = await fetch(API_ROUTES.INVESTOR_PROFILE.GET_BY_ID(id as string), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch investor details');
      }

      const data = await response.json();
      setInvestor(data);
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to fetch investor details');
      toast.error(apiError.message || 'Failed to fetch investor details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Fetch investor details on component mount
   */
  useEffect(() => {
    if (id) {
      fetchInvestorDetails();
    }
  }, [id, fetchInvestorDetails]);

  /**
   * Handle back button click
   */
  const handleBackClick = () => {
    router.push('/entrepreneur/investors');
  };

  /**
   * Handle connect button click
   */
  const handleConnectClick = () => {
    setShowContactForm(!showContactForm);
  };

  /**
   * Handle message form submission
   */
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent to investor!');
    setMessage('');
    setShowContactForm(false);
  };

  /**
   * Get social media icon based on platform
   * @param {string} platform - Social media platform name
   * @returns {JSX.Element} Social media icon component
   */
  const getSocialMediaIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <LinkedInLogoIcon className="w-5 h-5" aria-hidden="true" />;
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
          </svg>
        );
      default:
        return <GlobeIcon className="w-5 h-5" aria-hidden="true" />;
    }
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <EntrepreneurSidebar>
        <div className="flex items-center justify-center min-h-screen" aria-label="Loading investor details">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" role="status" />
          <span className="sr-only">Loading investor details...</span>
        </div>
      </EntrepreneurSidebar>
    );
  }

  /**
   * Render error state
   */
  if (error || !investor) {
    return (
      <EntrepreneurSidebar>
        <div className="container mx-auto p-4 md:p-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Button
                  onClick={handleBackClick}
                  variant="outline"
                  className="flex items-center space-x-2 bg-white hover:bg-gray-100"
                >
                  <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Back to Investors</span>
                </Button>
              </div>
              
              <div className="text-center p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {error || 'Investor not found'}
                </h3>
                <p className="text-gray-600">
                  {error ? 'Please try again later.' : 'The requested investor profile could not be found.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </EntrepreneurSidebar>
    );
  }

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8">
        {/* Navigation and Header */}
        <div className="mb-6">
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="flex items-center space-x-2 bg-white hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            <span>Back to Investors</span>
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden border-0 shadow-xl">
          <div className="relative h-48 bg-gradient-to-r from-gray-900 to-gray-800">
            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-black/50" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20" aria-hidden="true" />
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-500 opacity-10 rounded-full" aria-hidden="true" />
                <div className="absolute top-20 left-20 w-20 h-20 bg-gray-400 opacity-10 rounded-full" aria-hidden="true" />
                <div className="absolute bottom-5 right-1/4 w-16 h-16 bg-gray-600 opacity-10 rounded-full" aria-hidden="true" />
              </div>
            </div>
            
            {/* Content */}
            <div className="relative h-full px-8 flex items-end pb-6">
              <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                {/* Profile Image */}
                <div className="md:mr-6 -mb-16 flex justify-center md:justify-start">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white">
                    <Image
                      src={investor.profilePicture || '/default-profile.png'}
                      alt={investor.fullName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                
                {/* Basic Info */}
                <div className="flex-1 text-white pb-2">
                  <h1 className="text-3xl font-bold">{investor.fullName}</h1>
                  {investor.location && (
                    <p className="mt-1 flex items-center text-gray-200">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {investor.location}
                    </p>
                  )}
                </div>
                
                {/* Investment Stats */}
                <div className="hidden md:block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-300 uppercase tracking-wider">Investment Range</p>
                      <p className="mt-1 text-white font-bold">
                        ${investor.investmentRange.min.toLocaleString()} - ${investor.investmentRange.max.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center pl-6 border-l border-white/20">
                      <p className="text-xs text-gray-300 uppercase tracking-wider">Portfolio Size</p>
                      <p className="mt-1 text-white font-bold">{investor.portfolioSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Investment Stats */}
          <div className="md:hidden px-8 pt-20 pb-6">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Investment Range</p>
                  <p className="mt-1 text-gray-900 font-bold">
                    ${investor.investmentRange.min.toLocaleString()} - ${investor.investmentRange.max.toLocaleString()}
                  </p>
                </div>
                <div className="text-center border-l border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Portfolio Size</p>
                  <p className="mt-1 text-gray-900 font-bold">{investor.portfolioSize}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skills/Areas */}
          <div className="px-8 pb-6">
            <p className="text-sm text-gray-600 mb-2">Areas of Expertise</p>
            <div className="flex flex-wrap gap-2">
              {investor.skills.map((skill, index) => (
                <Badge 
                  key={index} 
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="shadow-md border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-indigo-100">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">About</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{investor.bio}</p>
              </CardContent>
            </Card>

            {/* Investment Preferences */}
            {investor.investmentPreferences && investor.investmentPreferences.length > 0 && (
              <Card className="shadow-md border border-gray-200">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-green-100">
                      <BarChartIcon className="w-5 h-5 text-green-600" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Investment Focus</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {investor.investmentPreferences.map((preference, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="p-1.5 bg-green-50 rounded-full">
                          <CheckCircledIcon className="w-4 h-4 text-green-600" aria-hidden="true" />
                        </div>
                        <span className="text-gray-800">{preference}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why This Investor */}
            <Card className="shadow-md border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-amber-100">
                    <LightningBoltIcon className="w-5 h-5 text-amber-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Why Partner With This Investor</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h3 className="text-amber-800 font-medium mb-2 flex items-center">
                      <RocketIcon className="mr-2 h-5 w-5" aria-hidden="true" /> Experience
                    </h3>
                    <p className="text-gray-700">Access to a robust network of industry connections and strategic advisors.</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="text-indigo-800 font-medium mb-2 flex items-center">
                      <PieChartIcon className="mr-2 h-5 w-5" aria-hidden="true" /> Track Record
                    </h3>
                    <p className="text-gray-700">Portfolio size of {investor.portfolioSize} with successful exits and growth stories.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Form (Conditionally shown) */}
            {showContactForm && (
              <Card className="shadow-md border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-blue-100">
                        <EnvelopeClosedIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">Send a Message</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowContactForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                  <CardDescription className="text-gray-600 mt-1">
                    Your message will be sent directly to {investor.fullName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmitMessage} noValidate>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                        <textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={5}
                          className="w-full rounded-md border border-gray-300 p-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          placeholder={`Hello ${investor.fullName}, I'd like to connect about my startup...`}
                          required
                          aria-required="true"
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full py-6"
                      >
                        Send Message
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - right 1/3 */}
          <div className="space-y-8">
            {/* Contact Information - FIXED EMAIL LAYOUT */}
            <Card className="shadow-md border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-blue-100">
                    <EnvelopeClosedIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {investor.email && (
                    <div className="flex flex-col sm:flex-row items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                        <EnvelopeClosedIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <a 
                          href={`mailto:${investor.email}`} 
                          className="text-indigo-600 hover:text-indigo-800 hover:underline break-all"
                        >
                          {investor.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {investor.phone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg shrink-0">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <a href={`tel:${investor.phone}`} className="text-gray-900 hover:text-indigo-600">
                          {investor.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Social Media Links */}
                  {investor.socialMedia && investor.socialMedia.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <p className="text-sm font-medium text-gray-700 mb-3">Connect Online</p>
                      <div className="space-y-3">
                        {investor.socialMedia.map((social, index) => (
                          <a
                            key={index}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 group transition-colors"
                          >
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-indigo-50 transition-colors shrink-0">
                              {getSocialMediaIcon(social.platform)}
                            </div>
                            <span className="flex-1 min-w-0 truncate">{social.platform}</span>
                            <svg className="w-4 h-4 opacity-50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="shadow-md border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-900">Investment Insights</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="divide-y divide-gray-200">
                  <div className="py-3 flex justify-between items-center">
                    <span className="text-gray-600">Investment Style</span>
                    <span className="font-medium text-gray-900">Early-stage Growth</span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="text-gray-600">Average Deal Size</span>
                    <span className="font-medium text-gray-900">
                      ${((investor.investmentRange.min + investor.investmentRange.max) / 2).toLocaleString()}
                    </span>
                  </div>
                  <div className="py-3 flex justify-between items-center">
                    <span className="text-gray-600">Due Diligence Time</span>
                    <span className="font-medium text-gray-900">2-4 weeks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connect Button */}
            <Button 
              onClick={handleConnectClick}
              className={`w-full py-6 text-white transition-colors ${
                showContactForm 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
              }`}
              aria-expanded={showContactForm}
            >
              {showContactForm ? 'Cancel Message' : 'Connect with Investor'}
            </Button>
          </div>
        </div>
      </div>
    </EntrepreneurSidebar>
  );
};

export default InvestorDetailsPage;