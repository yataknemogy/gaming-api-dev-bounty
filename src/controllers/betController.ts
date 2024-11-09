import { Request, Response } from 'express';
import {
    createBet,
    updateBetStatus,
    getUserBetStatistics
} from '../services/betService';
import { AppError } from '../utils/errorHandler';

export const createBetController = async (req: Request, res: Response) => {
    try {
        const { userId, challengeId, amount, cryptoAddress, transactionHash, odds } = req.body;
        const bet = await createBet(userId, challengeId, amount, cryptoAddress, transactionHash, odds);
        res.status(201).json(bet);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to create bet', error });
        }
    }
};

export const updateBetStatusController = async (req: Request, res: Response) => {
    try {
        const { betId } = req.params;
        const { isWon, winnerAddress } = req.body;
        const bet = await updateBetStatus(betId, isWon, winnerAddress);
        res.json(bet);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to update bet status', error });
        }
    }
};

export const getUserBetStatisticsController = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const statistics = await getUserBetStatistics(userId);
        res.json(statistics);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to retrieve user bet statistics', error });
        }
    }
};
