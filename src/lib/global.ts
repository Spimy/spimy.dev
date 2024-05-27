import {
	faDiscord,
	faGithub,
	faInstagram,
	faLinkedin,
	faYoutube
} from '@fortawesome/free-brands-svg-icons';
import type { Page } from './types/page';
import type { SocialLink } from './types/social-link';

export const pages: Page[] = [
	{ id: 'home', display: 'Home', path: '/', navbar: true },
	{ id: 'projects', display: 'Projects', path: '/projects', navbar: true },
	{ id: 'contact', display: 'Contact', path: '/contact', navbar: true },
	{ id: 'sitemap', display: 'Sitemap', path: '/sitemap.xml', navbar: false }
];

export const socialLinks: SocialLink[] = [
	{ name: 'YouTube', url: 'https://youtube.com/@officialspimy', icon: faYoutube },
	{ name: 'Instagram', url: 'hhttps://instagram.com/william3001_lhw', icon: faInstagram },
	{ name: 'GitHub', url: 'https://github.com/spimy', icon: faGithub },
	{ name: 'Discord', url: 'https://discord.spimy.dev', icon: faDiscord },
	{ name: 'LinkedIn', url: 'https://www.linkedin.com/in/william-law-hong-waye/', icon: faLinkedin }
];
