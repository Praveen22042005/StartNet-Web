"use client";
import React, { useState, useEffect } from 'react';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Startup } from '@/types/startup';
import { startupApi } from '@/config/api';
import { 
  PlusIcon, 
  RocketIcon, 
  PersonIcon, 
  CheckCircledIcon, 
  CrossCircledIcon, 
  ExclamationTriangleIcon 
} from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

/**
 * EntrepreneurHomePage Component
 * Dashboard for entrepreneurs showing startup stats, recent activities, and suggestions
 */
const EntrepreneurHomePage: React.FC = () => {
  // State for storing startups data and loading state
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch startups on component mount
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const data = await startupApi.fetchStartups();
        setStartups(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to fetch startups';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStartups();
  }, []);

  /**
   * Calculate profile completion percentage
   * @returns {number} Completion percentage
   */
  const getProfileCompletionPercentage = (): number => {
    // TODO: Replace with actual calculation based on profile completion
    // This should check mandatory fields and calculate percentage
    return 75;
  };

  /**
   * Calculate total funding goal from all startups
   * @returns {number} Total funding goal amount
   */
  const calculateTotalFundingGoal = (): number => {
    return startups.reduce((sum, startup) => sum + (startup.fundingGoal || 0), 0);
  };

  /**
   * Calculate total raised amount from all startups
   * @returns {number} Total raised amount
   */
  const calculateTotalRaised = (): number => {
    return startups.reduce((sum, startup) => sum + (startup.raisedSoFar || 0), 0);
  };

  /**
   * Navigate to startups page
   */
  const handleViewAllStartups = () => {
    router.push('/entrepreneur/startups');
  };

  /**
   * Navigate to startup creation page
   */
  const handleAddStartup = () => {
    router.push('/entrepreneur/startups/create');
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <EntrepreneurSidebar>
        <div className="flex items-center justify-center min-h-screen" aria-label="Loading content">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"
            role="status"
          />
          <span className="sr-only">Loading...</span>
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
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center" role="alert">
            <ExclamationTriangleIcon className="h-10 w-10 text-red-500 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to load dashboard</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </EntrepreneurSidebar>
    );
  }

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your startups</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Startups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <RocketIcon className="h-5 w-5 text-indigo-600 mr-2" aria-hidden="true" />
                <span className="text-2xl font-bold text-gray-900">{startups.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Funding Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  ${calculateTotalFundingGoal().toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600">
                  ${calculateTotalRaised().toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <PersonIcon className="h-5 w-5 text-indigo-600 mr-2" aria-hidden="true" />
                  <span className="text-2xl font-bold text-gray-900">{getProfileCompletionPercentage()}%</span>
                </div>
                <div 
                  className="w-full bg-gray-200 rounded-full h-2"
                  role="progressbar"
                  aria-valuenow={getProfileCompletionPercentage()}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${getProfileCompletionPercentage()}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Startups and Tasks Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Startups */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Startups</CardTitle>
              <CardDescription>Your latest startup ventures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startups.length === 0 ? (
                  <div className="text-center py-8">
                    <RocketIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
                    <p className="text-gray-500">No startups yet. Create your first one!</p>
                  </div>
                ) : (
                  startups.slice(0, 3).map((startup) => (
                    <div 
                      key={startup._id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        {startup.startupLogo ? (
                          <Image
                            src={startup.startupLogo}
                            alt=""
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-contain bg-white"
                            aria-hidden="true"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-400">
                              {startup.startupName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{startup.startupName}</h3>
                          <p className="text-sm text-gray-500">{startup.industry}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${startup.raisedSoFar?.toLocaleString() || 0}</p>
                        <p className="text-xs text-gray-500">of ${startup.fundingGoal?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  ))
                )}
                <Button
                  onClick={handleViewAllStartups}
                  variant="outline"
                  className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  {startups.length > 0 ? 'View All Startups' : 'Create Startup'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tasks and Suggestions */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Action Items</CardTitle>
              <CardDescription>Things that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startups.some(s => !s.startupLogo) && (
                  <div 
                    className="flex items-center space-x-3 p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-200"
                    role="alert"
                  >
                    <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium">Missing Startup Logos</p>
                      <p className="text-xs mt-1">Add logos to increase visibility and brand recognition</p>
                    </div>
                  </div>
                )}
                
                {startups.some(s => !s.description || s.description.length < 100) && (
                  <div 
                    className="flex items-center space-x-3 p-3 bg-red-50 text-red-800 rounded-lg border border-red-200"
                    role="alert"
                  >
                    <CrossCircledIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium">Incomplete Descriptions</p>
                      <p className="text-xs mt-1">Detailed descriptions help investors understand your vision better</p>
                    </div>
                  </div>
                )}

                {startups.some(s => !s.website) && (
                  <div 
                    className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-200"
                    role="alert"
                  >
                    <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium">Missing Website Links</p>
                      <p className="text-xs mt-1">Add website links to showcase your online presence</p>
                    </div>
                  </div>
                )}

                {startups.length === 0 && (
                  <div
                    className="flex items-center space-x-3 p-3 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200"
                    role="alert"
                  >
                    <RocketIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium">Start Your Journey</p>
                      <p className="text-xs mt-1">Create your first startup to begin fundraising</p>
                    </div>
                  </div>
                )}

                <div 
                  className="flex items-center space-x-3 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200"
                  role="status"
                >
                  <CheckCircledIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium">Profile Status</p>
                    <p className="text-xs mt-1">Your profile is {getProfileCompletionPercentage()}% complete</p>
                  </div>
                </div>

                <Button
                  onClick={handleAddStartup}
                  className="w-full mt-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                  Add Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips and Resources */}
        <Card className="bg-white mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Quick Tips & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <h3 className="font-medium text-gray-900 mb-2">Perfect Your Pitch</h3>
                <p className="text-sm text-gray-600">Learn how to create a compelling pitch deck that attracts investors.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <h3 className="font-medium text-gray-900 mb-2">Network Growth</h3>
                <p className="text-sm text-gray-600">Connect with other entrepreneurs and potential investors.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <h3 className="font-medium text-gray-900 mb-2">Funding Strategies</h3>
                <p className="text-sm text-gray-600">Explore different funding options for your startup.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EntrepreneurSidebar>
  );
};

export default EntrepreneurHomePage;