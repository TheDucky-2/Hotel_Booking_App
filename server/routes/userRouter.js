import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getUserData, storeRecentSearchedCities } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/', authenticate, getUserData);
userRouter.post('/store-recent-search', authenticate, storeRecentSearchedCities);

export default userRouter;