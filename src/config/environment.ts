// src/config/environment.ts

// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },
  
  // AWS Amplify Configuration
  aws: {
    userPoolId: import.meta.env.VITE_AWS_USER_POOLS_ID,
    userPoolClientId: import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID,
    region: import.meta.env.VITE_AWS_REGION,
  },
  
  // App Configuration
  app: {
    name: 'Strata Design',
    version: '1.0.0',
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
  
  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  },
} as const;

// Type-safe environment variables
export type Config = typeof config;

// Helper function to validate required environment variables
export const validateEnvironment = (): void => {
  const requiredVars = [
    'VITE_AWS_USER_POOLS_ID',
    'VITE_AWS_USER_POOLS_WEB_CLIENT_ID', 
    'VITE_AWS_REGION'
  ];
  
  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    console.error('Please check your .env file and ensure all required variables are set.');
  }
};

export default config;
