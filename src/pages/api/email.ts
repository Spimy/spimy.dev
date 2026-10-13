import type { APIRoute } from 'astro';
import { revealEmail } from '../../lib/contact';

export const prerender = false;

/** Used by the "Show email" button when JS is on */
export const GET: APIRoute = ({ url }) => {
  const email = revealEmail(url.searchParams.get('reveal'));

  return new Response(
    JSON.stringify(email ? { email } : { error: 'expired' }),
    {
      status: email ? 200 : 403,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );
};
