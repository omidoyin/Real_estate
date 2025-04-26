# Real Estate Website

This is a full-stack real estate website built with React.js for the frontend and Node.js with Express for the backend. The application allows users to register, log in, view available lands, manage their purchases, and more. Admins can manage users, lands, and payments through a dedicated admin panel.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication (Register, Login, Forgot Password)
- User Dashboard
  - View Profile
  - Payment Plan
  - Payment History
  - My Lands
- Available Lands Page
- Land Details Page
- Admin Panel
  - Manage Users
  - Manage Lands
  - Manage Payments

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT-based Authentication
- **Storage:** Cloudinary (for images & videos)
- **Hosting:** Vercel (frontend), Render/Heroku (backend)

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Navigate to the backend directory:
   ```
   cd ../backend
   ```
5. Install dependencies:
   ```
   npm install
   ```
6. Set up environment variables by copying `.env.example` to `.env` and filling in the required values.
7. Start the backend server:
   ```
   npm run start
   ```
8. Start the frontend development server:
   ```
   cd ../frontend
   npm run dev
   ```

## Folder Structure

```
real-estate-website
├── backend
│   ├── src
│   ├── package.json
│   └── README.md
├── frontend
│   ├── src
│   ├── package.json
│   └── README.md
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.