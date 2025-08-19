// src/services/api.ts

import { redirectToError } from '../utils/errorHandler';
import { config } from '../config/environment';

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

// Lambda URL configuration
const getLambdaUrl = (): string => {
  return config.lambda?.url || 'https://your-lambda-url.lambda-url.us-east-1.on.aws/';
};

const LAMBDA_URL = getLambdaUrl();

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

// Generic Lambda request function
async function lambdaRequest<T>(
  params: Record<string, any> = {},
  method: 'GET' | 'POST' = 'POST'
): Promise<T> {
  if (!config.lambda.url || config.lambda.url === 'https://your-lambda-url.lambda-url.us-east-1.on.aws/') {
    throw new ApiError('Lambda URL not configured. Please set VITE_CRAWLER_FUNC_URL in your .env file.', 500);
  }

  let url = LAMBDA_URL;
  let body: string | undefined;

  if (method === 'GET') {
    // For GET requests, add parameters to URL
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    url += `?${searchParams.toString()}`;
  } else {
    // For POST requests, send parameters in body
    body = JSON.stringify(params);
  }

  console.log('Lambda Request:', {
    url,
    method,
    params,
    body
  });

  const requestConfig: RequestInit = {
    method,
    headers: {
      ...getDefaultHeaders(),
      'Accept': 'application/json',
      'Origin': window.location.origin,
    },
    mode: 'cors',
    credentials: 'omit',
  };

  if (body) {
    requestConfig.body = body;
  }

  try {
    const response = await fetch(url, requestConfig);
    
    console.log('Lambda Response:', {
      url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
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
        console.warn(`Lambda endpoint not available: ${url}`);
        throw new ApiError('Lambda service unavailable', response.status);
      }
      
      throw new ApiError(errorMessage, response.status);
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lambda Request Error:', {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof TypeError ? 'TypeError' : 'Other'
    });
    
    // Handle network errors (no lambda available)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn('Network error - lambda may not be available:', error.message);
      throw new ApiError('Lambda service unavailable - network error', 0);
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
    return lambdaRequest<ApiResponse<{ token: string; user: any }>>({
      ...credentials,
      action: 'login'
    });
  }

  static async register(userData: { email: string; password: string; name: string }) {
    return lambdaRequest<ApiResponse<{ token: string; user: any }>>({
      ...userData,
      action: 'register'
    });
  }

  static async logout() {
    return lambdaRequest<ApiResponse>({
      action: 'logout'
    });
  }

  // User profile endpoints
  static async getUserProfile() {
    return lambdaRequest<ApiResponse<any>>({
      action: 'getUserProfile'
    });
  }

  static async updateUserProfile(profileData: any) {
    return lambdaRequest<ApiResponse<any>>({
      ...profileData,
      action: 'updateUserProfile'
    });
  }

  // Project endpoints - Using Lambda for all project operations
  static async getProjects(userId: string = 'default_user') {
    try {
      const response = await lambdaRequest<{ mode: string; user_id: string; projects: any[]; count: number }>({
        user_id: userId
      });
      
      console.log('Projects fetched from Lambda:', response);
      
      return {
        success: true,
        data: response.projects || []
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
    }
  }

  static async createProject(projectData: {
    websiteUrl: string;
    category?: string;
    description?: string;
    userId?: string;
  }) {
    try {
      console.log('Creating project with Lambda:', projectData);
      
      // Call Lambda to scrape and save project
      const response = await lambdaRequest<any[]>([
        {
          url: projectData.websiteUrl,
          user_id: projectData.userId || 'default_user',
          retries: 3
        }
      ]);
      
      console.log('Project created via Lambda:', response);
      
      // The Lambda returns an array with one object containing the scrape results
      const scrapeResult = response[0];
      
      if (!scrapeResult || !scrapeResult.saved_to_dynamodb) {
        throw new ApiError('Failed to save project to database', 500);
      }
      
      return {
        success: true,
        data: scrapeResult
      };
    } catch (error) {
      console.error('Error creating project:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
    }
  }

  // Legacy method for backward compatibility - now uses the new unified API
  static async callLambdaScraper(url: string, userId: string = 'default_user') {
    return this.createProject({
      websiteUrl: url,
      userId: userId
    });
  }

  static async getProject(projectId: string, userId: string = 'default_user') {
    try {
      // Get all projects and find the specific one
      const projectsResponse = await this.getProjects(userId);
      
      if (!projectsResponse.success) {
        throw new ApiError('Failed to fetch projects', 500);
      }
      
      const project = projectsResponse.data.find((p: any) => p.project_id === projectId);
      
      if (!project) {
        throw new ApiError('Project not found', 404);
      }
      
      return {
        success: true,
        data: project
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch project: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
    }
  }

  static async updateProject(projectId: string, projectData: any, userId: string = 'default_user') {
    // Note: The Lambda API doesn't support updating projects directly
    // This would need to be implemented on the backend if needed
    throw new ApiError('Project updates not supported in current API', 501);
  }

  static async deleteProject(projectId: string, userId: string = 'default_user') {
    // Note: The Lambda API doesn't support deleting projects directly
    // This would need to be implemented on the backend if needed
    throw new ApiError('Project deletion not supported in current API', 501);
  }

  // Analytics endpoints
  static async getAnalytics(siteId: string) {
    return lambdaRequest<ApiResponse<any>>({
      action: 'getAnalytics',
      siteId
    });
  }

  static async getSeoMetrics(siteId: string) {
    return lambdaRequest<ApiResponse<any>>({
      action: 'getSeoMetrics',
      siteId
    });
  }

  static async getRecommendations(siteId: string) {
    return lambdaRequest<ApiResponse<any[]>>({
      action: 'getRecommendations',
      siteId
    });
  }

  // Dashboard endpoints - Using Lambda data
  static async getDashboardData(userId: string = 'default_user') {
    try {
      const projectsResponse = await this.getProjects(userId);
      
      if (!projectsResponse.success) {
        throw new ApiError('Failed to fetch projects for dashboard', 500);
      }
      
      const projects = projectsResponse.data || [];
      
      // Calculate dashboard metrics from projects
      const totalProjects = projects.length;
      const activeProjects = projects.filter((p: any) => p.status === 'success').length;
      const averageHealthScore = projects.length > 0 
        ? projects.reduce((sum: number, p: any) => {
            const score = p.scrape_data?.curl_info?.status_code === 200 ? 85 : 65;
            return sum + score;
          }, 0) / projects.length 
        : 0;
      
      const dashboardData = {
        total_projects: totalProjects,
        active_projects: activeProjects,
        average_health_score: Math.round(averageHealthScore),
        page_statuses: [
          { type: 'healthy', count: activeProjects, label: 'Healthy Pages' },
          { type: 'broken', count: 0, label: 'Broken Pages' },
          { type: 'issues', count: totalProjects - activeProjects, label: 'Have Issues' }
        ],
        performance_breakdown: [
          { title: 'Technical SEO', score: Math.round(averageHealthScore) },
          { title: 'Content & On-Page SEO', score: Math.round(averageHealthScore * 0.9) },
          { title: 'Performance & Core Web Vitals', score: Math.round(averageHealthScore * 0.8) },
          { title: 'Internal Linking & Site Architecture', score: Math.round(averageHealthScore * 0.85) },
          { title: 'Visual UX & Accessibility', score: Math.round(averageHealthScore * 0.75) },
          { title: 'Authority & Backlinks', score: Math.round(averageHealthScore * 0.7) }
        ]
      };
      
      return {
        success: true,
        data: dashboardData
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      return {
        success: true,
        data: {
          total_projects: 0,
          active_projects: 0,
          average_health_score: 0,
          page_statuses: [
            { type: 'healthy', count: 0, label: 'Healthy Pages' },
            { type: 'broken', count: 0, label: 'Broken Pages' },
            { type: 'issues', count: 0, label: 'Have Issues' }
          ],
          performance_breakdown: [
            { title: 'Technical SEO', score: 0 },
            { title: 'Content & On-Page SEO', score: 0 },
            { title: 'Performance & Core Web Vitals', score: 0 },
            { title: 'Internal Linking & Site Architecture', score: 0 },
            { title: 'Visual UX & Accessibility', score: 0 },
            { title: 'Authority & Backlinks', score: 0 }
          ]
        }
      };
    }
  }

  static async getSiteHealth(siteId: string) {
    return lambdaRequest<ApiResponse<any>>({
      action: 'getSiteHealth',
      siteId
    });
  }

  // Project Results endpoint - gets scraped data from Lambda
  static async getProjectResults(projectId: string, userId: string = 'default_user') {
    try {
      // Get project details from Lambda
      const projectResponse = await this.getProject(projectId, userId);
      
      if (!projectResponse.success) {
        throw new ApiError('Project not found', 404);
      }

      const project = projectResponse.data;

      // Return project with scraped data
      const projectData = {
        project: project,
        scrapedData: project.scrape_data || { has_scraped_data: false }
      };

      console.log('Project results fetched from Lambda:', projectData);

      return {
        success: true,
        data: projectData
      };
    } catch (error) {
      console.warn('Error fetching project data:', error);
      throw new ApiError('Failed to fetch project data', 500);
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
