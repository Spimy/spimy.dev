import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export interface TagOption {
  slug: string;
  label: string;
  count: number;
}

/** "Node.js" -> "node-js". Used as the value in the URL (?tech=node-js) */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  // Newest first. Projects with the same date are sorted by title
  return projects.sort(
    (a, b) =>
      b.data.date.localeCompare(a.data.date) ||
      a.data.title.localeCompare(b.data.title),
  );
}

/** Every tag used by at least one project, most used first */
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
    const haystack =
      `${data.title} ${data.context ?? ''} ${data.summary}`.toLowerCase();
    if (needle && !haystack.includes(needle)) return false;

    const slugs = data.tags.map(tagSlug);
    return tags.every((tag) => slugs.includes(tag));
  });
}

/** Projects per page, on the Inventory page and in /api/projects */
export const PAGE_SIZE = 9;

export interface ProjectQuery {
  query: string;
  tags: string[];
  page: number;
}

/**
 * Reads ?q=, ?tech= and ?page= from a URL. Unknown tech slugs are dropped, and a missing or broken page number becomes 1
 * Shared by the Inventory page and /api/projects, so both read the same URL the same way
 */
export function readProjectQuery(
  params: URLSearchParams,
  tagOptions: TagOption[],
): ProjectQuery {
  const knownSlugs = new Set(tagOptions.map((tag) => tag.slug));

  return {
    query: (params.get('q') ?? '').trim().slice(0, 100),
    tags: [...new Set(params.getAll('tech'))].filter((slug) =>
      knownSlugs.has(slug),
    ),
    page: Math.floor(Number(params.get('page'))) || 1,
  };
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  requestedPage: number,
  pageSize = PAGE_SIZE,
): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(requestedPage, 1), totalPages);

  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
}
