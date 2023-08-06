import { Projects } from '$lib/server/database/models/projects.model';
import { Technology } from '$lib/server/database/models/technologies.model';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { Types } from 'mongoose';

// TODO: Set this to 9 for production
const PER_PAGE_SIZE = 2;

export const GET: RequestHandler = async ({ url }) => {
	const number = url.searchParams.get('number');
	const page = Number(url.searchParams.get('page') ?? 1);
	const technologies = url.searchParams.get('technologies')?.split(',') ?? [];

	let projects;

	if (technologies.length > 0) {
		// Get technologies provided in array of their respective _id attribute
		const filterTechs = (
			await Technology.find({
				name: {
					$in: technologies.map((tech) => new RegExp(tech, 'i'))
				}
			}).exec()
		).reduce((acc, cur) => [...acc, cur._id], [] as Types.ObjectId[]);

		// Find projects with technology id filters
		projects = Projects.find({
			technologies: {
				$in: filterTechs
			}
		}).populate('technologies');
	} else {
		projects = Projects.find({}).populate('technologies');
	}

	// Sort by latest projects
	projects.sort('-createdAt');

	// If an explicit number of projects are specified, there is no need for pagination
	if (number) {
		projects.limit(Number(number));
		return json({
			projects: await projects.exec(),
			paginator: {}
		});
	}

	// All the maths for the necessary data for pagination to work
	const numProjects = await Projects.count();
	const currentPage = Math.max(1, page);

	const totalFilteredProjects = (await projects.exec()).length;
	const results = await projects
		.clone()
		.limit(PER_PAGE_SIZE)
		.skip(PER_PAGE_SIZE * (currentPage - 1))
		.exec();

	const pageCount =
		technologies.length > 0
			? Math.ceil(totalFilteredProjects / PER_PAGE_SIZE)
			: Math.ceil(numProjects / PER_PAGE_SIZE);
	const pageRange = pageCount >= 5 ? 5 : pageCount;

	let pageMin: number;
	if (currentPage - 2 < 1) {
		pageMin = 1;
	} else if (currentPage >= pageCount) {
		pageMin = currentPage - pageRange + 1;
	} else if (currentPage === pageCount - 1) {
		pageMin = currentPage - pageRange + 2;
	} else {
		pageMin = currentPage - 2;
	}

	return json({
		projects: results,
		paginator: { pageCount, currentPage, pageRange, pageMin }
	});
};
