import zod from 'zod';

export const pages: Page[] = [
	{ id: 'home', display: 'Home', path: '/', navbar: true },
	{ id: 'projects', display: 'Projects', path: '/projects', navbar: true },
	{ id: 'contact', display: 'Contact', path: '/contact', navbar: true },
	{ id: 'sitemap', display: 'Sitemap', path: '/sitemap.xml', navbar: false }
];

export const contactFormSchema = zod.object({
	name: zod.string().min(2),
	email: zod.string().email(),
	message: zod.string().min(2)
});
