import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  root: './src',
  base: './',
  publicDir: '../public',
  build: {
    outDir: '../build',
    assetsDir: '.',
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
    VitePWA({
      injectRegister: 'inline',
      registerType: 'autoUpdate',
      manifest: {
        icons: [
          {
            src: './favicon.svg',
            type: 'image/svg+xml',
            sizes: '1024x1024',
          },
        ],
        background_color: 'hsl(130 15% 10%)',
        display: 'standalone',
        display_override: ['standalone'],
        theme_color: 'hsl(130 15% 25%)',
      },
    }),
  ],
})
