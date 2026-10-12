import { getCollection } from 'astro:content';

export const CODING_START_YEAR = 2016;
export const GITHUB_USERNAME = 'Spimy';
export const ANILIST_USERNAME = 'Spimy';

export function getYearsCoding(): number {
  return new Date().getFullYear() - CODING_START_YEAR;
}

export async function getProjectCount(): Promise<number> {
  return (await getCollection('projects')).length;
}
