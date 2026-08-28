import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Relative, rather than '/budget/', so the built app works both under the
  // GitHub Pages path and at the root of the static server the UI tests use.
  // Routing is hash-based, so no path prefix is needed for the routes.
  base: './',
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      // Paths here stay relative for the same reason `base` is: the manifest
      // sits next to index.html, so a browser resolves them against whichever
      // path the app is being served from.
      manifest: {
        name: 'Budget',
        short_name: 'Budget',
        description:
          'A simple way to budget your money and reconcile your statements.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0369a1',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      // The glob below already sweeps up the icons, so leaving this on would
      // list each of them in the precache manifest twice.
      includeManifestIcons: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3's own Sass still uses @import and the legacy colour
        // functions, so building it from source is noisy. Those warnings are
        // its code, not ours, and no 5.x release avoids them.
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
      },
    },
  },
  resolve: {
    alias: {
      // PouchDB expects Node's EventEmitter; Vite leaves node builtins out of
      // browser builds, so point it at the npm browser implementation.
      events: 'events',
    },
  },
  server: {
    host: true, // Reachable from outside the Docker container.
    port: 8080,
  },
})
