import type { Project } from '$lib/types/project';
import mongoose from 'mongoose';

export interface IProject extends mongoose.Document, Omit<Project, 'technologies'> {
	technologies: mongoose.Schema.Types.ObjectId[];
}

const projectsSchema = new mongoose.Schema<IProject>(
	{
		title: { type: String, required: true },
		link: { type: String, required: true },
		description: { type: String, required: true },
		previewImageUrl: { type: String, required: true },
		technologies: { type: [mongoose.Schema.Types.ObjectId], ref: 'technologies', required: true }
	},
	{ timestamps: { createdAt: true, updatedAt: true } }
);

export const Projects =
	(mongoose.models['projects'] as unknown as mongoose.Model<IProject>) ||
	mongoose.model<IProject>('projects', projectsSchema);
