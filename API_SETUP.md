# API Configuration Guide

This guide explains how to configure the frontend to communicate with your backend API.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# AWS Amplify Configuration (Required)
VITE_AWS_USER_POOLS_ID=us-east-1_XXXXXXXXX
VITE_AWS_USER_POOLS_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_AWS_REGION=us-east-1

# API Configuration (Optional - defaults to /api)
VITE_API_BASE_URL=/api
VITE_API_TIMEOUT=30000

# Feature Flags (Optional)
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=false
```

## Backend API Setup

The frontend is configured to proxy API requests to your backend server:

- **Development**: Requests to `/api/*` are proxied to `http://localhost:8080`
- **Production**: Update the `VITE_API_BASE_URL` to point to your production API

## API Service Usage

### Basic Usage

```typescript
import ApiService from './services/api';

// Make API calls
const response = await ApiService.getProjects();
if (response.success) {
  console.log(response.data);
}
```

### Using the useApiCall Hook

```typescript
import { useApiCall } from './services/api';

function MyComponent() {
  const { data, loading, error, execute } = useApiCall(ApiService.getProjects);

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

## Available API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Scraping & Optimization
- `POST /api/scrape` - Scrape website
- `POST /api/optimize` - Optimize website
- `GET /api/files` - Get scraped files

### Analytics & SEO
- `GET /api/analytics/site/:id` - Get site analytics
- `GET /api/seo/metrics/:id` - Get SEO metrics
- `GET /api/recommendations/:id` - Get recommendations
- `GET /api/health/:id` - Get site health

### Dashboard
- `GET /api/dashboard` - Get dashboard data

## Error Handling

The API service includes comprehensive error handling:

```typescript
import { handleApiError } from './services/api';

try {
  const response = await ApiService.getProjects();
} catch (error) {
  const errorMessage = handleApiError(error);
  console.error(errorMessage);
}
```

## Authentication

The API service automatically includes authentication tokens in requests:

1. Store the token in localStorage as `authToken`
2. The service will automatically include it in the `Authorization` header
3. For AWS Cognito, you can extract the token from the auth session

## Development vs Production

### Development
- Uses Vite proxy to forward `/api` requests to `http://localhost:8080`
- No CORS issues during development
- Environment variables from `.env.local`

### Production
- Update `VITE_API_BASE_URL` to your production API URL
- Ensure CORS is properly configured on your backend
- Use environment-specific `.env` files

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **404 Errors**: Check that your backend endpoints match the expected paths
3. **Authentication Errors**: Verify that tokens are properly stored and included
4. **Proxy Issues**: Ensure your backend is running on the correct port (8080)

### Debug Mode

Enable debug mode to see detailed API request/response logs:

```bash
VITE_DEBUG_MODE=true
```

## Backend Requirements

Your backend should:

1. Accept requests on the configured endpoints
2. Return responses in the expected format:
   ```json
   {
     "success": true,
     "data": { ... },
     "message": "Optional message"
   }
   ```
3. Handle CORS properly
4. Implement proper authentication/authorization
5. Return appropriate HTTP status codes
