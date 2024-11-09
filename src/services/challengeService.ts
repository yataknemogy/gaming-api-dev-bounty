import Challenge, { IChallenge } from '../models/Challenge';
import { AppError } from '../utils/errorHandler';
import { logEvent } from '../utils/logger';
import { ChallengeCategory } from '../types/types';
import mongoose from 'mongoose';
import { updateUserRating } from "./ratingService";
import Review from "../models/Review";

export const createChallenge = async (
    title: string,
    description: string,
    creatorId: string,
    stakeAmount: number,
    category: ChallengeCategory,
    isPrivate: boolean = false,
    startTime?: Date,
    endTime?: Date
): Promise<IChallenge | null> => {
    try {
        const creatorObjectId = new mongoose.Types.ObjectId(creatorId);

        const challenge = new Challenge({
            title,
            description,
            creator: creatorObjectId,
            stakeAmount,
            category,
            status: 'pending',
            startTime,
            endTime,
            isPrivate
        });
        await challenge.save();

        logEvent('Challenge Created', { challengeId: challenge._id, title, creatorId, category, isPrivate }, 'info');
        return challenge;
    } catch (error) {
        const err = error as Error;
        logEvent('Create Challenge Error', { message: err.message, title, creatorId, category, isPrivate }, 'error');
        throw new AppError('Failed to create challenge', 500);
    }
};

export const joinChallenge = async (challengeId: string, userId: string): Promise<IChallenge | null> => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            throw new AppError('Challenge not found', 404);
        }

        if (challenge.participants.includes(userObjectId)) {
            throw new AppError('User is already a participant in this challenge', 400);
        }

        challenge.participants.push(userObjectId);

        if (challenge.participants.length >= 2 && challenge.status === 'pending') {
            challenge.status = 'active';
        }

        await challenge.save();

        logEvent('User Joined Challenge', { challengeId, userId }, 'info');
        return challenge;
    } catch (error) {
        const err = error as Error;
        logEvent('Join Challenge Error', { message: err.message, challengeId, userId }, 'error');
        throw new AppError('Failed to join challenge', 500);
    }
};

export const completeChallenge = async (
    challengeId: string,
    proof: string,
    isSuccess: boolean
): Promise<IChallenge | null> => {
    try {
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            throw new AppError('Challenge not found', 404);
        }

        if (challenge.isCompleted || challenge.status === 'expired') {
            throw new AppError('Challenge is already completed or expired', 400);
        }

        challenge.isCompleted = true;
        challenge.status = 'completed';
        challenge.proof = proof;

        const ratingChange = isSuccess ? 10 : -5;
        for (const participantId of challenge.participants) {
            await updateUserRating(participantId.toString(), ratingChange);
        }

        await challenge.save();

        logEvent('Challenge Completed', { challengeId, proof, isSuccess }, 'info');
        return challenge;
    } catch (error) {
        const err = error as Error;
        logEvent('Complete Challenge Error', { message: err.message, challengeId, proof, isSuccess }, 'error');
        throw new AppError('Failed to complete challenge', 500);
    }
};

export const expireChallenges = async () => {
    try {
        const now = new Date();
        const expiredChallenges = await Challenge.updateMany(
            { endTime: { $lte: now }, status: 'active' },
            { status: 'expired', isCompleted: true }
        );

        logEvent('Challenges Expired', { expiredCount: expiredChallenges.modifiedCount }, 'info');
    } catch (error) {
        const err = error as Error;
        logEvent('Expire Challenges Error', { message: err.message }, 'error');
        throw new AppError('Failed to expire challenges', 500);
    }
};

export const getPublicChallenges = async (): Promise<IChallenge[]> => {
    try {
        const publicChallenges = await Challenge.find({ isPrivate: false }).sort({ createdAt: -1 }).exec();
        logEvent('Fetched Public Challenges', { count: publicChallenges.length }, 'info');
        return publicChallenges;
    } catch (error) {
        const err = error as Error;
        logEvent('Get Public Challenges Error', { message: err.message }, 'error');
        throw new AppError('Failed to fetch public challenges', 500);
    }
};

export const getChallengeStatistics = async (challengeId: string) => {
    try {
        const reviews = await Review.find({ challenge: challengeId });
        const totalReviews = reviews.length;
        const averageRating = totalReviews ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

        logEvent('Fetched Challenge Statistics', { challengeId, totalReviews, averageRating }, 'info');
        return { totalReviews, averageRating };
    } catch (error) {
        const err = error as Error;
        logEvent('Get Challenge Statistics Error', { message: err.message, challengeId }, 'error');
        throw new AppError('Failed to fetch challenge statistics', 500);
    }
};
