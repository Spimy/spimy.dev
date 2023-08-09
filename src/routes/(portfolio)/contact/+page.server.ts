import { EMAIL_HOST, EMAIL_PASSWORD, EMAIL_PORT, EMAIL_TO, EMAIL_USER } from '$env/static/private';
import { contactFormSchema } from '$lib/global';
import { fail, type Actions } from '@sveltejs/kit';
import { createTransport } from 'nodemailer';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from '../$types';

const transporter = createTransport({
	host: EMAIL_HOST,
	port: Number(EMAIL_PORT),
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASSWORD
	},
	secure: false,
	tls: {
		rejectUnauthorized: false
	}
});

export const load: PageServerLoad = async (event) => {
	const form = await superValidate(event, contactFormSchema);
	return { form };
};

export const actions: Actions = {
	submitContactForm: async (event) => {
		const form = await superValidate(event, contactFormSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		await transporter.sendMail({
			to: EMAIL_TO,
			text: [`From: ${form.data.email}`, form.data.message].join('\n'),
			from: `"Spimy - Automated <${EMAIL_USER}>`,
			subject: `Contact Form filled by ${form.data.name}`
		});
		return { form };
	}
};
