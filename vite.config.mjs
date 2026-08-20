import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  // Relative, rather than '/budget/', so the built app works both under the
  // GitHub Pages path and at the root of the static server the UI tests use.
  // Routing is hash-based, so no path prefix is needed for the routes.
  base: './',
  plugins: [svelte()],
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
