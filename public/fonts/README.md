# Fuentes self-hosted

Aquí van los archivos **.woff2** de la tipografía de FINOVA. El directorio está
vacío a propósito: las fuentes no se descargan automáticamente.

Reglas:

- Sólo **WOFF2** (soporte universal en navegadores actuales; el resto sobra).
- Nada de Google Fonts ni de ningún CDN externo: todo se sirve desde este dominio.
- Nomenclatura: `finova-sans-<peso>.woff2` (ej. `finova-sans-400.woff2`).
- Un archivo por peso realmente usado. No subir pesos que no se apliquen.

Al añadir los archivos:

1. Descomentar los bloques `@font-face` de `src/styles/typography.css`.
2. Si hace falta, precargar el peso crítico desde `src/layouts/BaseLayout.astro`.
3. Comprobar que `--font-sans` sigue teniendo un fallback de sistema válido.

Los archivos de `public/` se sirven tal cual, sin procesar, en `/fonts/…`.
