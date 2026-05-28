import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { registerHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();

hotelRouter.post("/", authenticate, registerHotel);

export default hotelRouter;