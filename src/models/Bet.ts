import mongoose, { Document, Schema } from 'mongoose';

export interface IBet extends Document {
    user: mongoose.Types.ObjectId;
    challenge: mongoose.Types.ObjectId;
    amount: number;
    cryptoAddress: string;
    transactionHash: string;
    odds: number;
    isWon: boolean;
    isResolved: boolean;
}

const betSchema: Schema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Types.ObjectId, ref: 'Challenge', required: true },
    amount: { type: Number, required: true },
    cryptoAddress: { type: String, required: true },
    transactionHash: { type: String, required: true },
    odds: { type: Number, default: 1 },
    isWon: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false }
});

export default mongoose.model<IBet>('Bet', betSchema);
