"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startupApi, API_ROUTES } from '@/config/api';
import { Startup } from '@/types/startup';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';
import EntrepreneurSidebar from '@/app/sidebar/entrepreneur/page';

interface ApiError {
  message: string;
}

const EditStartupPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Startup>({
    startupName: '',
    industry: '',
    fundingGoal: 0,
    raisedSoFar: 0,
    description: '',
    startupLogo: '',
    website: '',
    address: '',
    email: '',
    mobile: '',
    team: [{ name: '', role: '', email: '', linkedIn: '' }],
    founded: 0,
    location: '',
    problem: '',
    solution: '',
    traction: '',
    targetMarket: '',
    tam: '',
    demand: '',
    scalability: '',
    competitors: '',
    advantage: '',
    revenueStreams: '',
    annualRevenue: 0,
    projectedRevenue: '',
    previousFunding: '',
    seeking: '',
    investorROI: '',
    equityAvailable: '',
  });

  const [charCounts, setCharCounts] = useState({
    startupName: 0,
    industry: 0,
    address: 0,
    description: 0,
    problem: 0,
    solution: 0,
    traction: 0,
    competitors: 0,
    advantage: 0,
    revenueStreams: 0,
    projectedRevenue: 0,
    previousFunding: 0,
    seeking: 0,
    investorROI: 0,
    equityAvailable: 0,
  });

  useEffect(() => {
    const fetchStartupDetails = async () => {
      try {
        setLoading(true);
        const fetchedStartup = await startupApi.fetchStartup(id as string);
        setFormData({
          startupName: fetchedStartup.startupName,
          industry: fetchedStartup.industry,
          fundingGoal: fetchedStartup.fundingGoal,
          raisedSoFar: fetchedStartup.raisedSoFar,
          description: fetchedStartup.description,
          startupLogo: fetchedStartup.startupLogo,
          website: fetchedStartup.website,
          address: fetchedStartup.address,
          email: fetchedStartup.email,
          mobile: fetchedStartup.mobile,
          team: fetchedStartup.team || [{ name: '', role: '', email: '', linkedIn: '' }],
          founded: fetchedStartup.founded || 0,
          location: fetchedStartup.location || '',
          problem: fetchedStartup.problem || '',
          solution: fetchedStartup.solution || '',
          traction: fetchedStartup.traction || '',
          targetMarket: fetchedStartup.targetMarket || '',
          tam: fetchedStartup.tam || '',
          demand: fetchedStartup.demand || '',
          scalability: fetchedStartup.scalability || '',
          competitors: fetchedStartup.competitors || '',
          advantage: fetchedStartup.advantage || '',
          revenueStreams: fetchedStartup.revenueStreams || '',
          annualRevenue: fetchedStartup.annualRevenue || 0,
          projectedRevenue: fetchedStartup.projectedRevenue || '',
          previousFunding: fetchedStartup.previousFunding || '',
          seeking: fetchedStartup.seeking || '',
          investorROI: fetchedStartup.investorROI || '',
          equityAvailable: fetchedStartup.equityAvailable || '',
        });
      } catch (error) {
        const apiError = error as ApiError;
        setError(apiError.message || 'Failed to fetch startup details');
        toast.error(apiError.message || 'Failed to fetch startup details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStartupDetails();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target;
    const updatedValue = type === 'number' ? parseFloat(value) || 0 : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Update character count for text fields
    if (type !== 'number') {
      setCharCounts((prev) => ({
        ...prev,
        [name]: value.length,
      }));
    }
  };

  const handleTeamChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    const newTeam = [...formData.team];
    newTeam[index] = {
      ...newTeam[index],
      [name]: value,
    };
    setFormData((prev) => ({
      ...prev,
      team: newTeam,
    }));
  };

  const addTeamMember = (): void => {
    setFormData((prev) => ({
      ...prev,
      team: [...prev.team, { name: '', role: '', email: '', linkedIn: '' }],
    }));
  };

  const removeTeamMember = (index: number): void => {
    if (formData.team.length <= 1) {
      toast.error('At least one team member is required');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }));
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch(API_ROUTES.STARTUPS.UPLOAD_LOGO, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataUpload,
      });

      const responseText = await res.text();
      try {
        const data = JSON.parse(responseText);
        if (res.ok) {
          setFormData((prev) => ({
            ...prev,
            startupLogo: data.logoUrl,
          }));
          toast.success('Logo updated successfully');
        } else {
          toast.error(data.message || 'Logo update failed');
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        toast.error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Logo update failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await startupApi.updateStartup(id as string, formData);
      toast.success('Startup updated successfully');
      router.push('/entrepreneur/startups');
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.message || 'Failed to update startup');
    }
  };

  const handleCancelClick = () => {
    router.push('/entrepreneur/startups');
  };

  if (loading) {
    return (
      <EntrepreneurSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800" />
        </div>
      </EntrepreneurSidebar>
    );
  }

  return (
    <EntrepreneurSidebar>
      <div className="container mx-auto p-4 md:p-8">
        <Card className="bg-white shadow-lg">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-semibold text-gray-800">Edit Startup</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Startup Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Startup Name</label>
                  <input
                    type="text"
                    name="startupName"
                    value={formData.startupName}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs ${charCounts.startupName > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
                      {charCounts.startupName}/100 characters
                    </span>
                  </div>
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs ${charCounts.industry > 45 ? 'text-amber-600' : 'text-gray-500'}`}>
                      {charCounts.industry}/50 characters
                    </span>
                  </div>
                </div>

                {/* Funding Goal */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Funding Goal</label>
                  <input
                    type="number"
                    name="fundingGoal"
                    value={formData.fundingGoal}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Raised So Far */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Raised So Far</label>
                  <input
                    type="number"
                    name="raisedSoFar"
                    value={formData.raisedSoFar}
                    onChange={handleChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Startup Logo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Startup Logo</label>
                  <div className="mt-1 flex items-center space-x-4">
                    {formData.startupLogo ? (
                      <div className="relative group">
                        <img
                          src={formData.startupLogo}
                          alt="Current startup logo"
                          className="h-20 w-20 object-contain rounded-lg border border-gray-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">Current Logo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        No logo
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        onChange={handleLogoChange}
                        accept="image/*"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100
                          cursor-pointer
                        "
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Recommended: Square image, max 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs ${charCounts.address > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
                      {charCounts.address}/100 characters
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs ${charCounts.description > 450 ? 'text-amber-600' : 'text-gray-500'}`}>
                      {charCounts.description}/500 characters
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Team Members Section */}
              <Card className="mt-8 bg-white shadow">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-gray-800">Team Members</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {formData.team.map((member, index) => (
                    <Card key={index} className="mb-4 bg-white shadow">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              name="name"
                              value={member.name}
                              onChange={(e) => handleTeamChange(index, e)}
                              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <input
                              type="text"
                              name="role"
                              value={member.role}
                              onChange={(e) => handleTeamChange(index, e)}
                              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={member.email}
                              onChange={(e) => handleTeamChange(index, e)}
                              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                            <input
                              type="url"
                              name="linkedIn"
                              value={member.linkedIn}
                              onChange={(e) => handleTeamChange(index, e)}
                              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        {formData.team.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="mt-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            Remove Member
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Team Member
                  </button>
                </CardContent>
              </Card>

              {/* Additional Startup Details Section */}
              <Card className="mt-8 bg-white shadow">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-gray-800">Additional Startup Details</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Founded (Year)
                      </label>
                      <input
                        type="number"
                        name="founded"
                        value={formData.founded || ''}
                        onChange={handleChange}
                        placeholder="2023"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Idea & Validation */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Problem</label>
                    <textarea
                      name="problem"
                      value={formData.problem || ''}
                      onChange={handleChange}
                      rows={3}
                      maxLength={300}
                      placeholder="60% of SMEs struggle with obtaining quick loans..."
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs ${charCounts.problem > 270 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {charCounts.problem}/300 characters
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Solution</label>
                    <textarea
                      name="solution"
                      value={formData.solution || ''}
                      onChange={handleChange}
                      rows={3}
                      maxLength={300}
                      placeholder="AI-powered risk assessment for faster approvals..."
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs ${charCounts.solution > 270 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {charCounts.solution}/300 characters
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Traction</label>
                    <textarea
                      name="traction"
                      value={formData.traction || ''}
                      onChange={handleChange}
                      rows={3}
                      maxLength={250}
                      placeholder="500+ businesses onboarded, $50K revenue in 3 months..."
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs ${charCounts.traction > 225 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {charCounts.traction}/250 characters
                      </span>
                    </div>
                  </div>

                  {/* Market & Scalability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Target Market
                      </label>
                      <input
                        type="text"
                        name="targetMarket"
                        value={formData.targetMarket || ''}
                        onChange={handleChange}
                        placeholder="SMEs in the USA"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        TAM (Total Addressable Market)
                      </label>
                      <input
                        type="text"
                        name="tam"
                        value={formData.tam || ''}
                        onChange={handleChange}
                        placeholder="$10B"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Demand
                      </label>
                      <input
                        type="text"
                        name="demand"
                        value={formData.demand || ''}
                        onChange={handleChange}
                        placeholder="70% of SMEs seek alternative lending..."
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Scalability
                      </label>
                      <input
                        type="text"
                        name="scalability"
                        value={formData.scalability || ''}
                        onChange={handleChange}
                        placeholder="Expansion into Europe & Asia..."
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>
                  </div>

                  {/* Competitors & Edge */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Competitors</label>
                    <textarea
                      name="competitors"
                      value={formData.competitors || ''}
                      onChange={handleChange}
                      rows={2}
                      maxLength={150}
                      placeholder="Kabbage, Lendio, OnDeck..."
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs ${charCounts.competitors > 135 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {charCounts.competitors}/150 characters
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Advantage</label>
                    <textarea
                      name="advantage"
                      value={formData.advantage || ''}
                      onChange={handleChange}
                      rows={2}
                      maxLength={150}
                      placeholder="AI-based approvals, lower interest rates, 24-hour processing..."
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs ${charCounts.advantage > 135 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {charCounts.advantage}/150 characters
                      </span>
                    </div>
                  </div>

                  {/* Revenue & Financials */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Revenue Streams</label>
                    <textarea
                      name="revenueStreams"
                      value={formData.revenueStreams || ''}
                      onChange={handleChange}
                      rows={2}
                      maxLength={200}
                      placeholder="2% transaction fee, $10/month credit monitoring..."
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs ${charCounts.revenueStreams > 180 ? 'text-amber-600' : 'text-gray-500'}`}>
                        {charCounts.revenueStreams}/200 characters
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Annual Revenue $
                      </label>
                      <input
                        type="number"
                        name="annualRevenue"
                        value={formData.annualRevenue || 0}
                        onChange={handleChange}
                        placeholder="150000 (for $150K)"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Projected Revenue $</label>
                      <input
                        type="text"
                        name="projectedRevenue"
                        value={formData.projectedRevenue || ''}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="1M+"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                      <div className="flex justify-end">
                        <span className={`text-xs ${charCounts.projectedRevenue > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {charCounts.projectedRevenue}/100 characters
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Funding & Investment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Previous Funding</label>
                      <input
                        type="text"
                        name="previousFunding"
                        value={formData.previousFunding || ''}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="$250K Seed"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                      <div className="flex justify-end">
                        <span className={`text-xs ${charCounts.previousFunding > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {charCounts.previousFunding}/100 characters
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Seeking</label>
                      <input
                        type="text"
                        name="seeking"
                        value={formData.seeking || ''}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="$500K for AI scaling & user growth..."
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                      <div className="flex justify-end">
                        <span className={`text-xs ${charCounts.seeking > 90 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {charCounts.seeking}/100 characters
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Investor ROI</label>
                      <input
                        type="text"
                        name="investorROI"
                        value={formData.investorROI || ''}
                        onChange={handleChange}
                        maxLength={50}
                        placeholder="5x in 3 years"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                      <div className="flex justify-end">
                        <span className={`text-xs ${charCounts.investorROI > 45 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {charCounts.investorROI}/50 characters
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Equity Available</label>
                      <input
                        type="text"
                        name="equityAvailable"
                        value={formData.equityAvailable || ''}
                        onChange={handleChange}
                        maxLength={50}
                        placeholder="15%"
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      />
                      <div className="flex justify-end">
                        <span className={`text-xs ${charCounts.equityAvailable > 45 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {charCounts.equityAvailable}/50 characters
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelClick}
                  className="bg-white text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {id ? 'Update Startup' : 'Create Startup'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </EntrepreneurSidebar>
  );
};

export default EditStartupPage;