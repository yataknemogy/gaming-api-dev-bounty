import express from 'express';
import { addReviewController, getReviewsByChallengeController } from '../controllers/reviewController';

const router = express.Router();

router.post('/', addReviewController);
router.get('/:challengeId', getReviewsByChallengeController);

export default router;
