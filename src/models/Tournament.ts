import mongoose, { Document, Schema } from 'mongoose';

export interface ITournament extends Document {
    name: string;
    description: string;
    participants: mongoose.Types.ObjectId[];
    currentRound: number;
    prizePool: number;
    isActive: boolean;
    createdAt: Date;
}

const tournamentSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    participants: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    currentRound: { type: Number, default: 1 },
    prizePool: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITournament>('Tournament', tournamentSchema);
