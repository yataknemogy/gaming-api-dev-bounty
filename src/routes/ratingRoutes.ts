import express from 'express';
import {
    updateUserRatingController,
    getTopUsersByRatingController
} from '../controllers/ratingController';

const router = express.Router();

router.put('/:userId', updateUserRatingController);
router.get('/top-users', getTopUsersByRatingController);

export default router;
