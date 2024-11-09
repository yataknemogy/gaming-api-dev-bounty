import {IPlaceBet, ResultWithError, BetResult, CLUSTER_TYPES} from '../types/types';
import axios from 'axios';
import { ONCHAIN_CONFIG } from '../config/config';
import logger from '../logger';

export const placeBetService = async (clusterUrl: CLUSTER_TYPES, betData: IPlaceBet): Promise<ResultWithError<BetResult>> => {
    const baseUrl = ONCHAIN_CONFIG[clusterUrl].BackendURL;
    const partnerApiKey = ONCHAIN_CONFIG[clusterUrl].partnerApiKey;

    try {
        const response = await axios.post(`${baseUrl}/bet`, betData, {
            headers: { 'x-api-key': partnerApiKey },
            timeout: 100000,
        });

        if (!response.data.success || !response.data.transactionSignature) {
            throw new Error('Invalid response from the server');
        }

        return {
            data: {
                success: true,
                betID: response.data.betID,
                transactionSignature: response.data.transactionSignature,
            },
            error: null,
        };
    } catch (error) {
        logger.error(`Error placing bet: ${error}`);
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const getBetStatusService = async (clusterUrl: CLUSTER_TYPES, betID: number): Promise<ResultWithError<BetResult>> => {
    const baseUrl = ONCHAIN_CONFIG[clusterUrl].BackendURL;
    const partnerApiKey = ONCHAIN_CONFIG[clusterUrl].partnerApiKey;

    try {
        const response = await axios.get(`${baseUrl}/bet/${betID}`, {
            headers: { 'x-api-key': partnerApiKey },
            timeout: 100000,
        });

        if (!response.data.success) {
            throw new Error('Invalid response from the server');
        }

        return {
            data: {
                success: true,
                betID: response.data.betID,
                transactionSignature: response.data.transactionSignature,
            },
            error: null,
        };
    } catch (error) {
        logger.error(`Error fetching bet status: ${error}`);
        return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};
