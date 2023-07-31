import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	let theme: Theme | null = null;

	const newTheme = event.url.searchParams.get('theme') as Theme | null;
	const cookieTheme = event.cookies.get('theme') as Theme | undefined;

	if (newTheme) {
		theme = newTheme;
	} else if (cookieTheme) {
		theme = cookieTheme;
	}

	return await resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('data-theme=""', `data-theme="${theme ?? 'light'}"`)
	});
};
