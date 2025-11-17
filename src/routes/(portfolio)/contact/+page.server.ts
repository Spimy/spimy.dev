import {
	EMAIL_HOST,
	EMAIL_PASSWORD,
	EMAIL_PORT,
	EMAIL_TO,
	EMAIL_USER,
	HCAPTCHA_SECRET
} from '$env/static/private';
import { PUBLIC_HCAPTCHA_SITEKEY_CONTACT } from '$env/static/public';
import { contactFormSchema } from '$lib/forms/contact';
import type { Actions } from '@sveltejs/kit';
import { verify } from 'hcaptcha';
import { createTransport } from 'nodemailer';
import { zod4 } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms/server';
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

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(contactFormSchema));
	return { form };
};

export const actions: Actions = {
	submitContactForm: async (event) => {
		const form = await superValidate(event, zod4(contactFormSchema));
		if (!form.valid) return message(form, 'Contact form is missing some required fields.');

		const response = await verify(
			HCAPTCHA_SECRET,
			form.data['h-captcha-response'],
			event.getClientAddress(),
			PUBLIC_HCAPTCHA_SITEKEY_CONTACT
		);
		if (!response.success) {
			return message(form, 'Failed to verify captcha.', {
				status: 400
			});
		}

		await transporter.sendMail({
			to: EMAIL_TO,
			text: [`From: ${form.data.email}`, form.data.message].join('\n'),
			from: `Spimy - Automated <${EMAIL_USER}>`,
			subject: `Contact Form filled by ${form.data.name}`
		});

		return message(form, 'Email has been sent successfully.');
	}
};
