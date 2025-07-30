---
description: Enterprise application templates for rapid development
argument-hint: [saas-starter|ecommerce|marketplace|internal-tools]
---

# Use Template - Enterprise Application Starters

## Your Request
Template: $ARGUMENTS

## AI Instructions

You are an AI that creates complete applications from enterprise templates. Based on the template requested, create a full application:

### Available Templates

#### 1. SaaS Starter (`saas-starter`)
**Multi-tenant SaaS application foundation**
- User authentication & organization management
- Subscription billing integration (Stripe)
- Admin dashboard with user management
- API with rate limiting and authentication
- Responsive React frontend
- Database with tenant isolation
- Email notifications system
- Basic analytics dashboard

#### 2. E-commerce (`ecommerce`)
**Complete online store solution**
- Product catalog with categories and search
- Shopping cart and checkout flow
- Payment processing (Stripe/PayPal)
- User accounts and order history
- Admin inventory management
- Email notifications for orders
- Basic SEO optimization
- Mobile-responsive design

#### 3. Marketplace (`marketplace`)
**Two-sided marketplace platform**
- Seller and buyer registration
- Product/service listings
- Review and rating system
- Secure payment processing with escrow
- Message system between users
- Admin moderation tools
- Commission/fee management
- Mobile-first design

#### 4. Internal Tools (`internal-tools`)
**Employee/admin dashboard system**
- Role-based access control
- Data visualization dashboards
- CRUD operations for business entities
- Reporting and analytics
- File upload/management
- Audit logging
- Integration capabilities (APIs)
- Desktop-optimized interface

## Implementation Process

### 1. Setup Project Structure
```
project-name/
├── frontend/          # React/Next.js application
├── backend/           # Node.js/Express API
├── database/          # Database migrations & seeds
├── docs/              # Documentation
├── deploy/            # Deployment configs
└── tests/             # Test suites
```

### 2. Core Features Implementation
- Complete authentication system
- Database schema with proper relationships
- API endpoints with validation
- Frontend components and pages
- Business logic implementation

### 3. Integration Layer
- Third-party service integrations
- Payment processing setup
- Email service configuration
- File storage setup
- Analytics integration

### 4. Production Readiness
- Environment configuration
- Security best practices
- Performance optimizations
- Error handling and logging
- Testing setup

### 5. Documentation & Deployment
- Setup instructions
- API documentation
- Deployment guides
- Environment variable templates

## Customization Options
After template creation, mention:
- How to customize branding/styling
- Adding additional features
- Scaling considerations
- Integration possibilities

Create a complete, production-ready application based on the selected template!