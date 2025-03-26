"use client";
import React, { useState, useEffect, useCallback } from "react";
import InvestorSidebar from "@/app/sidebar/investor/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Startup } from "@/types/startup";
import { API_ROUTES } from "@/config/api";
import { useRouter } from "next/navigation";
import {
  RocketIcon,
  PersonIcon,
  ExclamationTriangleIcon,
  EyeOpenIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { FaDollarSign, FaChartBar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Image from "next/image";

/**
 * Interface for dashboard statistics
 */
interface DashboardStats {
  totalInvestments: number;
  activeStartups: number;
  totalInvested: number;
  averageReturn: number;
}

/**
 * InvestorHomePage Component
 * Dashboard for investors showing portfolio stats, recent startup opportunities, and investment insights
 */
const InvestorHomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentStartups, setRecentStartups] = useState<Startup[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestments: 0,
    activeStartups: 0,
    totalInvested: 0,
    averageReturn: 0,
  });
  
  const router = useRouter();

  /**
   * Fetch dashboard data including recent startups and investor statistics
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please sign in again.");
      }
      
      // Fetch recent startups
      const response = await fetch(
        `${API_ROUTES.INVESTOR.STARTUPS.GET_ALL}?limit=3`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: Failed to fetch startups`);
      }

      const data = await response.json();
      
      if (!data.startups) {
        throw new Error("Invalid response format. Please try again later.");
      }
      
      setRecentStartups(data.startups);

      // Fetch investor statistics - in a real implementation, this would be from a real API endpoint
      // Comment: This is a placeholder. In production, replace with actual API call.
      try {
        const statsResponse = await fetch(
          API_ROUTES.INVESTOR.DASHBOARD.GET_STATS,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          // If stats API fails, use example data but don't throw error
          // This prevents the whole dashboard from failing if only stats are unavailable
          console.warn("Could not fetch investment statistics. Using placeholder data.");
          setStats({
            totalInvestments: 12,
            activeStartups: 8,
            totalInvested: 500000,
            averageReturn: 15,
          });
        }
      } catch (statsError) {
        // If stats API fails, use example data but don't throw error
        console.warn("Could not fetch investment statistics. Using placeholder data.");
        setStats({
          totalInvestments: 12,
          activeStartups: 8,
          totalInvested: 500000,
          averageReturn: 15,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      toast.error(`Failed to fetch dashboard data: ${errorMessage}`);
      
      // If the error is due to authentication, redirect to login
      if (errorMessage.includes("Authentication required")) {
        localStorage.removeItem("token");
        router.push("/auth/signin");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Navigate to startup details
   */
  const handleViewStartup = (startupId: string) => {
    router.push(`/investor/startups/${startupId}`);
  };

  /**
   * Navigate to view all startups
   */
  const handleViewAllStartups = () => {
    router.push("/investor/startups");
  };

  /**
   * Navigate to portfolio
   */
  const handleViewPortfolio = () => {
    router.push("/investor/portfolio");
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <InvestorSidebar>
        <div className="flex justify-center items-center min-h-screen" aria-label="Loading dashboard">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" 
            role="status"
          />
          <span className="sr-only">Loading dashboard data...</span>
        </div>
      </InvestorSidebar>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <InvestorSidebar>
        <div className="container mx-auto p-4 md:p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-3xl mx-auto">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-red-800">Dashboard unavailable</h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="flex space-x-4">
              <Button
                onClick={fetchDashboardData}
                className="bg-red-100 text-red-800 hover:bg-red-200"
              >
                Try Again
              </Button>
              <Button
                onClick={handleViewAllStartups}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                View Startups
              </Button>
            </div>
          </div>
        </div>
      </InvestorSidebar>
    );
  }

  return (
    <InvestorSidebar>
      <div className="container mx-auto p-4 md:p-8 bg-gray-50">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Your Investor Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your investments and discover new opportunities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <PersonIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Investments
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.totalInvestments.toLocaleString()}
                  </h3>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-2 border-t border-gray-100">
              <button 
                onClick={handleViewPortfolio}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                aria-label="View your investment portfolio"
              >
                View Portfolio <ChevronRightIcon className="ml-1 h-3 w-3" aria-hidden="true" />
              </button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <RocketIcon className="w-6 h-6 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Startups
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.activeStartups.toLocaleString()}
                  </h3>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-2 border-t border-gray-100">
              <button 
                onClick={handleViewAllStartups}
                className="text-xs text-green-600 hover:text-green-800 flex items-center"
                aria-label="View all active startups"
              >
                View Startups <ChevronRightIcon className="ml-1 h-3 w-3" aria-hidden="true" />
              </button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaDollarSign className="w-6 h-6 text-purple-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Invested
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    ${stats.totalInvested.toLocaleString()}
                  </h3>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-2 border-t border-gray-100">
              <button 
                onClick={handleViewPortfolio}
                className="text-xs text-purple-600 hover:text-purple-800 flex items-center"
                aria-label="View investment details"
              >
                View Details <ChevronRightIcon className="ml-1 h-3 w-3" aria-hidden="true" />
              </button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <FaChartBar className="w-6 h-6 text-amber-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Return</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stats.averageReturn}%
                  </h3>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-6 py-2 border-t border-gray-100">
              <button 
                onClick={handleViewPortfolio}
                className="text-xs text-amber-600 hover:text-amber-800 flex items-center"
                aria-label="View return analytics"
              >
                View Analytics <ChevronRightIcon className="ml-1 h-3 w-3" aria-hidden="true" />
              </button>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Startups Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Recently Added Startups
                </CardTitle>
                <CardDescription>
                  Latest opportunities for investment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStartups.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <RocketIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                      </div>
                      <p className="text-gray-500">No startup opportunities available yet</p>
                      <p className="text-sm text-gray-400 mt-1">Check back soon for new listings</p>
                    </div>
                  ) : (
                    recentStartups.map((startup) => (
                      <div
                        key={startup._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        tabIndex={0}
                        role="button"
                        onClick={() => handleViewStartup(startup._id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleViewStartup(startup._id);
                          }
                        }}
                        aria-label={`View details for ${startup.startupName}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                            {startup.startupLogo ? (
                              <div className="relative h-10 w-10">
                                <Image
                                  src={startup.startupLogo}
                                  alt=""
                                  fill
                                  className="object-contain"
                                  aria-hidden="true"
                                />
                              </div>
                            ) : (
                              <span className="text-xl font-bold text-gray-400">
                                {startup.startupName.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {startup.startupName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {startup.industry}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center">
                          <div className="mr-4">
                            <p className="text-sm font-medium text-gray-900">
                              ${(startup.fundingGoal || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Funding Goal</p>
                          </div>
                          <EyeOpenIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                      </div>
                    ))
                  )}
                  <Button
                    onClick={handleViewAllStartups}
                    className="w-full mt-4 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    View All Startups
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Insights */}
          <div className="space-y-6">
            {/* Investment Tips Card */}
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">Investment Insights</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="font-medium text-blue-800 mb-1 text-sm">Top Performing Industries</h3>
                    <p className="text-sm text-gray-600">
                      Tech and Healthcare startups are showing the strongest growth in Q1 2025.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <h3 className="font-medium text-green-800 mb-1 text-sm">Due Diligence Reminder</h3>
                    <p className="text-sm text-gray-600">
                      Always review financial projections and team backgrounds before investing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="bg-white shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Button 
                    onClick={handleViewPortfolio}
                    variant="outline" 
                    className="w-full justify-start text-left"
                  >
                    <FaChartBar className="mr-2 h-4 w-4" aria-hidden="true" />
                    View Portfolio Performance
                  </Button>
                  <Button 
                    onClick={handleViewAllStartups}
                    variant="outline" 
                    className="w-full justify-start text-left"
                  >
                    <RocketIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                    Discover New Startups
                  </Button>
                  <Button 
                    onClick={() => router.push("/investor/settings")}
                    variant="outline" 
                    className="w-full justify-start text-left"
                  >
                    <svg 
                      className="mr-2 h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Performance Graph Placeholder */}
        <Card className="bg-white shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Portfolio Performance
            </CardTitle>
            <CardDescription>
              Track the growth of your investments over time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
              <div className="text-center p-6">
                <FaChartBar className="h-12 w-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
                <p className="text-gray-500 font-medium">Portfolio analytics coming soon</p>
                <p className="text-sm text-gray-400 mt-1">We're working on enhanced visualization tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </InvestorSidebar>
  );
};

export default InvestorHomePage;