import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import App from './App.tsx';
import './index.css';

// Read env vars once to avoid typos and to validate presence
const userPoolId = import.meta.env.VITE_AWS_USER_POOLS_ID as string | undefined;
const userPoolClientId = import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID as string | undefined;
const region = import.meta.env.VITE_AWS_REGION as string | undefined;

if (!userPoolId || !userPoolClientId || !region) {
  // Surface clear guidance in the console if configuration is missing
  // These must be defined in a Vite env file (e.g., .env.local) and the dev server restarted
  // Example:
  // VITE_AWS_USER_POOLS_ID=us-east-1_XXXXXXXXX
  // VITE_AWS_USER_POOLS_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
  // VITE_AWS_REGION=us-east-1
  // eslint-disable-next-line no-console
  console.error('Amplify Auth is not fully configured. Missing values:', {
    VITE_AWS_USER_POOLS_ID: Boolean(userPoolId),
    VITE_AWS_USER_POOLS_WEB_CLIENT_ID: Boolean(userPoolClientId),
    VITE_AWS_REGION: Boolean(region),
  });
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: userPoolId as string,
      userPoolClientId: userPoolClientId as string
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
