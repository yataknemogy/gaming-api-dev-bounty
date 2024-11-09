import mongoose, { Schema, Document } from 'mongoose';
import { VERIFIED_CURRENCY, CHALLENGE_CATEGORIES } from '../types/types';

export interface IChallenge extends Document {
    ChallengeName: string;
    ChallengeDescription: string;
    StartDate: number;
    EndDate: number;
    GameID: number;
    Wager: number;
    Target: number;
    AllowSideBets: boolean;
    SideBetsWager: number;
    Currency: VERIFIED_CURRENCY;
    ChallengeCategory: CHALLENGE_CATEGORIES;
    UserAddress?: string;
}

const ChallengeSchema: Schema = new Schema({
    ChallengeName: { type: String, required: true },
    ChallengeDescription: { type: String, required: true },
    StartDate: { type: Number, required: true },
    EndDate: { type: Number, required: true },
    GameID: { type: Number, required: true },
    Wager: { type: Number, required: true },
    Target: { type: Number, required: true },
    AllowSideBets: { type: Boolean, required: true },
    SideBetsWager: { type: Number, required: true },
    Currency: { type: String, enum: Object.values(VERIFIED_CURRENCY), required: true },
    ChallengeCategory: { type: String, enum: Object.values(CHALLENGE_CATEGORIES), required: true },
    UserAddress: { type: String, required: false },
});

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);
