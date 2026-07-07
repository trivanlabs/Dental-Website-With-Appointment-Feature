# Dental-Website-With-Appointment-Feature

A modern dental clinic website built with React and Node.js, featuring an interactive appointment booking system and a comprehensive admin dashboard for clinic management.

## 📂 Project Structure

- **`frontend/`**: React + Vite + TypeScript SPA for the patient-facing website and doctor admin portal.
- **`backend/`**: Node.js + Express API with MongoDB integration for data management.

## ✨ Key Features

### 🦷 Patient Features
- **Responsive Design**: Modern, mobile-first interface.
- **3-Step Appointment Booking**:
  1.  **Pick Date**: Select a date from an interactive calendar.
  2.  **Choose Time**: Select from 18 daily time slots (9:00 AM – 5:30 PM).
  3.  **Provide Details**: Submit name, email, phone, and medical concern.
- **Clinic Information**: Detailed sections for services, dentists, pricing, testimonials, and location.

### 👩‍⚕️ Doctor Dashboard & Admin Portal
- **Secure Authentication**: Role-based access control for doctors.
- **Modern Dashboard**:
    - Real-time metrics (today's appointments, total patients, revenue).
    - Calendar view to track appointment schedules.
    - Quick access to patient lists, upcoming appointments, services, and reviews.
- **Comprehensive Management Tools**:
    - **Appointments**: View, filter (pending, confirmed, cancelled, completed), add doctor's notes, and export to Excel.
    - **Patients**: Complete patient directory with visit history.
    - **Dentists**: Manage dentist profiles and availability.
    - **Services**: Manage treatment plans, durations, and pricing.
    - **Payments**: Track payment statuses and methods.
    - **Reviews**: View and respond to patient testimonials.
    - **Reports**: Visual analytics for business growth.
    - **Settings**: Clinic profile and admin credential management.

## 🛠️ Technology Stack

### Frontend
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui, Vanilla CSS (booking styles)
- **Icons**: Lucide React
- **Date Utilities**: `date-fns`

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (`jsonwebtoken`), `bcryptjs`
- **Utilities**: `xlsx` (for Excel exports)

## 🚀 Setup & Execution

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) local service running on `mongodb://localhost:27017`

### 1️⃣ Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/clinic_db
   JWT_SECRET=your_secret_key
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=secure_password
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2️⃣ Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the proxy in `vite.config.ts` points to your backend (default is `http://localhost:5001`):
   ```typescript
   // vite.config.ts
   server: {
     proxy: {
       '/api': 'http://localhost:5001',
     }
   }
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   - Patient Portal: [http://localhost:5173](http://localhost:5173)
   - Doctor Portal: [http://localhost:5173/doctor](http://localhost:5173/doctor)

## 🔑 Default Admin Credentials

After running the backend for the first time, default admin credentials will be seeded in the database. You can use the following to log in:

- **Email**: `[EMAIL_ADDRESS]`
- **Password**: `admin123`
