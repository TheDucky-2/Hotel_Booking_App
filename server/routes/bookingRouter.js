import express from 'express';
import { checkAvailabilityAPI, createBookingAPI, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import {authenticate} from '../middleware/authMiddleware.js'

const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkAvailabilityAPI)
bookingRouter.post("/book", authenticate ,createBookingAPI);
bookingRouter.get("/user", authenticate, getUserBookings);
bookingRouter.get("/hotel", authenticate, getHotelBookings);

export default bookingRouter;