import mongoose, { Document, Schema } from 'mongoose';

export interface ITournament extends Document {
    TournamentName: string;
    TournamentDescription: string;
    StartDate: Date;
    EndDate: Date;
    cluster: string;
    createdAt: Date;
}

const TournamentSchema = new Schema({
    TournamentName: { type: String, required: true },
    TournamentDescription: { type: String, required: true },
    StartDate: { type: Date, required: true },
    EndDate: { type: Date, required: true },
    cluster: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITournament>('Tournament', TournamentSchema);
