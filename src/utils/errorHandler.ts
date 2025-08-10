// src/utils/errorHandler.ts

// Utility function to redirect to error page with proper error details
export const redirectToError = (errorType: 'auth' | 'network' | 'server' | 'unknown', message?: string) => {
  // Clear any stored auth data to prevent loops
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  
  // Build error URL
  const errorUrl = `/error?type=${errorType}${message ? `&message=${encodeURIComponent(message)}` : ''}`;
  
  // Use window.location.href for hard redirect to prevent React Router issues
  window.location.href = errorUrl;
};

// Check if error is a rate limiting error
export const isRateLimitError = (error: any): boolean => {
  return error.name === 'TooManyRequestsException' || 
         error.message?.includes('Rate exceeded') ||
         error.message?.includes('TooManyRequests') ||
         error.message?.includes('429');
};

// Check if error is an authentication error
export const isAuthError = (error: any): boolean => {
  return error.name === 'NotAuthorizedException' ||
         error.message?.includes('Authentication required') ||
         error.message?.includes('Token expired') ||
         error.message?.includes('Invalid or expired token');
};

// Handle AWS Cognito errors specifically
export const handleCognitoError = (error: any) => {
  // Special case: "user is already signed in" is actually a success
  if (error.message?.includes('There is already a signed in user') ||
      error.message?.includes('already signed in') ||
      error.name === 'AlreadySignedInException') {
    // This is actually a success - user is authenticated
    // Redirect to dashboard instead of error page
    window.location.href = '/dashboard';
    return;
  }
  
  if (isRateLimitError(error)) {
    redirectToError('auth', 'Rate limit exceeded. Please try again later.');
    return;
  }
  
  if (isAuthError(error)) {
    redirectToError('auth', 'Authentication failed. Please log in again.');
    return;
  }
  
  // For other Cognito errors, redirect to generic auth error
  redirectToError('auth', error.message || 'Authentication error occurred.');
};
