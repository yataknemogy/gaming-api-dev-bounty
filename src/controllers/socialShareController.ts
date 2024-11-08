import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { IChallenge } from '../models/Challenge';
import { generateSocialShareContent } from '../services/socialShareService';

export const generateSocialShareController = async (req: Request, res: Response) => {
    try {
        const user: IUser = req.body.user;
        const challenge: IChallenge = req.body.challenge;

        const socialContent = generateSocialShareContent(user, challenge);

        res.json(socialContent);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate social share content', error });
    }
};
