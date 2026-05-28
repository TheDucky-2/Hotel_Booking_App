import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4), authenticate, createRoom)
roomRouter.get("/", getRooms)
roomRouter.get("/owner", authenticate ,getOwnerRooms)  // since this route is protected
roomRouter.post("/toggle-availability", authenticate, toggleRoomAvailability)

export default roomRouter;