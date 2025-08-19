# Strata Design - Frontend Application

A React-based web application for website analysis and optimization using a unified AWS Lambda API for all operations.

## What's Working

- ✅ User authentication and authorization
- ✅ Protected routes and navigation
- ✅ Dashboard with project overview
- ✅ Project creation and management using unified Lambda API
- ✅ Website scraping via Lambda functions
- ✅ Project persistence via Lambda API (DynamoDB)
- ✅ Responsive design and modern UI

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# AWS Amplify Configuration
VITE_AWS_USER_POOLS_ID=your-user-pool-id
VITE_AWS_USER_POOLS_WEB_CLIENT_ID=your-client-id
VITE_AWS_REGION=us-east-1

# Unified Lambda Function URL for All Operations
VITE_CRAWLER_FUNC_URL=https://your-lambda-function-url.lambda-url.us-east-1.on.aws/

# Optional: Analytics and Debug
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true
```

## Unified Lambda API Architecture

The application uses a single Lambda function for all operations:

### **Lambda Function** - For All Operations
- **Purpose**: Website scraping, project creation, project retrieval, and data persistence
- **Environment Variable**: `VITE_CRAWLER_FUNC_URL`
- **Usage**: Single endpoint for all project operations

### **API Modes:**
1. **Create New Scrape** - When `url` and `user_id` are provided
2. **Get User Projects** - When only `user_id` is provided

## Lambda Integration Setup

The frontend integrates with a unified AWS Lambda API that handles:

1. **Environment Variable**: Set `VITE_CRAWLER_FUNC_URL` to your Lambda function URL
2. **Dual-Mode API**: Automatically detects whether to scrape or retrieve projects
3. **Data Persistence**: Automatically saves scraped data to DynamoDB
4. **Project Management**: Retrieves user projects from DynamoDB

### Expected Lambda Response Formats:

**Mode 1: Create New Scrape Response**
```json
[
  {
    "url": "https://example.com",
    "title": "Example Website",
    "content": "Website content...",
    "project_id": "proj_1755608050_30e172ad",
    "saved_to_dynamodb": true,
    "scraped_at": 1755608050,
    "curl_info": {
      "status_code": 200,
      "response_time_ms": 245.67
    },
    "framework_detection": {
      "bootstrap": true,
      "wordpress": false
    }
  }
]
```

**Mode 2: Get User Projects Response**
```json
{
  "mode": "retrieve",
  "user_id": "user123",
  "projects": [
    {
      "user_id": "user123",
      "project_id": "proj_1755608050_30e172ad",
      "url": "https://example.com",
      "scraped_at": 1755608050,
      "status": "success",
      "scrape_data": {
        "url": "https://example.com",
        "title": "Example Website",
        "content": "Website content...",
        "curl_info": {
          "status_code": 200,
          "response_time_ms": 245.67
        }
      }
    }
  ],
  "count": 1
}
```

## How It Works

### **Project Creation Flow:**
1. User enters a website URL in the Create Project modal
2. Frontend calls Lambda with `url` and `user_id` parameters
3. Lambda scrapes the website and automatically saves to DynamoDB
4. Lambda returns scrape results with `project_id` and `saved_to_dynamodb` flag
5. Frontend redirects to dashboard to show the new project

### **Dashboard Data:**
- Projects are loaded by calling Lambda with only `user_id`
- Lambda retrieves all user projects from DynamoDB
- Dashboard metrics are calculated from the retrieved project data

### **Data Persistence:**
- All project data is automatically saved to DynamoDB by the Lambda function
- Data persists across all devices and sessions
- Real-time synchronization between users

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
├── hooks/              # Custom React hooks
├── services/           # Unified Lambda API integrations
├── utils/              # Utility functions
├── App.tsx            # Main application component
├── Home.tsx           # Dashboard page
├── LambdaResults.tsx  # Lambda scraping results page
└── main.tsx           # Application entry point
```

## Troubleshooting

### Lambda CORS Issues
If you encounter CORS errors when calling the Lambda function:

1. **Check Lambda CORS Configuration**:
   - Ensure your Lambda function returns proper CORS headers
   - Add `Access-Control-Allow-Origin: *` to Lambda response headers
   - Include `Access-Control-Allow-Methods: GET, POST, OPTIONS`

2. **Frontend Debugging**:
   - Check browser console for specific error messages
   - Verify environment variables are set correctly
   - Ensure the Lambda URL is accessible

### Environment Variables
- All environment variables must be prefixed with `VITE_` for Vite to expose them
- Restart the development server after changing environment variables
- Check the browser console for "not configured" errors

### API Usage
- **To scrape a website**: Send `url` + `user_id` to Lambda
- **To get user projects**: Send only `user_id` to Lambda
- **user_id is always required** for all operations

## Features

- **Website Analysis**: Scrape and analyze website data using Lambda functions
- **Project Management**: Create, view, and manage website projects via unified Lambda API
- **Dashboard**: Overview of project health and performance metrics
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: Secure user authentication with AWS Cognito
- **Data Persistence**: Real-time data storage and retrieval via Lambda API (DynamoDB)
- **Unified API**: Single Lambda endpoint for all operations
