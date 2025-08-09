import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App.tsx';
import './index.css';
import { config, validateEnvironment } from './config/environment';

// Validate environment variables
validateEnvironment();

// Configure AWS Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.aws.userPoolId as string,
      userPoolClientId: config.aws.userPoolClientId as string,
      // Optionally align with your pool's sign-in aliases
      // loginWith: { email: true },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
