import { Request, Response } from 'express';
import { addReview, getReviewsByChallenge } from '../services/reviewService';
import { AppError } from '../utils/errorHandler';

export const addReviewController = async (req: Request, res: Response) => {
    try {
        const { challengeId, userId, rating, comment } = req.body;
        const review = await addReview(challengeId, userId, rating, comment);
        res.status(201).json(review);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to add review', error });
        }
    }
};

export const getReviewsByChallengeController = async (req: Request, res: Response) => {
    try {
        const { challengeId } = req.params;
        const reviews = await getReviewsByChallenge(challengeId);
        res.json(reviews);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to fetch reviews', error });
        }
    }
};
