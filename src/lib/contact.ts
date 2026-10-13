import {
  CONTACT_FROM,
  CONTACT_TO,
  HCAPTCHA_SECRET,
  HCAPTCHA_SITEKEY,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
} from 'astro:env/server';
import nodemailer from 'nodemailer';
import { checkFormToken, checkRevealToken } from './form-token';

export const LIMITS = { name: 100, email: 254, message: 2000 } as const;

export interface ContactFields {
  name: string;
  email: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

/** Trims the fields. Newlines become \n so the length matches the textarea's maxlength. */
export function readFields(form: FormData): ContactFields {
  const read = (key: string) =>
    String(form.get(key) ?? '')
      .replace(/\r\n?/g, '\n')
      .trim();

  return {
    name: read('name'),
    email: read('email'),
    message: read('message'),
  };
}

export function validate({
  name,
  email,
  message,
}: ContactFields): ContactErrors {
  const errors: ContactErrors = {};

  if (name === '') errors.name = 'Tell me who you are.';
  else if (name.length > LIMITS.name)
    errors.name = `Keep it under ${LIMITS.name} characters.`;

  if (email === '') errors.email = 'I need an email to reply to.';
  else if (
    email.length > LIMITS.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
    errors.email = 'That email does not look right.';

  if (message === '') errors.message = 'Write a message first.';
  else if (message.length > LIMITS.message)
    errors.message = `Keep it under ${LIMITS.message} characters.`;

  return errors;
}

/** Strips line breaks so a visitor can never inject extra mail headers. */
function oneLine(text: string): string {
  return text.replace(/[\r\n]+/g, ' ').trim();
}

export async function sendContactEmail(
  { name, email, message }: ContactFields,
  captchaPassed: boolean,
) {
  if (!SMTP_HOST) {
    if (import.meta.env.DEV) {
      console.info('[Contact] SMTP_HOST is not set, so this is a dry run:', {
        name,
        email,
        message,
      });
      return;
    }
    throw new Error('SMTP_HOST is not set');
  }

  const to = CONTACT_TO ?? SMTP_USER;
  const from = CONTACT_FROM ?? SMTP_USER;
  if (!to || !from)
    throw new Error('Set CONTACT_TO and CONTACT_FROM (or SMTP_USER)');

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  await transport.sendMail({
    from,
    to,
    replyTo: { name: oneLine(name), address: email },
    // Without hCaptcha the message only passed the form token, so it is prefixed to make filtering easy
    subject: `${captchaPassed ? '' : '[No JS] '}Portfolio message from ${oneLine(name)}`,
    text: `From: ${oneLine(name)} <${email}>\n\n${message}\n`,
  });
}

// Soft per-address limit
// It resets on restart and is per server instance, which is enough to stop casual spam
const WINDOW_MS = 60 * 60 * 1000;
const recent = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  max: number,
  now = Date.now(),
): boolean {
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  const limited = hits.length >= max;
  if (!limited) hits.push(now);
  recent.set(key, hits);
  return limited;
}

export const SUBMIT_MESSAGES = {
  unreadable: 'That did not go through. Please try again.',
  limited: 'That is a lot of messages in a short time. Please try again later.',
  failed:
    'Your message could not be sent. Please try again, or use the links above.',
  captcha: 'Failed to verify captcha. Please try again.',
  expired:
    'This form expired or was sent too fast. Wait a moment and send again.',
} as const;

// Messages that pass hCaptcha are limited less than ones that only had a form token
const LIMIT_WITH_CAPTCHA = 5;
const LIMIT_WITHOUT_CAPTCHA = 2;

export type SubmitResult =
  | {
      kind: 'sent' | 'bot' | 'limited' | 'failed' | 'captcha' | 'expired';
      fields: ContactFields;
    }
  | { kind: 'invalid'; fields: ContactFields; errors: ContactErrors };

const HCAPTCHA_VERIFY_URL = 'https://api.hcaptcha.com/siteverify';

async function verifyHcaptcha(response: string, ip: string): Promise<boolean> {
  if (!HCAPTCHA_SECRET) {
    console.error(
      '[Contact] got an hCaptcha token but HCAPTCHA_SECRET is not set',
    );
    return false;
  }

  const body = new URLSearchParams({
    secret: HCAPTCHA_SECRET,
    response,
    remoteip: ip,
  });
  if (HCAPTCHA_SITEKEY) body.set('sitekey', HCAPTCHA_SITEKEY);

  try {
    const result = await fetch(HCAPTCHA_VERIFY_URL, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await result.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error('[Contact] could not reach hCaptcha', error);
    return false;
  }
}

/** The one place a submission is checked and sent, for both the page and the API route */
export async function submitContact(
  form: FormData,
  ip: string,
): Promise<SubmitResult> {
  const fields = readFields(form);

  // Only bots fill the hidden "website" honeypot field. Treat it as sent so they move on.
  if (String(form.get('website') ?? '') !== '') return { kind: 'bot', fields };

  const errors = validate(fields);
  if (Object.keys(errors).length > 0)
    return { kind: 'invalid', fields, errors };

  // With JS, the chat sends an hCaptcha token
  // Without it (no JS, or hCaptcha blocked), the form token has to do the job alone
  const captcha = String(form.get('h-captcha-response') ?? '');
  const withCaptcha = captcha !== '';

  if (withCaptcha) {
    if (!(await verifyHcaptcha(captcha, ip)))
      return { kind: 'captcha', fields };
  } else if (
    checkFormToken(String(form.get('form-token') ?? '')) === 'invalid'
  ) {
    return { kind: 'expired', fields };
  }

  const path = withCaptcha ? 'captcha' : 'token';
  if (
    isRateLimited(
      `${path}:${ip}`,
      withCaptcha ? LIMIT_WITH_CAPTCHA : LIMIT_WITHOUT_CAPTCHA,
    )
  )
    return { kind: 'limited', fields };

  try {
    await sendContactEmail(fields, withCaptcha);
    return { kind: 'sent', fields };
  } catch (error) {
    console.error('[Contact] could not send the message', error);
    return { kind: 'failed', fields };
  }
}

// After a send without JS, the redirect has to carry the visitor's
// message so the page can show it. A one-time token keeps it out of the URL
const SENT_TTL_MS = 5 * 60 * 1000;
const SENT_MAX = 200;
const sentMessages = new Map<
  string,
  { name: string; message: string; expires: number }
>();

export function rememberSent({ name, message }: ContactFields): string {
  const now = Date.now();
  for (const [token, entry] of sentMessages) {
    if (entry.expires < now) sentMessages.delete(token);
  }
  if (sentMessages.size >= SENT_MAX) {
    const oldest = sentMessages.keys().next().value;
    if (oldest !== undefined) sentMessages.delete(oldest);
  }

  const token = crypto.randomUUID();
  sentMessages.set(token, { name, message, expires: now + SENT_TTL_MS });
  return token;
}

/** Return the remembered message once, then forget it */
export function takeSent(
  token: string,
): { name: string; message: string } | undefined {
  const entry = sentMessages.get(token);
  sentMessages.delete(token);
  if (!entry || entry.expires < Date.now()) return undefined;
  return { name: entry.name, message: entry.message };
}

/** The contact address, but only for a valid "Show email" token */
export function revealEmail(token: string | null): string | null {
  return token !== null && checkRevealToken(token)
    ? (CONTACT_TO ?? null)
    : null;
}
