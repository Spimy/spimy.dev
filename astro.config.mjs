// @ts-check
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  server: { host: true },
  site: 'https://www.spimy.dev',
  integrations: [svelte(), sitemap()],

  adapter: vercel(),

  security: {
    allowedDomains: [
      { hostname: 'spimy.dev', protocol: 'https' },
      { hostname: 'www.spimy.dev', protocol: 'https' },
      { hostname: 'localhost', protocol: 'http' },
      { hostname: '127.0.0.1', protocol: 'http' },
    ],
  },

  env: {
    schema: {
      GITHUB_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SMTP_HOST: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SMTP_PORT: envField.number({
        context: 'server',
        access: 'secret',
        default: 587,
      }),
      SMTP_USER: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      SMTP_PASS: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CONTACT_TO: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CONTACT_FROM: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      HCAPTCHA_SITEKEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      HCAPTCHA_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CONTACT_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
});
