"use client";

import React, { useState, useEffect } from 'react';
import InvestorSidebar from '@/app/sidebar/investor/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { API_ROUTES } from '@/config/api';
import { useRouter } from 'next/navigation';
import { InfoCircledIcon, ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password strength levels
 */
type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

/**
 * InvestorSettingsPage Component
 * Allows investors to manage account settings including password and account deletion
 */
const InvestorSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const router = useRouter();

  /**
   * Check password strength and update the strength indicator
   */
  useEffect(() => {
    if (!passwordForm.newPassword) {
      setPasswordStrength('weak');
      return;
    }

    let score = 0;
    
    // Length check
    if (passwordForm.newPassword.length >= 8) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(passwordForm.newPassword)) score += 1;
    if (/[0-9]/.test(passwordForm.newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordForm.newPassword)) score += 1;
    
    // Set strength level based on score
    if (score === 1) setPasswordStrength('weak');
    else if (score === 2) setPasswordStrength('fair');
    else if (score === 3) setPasswordStrength('good');
    else if (score >= 4) setPasswordStrength('strong');
  }, [passwordForm.newPassword]);

  /**
   * Handle password form input changes
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Get color for password strength indicator
   */
  const getPasswordStrengthColor = (): string => {
    switch (passwordStrength) {
      case 'weak': return 'text-red-500 bg-red-50';
      case 'fair': return 'text-amber-500 bg-amber-50';
      case 'good': return 'text-blue-500 bg-blue-50';
      case 'strong': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  /**
   * Handle password update form submission
   */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!passwordForm.currentPassword.trim()) {
      toast.error('Current password is required');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please sign in again.');
        router.push('/auth/signin');
        return;
      }
      
      const response = await fetch(API_ROUTES.INVESTOR.UPDATE_PASSWORD, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password updated successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else if (response.status === 401 && data.isExpired) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please sign in again.');
        router.push('/auth/signin');
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset password form
   */
  const handleReset = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  /**
   * Handle account deletion
   */
  const handleDeleteAccount = async () => {
    // Check if confirmation text matches
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please sign in again.');
        router.push('/auth/signin');
        return;
      }
      
      const response = await fetch(API_ROUTES.INVESTOR.DELETE_ACCOUNT, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Clear local storage and redirect to home page
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Account deleted successfully');
        router.push('/');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <InvestorSidebar>
      <div className="container mx-auto p-4 md:p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Change Password Section */}
            <Card className="bg-white shadow-md border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircledIcon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Change Password
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-500">
                  Update your password regularly to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-5" aria-label="Change password form">
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 
                        text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      aria-required="true"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 
                        text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      aria-required="true"
                      aria-describedby="password-strength"
                    />
                    {passwordForm.newPassword && (
                      <div 
                        id="password-strength"
                        className={`flex items-center mt-2 px-3 py-1 rounded-md text-sm ${getPasswordStrengthColor()}`}
                      >
                        <span className="capitalize">{passwordStrength}</span> password
                      </div>
                    )}
                    <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc list-inside">
                      <li className={passwordForm.newPassword.length >= 8 ? 'text-green-600' : ''}>
                        At least 8 characters long
                      </li>
                      <li className={/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}>
                        Contains uppercase letters
                      </li>
                      <li className={/[0-9]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}>
                        Contains numbers
                      </li>
                      <li className={/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}>
                        Contains special characters
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 
                        text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      aria-required="true"
                    />
                    {passwordForm.newPassword && passwordForm.confirmPassword && (
                      <div className="mt-1">
                        {passwordForm.newPassword === passwordForm.confirmPassword ? (
                          <p className="text-green-600 text-sm flex items-center">
                            <CheckCircledIcon className="w-4 h-4 mr-1" />
                            Passwords match
                          </p>
                        ) : (
                          <p className="text-red-600 text-sm flex items-center">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            Passwords do not match
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      onClick={handleReset}
                      className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-indigo-600 text-white hover:bg-indigo-700"
                      disabled={isLoading}
                      aria-busy={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication Section */}
            <Card className="bg-white shadow-md border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <InfoCircledIcon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Two-Factor Authentication
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-500">
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-gray-600">
                    Two-factor authentication adds an extra layer of security to your account by requiring 
                    more than just a password to sign in.
                  </p>
                  <Button
                    className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700"
                    disabled={true}
                  >
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Session Management Section */}
            <Card className="bg-white shadow-md border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">Current Device</p>
                        <p className="text-sm text-gray-600">Web Browser • {new Date().toLocaleDateString()}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full text-red-600 bg-white border border-red-200 hover:bg-red-50"
                    disabled={true}
                  >
                    Sign Out From All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Delete Account Section */}
            <Card className="bg-white shadow-md border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Danger Zone
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800 mb-4">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle className="font-medium">Warning: Irreversible Action</AlertTitle>
                  <AlertDescription>
                    Deleting your account will permanently remove all your data, including investment history, 
                    portfolio information, and startup connections. This action cannot be undone.
                  </AlertDescription>
                </Alert>

                {!showDeleteDialog ? (
                  <Button
                    type="button"
                    onClick={() => setShowDeleteDialog(true)}
                    className="w-full bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-4 border border-red-300 rounded-md p-4 bg-red-50">
                    <p className="text-sm text-red-700 font-medium">
                      To confirm, please type "DELETE" in the box below:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="mt-1 block w-full rounded-md border border-red-300 bg-white px-3 py-2 
                        text-gray-900 focus:border-red-500 focus:ring-red-500"
                      aria-label="Confirmation text"
                    />
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => {
                          setShowDeleteDialog(false);
                          setDeleteConfirmation('');
                        }}
                        className="flex-1 bg-gray-100 text-gray-800 hover:bg-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== 'DELETE' || isLoading}
                        className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300"
                        aria-busy={isLoading}
                      >
                        {isLoading ? 'Processing...' : 'Confirm Delete'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </InvestorSidebar>
  );
};

export default InvestorSettingsPage;