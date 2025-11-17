import * as zod from 'zod';

export const contactFormSchema = zod.object({
	name: zod.string().min(2),
	email: zod.email(),
	message: zod.string().min(2),
	'h-captcha-response': zod.string()
});
