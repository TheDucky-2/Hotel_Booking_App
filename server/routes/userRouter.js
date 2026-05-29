import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSearchedCities } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', authenticate, getUserData);
userRouter.post('/store-recent-search', authenticate, storeRecentSearchedCities);

export default userRouter;