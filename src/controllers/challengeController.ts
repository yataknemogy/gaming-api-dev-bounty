import { Request, Response } from 'express';
import {
    createChallenge,
    joinChallenge,
    completeChallenge,
    expireChallenges,
    getPublicChallenges,
    getChallengeStatistics
} from '../services/challengeService'; 
import { AppError } from '../utils/errorHandler';

export const createChallengeController = async (req: Request, res: Response) => {
    try {
        const { title, description, creatorId, stakeAmount, category, isPrivate, startTime, endTime } = req.body;
        const challenge = await createChallenge(title, description, creatorId, stakeAmount, category, isPrivate, startTime, endTime);
        res.status(201).json(challenge);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to create challenge', error });
        }
    }
};

export const joinChallengeController = async (req: Request, res: Response) => {
    try {
        const { challengeId } = req.params;
        const { userId } = req.body;
        const challenge = await joinChallenge(challengeId, userId);
        res.json(challenge);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to join challenge', error });
        }
    }
};

export const completeChallengeController = async (req: Request, res: Response) => {
    try {
        const { challengeId } = req.params;
        const { proof, isSuccess } = req.body;
        const challenge = await completeChallenge(challengeId, proof, isSuccess);
        res.json(challenge);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to complete challenge', error });
        }
    }
};

export const expireChallengesController = async (_req: Request, res: Response) => {
    try {
        await expireChallenges();
        res.json({ message: 'Expired challenges processed' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to expire challenges', error });
    }
};

export const getPublicChallengesController = async (_req: Request, res: Response) => {
    try {
        const challenges = await getPublicChallenges();
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch public challenges', error });
    }
};

export const getChallengeStatisticsController = async (req: Request, res: Response) => {
    try {
        const { challengeId } = req.params;
        const statistics = await getChallengeStatistics(challengeId);
        res.json(statistics);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch challenge statistics', error });
    }
};
