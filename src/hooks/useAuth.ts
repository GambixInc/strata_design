// src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signIn, 
  signUp, 
  signOut, 
  fetchUserAttributes, 
  fetchAuthSession,
  confirmSignUp,
  resendSignUpCode
} from 'aws-amplify/auth';
import ApiService from '../services/api';
import { handleCognitoError } from '../utils/errorHandler';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  // Don't automatically check authentication on mount
  // Only check when explicitly requested (like during login)

  const checkAuthStatus = useCallback(async () => {
    try {
      const session = await fetchAuthSession();
      
      if (session.tokens) {
        const attributes = await fetchUserAttributes();
        const groups = session.tokens.accessToken.payload["cognito:groups"] as string[] | undefined;
        
        const user: User = {
          id: attributes.sub || '',
          email: attributes.email || '',
          name: (attributes as any).name || attributes.email || '',
          role: groups?.[0] || 'user',
        };

        // Store user in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Store auth token for API calls
        const token = session.tokens.accessToken.toString();
        localStorage.setItem('authToken', token);

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        // Clear any stale data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      
      // Handle Cognito errors (including rate limiting)
      handleCognitoError(error);
      
      // If we get here, it's not a Cognito error, so just clear state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await signIn({ username: email, password });
      
      const [attributes, session] = await Promise.all([
        fetchUserAttributes(),
        fetchAuthSession(),
      ]);

      if (session.tokens) {
        const groups = session.tokens.accessToken.payload["cognito:groups"] as string[] | undefined;
        
        const user: User = {
          id: attributes.sub || '',
          email: attributes.email || '',
          name: (attributes as any).name || attributes.email || '',
          role: groups?.[0] || 'user',
        };

        // Store user and token
        localStorage.setItem('currentUser', JSON.stringify(user));
        const token = session.tokens.accessToken.toString();
        localStorage.setItem('authToken', token);

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true, user };
      } else {
        throw new Error('Sign in incomplete. Please complete any required steps (MFA/verification).');
      }
    } catch (error: any) {
      // Handle Cognito errors (including rate limiting)
      handleCognitoError(error);
      
      const errorMessage = error.message || 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true, message: 'Registration successful. Please check your email for verification.' };
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const confirmRegistration = useCallback(async (email: string, code: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true, message: 'Email confirmed successfully. You can now log in.' };
    } catch (error: any) {
      const errorMessage = error.message || 'Confirmation failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const resendConfirmationCode = useCallback(async (email: string) => {
    try {
      await resendSignUpCode({ username: email });
      return { success: true, message: 'Confirmation code resent successfully.' };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend confirmation code');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
      
      // Clear local storage
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigate]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    confirmRegistration,
    resendConfirmationCode,
    logout,
    clearError,
    checkAuthStatus,
  };
};
