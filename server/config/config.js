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
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME
}

export default config;