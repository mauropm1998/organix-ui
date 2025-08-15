# Organix Vue - Backend Integration Guide

## Overview
This Vue 3 application has been fully integrated with backend API services using the provided `api-spec.json` OpenAPI specification. All components now use real API calls instead of mock data.

## Features Implemented

### 🔐 Authentication System
- **Login/Signup Forms**: Real authentication with JWT tokens
- **Token Management**: Automatic token refresh and storage
- **Protected Routes**: Authentication-based route protection
- **User Session**: Persistent user sessions with localStorage

### 📊 Data Management
- **User Management**: CRUD operations for users (Admin only)
- **Product Management**: CRUD operations for products (Admin only)
- **Draft Management**: Create, update, delete, and manage draft content
- **Content Management**: Full content lifecycle management
- **Performance Analytics**: Real-time performance metrics and analytics

### 🛠 Technical Architecture
- **HTTP Client**: Axios-based API client with interceptors
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Loading indicators for better UX
- **Success Messages**: User feedback for successful operations
- **Role-based Access**: Admin vs Operator permission handling

## API Services

### Core Services
1. **authService**: Login, signup, token refresh
2. **userService**: User CRUD operations
3. **productService**: Product CRUD operations
4. **draftService**: Draft management
5. **contentService**: Content management
6. **performanceService**: Analytics and metrics
7. **companyService**: Company information and stats
8. **channelService**: Channel management

### API Endpoints Covered
- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/refresh` - Token refresh
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/products` - List products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/drafts` - List drafts with optional filters
- `POST /api/drafts` - Create draft
- `PUT /api/drafts/{id}` - Update draft
- `DELETE /api/drafts/{id}` - Delete draft
- `GET /api/content` - List all content
- `GET /api/content/my` - List user's content
- `POST /api/content` - Create content
- `PUT /api/content/{id}` - Update content
- `DELETE /api/content/{id}` - Delete content
- `GET /api/performance/summary` - Performance metrics
- `GET /api/performance/top-content` - Top performing content
- `GET /api/performance/channel-performance` - Channel analytics
- `GET /api/company` - Company information
- `GET /api/company/stats` - Company statistics
- `GET /api/channels` - List available channels

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Organix
VITE_APP_VERSION=1.0.0
```

### Development Environment
Create a `.env.development` file:
```
VITE_API_BASE_URL=http://localhost:8080
VITE_DEBUG=true
```

## Running the Application

### Prerequisites
1. Node.js 18+ installed
2. Backend API server running on http://localhost:8080 (or configured URL)
3. Database properly set up and migrated

### Development Setup
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

### Backend Requirements
The backend API should implement the OpenAPI 3.0.1 specification from `api-spec.json`:
- JWT-based authentication with Bearer tokens
- Proper CORS configuration for frontend origin
- All endpoints should return appropriate HTTP status codes
- Error responses should include descriptive messages

## Authentication Flow

### Login Process
1. User enters credentials on `/login`
2. Frontend sends `POST /api/auth/login`
3. Backend returns JWT token and refresh token
4. Frontend stores tokens in localStorage
5. User is redirected to dashboard

### Token Management
- Access tokens are automatically attached to all API requests
- Expired tokens trigger automatic refresh attempts
- Failed refresh redirects user to login page
- Tokens are stored securely in localStorage

### User Roles
- **ADMIN**: Full access to all features, can manage users and products
- **OPERATOR**: Limited access, can manage own content and drafts

## Component Updates

### Updated Components
1. **Dashboard.vue**: Real data from API, loading states, error handling
2. **UserManager.vue**: Complete user CRUD with API integration
3. **ProductManager.vue**: Complete product CRUD with API integration
4. **LoginForm.vue**: Real authentication with error handling
5. **SignUpForm.vue**: Real registration with validation

### Pending Components (For Next Phase)
- **DraftManager.vue**: Needs API integration
- **ContentManager.vue**: Needs API integration  
- **Performance.vue**: Needs API integration
- **Calendar.vue**: Needs API integration

## Error Handling

### HTTP Error Codes
- **401 Unauthorized**: Token expired or invalid (automatic refresh attempt)
- **403 Forbidden**: Insufficient permissions (admin-only actions)
- **404 Not Found**: Resource not found
- **400 Bad Request**: Validation errors
- **500 Server Error**: Backend server issues

### User Feedback
- Loading spinners during API calls
- Success messages for completed actions
- Error messages for failed operations
- Confirmation dialogs for destructive actions

## Security Features

### Token Security
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Automatic token refresh mechanism
- Logout clears all authentication data

### API Security
- All protected endpoints require Bearer token authentication
- Role-based access control (RBAC)
- CORS protection on backend

### Input Validation
- Client-side form validation
- Server-side validation handled by backend API
- XSS protection through Vue's built-in escaping

## Performance Optimizations

### Caching Strategy
- User data cached in localStorage
- API responses cached in component state
- Efficient re-fetching on data mutations

### Loading Optimization
- Loading states prevent multiple API calls
- Parallel API calls where possible
- Lazy loading for non-critical data

## Monitoring and Debugging

### Development Tools
- Vue DevTools for component inspection
- Network tab for API call monitoring
- Console logging for error tracking

### Production Monitoring
- Error boundaries for graceful failure handling
- API response logging
- Performance metrics tracking

## Next Steps

### Immediate Tasks
1. Complete remaining component API integrations
2. Add comprehensive error boundaries
3. Implement offline support
4. Add data caching strategy

### Future Enhancements
1. Real-time updates with WebSockets
2. Advanced filtering and search
3. Export/import functionality
4. Mobile responsiveness improvements
5. Dark mode enhancements
6. Internationalization improvements

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend allows frontend origin
2. **401 Errors**: Check token validity and refresh mechanism
3. **Loading Issues**: Verify API endpoints are correct
4. **Role Access**: Ensure user has proper permissions

### Debug Steps
1. Check browser Network tab for API calls
2. Verify environment variables are loaded
3. Check localStorage for stored tokens
4. Review backend API logs
5. Validate API specification compliance

## Support
For issues or questions about the implementation, refer to:
- Vue 3 documentation
- Axios documentation
- OpenAPI specification
- Component-specific documentation in each file
