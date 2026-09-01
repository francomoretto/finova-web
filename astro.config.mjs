// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://somosfinova.com',
  trailingSlash: 'always',
  build: {
    // Genera /ruta/index.html para que las URLs canónicas terminen en "/".
    format: 'directory',
  },
  integrations: [
    // React queda reservado para islas interactivas (src/components/mortgage/**).
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/aviso-legal/') &&
        !page.includes('/politica-privacidad/') &&
        !page.includes('/politica-cookies/'),
    }),
  ],
  // Sin adapter: la decisión de runtime en producción (static + endpoint PHP vs. SSR Node)
  // todavía no está tomada. Ver README > Deployment.
  //
  // `prefetch` está desactivado a propósito: inyecta ~2,5 kB de JS en TODAS las
  // páginas. Se activará, si procede, cuando exista navegación real que medir.
});
