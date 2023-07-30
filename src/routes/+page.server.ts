import { pages } from '$lib/global';
import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	setTheme: async ({ url, cookies }) => {
		const newTheme = url.searchParams.get('theme') as Theme | null;
		const redirectTo = url.searchParams.get('redirectTo');

		if (newTheme) {
			cookies.set('theme', newTheme, {
				path: '/',
				maxAge: 60 * 60 * 24 * 365
			});
		}

		if (!pages.some((page) => page.path === redirectTo)) throw redirect(303, '/');
		throw redirect(302, redirectTo ?? '/');
	}
};
