🏗️ Real Estate Company Website – Full Requirements
✅ Tech Stack

Layer Technology
Frontend React.js + Tailwind CSS + vite
Backend Node.js + Express.js
Database MongoDB (Mongoose ODM)
Auth JWT-based Authentication
Storage Cloudinary (for images & videos)
Admin Panel React Admin Dashboard or custom
Hosting Vercel (frontend) + Render/Heroku (backend)
👤 User Features

1. Authentication
   Register (name, email, phone, password)

Login

JWT token for session management

Forgot password (email-based reset)

2. User Dashboard
   When logged in, users can:

View profile (basic info)

Payment Plan Section:

Shows installment amount, due dates, status

Payment History:

Table of transactions with date, method, amount, status

My Lands:

List of purchased lands

Includes purchase date, land details, and downloadable title (if available)

3. Available Lands Page
   Card grid layout

Each card shows:

Image

Title

Location

Price

“View Details” button

4. Land Details Page
   On clicking a land:

Image gallery (from Cloudinary)

Video player (Cloudinary-hosted video)

Location details with landmarks

Inspection dates & times

Google Map preview (optional)

Description & features

“Book Inspection” or “Express Interest” button

🛠️ Admin Panel Features
Accessible by admins only.

Dashboard Includes:
Overview of total users, lands sold, pending payments

Manage Lands:

Add new land (with images, video, inspection date, location, landmark, price)

Edit/Delete land

Manage Users:

View all users

View each user's profile, lands, and payments

Manage Payments:

Add, edit, mark payments as completed

Media Uploads:

Cloudinary integration for uploading media

Security:

Admin-only access with separate login

☁️ Cloudinary Integration
Store land images, videos securely

Return optimized URLs for use on frontend

Admin upload via API or admin panel

🎨 Theme & UI
Use a color palette based on:

Primary Blue: #007BFF

Light Blue: #E6F0FF

White: #FFFFFF

Accent Green: #28A745

Use Tailwind CSS for consistent styling.
