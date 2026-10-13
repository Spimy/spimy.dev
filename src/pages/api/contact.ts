import type { APIRoute } from 'astro';
import { SUBMIT_MESSAGES, submitContact } from '../../lib/contact';
import { issueFormToken } from '../../lib/form-token';

export const prerender = false;

/** Every reply carries a fresh token, because the one that was sent is used up */
const reply = (body: object, status: number, previousToken: string) =>
  new Response(
    JSON.stringify({ ...body, token: issueFormToken(previousToken) }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );

/** Used by the chat when JS is on. The page itself handles the plain form post */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const form = await request.formData().catch(() => null);
  if (form === null)
    return reply({ error: SUBMIT_MESSAGES.unreadable }, 400, '');

  const token = String(form.get('form-token') ?? '');
  const result = await submitContact(form, clientAddress);

  switch (result.kind) {
    case 'sent':
    case 'bot':
      return reply({ ok: true }, 200, token);
    case 'invalid':
      return reply({ errors: result.errors }, 422, token);
    case 'expired':
      return reply({ error: SUBMIT_MESSAGES.expired }, 400, token);
    case 'captcha':
      return reply({ error: SUBMIT_MESSAGES.captcha }, 400, token);
    case 'limited':
      return reply({ error: SUBMIT_MESSAGES.limited }, 429, token);
    case 'failed':
      return reply({ error: SUBMIT_MESSAGES.failed }, 500, token);
  }
};
