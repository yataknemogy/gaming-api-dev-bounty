import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    publicKey: string;
    balance: number;
    rating: number;
    createdAt: Date;
}

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    publicKey: { type: String, unique: true, required: true },
    balance: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', userSchema);
