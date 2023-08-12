import { pages } from '$lib/global';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

function calculateAge(date: string) {
	const timeDiff = Math.abs(Date.now() - new Date(date).getTime());
	return Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
}

export const load: PageServerLoad = async ({ fetch }) => {
	const projectResponse: ProjectResponse = await fetch('/api/projects?number=3').then((response) =>
		response.json()
	);
	const technologyResponse: TechnologyResponse = await fetch('/api/technologies').then((response) =>
		response.json()
	);

	return {
		age: calculateAge('2003/01/30'),
		experienceYears: calculateAge('2016'),
		...projectResponse,
		...technologyResponse
	};
};

export const actions: Actions = {
	setTheme: async ({ url, cookies }) => {
		const newTheme = url.searchParams.get('theme') as Theme | null;
		const redirectTo = url.searchParams.get('redirectTo');
		const searchParams = url.searchParams.get('searchParams');

		if (newTheme) {
			cookies.set('theme', newTheme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
				secure: false
			});
		}

		if (!pages.some((page) => page.path === redirectTo)) throw redirect(303, '/');

		if (!searchParams) throw redirect(302, redirectTo ?? '/');
		throw redirect(302, `${redirectTo}?${searchParams?.split(',').join('&')}`);
	}
};
