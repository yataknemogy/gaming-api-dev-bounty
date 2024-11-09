import axios from 'axios';
import { ONCHAIN_CONFIG } from '../config/config';
import { ICreateChallenge, IChallengeById, ResultWithError, CLUSTER_TYPES, CHALLENGE_STATE } from '../types/types';
import { GenericError } from '../errors/errorHandling';
import Challenge from '../models/Challenge';
import logger from '../logger';
import { PublicKey } from '@solana/web3.js';

export const createChallengeService = async (
    clusterUrl: CLUSTER_TYPES,
    challengeData: ICreateChallenge
): Promise<ResultWithError> => {
    const baseUrl = ONCHAIN_CONFIG[clusterUrl]?.BackendURL;
    const partnerApiKey = ONCHAIN_CONFIG[clusterUrl]?.partnerApiKey;

    if (!baseUrl || !partnerApiKey) {
        throw new GenericError(`Configuration missing for cluster ${clusterUrl}`, 500);
    }

    try {
        const response = await axios.post(`${baseUrl}/challenge`, challengeData, {
            headers: { 'x-api-key': partnerApiKey, 'Content-Type': 'application/json' },
            timeout: 100000,
        });

        const createdChallenge = response.data.data;

        const challengeDoc = new Challenge({
            ChallengeName: challengeData.ChallengeName,
            ChallengeDescription: challengeData.ChallengeDescription,
            StartDate: challengeData.StartDate,
            EndDate: challengeData.EndDate,
            GameID: challengeData.GameID,
            Wager: challengeData.Wager,
            Target: challengeData.Target,
            AllowSideBets: challengeData.AllowSideBets,
            SideBetsWager: challengeData.SideBetsWager,
            Currency: challengeData.Currency,
            ChallengeCategory: challengeData.ChallengeCategory,
            UserAddress: challengeData.UserAddress,
        });

        await challengeDoc.save();

        return { data: createdChallenge, error: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error creating challenge: ${errorMessage}`);
        throw new GenericError(`Error creating challenge: ${errorMessage}`, 500);
    }
};

export const getChallengeByIdService = async (
    clusterUrl: CLUSTER_TYPES,
    challengeId: number
): Promise<ResultWithError<IChallengeById>> => {
    const baseUrl = ONCHAIN_CONFIG[clusterUrl]?.BackendURL;
    const partnerApiKey = ONCHAIN_CONFIG[clusterUrl]?.partnerApiKey;

    if (!baseUrl || !partnerApiKey) {
        throw new GenericError(`Configuration missing for cluster ${clusterUrl}`, 500);
    }

    try {
        const localChallenge = await Challenge.findOne({ ChallengeID: challengeId });
        if (localChallenge) {
            const challengeData: IChallengeById = {
                ChallengeID: challengeId,
                ChallengeName: localChallenge.ChallengeName,
                ChallengeDescription: localChallenge.ChallengeDescription,
                StartDate: localChallenge.StartDate,
                EndDate: localChallenge.EndDate,
                State: CHALLENGE_STATE.UPCOMING,
                MaxParticipants: 100,
                Currency: localChallenge.Currency,
                Category: localChallenge.ChallengeCategory,
                ChallengeCreator: new PublicKey(localChallenge.UserAddress || ""),
                GameID: localChallenge.GameID,
            };
            return { data: challengeData, error: null };
        }

        // Запрашиваем вызов по ID у внешнего API
        const response = await axios.get(`${baseUrl}/challenge/${challengeId}`, {
            headers: { 'x-api-key': partnerApiKey, 'Content-Type': 'application/json' },
            timeout: 100000,
        });

        const fetchedChallenge = response.data.data as IChallengeById;

        const challengeDoc = new Challenge({
            ChallengeName: fetchedChallenge.ChallengeName,
            ChallengeDescription: fetchedChallenge.ChallengeDescription,
            StartDate: fetchedChallenge.StartDate,
            EndDate: fetchedChallenge.EndDate,
            GameID: fetchedChallenge.GameID,
            Currency: fetchedChallenge.Currency,
            ChallengeCategory: fetchedChallenge.Category,
            UserAddress: fetchedChallenge.ChallengeCreator.toString(),
        });

        await challengeDoc.save();

        return { data: fetchedChallenge, error: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error fetching challenge by ID: ${errorMessage}`);
        throw new GenericError(`Error fetching challenge by ID: ${errorMessage}`, 500);
    }
};
