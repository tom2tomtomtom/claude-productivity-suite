---
name: create-spec
description: Create detailed specifications for features
---

Transform plans into detailed technical specifications.

## 1. User Stories

### 1.1 Story Format
As a [type of user]
I want [goal]
So that [benefit]

### 1.2 Acceptance Criteria
- Given [context]
- When [action]
- Then [expected result]

## 2. Technical Requirements

### 2.1 API Specification
Define all endpoints:
```
POST /api/auth/register
Body: {
  email: string (required, valid email)
  password: string (required, min 8 chars)
  name: string (required)
}
Response: {
  user: User
  token: string
}
Errors: 
  400: Validation error
  409: Email already exists
```

### 2.2 Database Schema
Define all tables/collections:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 3. UI/UX Specifications

### 3.1 Page Layouts
- Header components
- Navigation structure
- Content areas
- Footer elements

### 3.2 User Flows
- Registration flow
- Login flow
- Main feature flow
- Error handling flow

### 3.3 Responsive Design
- Mobile (320-768px)
- Tablet (768-1024px)
- Desktop (1024px+)

## 4. Validation Rules

### 4.1 Input Validation
- Email: Valid format
- Password: Min 8 chars, 1 uppercase, 1 number
- Phone: Valid format with country code
- Dates: Future dates only (if applicable)

### 4.2 Business Rules
- User can only have one active session
- Admin approval required for certain actions
- Rate limiting on API calls
- Data retention policies

## 5. Security Requirements

### 5.1 Authentication
- JWT token implementation
- Refresh token strategy
- Session management
- Password reset flow

### 5.2 Authorization
- Role-based access control
- Permission matrix
- API key management
- Resource ownership

## 6. Performance Requirements

### 6.1 Response Times
- Page load: < 3 seconds
- API responses: < 200ms
- Search results: < 500ms
- File uploads: Progress indication

### 6.2 Scalability
- Support 1000 concurrent users
- Database indexing strategy
- Caching implementation
- CDN usage

## 7. Testing Requirements

### 7.1 Unit Tests
- All utility functions
- API endpoints
- Data transformations
- Validation logic

### 7.2 Integration Tests
- Database operations
- External API calls
- Authentication flow
- Payment processing

### 7.3 E2E Tests
- Complete user journeys
- Cross-browser testing
- Mobile testing
- Performance testing

## Generate Specification Document

Create detailed specification:
- Technical requirements document
- API documentation
- Database design document
- UI/UX mockups reference
- Testing plan

Save as `specs/{feature-name}-spec.md`
