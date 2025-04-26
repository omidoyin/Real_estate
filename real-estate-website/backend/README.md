# Real Estate Website Backend

## Overview
This backend application serves as the API for the Real Estate Website, providing functionalities for user authentication, land management, and payment processing. It is built using Node.js, Express.js, and MongoDB.

## Tech Stack
- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB to define schemas and interact with the database.
- **Cloudinary**: For storing and managing media files (images and videos).
- **JWT**: For user authentication and session management.

## Features
- **User Authentication**: 
  - Register new users
  - Login existing users
  - Password reset functionality

- **User Dashboard**:
  - View user profile
  - View payment plans and history
  - Access purchased lands

- **Land Management**:
  - View available lands
  - Add, edit, and delete land listings
  - View land details including images and videos

- **Payment Management**:
  - View payment history
  - Add new payments
  - Mark payments as completed

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
Refer to the individual route files in the `src/routes` directory for detailed API endpoints and their usage.

## License
This project is licensed under the MIT License.