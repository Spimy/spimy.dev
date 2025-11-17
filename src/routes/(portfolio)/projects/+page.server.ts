import type { ProjectResponse } from '$lib/types/project';
import type { TechnologyResponse } from '$lib/types/technology';
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
	return {
		...projectResponse,
		...technologyResponse,
		searchParams: url.searchParams.toString()
	};
};

export const actions: Actions = {
	filterProjects: async ({ request }) => {
		const form = await request.formData();
		const technologies = Object.keys(Object.fromEntries(form)).filter(
			(x) => x !== 'technologies-toggle'
		);
		if (technologies.length === 0) redirect(302, `?page=1`);
		redirect(302, `?page=1&technologies=${technologies}`);
	}
};
