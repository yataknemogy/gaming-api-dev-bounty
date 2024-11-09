import { Request, Response } from 'express';
import { createTransactionService } from '../services/transactionService';
import {CLUSTER_TYPES, ICreateTransaction} from '../types/types';
import { validateParameters } from '../utils/validation';
import { GenericError } from '../errors/errorHandling';
import { Keypair, Connection } from '@solana/web3.js';
import { ONCHAIN_CONFIG } from '../config/config';

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { accountPublicKey, recipientPublicKey, currency, amount } = req.body;

        validateParameters('accountPublicKey', !!accountPublicKey, 'Account public key is required');
        validateParameters('recipientPublicKey', !!recipientPublicKey, 'Recipient public key is required');
        validateParameters('currency', !!currency, 'Currency is required');
        validateParameters('amount', amount > 0, 'Amount must be greater than zero');

        const connection = new Connection(ONCHAIN_CONFIG.devnet.nodeURL, 'confirmed');
        const cluster = 'devnet';

        const signer = Keypair.generate();

        const transactionData: ICreateTransaction = {
            accountPublicKey,
            recipientPublicKey,
            currency,
            amount,
            connection,
            cluster,
        };

        const result = await createTransactionService(CLUSTER_TYPES.DEVNET, transactionData, signer);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof GenericError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error creating transaction', error });
        }
    }
};
