# Real Estate Company Website

This project is a full-stack real estate website built with a modern tech stack. It includes user authentication, a user dashboard, an available lands page, a land details page, and an admin panel for managing users, lands, and payments.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT-based Authentication
- **Storage**: Cloudinary (for images & videos)
- **Hosting**: Vercel (frontend) + Render/Heroku (backend)

## Features

### User Features

1. **Authentication**
   - Register (name, email, phone, password)
   - Login
   - JWT token for session management
   - Forgot password (email-based reset)

2. **User Dashboard**
   - View profile (basic info)
   - Payment Plan Section: Shows installment amount, due dates, status
   - Payment History: Table of transactions with date, method, amount, status
   - My Lands: List of purchased lands with purchase date, land details, and downloadable title (if available)

3. **Available Lands Page**
   - Card grid layout displaying:
     - Image
     - Title
     - Location
     - Price
     - “View Details” button

4. **Land Details Page**
   - Image gallery (from Cloudinary)
   - Video player (Cloudinary-hosted video)
   - Location details with landmarks
   - Inspection dates & times
   - Google Map preview (optional)
   - Description & features
   - “Book Inspection” or “Express Interest” button

### Admin Panel Features

- **Dashboard**: Overview of total users, lands sold, pending payments
- **Manage Lands**: Add, edit, delete lands with images, video, inspection date, location, landmark, price
- **Manage Users**: View all users and their profiles, lands, and payments
- **Manage Payments**: Add, edit, mark payments as completed
- **Media Uploads**: Cloudinary integration for uploading media
- **Security**: Admin-only access with separate login

## Cloudinary Integration

- Store land images and videos securely
- Return optimized URLs for use on frontend
- Admin upload via API or admin panel

## Theme & UI

- Color Palette:
  - Primary Blue: #007BFF
  - Light Blue: #E6F0FF
  - White: #FFFFFF
  - Accent Green: #28A745
- Use Tailwind CSS for consistent styling.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env` and filling in the required values.

4. Start the backend server:
   ```
   npm start
   ```

5. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

6. Start the frontend development server:
   ```
   npm run dev
   ```

## License

This project is licensed under the MIT License.