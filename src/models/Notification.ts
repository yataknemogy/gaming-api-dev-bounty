import mongoose, { Document, Schema } from 'mongoose';
import { NOTIFICATION_TYPE } from '../types/types';

export interface INotification extends Document {
    userId: string;
    title: string;
    message: string;
    type: NOTIFICATION_TYPE;
    challengeId?: string;
    tournamentId?: string;
    status?: string;
    currency?: string;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: Object.values(NOTIFICATION_TYPE), required: true },
    challengeId: { type: String },
    tournamentId: { type: String },
    status: { type: String },
    currency: { type: String },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
