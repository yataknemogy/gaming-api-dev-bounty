import { Request, Response } from 'express';
import { updateUserRating, getTopUsersByRating } from '../services/ratingService';
import { AppError } from '../utils/errorHandler';

export const updateUserRatingController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { ratingPoints } = req.body;

        if (!ratingPoints || typeof ratingPoints !== 'number') {
            throw new AppError('Invalid rating points', 400);
        }

        await updateUserRating(userId, ratingPoints);
        res.status(200).json({ message: 'User rating updated successfully' });
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to update user rating', error });
        }
    }
};

export const getTopUsersByRatingController = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;

        const topUsers = await getTopUsersByRating(limit);
        res.status(200).json(topUsers);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to retrieve top users by rating', error });
        }
    }
};
