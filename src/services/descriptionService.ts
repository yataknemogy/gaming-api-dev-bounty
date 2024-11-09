import axios from 'axios';
import { ONCHAIN_CONFIG } from '../config/config';
import logger from '../logger';
import { GenericError } from '../errors/errorHandling';

const baseUrl = ONCHAIN_CONFIG.devnet.BackendURL;
const partnerApiKey = ONCHAIN_CONFIG.devnet.partnerApiKey;

export const generateAIDescriptionService = async (name: string, participationType: string) => {
    try {
        const response = await axios.post(`${baseUrl}/generate-description-x-api-key/`, {
            prompt: name,
            participation_type: participationType,
            result_type: 'voting',
        }, {
            headers: { 'x-api-key': partnerApiKey, 'Content-Type': 'application/json' },
            timeout: 200000,
        });
        return { data: response.data, error: null };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Error generating AI description: ${errorMessage}`);
        throw new GenericError(`Error generating AI description: ${errorMessage}`, 500);
    }
};
