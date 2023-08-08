import { Document, Schema, model } from 'mongoose';

export interface ITechnology extends Document, Technology {}

const technologiesSchema = new Schema<ITechnology>({
	icon: { type: String, unique: true, required: true },
	name: { type: String, unique: true, required: true }
});

export const Technology = model<ITechnology>('technologies', technologiesSchema);
