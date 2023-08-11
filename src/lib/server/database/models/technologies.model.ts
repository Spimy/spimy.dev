import { Document, Schema, model, models } from 'mongoose';

export interface ITechnology extends Document, Technology {}

const technologiesSchema = new Schema<ITechnology>({
	icon: { type: String, unique: true, required: true },
	name: { type: String, unique: true, required: true }
});

export const Technology =
	(models['technologies'] as unknown as ITechnology) ||
	model<ITechnology>('technologies', technologiesSchema);
