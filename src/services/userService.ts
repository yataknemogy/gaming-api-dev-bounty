import User, { IUser } from '../models/User';
import { AppError } from '../utils/errorHandler';
import { logEvent } from '../utils/logger';
import Bet from "../models/Bet";

export const registerUser = async (username: string, publicKey: string): Promise<IUser | null> => {
    try {
        const existingUser = await User.findOne({ publicKey });
        if (existingUser) {
            throw new AppError('User with this public key already exists', 400);
        }

        const user = new User({ username, publicKey });
        await user.save();

        logEvent('User Registered', { userId: user._id, username: user.username, publicKey }, 'info');
        return user;
    } catch (error) {
        const err = error as Error;
        logEvent('Register User Error', { message: err.message }, 'error');
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError('Failed to register user', 500);
        }
    }
};

export const getUserByPublicKey = async (publicKey: string): Promise<IUser | null> => {
    try {
        const user = await User.findOne({ publicKey });
        if (!user) {
            throw new AppError('User not found', 404);
        }

        logEvent('User Fetched', { userId: user._id, username: user.username, publicKey }, 'info');
        return user;
    } catch (error) {
        const err = error as Error;
        logEvent('Fetch User Error', { message: err.message }, 'error');
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError('Failed to fetch user', 500);
        }
    }
};

export const updateUserBalance = async (publicKey: string, amount: number): Promise<IUser | null> => {
    try {
        const user = await User.findOneAndUpdate(
            { publicKey },
            { $inc: { balance: amount } },
            { new: true }
        );
        if (!user) {
            throw new AppError('User not found', 404);
        }

        logEvent('User Balance Updated', { userId: user._id, balance: user.balance, amount }, 'info');
        return user;
    } catch (error) {
        const err = error as Error;
        logEvent('Update Balance Error', { message: err.message, publicKey, amount }, 'error');
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError('Failed to update user balance', 500);
        }
    }
};

export const getTopUsersByTotalBetAmount = async (limit: number): Promise<Array<{ userId: string; totalBetAmount: number }> | null> => {
    try {
        const topUsers = await Bet.aggregate([
            { $group: { _id: '$user', totalBetAmount: { $sum: '$amount' } } },
            { $sort: { totalBetAmount: -1 } },
            { $limit: limit },
            { $project: { userId: '$_id', totalBetAmount: 1, _id: 0 } }
        ]);

        logEvent('Top Users by Total Bet Amount Retrieved', { limit, topUsers }, 'info');
        return topUsers;
    } catch (error) {
        const err = error as Error;
        logEvent('Get Top Users by Bet Amount Error', { message: err.message, limit }, 'error');
        throw new AppError('Failed to retrieve top users by total bet amount', 500);
    }
};

export const depositToUserBalance = async (publicKey: string, depositAmount: number): Promise<IUser | null> => {
    try {
        if (depositAmount <= 0) {
            throw new AppError('Deposit amount must be greater than zero', 400);
        }

        const user = await User.findOneAndUpdate(
            { publicKey },
            { $inc: { balance: depositAmount } },
            { new: true }
        );
        if (!user) {
            throw new AppError('User not found', 404);
        }

        logEvent('User Deposit', { userId: user._id, depositAmount, newBalance: user.balance }, 'info');
        return user;
    } catch (error) {
        const err = error as Error;
        logEvent('Deposit Error', { message: err.message, publicKey, depositAmount }, 'error');
        throw new AppError('Failed to deposit to user balance', 500);
    }
};
