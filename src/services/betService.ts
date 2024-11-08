import mongoose from 'mongoose';
import Bet, { IBet } from '../models/Bet';
import { AppError } from '../utils/errorHandler';
import { logEvent } from '../utils/logger';
import { BetStatistics } from '../types/types';
import { verifyTransaction, sendPrizeToWinner } from '../utils/cryptoUtils';

export const createBet = async (
    userId: string,
    challengeId: string,
    amount: number,
    cryptoAddress: string,
    transactionHash: string,
    odds: number = 1,
    minBet: number = 10,
    maxBet: number = 1000
): Promise<IBet | null> => {
    try {
        if (amount < minBet || amount > maxBet) {
            throw new AppError(`Bet amount must be between ${minBet} and ${maxBet}`, 400);
        }

        if (amount <= 0) {
            throw new AppError('Bet amount must be greater than zero', 400);
        }

        const isVerified = await verifyTransaction(transactionHash, amount, cryptoAddress);
        if (!isVerified) {
            throw new AppError('Transaction verification failed', 400);
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const challengeObjectId = new mongoose.Types.ObjectId(challengeId);

        const bet = new Bet({
            user: userObjectId,
            challenge: challengeObjectId,
            amount,
            cryptoAddress,
            transactionHash,
            odds,
            isResolved: false,
        });

        await bet.save();
        logEvent('Bet Created', { betId: bet._id, userId, challengeId, amount, cryptoAddress, transactionHash, odds }, 'info');
        return bet;
    } catch (error) {
        const err = error as Error;
        logEvent('Create Bet Error', { message: err.message, userId, challengeId, amount, cryptoAddress, transactionHash, odds }, 'error');
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError('Failed to create bet', 500);
        }
    }
};

export const updateBetStatus = async (betId: string, isWon: boolean, winnerAddress: string): Promise<IBet | null> => {
    try {
        const bet = await Bet.findById(betId);
        if (!bet) {
            throw new AppError('Bet not found', 404);
        }

        bet.isWon = isWon;
        bet.isResolved = true;

        if (isWon) {
            const winnings = bet.amount * bet.odds;
            await sendPrizeToWinner(bet.cryptoAddress, winnerAddress, winnings);
            logEvent('Prize Sent to Winner', { betId, winnerAddress, winnings }, 'info');
        }

        await bet.save();
        logEvent('Bet Status Updated', { betId, isWon }, 'info');
        return bet;
    } catch (error) {
        const err = error as Error;
        logEvent('Update Bet Status Error', { message: err.message, betId, isWon }, 'error');
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError('Failed to update bet status', 500);
        }
    }
}

export const getUserBetStatistics = async (userId: string): Promise<BetStatistics | null> => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const totalBets = await Bet.countDocuments({ user: userObjectId });

        const totalAmountData = await Bet.aggregate([
            { $match: { user: userObjectId } },
            { $group: { _id: null, totalAmount: { $sum: '$amount' }, averageOdds: { $avg: '$odds' } } }
        ]);
        const totalAmount = totalAmountData[0]?.totalAmount || 0;
        const averageOdds = totalAmountData[0]?.averageOdds || 1;

        const totalWon = await Bet.countDocuments({ user: userObjectId, isWon: true });
        const totalLost = totalBets - totalWon;

        const averageWinAmount = totalWon ? totalAmount / totalWon : 0;

        logEvent('User Bet Statistics Retrieved', { userId, totalBets, totalAmount, totalWon, totalLost, averageOdds, averageWinAmount }, 'info');

        return { totalBets, totalAmount, totalWon, totalLost, averageOdds, averageWinAmount };
    } catch (error) {
        const err = error as Error;
        logEvent('Get User Bet Statistics Error', { message: err.message, userId }, 'error');
        throw new AppError('Failed to retrieve user bet statistics', 500);
    }
};
