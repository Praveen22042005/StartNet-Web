/**
 * API Configuration for StartNet
 * 
 * This file defines the API routes and helper functions for communicating with the backend.
 * For open source, we use environment variables to allow flexibility in deployment.
 */

import { Startup } from '@/types/startup';

// Use environment variable with fallback to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

/**
 * API route definitions
 * Centralized configuration of all API endpoints
 */
export const API_ROUTES = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    SIGNIN: `${API_BASE_URL}/auth/signin`,
    SIGNOUT: `${API_BASE_URL}/auth/signout`,
    UPDATE_PASSWORD: `${API_BASE_URL}/auth/password/update`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/password/forgot`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/password/reset`
  },
  
  PROFILE: {
    GET: `${API_BASE_URL}/profile`,
    UPDATE: `${API_BASE_URL}/profile`,
    DELETE: `${API_BASE_URL}/profile`,
    UPLOAD_PROFILE_PICTURE: `${API_BASE_URL}/profile/upload-profile-picture`
  },
  
  STARTUPS: {
    BASE: `${API_BASE_URL}/entrepreneur/startups`,
    DETAIL: (id: string) => `${API_BASE_URL}/entrepreneur/startups/${id}`,
    UPLOAD_LOGO: `${API_BASE_URL}/entrepreneur/upload-startup-logo`,
    UPLOAD_DOCUMENTS: `${API_BASE_URL}/entrepreneur/startups/upload-documents`,
    METRICS: (id: string) => `${API_BASE_URL}/entrepreneur/startups/${id}/metrics`
  },
  
  INVESTOR_PROFILE: {
    GET: `${API_BASE_URL}/investor/profile`,
    UPDATE: `${API_BASE_URL}/investor/profile`,
    UPLOAD_PROFILE_PICTURE: `${API_BASE_URL}/investor/profile/upload-profile-picture`,
    GET_ALL: `${API_BASE_URL}/investor/profile/all`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/investor/profile/${id}`
  },
  
  INVESTOR: {
    STARTUPS: {
      GET_ALL: `${API_BASE_URL}/investor/startups/all`,
      GET_BY_ID: (id: string) => `${API_BASE_URL}/investor/startups/${id}`,
      FAVORITE: (id: string) => `${API_BASE_URL}/investor/startups/${id}/favorite`,
      CONTACT: (id: string) => `${API_BASE_URL}/investor/startups/${id}/contact`
    },
    PORTFOLIO: {
      GET_ALL: `${API_BASE_URL}/investor/portfolio`,
      ADD: (startupId: string) => `${API_BASE_URL}/investor/portfolio/${startupId}`,
      REMOVE: (startupId: string) => `${API_BASE_URL}/investor/portfolio/${startupId}`
    },
    UPDATE_PASSWORD: `${API_BASE_URL}/investor/settings/update-password`,
    DELETE_ACCOUNT: `${API_BASE_URL}/investor/settings/delete-account`
  },
  
  ENTREPRENEUR: {
    DASHBOARD: `${API_BASE_URL}/entrepreneur/dashboard`,
    INVESTORS: {
      GET_ALL: `${API_BASE_URL}/entrepreneur/investors`,
      GET_BY_ID: (id: string) => `${API_BASE_URL}/entrepreneur/investors/${id}`
    },
    UPDATE_PASSWORD: `${API_BASE_URL}/entrepreneur/settings/update-password`,
    DELETE_ACCOUNT: `${API_BASE_URL}/entrepreneur/settings/delete-account`
  }
};

/**
 * Standard API response interface
 */
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  pagination?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

/**
 * Auth token management helpers
 */
export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },
  
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  },
  
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getAuthHeaders: (): HeadersInit => {
    const token = tokenStorage.get();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  }
};

/**
 * Error handler for API responses
 */
export const handleApiError = async (response: Response): Promise<never> => {
  // Try to parse error message from response
  let errorMessage = 'An unexpected error occurred';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
    
    // Handle session expiration
    if (response.status === 401 && errorData.isExpired) {
      tokenStorage.remove();
      errorMessage = 'Session expired. Please sign in again.';
    }
  } catch (e) {
    // If we can't parse the JSON, use status text
    errorMessage = response.statusText || errorMessage;
  }
  
  throw new Error(errorMessage);
};

/**
 * API functions for Startups
 */
export const startupApi = {
  // Get all startups for the logged-in entrepreneur
  fetchStartups: async (): Promise<Startup[]> => {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(API_ROUTES.STARTUPS.BASE, {
      headers: tokenStorage.getAuthHeaders()
    });

    if (!response.ok) {
      return handleApiError(response);
    }

    return response.json();
  },

  // Get startup by ID
  fetchStartup: async (id: string): Promise<Startup> => {
    const response = await fetch(API_ROUTES.STARTUPS.DETAIL(id), {
      headers: tokenStorage.getAuthHeaders()
    });
    
    if (!response.ok) {
      return handleApiError(response);
    }
    
    return response.json();
  },

  // Create new startup
  createStartup: async (data: Omit<Startup, '_id'>): Promise<Startup> => {
    try {
      const response = await fetch(API_ROUTES.STARTUPS.BASE, {
        method: 'POST',
        headers: tokenStorage.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return response.json();
    } catch (error) {
      console.error('Create startup error:', error);
      throw error;
    }
  },

  // Update startup
  updateStartup: async (id: string, startup: Startup): Promise<Startup> => {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('Authentication required. Please sign in.');
    }

    try {
      const response = await fetch(API_ROUTES.STARTUPS.DETAIL(id), {
        method: 'PUT',
        headers: tokenStorage.getAuthHeaders(),
        body: JSON.stringify({
          ...startup,
          user: undefined // Remove user reference to avoid circular references
        }),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Update error:', error);
      throw new Error(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete startup
  deleteStartup: async (id: string): Promise<ApiResponse<null>> => {
    const response = await fetch(API_ROUTES.STARTUPS.DETAIL(id), {
      method: 'DELETE',
      headers: tokenStorage.getAuthHeaders(),
    });
    
    if (!response.ok) {
      return handleApiError(response);
    }
    
    return response.json();
  },
  
  // Upload startup logo
  uploadLogo: async (startupId: string, file: File): Promise<{ logoUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('startupId', startupId);
    
    const response = await fetch(API_ROUTES.STARTUPS.UPLOAD_LOGO, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenStorage.get()}`
      },
      body: formData
    });
    
    if (!response.ok) {
      return handleApiError(response);
    }
    
    return response.json();
  }
};

// Export base URL for use in other files
export default API_BASE_URL;