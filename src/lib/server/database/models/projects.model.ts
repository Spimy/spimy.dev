import { Document, Schema, model } from 'mongoose';
import { Technology } from './technologies.model';

export interface IProject extends Document, Omit<Project, 'technologies'> {
	technologies: Schema.Types.ObjectId[];
}

const projectsSchema = new Schema<IProject>(
	{
		title: { type: String, required: true },
		link: { type: String, required: true },
		description: { type: String, required: true },
		previewImageUrl: { type: String, required: true },
		technologies: { type: [Schema.Types.ObjectId], ref: Technology, required: true }
	},
	{ timestamps: { createdAt: true, updatedAt: true } }
);

export const Projects = model<IProject>('projects', projectsSchema);
