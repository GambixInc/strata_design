// src/services/api.ts

import { redirectToError } from '../utils/errorHandler';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Error class for better error handling
export class ApiError extends Error {
  public status?: number;
  public data?: any;
  
  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Base API configuration
const getApiBaseUrl = (): string => {
  // Use the environment variable for the backend URL
  // This should point to your EC2 instance, e.g., http://your-ec2-ip:8080/api
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
};

const API_BASE_URL = getApiBaseUrl();

// Check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    // Decode the JWT token (without verification since we're just checking expiration)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired (with 5 minute buffer)
    return payload.exp < (currentTime + 300);
  } catch (error) {
    // If we can't decode the token, consider it expired
    return true;
  }
};

// Default headers for API requests
const getDefaultHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authentication token if available and not expired
  const token = localStorage.getItem('authToken');
  if (token && !isTokenExpired(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (token && isTokenExpired(token)) {
    // Clear expired token but don't redirect - let the auth system handle it
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  return headers;
};

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: getDefaultHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-2xx responses
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }
      
      // Handle authentication errors (401, 403)
      if (response.status === 401 || response.status === 403) {
        redirectToError('auth', 'Authentication required. Please log in again.');
        throw new ApiError('Authentication required. Please log in again.', response.status);
      }
      
      // Handle backend unavailable (404, 502, 503, 504)
      if (response.status === 404 || response.status === 502 || response.status === 503 || response.status === 504) {
        console.warn(`Backend endpoint not available: ${url}`);
        throw new ApiError('Backend service unavailable', response.status);
      }
      
      throw new ApiError(errorMessage, response.status);
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors (no backend available)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error - backend may not be available:', error.message);
      throw new ApiError('Backend service unavailable - network error', 0);
    }
    
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

// API service class with typed methods
export class ApiService {
  // Authentication endpoints
  static async login(credentials: { email: string; password: string }) {
    return apiRequest<ApiResponse<{ token: string; user: any }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async register(userData: { email: string; password: string; name: string }) {
    return apiRequest<ApiResponse<{ token: string; user: any }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async logout() {
    return apiRequest<ApiResponse>('/auth/logout', {
      method: 'POST',
    });
  }

  // User profile endpoints
  static async getUserProfile() {
    return apiRequest<ApiResponse<any>>('/user/profile');
  }

  static async updateUserProfile(profileData: any) {
    return apiRequest<ApiResponse<any>>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Project endpoints
  static async getProjects() {
    return apiRequest<ApiResponse<any[]>>('/projects');
  }

  static async createProject(projectData: { websiteUrl: string; category: string; description: string }) {
    return apiRequest<ApiResponse<any>>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  static async getProject(projectId: string) {
    return apiRequest<ApiResponse<any>>(`/projects/${projectId}`);
  }

  static async updateProject(projectId: string, projectData: any) {
    return apiRequest<ApiResponse<any>>(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  static async deleteProject(projectId: string) {
    return apiRequest<ApiResponse>(`/gambix/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Scraping endpoints
  static async scrapeWebsite(url: string) {
    return apiRequest<ApiResponse<any>>('/scrape', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }

  static async optimizeWebsite(url: string, userProfile: string) {
    return apiRequest<ApiResponse<any>>('/optimize', {
      method: 'POST',
      body: JSON.stringify({ url, user_profile: userProfile }),
    });
  }

  static async getFiles() {
    return apiRequest<ApiResponse<any>>('/files');
  }

  // Analytics and SEO endpoints
  static async getSiteAnalytics(siteId: string) {
    return apiRequest<ApiResponse<any>>(`/analytics/site/${siteId}`);
  }

  static async getSeoMetrics(siteId: string) {
    return apiRequest<ApiResponse<any>>(`/seo/metrics/${siteId}`);
  }

  static async getRecommendations(siteId: string) {
    return apiRequest<ApiResponse<any[]>>(`/recommendations/${siteId}`);
  }

  // Dashboard endpoints
  static async getDashboardData() {
    return apiRequest<ApiResponse<any>>('/dashboard');
  }

  static async getSiteHealth(siteId: string) {
    return apiRequest<ApiResponse<any>>(`/health/${siteId}`);
  }

  // Project Results endpoint - combines multiple backend endpoints
  static async getProjectResults(projectId: string) {
    try {
      // Get project details, pages, recommendations, and health data
      const [projectResponse, pagesResponse, recommendationsResponse, healthResponse] = await Promise.allSettled([
        apiRequest<ApiResponse<any>>(`/gambix/projects/${projectId}`),
        apiRequest<ApiResponse<any>>(`/gambix/projects/${projectId}/pages`),
        apiRequest<ApiResponse<any>>(`/gambix/projects/${projectId}/recommendations`),
        apiRequest<ApiResponse<any>>(`/gambix/projects/${projectId}/health`)
      ]);

      // Extract successful responses
      const project = projectResponse.status === 'fulfilled' ? projectResponse.value : null;
      const pages = pagesResponse.status === 'fulfilled' ? pagesResponse.value : null;
      const recommendations = recommendationsResponse.status === 'fulfilled' ? recommendationsResponse.value : null;
      const health = healthResponse.status === 'fulfilled' ? healthResponse.value : null;

      // Check if we at least have the basic project info
      if (!project || !project.success) {
        throw new ApiError('Project not found', 404);
      }

      // Combine all the data into a single response
      const projectData = {
        project: project.data,
        pages: pages?.data?.pages || [],
        recommendations: recommendations?.data?.recommendations || [],
        health: health?.data?.health_data || null
      };

      return {
        success: true,
        data: projectData
      };
    } catch (error) {
      // If any of the endpoints fail, return a basic project structure
      console.warn('Some project data endpoints failed, returning basic structure:', error);
      
      // Try to get at least the basic project info
      try {
        const projectResponse = await apiRequest<ApiResponse<any>>(`/gambix/projects/${projectId}`);
        return {
          success: true,
          data: {
            project: projectResponse.data,
            pages: [],
            recommendations: [],
            health: null
          }
        };
      } catch (fallbackError) {
        throw new ApiError('Failed to fetch project data', 500);
      }
    }
  }
}

// Utility function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

import React from 'react';

// Hook for making API calls with loading and error states
export const useApiCall = <T, P extends any[]>(
  apiFunction: (...args: P) => Promise<T>
) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const execute = React.useCallback(async (...args: P) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, execute };
};

export default ApiService;
