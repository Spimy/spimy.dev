import { getCollection } from 'astro:content';

export const CODING_START_YEAR = 2016;
export const GITHUB_USERNAME = 'Spimy';
export const ANILIST_USERNAME = 'Spimy';
export const X_USERNAME = 'OfficialSpimy';
export const DISCORD_URL = 'https://discord.spimy.dev';
export const REPO_URL = `https://github.com/${GITHUB_USERNAME}/spimy.dev`;
export const LINKEDIN_URL =
  'https://www.linkedin.com/in/william-law-hong-waye/';

export function getYearsCoding(): number {
  return new Date().getFullYear() - CODING_START_YEAR;
}

export async function getProjectCount(): Promise<number> {
  return (await getCollection('projects')).length;
}

export interface Cutscene {
  id: string;
  title: string;
  meta: string;
  note: string;
}

export const cutscenes: Cutscene[] = [
  {
    id: 'uCLp_x-FUKE',
    title: 'Malay Language Oral Test',
    meta: 'Sunway University · Mar 2024',
    note: 'Scripted and edited in DaVinci Resolve.',
  },
  {
    id: 'PoGLyc7fTL8',
    title: 'Digital Transformation ft. ZUS Coffee',
    meta: 'Sunway University · Dec 2024',
    note: 'Group presentation, edited in DaVinci Resolve.',
  },
];
