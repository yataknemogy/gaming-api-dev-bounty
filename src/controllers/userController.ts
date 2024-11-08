import { Request, Response } from 'express';
import {
    registerUser,
    getUserByPublicKey,
    updateUserBalance,
    getTopUsersByTotalBetAmount,
    depositToUserBalance
} from '../services/userService';
import { AppError } from '../utils/errorHandler';

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { username, publicKey } = req.body;
        const user = await registerUser(username, publicKey);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to register user', error });
        }
    }
};

export const getUserByPublicKeyController = async (req: Request, res: Response) => {
    try {
        const { publicKey } = req.params;
        const user = await getUserByPublicKey(publicKey);
        res.json(user);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to fetch user', error });
        }
    }
};

export const updateUserBalanceController = async (req: Request, res: Response) => {
    try {
        const { publicKey } = req.params;
        const { amount } = req.body;
        const user = await updateUserBalance(publicKey, amount);
        res.json(user);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to update user balance', error });
        }
    }
};

export const getTopUsersByTotalBetAmountController = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10; // по умолчанию 10 пользователей
        const topUsers = await getTopUsersByTotalBetAmount(limit);
        res.json(topUsers);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to retrieve top users by total bet amount', error });
        }
    }
};

export const depositToUserBalanceController = async (req: Request, res: Response) => {
    try {
        const { publicKey } = req.params;
        const { depositAmount } = req.body;
        const user = await depositToUserBalance(publicKey, depositAmount);
        res.json(user);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to deposit to user balance', error });
        }
    }
};
