# Hotel Booking Platform

A full-stack hotel booking application built with the MERN stack that enables users to browse hotels, view property details, securely book accommodations, complete payments through Stripe Checkout and receive automated booking confirmations via email.

The platform combines modern authentication, secure payment processing, real-time booking management and automated notifications to deliver a seamless hotel reservation experience.

Built using the MERN stack with deployments on Vercel.

## Overview

The Hotel Booking Platform is designed to provide a seamless hotel reservation experience. Users can explore available accommodations, check hotel details, make bookings and manage their reservations through an intuitive and responsive interface.

The platform leverages modern web technologies to deliver fast performance, secure authentication, and efficient data management.

---

## Features

### User Authentication

* Secure authentication powered by Clerk
* User registration and login
* Protected routes and session management
* User profile management

### Hotel Discovery

* Browse available hotels
* Search and filter properties
* View hotel details and amenities
* Hotel image galleries

### Booking Management

* Book hotel rooms
* Manage reservations
* View booking history
* Booking confirmation workflow

### Payments

- Secure payments powered by Stripe
- Stripe Checkout integration
- Stripe Webhook verification
- Automated booking confirmation after successful payment
- Payment status synchronization
- Transaction tracking and management

### Responsive User Experience

* Mobile-friendly design
* Fast and interactive UI
* Modern React-based frontend
* Smooth navigation and user flow

### Backend Services

* RESTful API architecture
* Secure request handling
* Database-driven hotel and booking management
* Scalable server-side structure

### Email Notifications

* Automated booking confirmation emails
* Payment success notifications
* Reservation details sent to users
* Email delivery powered by Nodemailer

---

## Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* React Router
* Axios
* Tailwind CSS 

### Backend

* Node.js
* Express.js
* JavaScript

### Database

* MongoDB
* Mongoose

### Authentication

* Clerk

### Deployment

* Vercel

### Payments

- Stripe API
- Stripe Checkout
- Stripe Webhooks

### Email Notifications

* Nodemailer

---

## Project Architecture

```text
                    ┌──────────────────┐
                    │    React.js UI   │
                    │   (Frontend)     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Express.js API  │
                    │    (Node.js)     │
                    └───────┬──────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼

    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
    │    Clerk    │  │   MongoDB   │  │   Stripe    │
    │Authentication│ │ + Mongoose  │  │  Checkout   │
    └─────────────┘  └─────────────┘  └──────┬──────┘
                                              │
                                              ▼
                                     ┌────────────────┐
                                     │ Stripe Webhook │
                                     └───────┬────────┘
                                             │
                                             ▼
                                     ┌────────────────┐
                                     │ Booking Update │
                                     │ Confirmation   │
                                     │ Transaction Log│
                                     └────────────────┘
                                            │
                                             ▼
                                     ┌────────────────┐
                                     │ Email Service  |
                                     │                |
                                     │   Nodemailer   │
                                     └────────────────┘

---

## Folder Structure

```text
hotel-booking-platform/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/TheDucky-2/Hotel_Booking_App
cd Hotel_Booking_App
```

---

## Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## Frontend Setup

Navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## Database Schema

### Hotel

* Name
* Description
* Location
* Images
* Price Per Night
* Amenities
* Available Rooms

### Booking

* User ID
* Hotel ID
* Check-in Date
* Check-out Date
* Total Price
* Booking Status

### User

* Managed through Clerk Authentication
* Profile Information
* Booking History

---

## API Endpoints

### Hotels

```http
GET /api/hotels
```

Retrieve all hotels.

```http
GET /api/hotels/:id
```

Retrieve a specific hotel.

---

### Bookings

```http
POST /api/bookings
```

Create a new booking.

```http
GET /api/bookings/user
```

Retrieve bookings for the authenticated user.

---

### Users

```http
GET /api/users/profile
```

Retrieve authenticated user information.

---

## Deployment

### Frontend

The React application is deployed on Vercel.

### Backend

The Express.js backend is deployed on Vercel using serverless functions.

### Database

MongoDB database hosted using MongoDB Atlas.

---

## Security Features

* Clerk authentication and authorization
* Protected API routes
* Environment variable management
* Secure database access
* Input validation and sanitization

---

---

## License

This project is licensed under the MIT License.

---

## Author

Developed using the MERN Stack (MongoDB, Express.js, React.js, Node.js) with Clerk Authentication, Nodemailer email notifications and deployment on Vercel.
