import { Projects } from '$lib/server/database/models/projects.model';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const number = url.searchParams.get('number');

	const projects = Projects.find({}).populate('technologies').sort('-createdAt');
	if (number) projects.limit(Number(number));

	return json(await projects);
};
