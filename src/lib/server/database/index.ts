import { MONGODB_URI } from '$env/static/private';
import { connect } from 'mongoose';

export function connectDatabase() {
	connect(MONGODB_URI).then(() => {
		console.log('Connected to MongoDB');
	});
}
