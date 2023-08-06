import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const page = Number(url.searchParams.get('page') ?? 1) || 1;
	const technologies = url.searchParams.get('technologies');

	let apiRoute = `/api/projects?page=${page}`;
	if (technologies) apiRoute += `&technologies=${technologies}`;

	const response: ProjectResponse = await fetch(apiRoute).then((response) => response.json());
	return { ...response };
};
