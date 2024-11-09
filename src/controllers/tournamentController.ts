import { Request, Response } from 'express';
import { createTournamentService, getTournamentByIdService } from '../services/tournamentService';
import { ICreateTournament, CLUSTER_TYPES } from '../types/types';
import { calculateTimeRange } from '../utils/time';
import { validateParameters } from '../utils/validation';
import { GenericError } from '../errors/errorHandling';

export const createTournament = async (req: Request, res: Response) => {
    try {
        const { TournamentName, TournamentDescription, StartDate, Duration, cluster } = req.body;

        validateParameters('TournamentName', !!TournamentName, 'Tournament name is required');
        validateParameters('StartDate', !!StartDate, 'Start date is required');
        validateParameters('Duration', !!Duration, 'Duration is required');

        const clusterUrl = cluster as CLUSTER_TYPES;
        if (!Object.values(CLUSTER_TYPES).includes(clusterUrl)) {
            throw new GenericError('Invalid cluster URL', 400);
        }

        const { startDate, endDate } = calculateTimeRange(StartDate, Duration);

        const tournamentData: ICreateTournament = {
            ...req.body,
            StartDate: startDate,
            EndDate: endDate,
        };

        const result = await createTournamentService(clusterUrl, tournamentData);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof GenericError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error creating tournament', error });
        }
    }
};

export const getTournamentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { cluster } = req.query;
        const tournamentId = Number(id);

        validateParameters('Tournament ID', !isNaN(tournamentId) && tournamentId > 0, 'Invalid tournament ID');
        const clusterUrl = cluster as CLUSTER_TYPES;

        if (!Object.values(CLUSTER_TYPES).includes(clusterUrl)) {
            throw new GenericError('Invalid cluster URL', 400);
        }

        const result = await getTournamentByIdService(clusterUrl, tournamentId);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof GenericError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error fetching tournament by ID', error });
        }
    }
};
