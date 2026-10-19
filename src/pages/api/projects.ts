import type { APIRoute } from 'astro';
import {
  PAGE_SIZE,
  filterProjects,
  getProjects,
  getTagOptions,
  paginate,
  readProjectQuery,
} from '../../lib/projects';

export const prerender = false;

/** Used to avoid querying too many projects at once like 1000+ which can cause performance issues */
const MAX_LIMIT = 50;

/**
 * Paginated list of projects, for other potential use cases
 */
export const GET: APIRoute = async ({ url }) => {
  const projects = await getProjects();
  const { query, tags, page } = readProjectQuery(
    url.searchParams,
    getTagOptions(projects),
  );

  // Limit the number of projects returned to avoid performance issues following page size by default
  const limit = Math.min(
    Math.max(Math.floor(Number(url.searchParams.get('limit'))) || PAGE_SIZE, 1),
    MAX_LIMIT,
  );

  const result = paginate(
    filterProjects(projects, { query, tags }),
    page,
    limit,
  );

  return Response.json(
    {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
      projects: result.items.map(({ id, data }) => ({ id, ...data })),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
};
