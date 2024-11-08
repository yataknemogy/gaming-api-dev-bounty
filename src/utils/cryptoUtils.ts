import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import dotenv from 'dotenv';

dotenv.config();

const CAT5_MINT_ADDRESS = process.env.CAT5_MINT_ADDRESS!;
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL!;

export const verifyTransaction = async (transactionHash: string, amount: number, recipientAddress: string): Promise<boolean> => {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const transaction = await connection.getParsedTransaction(transactionHash, 'confirmed');

    if (transaction && transaction.meta) {
        const transferInstruction = transaction.transaction.message.instructions.find(
            (instr: any) =>
                instr.programId === TOKEN_PROGRAM_ID &&
                instr.parsed?.info?.destination === recipientAddress &&
                instr.parsed?.info?.mint === CAT5_MINT_ADDRESS &&
                instr.parsed?.info?.amount === amount
        );
        return !!transferInstruction;
    }
    return false;
};

export const sendPrizeToWinner = async (fromPrivateKey: string, toPublicKey: string, amount: number) => {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const from = Keypair.fromSecretKey(Buffer.from(fromPrivateKey, 'hex'));
    const to = new PublicKey(toPublicKey);
    const fromTokenAccount = await getAssociatedTokenAddress(new PublicKey(CAT5_MINT_ADDRESS), from.publicKey);
    const toTokenAccount = await getAssociatedTokenAddress(new PublicKey(CAT5_MINT_ADDRESS), to);

    const transaction = new Transaction().add(
        createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            from.publicKey,
            amount,
            [],
            TOKEN_PROGRAM_ID
        )
    );

    const signature = await connection.sendTransaction(transaction, [from]);
    await connection.confirmTransaction(signature);
    console.log(`CAT5 token transfer confirmed with signature: ${signature}`);
};
