import { Technology } from '$lib/server/database/models/technologies.model';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const technologies = await Technology.find({}).exec();
	return json({ technologies });
};
