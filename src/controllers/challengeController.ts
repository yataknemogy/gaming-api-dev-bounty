import { Request, Response, NextFunction } from 'express';
import { createChallengeService, getChallengeByIdService, getChallengeShareLink } from '../services/challengeService';
import { CLUSTER_TYPES, ICreateChallenge } from '../types/types';
import { GenericError } from '../errors/errorHandling';

export const createChallenge = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const challengeData: ICreateChallenge = req.body;
        const clusterUrl = req.query.cluster as CLUSTER_TYPES;

        if (!clusterUrl) {
            throw new GenericError('Cluster URL is required.', 400);
        }

        const result = await createChallengeService(clusterUrl, challengeData);

        if (result.error) {
            throw new GenericError(`Error creating challenge: ${result.error}`, 500);
        }

        res.status(201).json(result.data);
    } catch (error) {
        next(error);
    }
};

export const getChallengeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const clusterUrl = req.query.cluster as CLUSTER_TYPES;

        if (!clusterUrl) {
            throw new GenericError('Cluster URL is required.', 400);
        }

        const result = await getChallengeByIdService(clusterUrl, Number(id));

        if (result.error) {
            throw new GenericError(`Error fetching challenge: ${result.error}`, 500);
        }

        res.status(200).json(result.data);
    } catch (error) {
        next(error);
    }
};

export const getChallengeShareLinkHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const clusterUrl = req.query.cluster as CLUSTER_TYPES;

        if (!clusterUrl || !slug) {
            throw new GenericError('Cluster URL and slug are required.', 400);
        }

        const result = await getChallengeShareLink(clusterUrl, slug);

        if (result.error) {
            throw new GenericError(`Failed to fetch challenge share link: ${result.error}`, 500);
        }

        res.status(200).json({ shareLink: result.data });
    } catch (error) {
        next(error);
    }
};
