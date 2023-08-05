interface Page {
	id: string;
	display: string;
	path: string;
	navbar: boolean;
}

interface Project {
	title: string;
	link: string;
	description: string;
	previewImageUrl: string;
	technologies: string[]; // Will update the type later
	createdAt: string;
	updatedAt: string;
}

type Theme = 'light' | 'dark';
