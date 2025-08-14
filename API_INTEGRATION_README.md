# API Integration Setup

This document explains how the login page has been integrated with the backend API.

## What's Been Added

### 1. API Service (`src/services/api.js`)

- Centralized API client for all backend communication
- Handles authentication tokens automatically
- Supports both localStorage and sessionStorage for token persistence
- Built-in error handling and response validation

### 2. Authentication Context (`src/contexts/AuthContext.js`)

- React Context for managing authentication state
- Provides login, register, logout, and profile management functions
- Handles token storage and user session management
- Automatic authentication checks on app load

### 3. Protected Route Component (`src/components/ProtectedRoute.js`)

- Component for protecting routes that require authentication
- Automatically redirects unauthenticated users to login
- Supports role-based access control
- Shows loading state during authentication checks

### 4. Updated Login Page (`src/app/login/page.js`)

- Integrated with backend API endpoints
- Real authentication instead of mock data
- Proper error handling from backend responses
- Remember me functionality
- Role-based registration with proper validation

## Environment Configuration

Create a `.env.local` file in the client directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Environment
NODE_ENV=development
```

## Backend Requirements

Make sure your backend server is running on port 5000 with the following endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/logout` - User logout (protected)

## How to Use

### 1. Start the Backend Server

```bash
cd server
npm install
npm start
```

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Test the Integration

- Navigate to `/login`
- Try logging in with valid credentials
- Try registering a new user
- Check that authentication state persists across page refreshes

## Features

- **Real-time Authentication**: No more mock data, real backend integration
- **Token Management**: Automatic JWT token handling
- **Role-based Access**: Different registration flows for students, admins, and reviewers
- **Error Handling**: Proper error messages from backend
- **Session Persistence**: Remember me functionality
- **Protected Routes**: Automatic authentication checks
- **Loading States**: Better user experience during API calls

## Security Features

- JWT token-based authentication
- Automatic token inclusion in API requests
- Secure token storage (localStorage/sessionStorage)
- Role-based access control
- Input validation and sanitization

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend has CORS configured for `http://localhost:3000`
2. **API Connection Failed**: Verify the backend is running on port 5000
3. **Token Not Persisting**: Check browser storage settings
4. **Role Mismatch**: Ensure the selected role matches the user's actual role in the database

### Debug Steps

1. Check browser console for API errors
2. Verify backend server is running and accessible
3. Check network tab for failed requests
4. Verify environment variables are set correctly
5. Check MongoDB connection in backend

## Next Steps

After successful integration:

1. Add logout functionality to protected pages
2. Implement user profile management
3. Add password reset functionality
4. Implement session timeout handling
5. Add multi-factor authentication if required
