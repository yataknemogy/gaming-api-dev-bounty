import mongoose from 'mongoose';
import Tournament, { ITournament } from '../models/Tournament';
import { AppError } from '../utils/errorHandler';
import { logEvent } from '../utils/logger';

export const createTournament = async (
    name: string,
    description: string,
    prizePool: number
): Promise<ITournament> => {
    try {
        const tournament = new Tournament({ name, description, prizePool });
        await tournament.save();

        logEvent('Tournament Created', { tournamentId: tournament._id, name }, 'info');
        return tournament;
    } catch (error) {
        const err = error as Error;
        logEvent('Create Tournament Error', { message: err.message, name }, 'error');
        throw new AppError('Failed to create tournament', 500);
    }
};

export const addParticipant = async (tournamentId: string, userId: string): Promise<ITournament | null> => {
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            throw new AppError('Tournament not found', 404);
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);
        if (tournament.participants.includes(userObjectId)) {
            throw new AppError('User is already a participant in this tournament', 400);
        }

        tournament.participants.push(userObjectId);
        await tournament.save();

        logEvent('Participant Added to Tournament', { tournamentId, userId }, 'info');
        return tournament;
    } catch (error) {
        const err = error as Error;
        logEvent('Add Participant Error', { message: err.message, tournamentId, userId }, 'error');
        throw new AppError('Failed to add participant', 500);
    }
};

export const advanceToNextRound = async (tournamentId: string): Promise<ITournament | null> => {
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            throw new AppError('Tournament not found', 404);
        }

        if (!tournament.isActive) {
            throw new AppError('Tournament has already ended', 400);
        }

        tournament.currentRound += 1;
        await tournament.save();

        logEvent('Tournament Advanced to Next Round', { tournamentId, currentRound: tournament.currentRound }, 'info');
        return tournament;
    } catch (error) {
        const err = error as Error;
        logEvent('Advance Tournament Round Error', { message: err.message, tournamentId }, 'error');
        throw new AppError('Failed to advance to the next round', 500);
    }
};

export const endTournament = async (tournamentId: string): Promise<ITournament | null> => {
    try {
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            throw new AppError('Tournament not found', 404);
        }

        tournament.isActive = false;
        await tournament.save();

        logEvent('Tournament Ended', { tournamentId, prizePool: tournament.prizePool }, 'info');
        return tournament;
    } catch (error) {
        const err = error as Error;
        logEvent('End Tournament Error', { message: err.message, tournamentId }, 'error');
        throw new AppError('Failed to end tournament', 500);
    }
};
