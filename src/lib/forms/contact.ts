import zod from 'zod';
import { zod4 } from 'sveltekit-superforms/adapters';

const contactFormSchemaRaw = zod.object({
	name: zod.string().min(2),
	email: zod.string().email(),
	message: zod.string().min(2),
	'h-captcha-response': zod.string()
});

export const contactFormSchema = zod4(contactFormSchemaRaw);
