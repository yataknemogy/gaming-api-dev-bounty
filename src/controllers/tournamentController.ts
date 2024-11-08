import { Request, Response } from 'express';
import {
    createTournament,
    addParticipant,
    advanceToNextRound,
    endTournament
} from '../services/tournamentService';
import { AppError } from '../utils/errorHandler';

export const createTournamentController = async (req: Request, res: Response) => {
    try {
        const { name, description, prizePool } = req.body;
        const tournament = await createTournament(name, description, prizePool);
        res.status(201).json(tournament);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to create tournament', error });
        }
    }
};

export const addParticipantController = async (req: Request, res: Response) => {
    try {
        const { tournamentId } = req.params;
        const { userId } = req.body;
        const tournament = await addParticipant(tournamentId, userId);
        res.json(tournament);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to add participant', error });
        }
    }
};

export const advanceToNextRoundController = async (req: Request, res: Response) => {
    try {
        const { tournamentId } = req.params;
        const tournament = await advanceToNextRound(tournamentId);
        res.json(tournament);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to advance to the next round', error });
        }
    }
};

export const endTournamentController = async (req: Request, res: Response) => {
    try {
        const { tournamentId } = req.params;
        const tournament = await endTournament(tournamentId);
        res.json(tournament);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Failed to end tournament', error });
        }
    }
};
