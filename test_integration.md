# Frontend-Backend Integration Test Guide

## Overview
This guide helps you test the integration between the frontend and backend to ensure real data is being displayed instead of dummy data.

## Prerequisites
1. Backend server running on `http://localhost:8080`
2. Frontend running on `http://localhost:5173` (or your configured port)
3. User authenticated via AWS Cognito

## Test Steps

### 1. Authentication Test
- [ ] Navigate to the frontend application
- [ ] Verify you can log in with AWS Cognito
- [ ] Check that the authentication token is stored in localStorage

### 2. Dashboard Data Test
- [ ] After login, navigate to the dashboard
- [ ] Check for loading spinner while data loads
- [ ] Verify projects are loaded from backend (not dummy data)
- [ ] Check that dashboard shows real project count and health scores

### 3. Project Management Test
- [ ] Click "New Project" button
- [ ] Fill in project details (URL, category, description)
- [ ] Submit the form
- [ ] Verify project is created and appears in the list
- [ ] Check that project data matches what you entered

### 4. User Profile Test
- [ ] Navigate to Account page
- [ ] Verify profile loads from backend
- [ ] Make changes to profile information
- [ ] Save changes
- [ ] Verify changes are persisted

### 5. Error Handling Test
- [ ] Temporarily stop the backend server
- [ ] Try to load dashboard or profile
- [ ] Verify error message is displayed
- [ ] Restart backend and verify data loads again

## Expected Behavior

### Loading States
- Loading spinner should appear while fetching data
- "Loading your projects..." message should be shown

### Error States
- Error messages should be displayed if API calls fail
- Retry button should be available
- User-friendly error messages should be shown

### Data Display
- Projects should show real URLs, health scores, and status
- Dashboard should show actual project counts
- User profile should display real user information

### Real-time Updates
- New projects should appear immediately after creation
- Profile changes should be reflected immediately after saving

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check that backend CORS is configured for frontend URL
   - Verify backend is running on correct port

2. **Authentication Errors**
   - Check that Cognito token is valid
   - Verify token is included in API requests

3. **Data Not Loading**
   - Check browser network tab for failed requests
   - Verify backend endpoints are responding correctly
   - Check backend logs for errors

4. **Projects Not Creating**
   - Verify user exists in backend database
   - Check backend logs for validation errors
   - Ensure all required fields are provided

## API Endpoints to Verify

- `GET /api/user/profile` - User profile data
- `GET /api/projects` - User's projects
- `POST /api/projects` - Create new project
- `PUT /api/user/profile` - Update user profile
- `GET /api/dashboard` - Dashboard data

## Success Criteria

✅ Frontend displays real data from backend
✅ Loading states work correctly
✅ Error handling works properly
✅ Project creation works end-to-end
✅ User profile management works
✅ No dummy/mock data is displayed
✅ Authentication flow works with AWS Cognito
