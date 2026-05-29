import express from 'express';
import { checkAvailability, createBooking, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import {authenticate} from '../middleware/authMiddleware.js'

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailability)
bookingRouter.post("/book", authenticate ,createBooking);
bookingRouter.get("/user", authenticate, getUserBookings);
bookingRouter.get("/hotel", authenticate, getHotelBookings);

export default bookingRouter;