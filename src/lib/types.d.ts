interface Page {
	id: string;
	display: string;
	path: string;
	navbar: boolean;
}

interface SocialLink {
	name: string;
	url: string;
	icon: IconDefinition;
}

interface Technology {
	icon: string;
	name: string;
}

interface Project {
	title: string;
	link: string;
	description: string;
	previewImageUrl: string;
	technologies: Technology[];
	createdAt: string;
	updatedAt: string;
}

interface Paginator {
	pageCount: number;
	currentPage: number;
	pageRange: number;
	pageMin: number;
}

interface ProjectResponse {
	projects: Project[];
	paginator: Paginator;
}

interface TechnologyResponse {
	technologies: Technology[];
}

type Theme = 'light' | 'dark';
