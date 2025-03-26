"use client";

import React, { useState, useEffect, useCallback } from 'react';
import InvestorSidebar from '@/app/sidebar/investor/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { API_ROUTES } from '@/config/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cropper from 'react-easy-crop';
import { readFile, cropImage } from '@/lib/imageUtils';
import { PlusIcon, Cross2Icon } from '@radix-ui/react-icons';

interface ProfilePictureUploadProps {
  isEditing: boolean;
  onUpload: (file: File) => Promise<string>;
  currentProfilePicture: string;
  updateProfilePicture: (url: string) => void;
}

// Add CropArea interface
interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  isEditing, 
  onUpload, 
  currentProfilePicture,
  updateProfilePicture
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setPreviewUrl(
      currentProfilePicture ? `${currentProfilePicture}?${Date.now()}` : '/default-profile.png'
    );
  }, [currentProfilePicture]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageDataUrl = await readFile(file);
      setSelectedFile(file);
      setPreviewUrl(imageDataUrl);
      setShowCropModal(true);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    }
  };

  // Add onCropComplete function
  const onCropComplete = useCallback(
    (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (!selectedFile || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      if (!previewUrl) return;
      const croppedImage = await cropImage(previewUrl, croppedAreaPixels);
      const file = new File([croppedImage], selectedFile.name, {
        type: selectedFile.type
      });
      
      const azureUrl = await onUpload(file);
      setPreviewUrl(`${azureUrl}?${Date.now()}`);
      setShowCropModal(false);
      
      // Update the profile picture in the parent component
      updateProfilePicture(azureUrl);
    } catch (error) {
      console.error('Error cropping/uploading image:', error);
      toast.error('Failed to crop and upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white">
        <Image
          src={previewUrl || '/default-profile.png'}
          alt="Profile"
          width={160}
          height={160}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {isEditing && (
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="profile-picture"
            className="px-6 py-2 bg-gray-900 text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-md"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
            ) : (
              'Change Photo'
            )}
          </label>
          <input
            id="profile-picture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}

      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="relative w-full h-96">
              <Cropper
                image={previewUrl || ''}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                onClick={() => setShowCropModal(false)}
                className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCrop}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                Crop & Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SocialMedia {
  platform: string;
  url: string;
}

interface Skill {
  name: string;
}

interface InvestorProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profilePicture: string;
  socialMedia: SocialMedia[];
  skills: Skill[];
  investmentPreferences: string[];
  portfolioSize: string;
  investmentRange: {
    min: number;
    max: number;
  };
}

const SOCIAL_MEDIA_PLATFORMS = [
  'LinkedIn',
  'Twitter',
  'Instagram',
  'GitHub',
  'Facebook',
  'YouTube'
];

const PLATFORM_PLACEHOLDERS = {
  LinkedIn: 'https://linkedin.com/in/username',
  Twitter: 'https://twitter.com/username',
  Instagram: 'https://instagram.com/username',
  GitHub: 'https://github.com/username',
  Facebook: 'https://facebook.com/username',
  YouTube: 'https://youtube.com/@username'
};

const PORTFOLIO_SIZE_OPTIONS = [
  'Under $100K',
  '$100K - $500K',
  '$500K - $1M',
  '$1M - $5M',
  '$5M - $10M',
  'Over $10M'
];

const InvestorProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const router = useRouter();
  
  const [profile, setProfile] = useState<InvestorProfile>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profilePicture: '',
    socialMedia: [{ platform: 'LinkedIn', url: '' }],
    skills: [],
    investmentPreferences: [],
    portfolioSize: '',
    investmentRange: {
      min: 0,
      max: 0
    }
  });

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(API_ROUTES.INVESTOR_PROFILE.GET, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data);
      } else if (data.isExpired) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/signin');
        toast.error('Session expired. Please sign in again.');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    
    if (name.startsWith('investmentRange.')) {
      const field = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        investmentRange: {
          ...prev.investmentRange,
          [field]: parseFloat(value) || 0
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    fetchProfile();
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ROUTES.INVESTOR_PROFILE.UPDATE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else if (data.isExpired) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/auth/signin');
        toast.error('Session expired. Please sign in again.');
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };

  const handleAddSocialMedia = () => {
    const availablePlatforms = SOCIAL_MEDIA_PLATFORMS.filter(
      platform => !profile.socialMedia.some(sm => sm.platform === platform)
    );

    if (availablePlatforms.length === 0) {
      toast.error('All social media platforms have been added');
      return;
    }

    setProfile(prev => ({
      ...prev,
      socialMedia: [...prev.socialMedia, { platform: availablePlatforms[0], url: '' }]
    }));
  };

  const handleRemoveSocialMedia = (index: number) => {
    setProfile(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter((_, i) => i !== index)
    }));
  };

  const handleSocialMediaChange = (index: number, field: 'platform' | 'url', value: string) => {
    setProfile(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map((sm, i) => 
        i === index ? { ...sm, [field]: value } : sm
      )
    }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    if (profile.skills.some(skill => skill.name.toLowerCase() === newSkill.toLowerCase())) {
      toast.error('Skill already exists');
      return;
    }

    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, { name: newSkill.trim() }]
    }));
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillToRemove)
    }));
  };

  if (loading) {
    return (
      <InvestorSidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
        </div>
      </InvestorSidebar>
    );
  }

  return (
    <InvestorSidebar>
      <div className="container mx-auto p-4 md:p-8 space-y-8 bg-gray-50">
        {/* Profile Header Section */}
        <Card className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white py-12 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <ProfilePictureUpload 
                  isEditing={isEditing}
                  currentProfilePicture={profile.profilePicture}
                  onUpload={async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    const response = await fetch(API_ROUTES.INVESTOR_PROFILE.UPLOAD_PROFILE_PICTURE, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      },
                      body: formData
                    });
                    const data = await response.json();
                    if (response.ok) {
                      toast.success('Profile picture uploaded');
                      return data.profilePicture;
                    } else {
                      throw new Error(data.message || 'Failed to upload profile picture');
                    }
                  }}
                  updateProfilePicture={(url) => {
                    setProfile(prev => ({
                      ...prev,
                      profilePicture: url
                    }));
                  }}
                />
                <div>
                  <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                  <p className="text-gray-300">{profile.email}</p>
                  {profile.location && (
                    <p className="text-gray-300">{profile.location}</p>
                  )}
                </div>
              </div>
              <div>
                {!isEditing && (
                  <Button
                    type="button"
                    onClick={handleEdit}
                    className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-6 py-3 shadow-sm"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card className="shadow-sm border">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="John Doe"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 
                          text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                          disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="john.doe@example.com"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 
                          text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                          disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="+91 9876543210"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 
                          text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                          disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Chennai, Tamil Nadu"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 
                          text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                          disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        rows={4}
                        disabled={!isEditing}
                        placeholder="Tell us about your investment experience and interests..."
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 
                          text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                          disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Details */}
              <Card className="shadow-sm border">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Investment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Portfolio Size</label>
                        <select
                          name="portfolioSize"
                          value={profile.portfolioSize}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 
                            text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                            disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          <option value="">Select Portfolio Size</option>
                          {PORTFOLIO_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Investment Range</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="number"
                              name="investmentRange.min"
                              value={profile.investmentRange.min}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder="Min Amount"
                              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 
                                text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                                disabled:bg-gray-100 disabled:text-gray-500"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              name="investmentRange.max"
                              value={profile.investmentRange.max}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder="Max Amount"
                              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 
                                text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                                disabled:bg-gray-100 disabled:text-gray-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-sm border">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Social Media Profiles
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {profile.socialMedia.map((social, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <select
                          value={social.platform}
                          onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                          disabled={!isEditing}
                          className="w-1/4 rounded-md border border-gray-300 px-4 py-2 
                            text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                            disabled:bg-gray-100 disabled:text-gray-500"
                        >
                          {SOCIAL_MEDIA_PLATFORMS.map(platform => (
                            <option 
                              key={platform} 
                              value={platform}
                              disabled={profile.socialMedia.some(
                                (sm, i) => sm.platform === platform && i !== index
                              )}
                            >
                              {platform}
                            </option>
                          ))}
                        </select>
                        <input
                          type="url"
                          value={social.url}
                          onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                          disabled={!isEditing}
                          placeholder={PLATFORM_PLACEHOLDERS[social.platform as keyof typeof PLATFORM_PLACEHOLDERS]}
                          className="flex-1 rounded-md border border-gray-300 px-4 py-2 
                            text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900
                            disabled:bg-gray-100 disabled:text-gray-500"
                        />
                        {isEditing && index > 0 && (
                          <Button
                            type="button"
                            onClick={() => handleRemoveSocialMedia(index)}
                            className="p-2 bg-gray-900 text-white hover:bg-gray-800 rounded-md"
                          >
                            <Cross2Icon className="h-5 w-5" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        type="button"
                        onClick={handleAddSocialMedia}
                        className="mt-4 w-full border-2 border-dashed border-gray-300 
                          bg-gray-50 hover:bg-gray-100 text-gray-800 hover:text-gray-900
                          hover:border-gray-400 transition-all duration-200"
                        disabled={profile.socialMedia.length >= SOCIAL_MEDIA_PLATFORMS.length}
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Social Media Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="shadow-sm border">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 
                            bg-gray-200 text-gray-800 rounded-full"
                        >
                          <span>{skill.name}</span>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill.name)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Cross2Icon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill (e.g., Angel Investing)"
                          className="flex-1 rounded-md border border-gray-300 px-4 py-2 
                            text-gray-900 bg-white focus:border-gray-900 focus:ring-gray-900"
                        />
                        <Button
                          type="button"
                          onClick={handleAddSkill}
                          className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full px-6 py-3"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-3"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </InvestorSidebar>
  );
};

export default InvestorProfilePage;