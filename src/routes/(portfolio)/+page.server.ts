import { pages } from '$lib/global';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

function calculateAge(date: string) {
	const timeDiff = Math.abs(Date.now() - new Date(date).getTime());
	return Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
}

export const load: PageServerLoad = async ({ fetch }) => {
	const projects: Project[] = await fetch('/api/projects?number=3').then((response) =>
		response.json()
	);

	return {
		age: calculateAge('2003/01/30'),
		experienceYears: calculateAge('2016'),
		projects
	};
};

export const actions: Actions = {
	setTheme: async ({ url, cookies }) => {
		const newTheme = url.searchParams.get('theme') as Theme | null;
		const redirectTo = url.searchParams.get('redirectTo');

		if (newTheme) {
			cookies.set('theme', newTheme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365,
				secure: false
			});
		}

		if (!pages.some((page) => page.path === redirectTo)) throw redirect(303, '/');
		throw redirect(302, redirectTo ?? '/');
	}
};
