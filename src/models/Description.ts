import mongoose, { Document, Schema } from 'mongoose';

export interface IDescription extends Document {
    name: string;
    participationType: string;
    description: string;
    createdAt: Date;
}

const DescriptionSchema = new Schema({
    name: { type: String, required: true },
    participationType: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDescription>('Description', DescriptionSchema);
