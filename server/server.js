import config from './config/config.js';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';

await connectDB();

const app = express();

// Middlewares
app.use(cors())            // Enabling Cross-Origin Resource Sharing
app.use(clerkMiddleware())

// API for listening to clerk webhooks

app.post("/api/clerk", express.raw({type: 'application/json'}), clerkWebhooks);

app.use(express.json())

app.get("/", (req, res) => res.send("API is working fine."));

const PORT = config.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})