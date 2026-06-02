import dotenv from 'dotenv';
dotenv.config({path: "/home/kshitij/Desktop_Content/Hotel_Booking_App/server/.env"})

const config = {
    MONGODB_URI : process.env.MONGODB_URI,
    PORT : process.env.PORT,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY:process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOKS_SECRET:process.env.CLERK_WEBHOOKS_SECRET,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    HOTEL_OWNER:process.env.HOTEL_OWNER,
    BREVO_SMTP_SERVER: process.env.BREVO_SMTP_SERVER,
    SENDER_EMAIL:process.env.SENDER_EMAIL,
    BREVO_SMTP_USER:process.env.BREVO_SMTP_USER,
    BREVO_SMTP_PASS:process.env.BREVO_SMTP_PASS,
    CURRENCY: process.env.CURRENCY,
    STRIPE_PUBLISHABLE_KEY:process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    }

export default config;