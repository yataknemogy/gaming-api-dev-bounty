import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    accountPublicKey: string;
    recipientPublicKey: string;
    currency: string;
    amount: number;
    cluster: string;
    transactionSignature: string;
    createdAt: Date;
}

const TransactionSchema = new Schema({
    accountPublicKey: { type: String, required: true },
    recipientPublicKey: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    cluster: { type: String, required: true },
    transactionSignature: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
