import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    challenge: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number; 
    comment: string;
    createdAt: Date;
}

const reviewSchema: Schema = new Schema({
    challenge: { type: mongoose.Types.ObjectId, ref: 'Challenge', required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReview>('Review', reviewSchema);
