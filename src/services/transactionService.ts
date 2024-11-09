import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    Keypair,
} from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ONCHAIN_CONFIG } from "../config/config";
import {CLUSTER_TYPES, ICreateTransaction, TransactionError, TransactionResult} from "../types/types";
import logger from "../logger";
import { GenericError } from "../errors/errorHandling";

export const createTransactionService = async (
    clusterUrl: CLUSTER_TYPES,
    data: ICreateTransaction,
    signer: Keypair
): Promise<TransactionResult | TransactionError> => {
    try {
        const nodeURL = ONCHAIN_CONFIG[clusterUrl]?.nodeURL;
        if (!nodeURL) {
            throw new GenericError(`nodeURL is not defined for cluster ${clusterUrl}`, 500);
        }

        const connection = new Connection(nodeURL, "confirmed");
        const instructions: TransactionInstruction[] = [];

        const { blockhash } = await connection.getLatestBlockhash("confirmed");

        if (data.currency === "SOL") {
            const lamports = data.amount * Math.pow(10, 9);
            instructions.push(
                SystemProgram.transfer({
                    fromPubkey: data.accountPublicKey,
                    toPubkey: data.recipientPublicKey,
                    lamports,
                })
            );
        } else {
            const mintAddress = await getMintPublicKeyForCurrency(data.currency, clusterUrl);
            const senderTokenAccount = await getAssociatedTokenAddress(mintAddress, data.accountPublicKey);
            const recipientTokenAccount = await getAssociatedTokenAddress(mintAddress, data.recipientPublicKey);

            const decimals = ONCHAIN_CONFIG[clusterUrl]?.Decimals[data.currency];
            if (decimals === undefined) {
                throw new GenericError(`Decimals not defined for currency ${data.currency}`, 500);
            }

            instructions.push(
                createTransferInstruction(
                    senderTokenAccount,
                    recipientTokenAccount,
                    data.accountPublicKey,
                    data.amount * Math.pow(10, decimals),
                    [],
                    TOKEN_PROGRAM_ID
                )
            );
        }

        const transaction = new Transaction().add(...instructions);
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = signer.publicKey;
        transaction.sign(signer);

        const signature = await connection.sendTransaction(transaction, [signer]);
        logger.info(`[createTransactionService] Successfully sent transaction. Signature: ${signature}`);

        return { success: true, transactionSignature: signature };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`[createTransactionService] Error creating transaction: ${errorMessage}`);
        throw new GenericError(`Error creating transaction: ${errorMessage}`, 500);
    }
};

const getMintPublicKeyForCurrency = async (currency: string, clusterUrl: CLUSTER_TYPES): Promise<PublicKey> => {
    const config = ONCHAIN_CONFIG[clusterUrl];
    switch (currency) {
        case "USDC":
            return config.usdcMintAddress;
        case "BONK":
            return config.bonkMintAddress;
        case "SEND":
            return config.sendMintAddress;
        default:
            throw new GenericError(`Unsupported currency: ${currency}`, 400);
    }
};
