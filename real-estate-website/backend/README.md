# Real Estate Website Backend

## Overview

This backend application serves as the API for the Real Estate Website, providing functionalities for user authentication, property management, service management, favorites, portfolio, and payment processing. It is built using Node.js, Express.js, and MongoDB.

## Tech Stack

- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB to define schemas and interact with the database.
- **Cloudinary**: For storing and managing media files (images, videos, and documents).
- **JWT**: For user authentication and session management.
- **Bcrypt**: For password hashing and security.
- **Multer**: For handling file uploads.

## Features

- **User Authentication**:

  - Register new users
  - Login existing users
  - Password reset functionality
  - Email verification
  - Profile management

- **User Dashboard**:

  - View user profile
  - View payment plans and history
  - Access purchased properties
  - Manage favorites
  - View portfolio statistics

- **Property Management**:

  - Lands, Houses, and Apartments
  - View available properties
  - Search and filter properties
  - Add, edit, and delete property listings
  - View property details including images, videos, and documents
  - Add properties to favorites

- **Service Management**:

  - Estate Management
  - Architectural Design
  - Property Valuation
  - Legal Consultation
  - Subscribe to services

- **Payment Management**:

  - View payment history
  - Process payments
  - Support for installment plans
  - Mark payments as completed

- **Admin Dashboard**:
  - User management
  - Property management
  - Service management
  - Payment tracking
  - Statistics and analytics

## File Structure

```
backend
├── src
│   ├── controllers          # Contains controller logic for handling requests
│   ├── models               # Contains Mongoose models for data schemas
│   ├── routes               # Contains route definitions for the API
│   ├── middlewares          # Contains middleware for authentication and error handling
│   ├── utils                # Contains utility functions (e.g., for Cloudinary)
│   ├── app.js               # Main application setup
│   └── server.js            # Server entry point
├── package.json             # Project dependencies and scripts
├── .env.example             # Example environment variables
└── README.md                # Documentation for the backend
```

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd real-estate-website/backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env` and fill in the required values.

4. Start the server:
   ```
   npm start
   ```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Lands

- `GET /api/lands` - Get all available lands
- `GET /api/lands/search` - Search lands
- `GET /api/lands/filter` - Filter lands
- `GET /api/lands/:id` - Get land details
- `GET /api/lands/favorites` - Get user's favorite lands
- `POST /api/lands/favorites/:id` - Add land to favorites
- `DELETE /api/lands/favorites/:id` - Remove land from favorites
- `GET /api/lands/my-lands` - Get user's purchased lands
- `POST /api/lands` - Add new land (admin only)
- `PUT /api/lands/:id` - Update land (admin only)
- `DELETE /api/lands/:id` - Delete land (admin only)

### Houses

- `GET /api/houses` - Get all available houses
- `GET /api/houses/search` - Search houses
- `GET /api/houses/filter` - Filter houses
- `GET /api/houses/:id` - Get house details
- `GET /api/houses/favorites` - Get user's favorite houses
- `POST /api/houses/favorites/:id` - Add house to favorites
- `DELETE /api/houses/favorites/:id` - Remove house from favorites
- `GET /api/houses/my-houses` - Get user's purchased houses
- `POST /api/houses` - Add new house (admin only)
- `PUT /api/houses/:id` - Update house (admin only)
- `DELETE /api/houses/:id` - Delete house (admin only)

### Apartments

- `GET /api/apartments` - Get all available apartments
- `GET /api/apartments/search` - Search apartments
- `GET /api/apartments/filter` - Filter apartments
- `GET /api/apartments/:id` - Get apartment details
- `GET /api/apartments/favorites` - Get user's favorite apartments
- `POST /api/apartments/favorites/:id` - Add apartment to favorites
- `DELETE /api/apartments/favorites/:id` - Remove apartment from favorites
- `GET /api/apartments/my-apartments` - Get user's purchased apartments
- `POST /api/apartments` - Add new apartment (admin only)
- `PUT /api/apartments/:id` - Update apartment (admin only)
- `DELETE /api/apartments/:id` - Delete apartment (admin only)

### Services

- `GET /api/services` - Get all services
- `GET /api/services/estate-management` - Get estate management services
- `GET /api/services/architectural-design` - Get architectural design services
- `GET /api/services/property-valuation` - Get property valuation services
- `GET /api/services/legal-consultation` - Get legal consultation services
- `GET /api/services/:id` - Get service details
- `POST /api/services/subscribe/:id` - Subscribe to service
- `DELETE /api/services/subscribe/:id` - Unsubscribe from service
- `GET /api/services/my-services` - Get user's subscribed services
- `POST /api/services` - Add new service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Payments

- `GET /api/payments/history` - Get payment history
- `GET /api/payments/:paymentId` - Get payment details
- `GET /api/payments/plan` - Get payment plan
- `GET /api/payments/installments/:paymentId` - Get installment details
- `POST /api/payments/process` - Process payment
- `GET /api/payments` - Get all payments (admin only)
- `POST /api/payments` - Add payment (admin only)
- `PATCH /api/payments/:paymentId/complete` - Mark payment as completed (admin only)
- `PUT /api/payments/plan/:userId` - Update payment plan (admin only)

### Portfolio

- `GET /api/portfolio` - Get user portfolio
- `GET /api/portfolio/lands` - Get portfolio lands
- `GET /api/portfolio/houses` - Get portfolio houses
- `GET /api/portfolio/apartments` - Get portfolio apartments
- `GET /api/portfolio/services` - Get portfolio services
- `GET /api/portfolio/stats` - Get portfolio statistics

### Favorites

- `GET /api/favorites` - Get user favorites
- `GET /api/favorites/lands` - Get favorite lands
- `GET /api/favorites/houses` - Get favorite houses
- `GET /api/favorites/apartments` - Get favorite apartments
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:favoriteId` - Remove from favorites

### Admin

- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/stats` - Get admin stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user details
- `PUT /api/admin/users/:userId/role` - Update user role
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/announcements` - Get announcements
- `POST /api/admin/announcements` - Add announcement
- `PUT /api/admin/announcements/:id` - Update announcement
- `DELETE /api/admin/announcements/:id` - Delete announcement
- `GET /api/admin/teams` - Get teams
- `POST /api/admin/teams` - Add team member
- `PUT /api/admin/teams/:id` - Update team member
- `DELETE /api/admin/teams/:id` - Delete team member
- `GET /api/admin/inspections` - Get inspections
- `POST /api/admin/inspections` - Add inspection
- `PUT /api/admin/inspections/:id` - Update inspection
- `DELETE /api/admin/inspections/:id` - Delete inspection

## License

This project is licensed under the MIT License.
