import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export interface TagOption {
	slug: string;
	label: string;
	count: number;
}

/** "Node.js" -> "node-js". Used as the value in the URL (?tech=node-js). */
export function tagSlug(tag: string): string {
	return tag
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export async function getProjects(): Promise<Project[]> {
	const projects = await getCollection('projects');
	// Newest first. Projects with the same date are sorted by title.
	return projects.sort(
		(a, b) =>
			b.data.date.localeCompare(a.data.date) ||
			a.data.title.localeCompare(b.data.title),
	);
}

/** Every tag used by at least one project, most used first. */
export function getTagOptions(projects: Project[]): TagOption[] {
	const options = new Map<string, TagOption>();

	for (const project of projects) {
		for (const label of project.data.tags) {
			const slug = tagSlug(label);
			const existing = options.get(slug);
			if (existing) existing.count += 1;
			else options.set(slug, { slug, label, count: 1 });
		}
	}

	return [...options.values()].sort(
		(a, b) => b.count - a.count || a.label.localeCompare(b.label),
	);
}

/**
 * A project is kept when it matches the search text (title, caption or
 * summary) AND uses every one of the selected tags.
 */
export function filterProjects(
	projects: Project[],
	{ query, tags }: { query: string; tags: string[] },
): Project[] {
	const needle = query.trim().toLowerCase();

	return projects.filter(({ data }) => {
		const haystack = `${data.title} ${data.context ?? ''} ${data.summary}`.toLowerCase();
		if (needle && !haystack.includes(needle)) return false;

		const slugs = data.tags.map(tagSlug);
		return tags.every((tag) => slugs.includes(tag));
	});
}
