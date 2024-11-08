import Review, { IReview } from '../models/Review';
import { logEvent } from "../utils/logger";
import { AppError } from "../utils/errorHandler";

export const addReview = async (
    challengeId: string,
    userId: string,
    rating: number,
    comment: string
): Promise<IReview | null> => {
    try {
        const review = new Review({
            challenge: challengeId,
            user: userId,
            rating,
            comment
        });

        await review.save();
        logEvent('Review Added', { challengeId, userId, rating, comment }, 'info');
        return review;
    } catch (error) {
        const err = error as Error;
        logEvent('Add Review Error', { message: err.message, challengeId, userId, rating, comment }, 'error');
        throw new AppError('Failed to add review', 500);
    }
};

export const getReviewsByChallenge = async (challengeId: string): Promise<IReview[]> => {
    try {
        const reviews = await Review.find({ challenge: challengeId }).sort({ createdAt: -1 }).exec();
        logEvent('Fetched Reviews for Challenge', { challengeId, count: reviews.length }, 'info');
        return reviews;
    } catch (error) {
        const err = error as Error;
        logEvent('Get Reviews Error', { message: err.message, challengeId }, 'error');
        throw new AppError('Failed to fetch reviews', 500);
    }
};
