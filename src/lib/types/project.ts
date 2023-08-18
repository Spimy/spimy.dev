import type { Paginator } from './paginator';
import type { Technology } from './technology';

export interface Project {
	title: string;
	link: string;
	description: string;
	previewImageUrl: string;
	technologies: Technology[];
	createdAt: string;
	updatedAt: string;
}

export interface ProjectResponse {
	projects: Project[];
	paginator: Paginator;
}
