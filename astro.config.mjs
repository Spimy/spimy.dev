// @ts-check
import node from '@astrojs/node';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  server: { host: true },
  integrations: [svelte()],

  adapter: node({
    mode: 'standalone',
  }),
});
