// src/utils/auth.ts

// Check if user is authenticated and token is valid
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('currentUser');
  
  if (!token || !user) {
    return false;
  }
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired (with 5 minute buffer)
    if (payload.exp < (currentTime + 300)) {
      // Clear expired data
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return false;
    }
    
    return true;
  } catch (error) {
    // If we can't decode the token, consider it invalid
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    return false;
  }
};

// Clear authentication data and redirect to login
export const clearAuthAndRedirect = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Get auth token
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (token && isAuthenticated()) {
    return token;
  }
  return null;
};
