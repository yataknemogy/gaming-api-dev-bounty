import User, {IUser} from '../models/User';
import { AppError } from '../utils/errorHandler';
import { logEvent } from '../utils/logger';

export const updateUserRating = async (userId: string, ratingPoints: number): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { rating: ratingPoints } },
            { new: true }
        );

        if (!user) {
            throw new AppError('User not found', 404);
        }

        logEvent('User Rating Updated', { userId, newRating: user.rating }, 'info');
    } catch (error) {
        const err = error as Error;
        logEvent('Update Rating Error', { message: err.message, userId }, 'error');
        throw new AppError('Failed to update user rating', 500);
    }
};

export const getTopUsersByRating = async (limit: number): Promise<IUser[]> => {
    try {
        const topUsers = await User.find().sort({ rating: -1 }).limit(limit).exec();

        logEvent('Top Users by Rating Retrieved', { limit, topUsers }, 'info');
        return topUsers;
    } catch (error) {
        const err = error as Error;
        logEvent('Get Top Users by Rating Error', { message: err.message, limit }, 'error');
        throw new AppError('Failed to retrieve top users by rating', 500);
    }
};
