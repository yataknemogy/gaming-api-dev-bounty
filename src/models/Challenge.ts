import mongoose, { Document, Schema } from 'mongoose';
import { ChallengeCategory } from '../types/types';

export interface IChallenge extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    creator: mongoose.Types.ObjectId;
    participants: mongoose.Types.ObjectId[];
    stakeAmount: number;
    proof: string;
    isCompleted: boolean;
    createdAt: Date;
    category: ChallengeCategory;
    status: 'pending' | 'active' | 'completed' | 'expired';
    difficulty: 'easy' | 'medium' | 'hard';
    rewardMultiplier: number;
}

const challengeSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    stakeAmount: { type: Number, required: true },
    proof: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    category: {
        type: String,
        enum: Object.values(ChallengeCategory),
        required: true,
        default: ChallengeCategory.ADVENTURE
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'expired'],
        default: 'pending'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    rewardMultiplier: { type: Number, default: 1 },
    isPrivate: { type: Boolean, default: false }
});

export default mongoose.model<IChallenge>('Challenge', challengeSchema);
