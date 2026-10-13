// @ts-check
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  server: { host: true },
  integrations: [svelte()],

  adapter: node({
    mode: 'standalone',
  }),

  env: {
    schema: {
      GITHUB_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
});
