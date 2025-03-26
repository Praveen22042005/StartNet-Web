"use client";
import React, { useState, useEffect, useCallback } from 'react';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';
import { startupApi, API_ROUTES } from '@/config/api';
import { Startup, TeamMember } from '@/types/startup';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, Pencil1Icon, EyeOpenIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ApiError {
  message: string;
}

interface ExtendedStartup {
  founded: number;
  problem: string;
  solution: string;
  traction: string;
  targetMarket: string;
  tam: string;
  demand: string;
  scalability: string;
  competitors: string;
  advantage: string;
  revenueStreams: string;
  annualRevenue: number;
  projectedRevenue: string;
  previousFunding: string;
  seeking: string;
  investorROI: string;
  equityAvailable: string;
}

/**
 * StartupsPage Component
 * Dashboard for entrepreneurs to manage their startup ventures
 */
const StartupsPage = () => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Fetch startups data from API
   */
  const fetchStartupsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please sign in again.');
      }
      
      const fetchedStartups = await startupApi.fetchStartups();
      setStartups(fetchedStartups);
    } catch (error) {
      const apiError = error as ApiError;
      const errorMessage = apiError.message || 'Failed to fetch your startups';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If the error is due to authentication, redirect to login
      if (errorMessage.includes('Authentication required')) {
        router.push('/auth/signin');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchStartupsData();
  }, [fetchStartupsData]);

  /**
   * Navigate to startup creation page
   */
  const handleAddStartupClick = () => {
    router.push('/entrepreneur/startups/create');
  };

  /**
   * Navigate to startup edit page
   */
  const handleEditStartupClick = (startup: Startup) => {
    router.push(`/entrepreneur/startups/edit/${startup._id}`);
  };

  /**
   * Navigate to startup details page
   */
  const handleViewDetailsClick = (startup: Startup) => {
    router.push(`/entrepreneur/startups/${startup._id}`);
  };

  /**
   * Calculate funding progress percentage
   */
  const calculateFundingProgress = (raisedSoFar: number, fundingGoal: number): number => {
    if (fundingGoal <= 0) return 0;
    const percentage = (raisedSoFar / fundingGoal) * 100;
    return Math.min(percentage, 100);
  };

  /**
   * Render loading skeleton
   */
  if (loading) {
    return (
      <EntrepreneurSidebar>
        <div className="container mx-auto p-4 md:p-8 bg-gray-50" aria-live="polite" aria-busy="true">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Startups</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-white shadow-lg animate-pulse">
                <CardHeader className="bg-gray-50 border-b p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-3 w-16 bg-gray-200 rounded" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <span className="sr-only">Loading startups...</span>
        </div>
      </EntrepreneurSidebar>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <EntrepreneurSidebar>
        <div className="container mx-auto p-4 md:p-8 bg-gray-50">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Startups</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-3xl mx-auto">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-red-800">Error loading startups</h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex space-x-4">
              <Button
                onClick={fetchStartupsData}
                className="bg-red-100 text-red-800 hover:bg-red-200"
              >
                Try Again
              </Button>
              <Button
                onClick={handleAddStartupClick}
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create New Startup
              </Button>
            </div>
          </div>
        </div>
      </EntrepreneurSidebar>
    );
  }

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Startups</h1>
          <Button
            onClick={handleAddStartupClick}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Add Startup
          </Button>
        </div>

        {startups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-2xl mx-auto">
            <div className="h-24 w-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <PlusIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No startups yet</h2>
            <p className="text-gray-600 mb-6">
              Get started by creating your first startup to showcase to potential investors.
            </p>
            <Button 
              onClick={handleAddStartupClick} 
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Your First Startup
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <Card 
                key={startup._id} 
                className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
              >
                <CardHeader className="bg-gray-50 border-b p-4">
                  <div className="flex items-center space-x-4">
                    {startup.startupLogo ? (
                      <Image 
                        src={startup.startupLogo} 
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain rounded-lg border border-gray-200 bg-white"
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {startup.startupName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl text-gray-800">{startup.startupName}</CardTitle>
                      <p className="text-sm text-gray-600">{startup.industry}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">Funding Goal</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${startup.fundingGoal.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-sm font-medium text-gray-500">Raised</p>
                        <p className="text-lg font-semibold text-green-600">
                          ${startup.raisedSoFar.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar with accessibility */}
                    <div 
                      className="w-full bg-gray-200 rounded-full h-2"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={calculateFundingProgress(startup.raisedSoFar, startup.fundingGoal)}
                      aria-label={`Funding progress: ${calculateFundingProgress(startup.raisedSoFar, startup.fundingGoal).toFixed(0)}%`}
                    >
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${calculateFundingProgress(startup.raisedSoFar, startup.fundingGoal)}%` 
                        }}
                      />
                    </div>

                    <div className="pt-2 space-y-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {startup.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{startup.email || 'No email provided'}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{startup.mobile || 'No phone provided'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {startup.website ? (
                              <a 
                                href={startup.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-600 hover:text-indigo-800 truncate"
                              >
                                Website
                              </a>
                            ) : (
                              <span>No website</span>
                            )}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{startup.address || 'No address provided'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team section */}
                    {startup.team && startup.team.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Team</p>
                        <div className="flex flex-wrap gap-2">
                          {startup.team.slice(0, 3).map((member, index) => (
                            <div 
                              key={index} 
                              className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                              title={`${member.name}, ${member.role || 'Team Member'}`}
                            >
                              {member.name}
                              {member.role && `, ${member.role}`}
                            </div>
                          ))}
                          {startup.team.length > 3 && (
                            <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                              +{startup.team.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex justify-between items-center">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleEditStartupClick(startup)} 
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        <Pencil1Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleViewDetailsClick(startup)}
                        className="bg-gray-900 text-white hover:bg-gray-800"
                      >
                        <EyeOpenIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add Startup Card */}
            <div className="flex items-center justify-center">
              <Button 
                onClick={handleAddStartupClick} 
                variant="outline" 
                className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 text-black"
              >
                <PlusIcon className="mr-2 h-6 w-6" aria-hidden="true" />
                Add Startup
              </Button>
            </div>
          </div>
        )}
      </div>
    </EntrepreneurSidebar>
  );
};

export default StartupsPage;