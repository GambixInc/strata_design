import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ErrorPage.css';

interface ErrorPageProps {
  errorType?: 'auth' | 'network' | 'server' | 'unknown';
  errorMessage?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  errorType = 'unknown', 
  errorMessage 
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get error details from URL params or props
  const urlErrorType = searchParams.get('type') as ErrorPageProps['errorType'];
  const urlErrorMessage = searchParams.get('message');
  
  const finalErrorType = errorType || urlErrorType || 'unknown';
  const finalErrorMessage = errorMessage || urlErrorMessage || 'An unexpected error occurred';

  const getErrorDetails = () => {
    switch (finalErrorType) {
      case 'auth':
        return {
          title: 'Authentication Error',
          icon: 'fas fa-lock',
          description: 'There was an issue with your authentication. This could be due to rate limiting or service issues.',
          suggestions: [
            'Wait a few minutes and try again',
            'Clear your browser cache and cookies',
            'Contact support if the issue persists'
          ]
        };
      case 'network':
        return {
          title: 'Network Error',
          icon: 'fas fa-wifi',
          description: 'Unable to connect to our services. Please check your internet connection.',
          suggestions: [
            'Check your internet connection',
            'Try refreshing the page',
            'Contact support if the issue persists'
          ]
        };
      case 'server':
        return {
          title: 'Server Error',
          icon: 'fas fa-server',
          description: 'Our servers are experiencing issues. We\'re working to resolve this.',
          suggestions: [
            'Try again in a few minutes',
            'Check our status page for updates',
            'Contact support if the issue persists'
          ]
        };
      default:
        return {
          title: 'Unexpected Error',
          icon: 'fas fa-exclamation-triangle',
          description: 'Something went wrong. We\'re sorry for the inconvenience.',
          suggestions: [
            'Try refreshing the page',
            'Clear your browser cache',
            'Contact support if the issue persists'
          ]
        };
    }
  };

  const errorDetails = getErrorDetails();

  const handleRetry = () => {
    // Clear any stored auth data to prevent loops
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Navigate back to login
    navigate('/login', { replace: true });
  };

  const handleGoHome = () => {
    // Clear any stored auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Navigate to landing page
    navigate('/', { replace: true });
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <i className={errorDetails.icon}></i>
        </div>
        
        <h1 className="error-title">{errorDetails.title}</h1>
        
        <p className="error-description">{errorDetails.description}</p>
        
        {finalErrorMessage && finalErrorMessage !== 'An unexpected error occurred' && (
          <div className="error-details">
            <p className="error-message">{finalErrorMessage}</p>
          </div>
        )}
        
        <div className="error-suggestions">
          <h3>What you can try:</h3>
          <ul>
            {errorDetails.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
        
        <div className="error-actions">
          <button onClick={handleRetry} className="btn-primary">
            <i className="fas fa-redo"></i>
            Try Again
          </button>
          <button onClick={handleGoHome} className="btn-secondary">
            <i className="fas fa-home"></i>
            Go to Home
          </button>
        </div>
        
        <div className="error-support">
          <p>Need help? <a href="mailto:support@strata.com">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
