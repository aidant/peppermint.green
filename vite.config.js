import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',
  base: './',
  publicDir: '../public',
  build: {
    outDir: '../build',
    assetsDir: '.',
    emptyOutDir: true,
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
  ],
})
