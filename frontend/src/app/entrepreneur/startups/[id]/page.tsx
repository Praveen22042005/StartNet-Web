"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startupApi } from '@/config/api';
import { Startup } from '@/types/startup';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil1Icon, ArrowLeftIcon, CalendarIcon } from '@radix-ui/react-icons';
import { toast } from 'react-hot-toast';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';

interface ApiError {
  message: string;
}

const StartupDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStartupDetails = async () => {
      try {
        setLoading(true);
        const fetchedStartup = await startupApi.fetchStartup(id as string);
        setStartup(fetchedStartup);
      } catch (error) {
        const apiError = error as ApiError;
        const errorMsg = apiError.message || "Failed to fetch startup details";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStartupDetails();
    }
  }, [id]);

  const handleEditClick = () => {
    router.push(`/entrepreneur/startups/edit/${id}`);
  };

  const handleBackClick = () => {
    router.push('/entrepreneur/startups');
  };

  if (loading) {
    return (
      <EntrepreneurSidebar>
        <div className="flex items-center justify-center min-h-screen" aria-live="polite" aria-busy="true">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800" />
          <span className="sr-only">Loading startup details...</span>
        </div>
      </EntrepreneurSidebar>
    );
  }

  if (error) {
    return (
      <EntrepreneurSidebar>
        <div className="container mx-auto p-4 md:p-8">
          <div className="mt-4 p-4 text-red-700 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
          <div className="mt-4">
            <Button onClick={handleBackClick} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Startups
            </Button>
          </div>
        </div>
      </EntrepreneurSidebar>
    );
  }

  if (!startup) {
    return (
      <EntrepreneurSidebar>
        <div className="container mx-auto p-4 md:p-8">
          <div className="mt-4 p-4 bg-gray-50 text-gray-700 rounded-md border border-gray-200">
            Startup not found.
          </div>
          <div className="mt-4">
            <Button onClick={handleBackClick} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to Startups
            </Button>
          </div>
        </div>
      </EntrepreneurSidebar>
    );
  }

  // Calculate funding progress percentage
  const progress = startup.fundingGoal ? (startup.raisedSoFar / startup.fundingGoal) * 100 : 0;

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8">
        {/* Hero Section */}
        <Card className="bg-white shadow-lg mb-8">
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-8">
            <div className="flex items-center space-x-6">
              {startup.startupLogo ? (
                <img
                  src={startup.startupLogo}
                  alt={`${startup.startupName} logo`}
                  className="h-24 w-24 rounded-xl border-2 border-gray-700 bg-white p-2 object-contain"
                />
              ) : (
                <div className="h-24 w-24 rounded-xl border-2 border-gray-700 bg-white flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    {startup.startupName.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{startup.startupName}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-gray-700 text-gray-100 rounded-full text-sm">
                    {startup.industry}
                  </span>
                  {startup.founded && (
                    <span className="px-3 py-1 bg-gray-700 text-gray-100 rounded-full text-sm flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      Founded {startup.founded}
                    </span>
                  )}
                  {startup.website && (
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm transition-colors duration-200"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Funding Progress Section */}
            <Card className="shadow-sm border overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 border-b py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Funding Progress</CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Target: ${startup.fundingGoal?.toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-indigo-600">
                      ${startup.raisedSoFar?.toLocaleString()}
                    </span>
                    <p className="text-sm text-gray-600">Raised so far</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                    aria-label={`Funding progress is ${progress.toFixed(1)}%`}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center border">
                    <p className="text-sm font-medium text-gray-500">Progress</p>
                    <p className="text-xl font-bold text-indigo-600">{progress.toFixed(1)}%</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center border">
                    <p className="text-sm font-medium text-gray-500">Seeking</p>
                    <p className="text-xl font-bold text-gray-800">{startup.seeking || "Not specified"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center border">
                    <p className="text-sm font-medium text-gray-500">Equity Available</p>
                    <p className="text-xl font-bold text-gray-800">{startup.equityAvailable || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About the Startup */}
            <Card className="shadow-sm border">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 border-b">
                <CardTitle className="text-xl font-semibold text-gray-900">About the Startup</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {startup.description || 'No description available.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-3">Problem</h3>
                    <p className="text-gray-700">{startup.problem || "Not specified"}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">Solution</h3>
                    <p className="text-gray-700">{startup.solution || "Not specified"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Overview */}
            <Card className="shadow-sm border">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 border-b">
                <CardTitle className="text-xl font-semibold text-gray-900">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Annual Revenue</h3>
                    <p className="text-xl font-bold text-green-600">${startup.annualRevenue?.toLocaleString() || '0'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Projected Revenue</h3>
                    <p className="text-xl font-bold text-indigo-600">{startup.projectedRevenue || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Previous Funding</h3>
                    <p className="text-xl font-bold text-gray-800">{startup.previousFunding || 'None'}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Revenue Streams</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border">{startup.revenueStreams || 'Not specified'}</p>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Investor ROI</h3>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <p className="text-gray-700">{startup.investorROI || 'Not specified'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Traction</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="text-gray-700">{startup.traction || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market & Growth */}
            <Card className="shadow-sm border">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 border-b">
                <CardTitle className="text-xl font-semibold text-gray-900">Market & Growth</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Target Market</h3>
                    <p className="text-gray-700">{startup.targetMarket || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">TAM (Total Addressable Market)</h3>
                    <p className="text-gray-700">{startup.tam || 'Not specified'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Demand</h3>
                    <p className="text-gray-700">{startup.demand || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-md font-semibold text-gray-700 mb-2">Scalability</h3>
                    <p className="text-gray-700">{startup.scalability || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitive Edge */}
            <Card className="shadow-sm border">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 border-b">
                <CardTitle className="text-xl font-semibold text-gray-900">Competitive Edge</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Competitors</h3>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <p className="text-gray-700">{startup.competitors || 'Not specified'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Competitive Advantage</h3>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="text-gray-700">{startup.advantage || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Section */}
            <Card className="shadow-sm border">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 border-b">
                <CardTitle className="text-xl font-semibold text-gray-900">Meet the Team</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {startup.team.map((member, index) => (
                    <div 
                      key={index} 
                      className="relative group p-6 border rounded-xl bg-white hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-xl font-semibold text-indigo-600">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {member.email}
                        </div>
                        {member.linkedIn && (
                          <a
                            href={member.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            LinkedIn Profile
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-sm border">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-50 border-b">
                <CardTitle className="text-xl font-semibold text-gray-900">Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900">{startup.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-gray-900">{startup.mobile}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-gray-900">{startup.address}</p>
                      </div>
                    </div>
                    {startup.location && (
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="text-gray-900">{startup.location}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4">
              <Button
                onClick={handleBackClick}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Startups
              </Button>
              <Button
                onClick={handleEditClick}
                className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
              >
                <Pencil1Icon className="mr-2 h-4 w-4" />
                Edit Startup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </EntrepreneurSidebar>
  );
};

export default StartupDetailsPage;