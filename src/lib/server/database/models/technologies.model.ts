import { Document, Schema, model } from 'mongoose';

export interface ITechnology extends Document {
	icon: string;
	name: string;
}

const technologiesSchema = new Schema<ITechnology>({
	icon: { type: String, required: true },
	name: { type: String, required: true }
});

export const Technology = model<ITechnology>('technologies', technologiesSchema);
