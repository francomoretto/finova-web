# Imágenes de la portada

Vacío a propósito: **no se descargan ni se generan imágenes**. Aquí van las
fotografías reales que proporcione FINOVA.

## Pendiente

| Archivo esperado       | Uso                       | Proporción sugerida |
| ---------------------- | ------------------------- | ------------------- |
| `hero.jpg` (o `.webp`) | Imagen principal del hero | 4/5 (vertical)      |

## Cómo incorporarla

1. Dejar el archivo en esta carpeta (no en `public/`: así Astro la optimiza,
   genera AVIF/WebP y le pone hash de caché).
2. En [`Hero.astro`](../../../components/sections/home/Hero.astro), seguir las
   instrucciones del comentario de la zona `hero__media`: sustituir el
   marcador por
   ```astro
   import {Image} from 'astro:assets'; import heroImage from '@assets/images/home/hero.jpg' <Image
     src={heroImage}
     alt="…"
     widths={[480, 720, 960]}
     loading="eager"
   />
   ```
3. El `alt` debe describir la escena; escribirlo cuando se conozca la imagen.
4. `index.astro` no cambia.
