import config from './config/config.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from "./routes/userRouter.js";
import hotelRouter from "./routes/hotelRouter.js";
import roomRouter from './routes/roomRouter.js';
import connectCloudinary from './config/cloudinary.js';
import bookingRouter from './routes/bookingRouter.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

await connectDB();
await connectCloudinary();

const app = express();

// Middlewares

app.use(cors())            // Enabling Cross-Origin Resource Sharing
app.use(clerkMiddleware())

// API for listening to clerk webhooks

app.post("/api/clerk", express.raw({type: 'application/json'}), clerkWebhooks);

// API fot listening to stripe Webhooks

app.post("/api/stripe", express.raw({type: "application/json"}), stripeWebhooks);

app.use(express.json())

app.get("/", (req, res) => res.send("API is working fine."));
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = config.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})