import { Request, Response } from 'express';
import { generateAIDescriptionService } from '../services/descriptionService';
import { validateParameters } from '../utils/validation';
import { GenericError } from '../errors/errorHandling';

export const generateAIDescription = async (req: Request, res: Response) => {
    try {
        const { name, participationType } = req.body;

        validateParameters('name', !!name, 'Name is required');
        validateParameters('participationType', !!participationType, 'Participation type is required');

        const result = await generateAIDescriptionService(name, participationType);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof GenericError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error generating AI description', error });
        }
    }
};
