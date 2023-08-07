import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('page') ?? 1) || 1;
	const technologies = url.searchParams.get('technologies');

	let apiRoute = `/api/projects?page=${page}`;
	if (technologies) apiRoute += `&technologies=${technologies}`;

	const projectResponse: ProjectResponse = await fetch(apiRoute).then((response) =>
		response.json()
	);
	const technologyResponse: TechnologyResponse = await fetch('/api/technologies').then((response) =>
		response.json()
	);
	return { ...projectResponse, ...technologyResponse };
};

export const actions: Actions = {
	filterProjects: async ({ request }) => {
		const form = await request.formData();
		const technologies = form.getAll('technologies');
		if (technologies.length === 0) throw redirect(302, `?page=1`);
		throw redirect(302, `?page=1&technologies=${technologies}`);
	}
};
