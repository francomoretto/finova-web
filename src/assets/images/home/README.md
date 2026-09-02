# Imágenes de la portada

Bandas gráficas oficiales de FINOVA, procedentes del material de la web actual.
Todas miden **2172×724** (≈3:1) y **ya llevan incrustadas** las líneas
diagonales de la marca, así que no se les superpone ningún recurso decorativo.

| Archivo                     | Origen                     | Sección            |
| --------------------------- | -------------------------- | ------------------ |
| `hero-finova.png`           | `hero-finova-2.png`        | Hero               |
| `banda-propuesta-valor.png` | `imagen-inicio.png`        | Propuesta de valor |
| `banda-institucional.png`   | `imagen-institucional.png` | Sobre FINOVA       |
| `banda-footer.png`          | `imagen-footer.png`        | Pie de página      |

## Cómo se usan

Con `<Image>` de Astro (genera WebP/AVIF y varios anchos). Cada archivo tiene
una zona «limpia» y otra con fotografía o diagonales claras, así que el
`object-position` cambia entre móvil y escritorio: está comentado en cada
componente. En pantallas estrechas las bandas oscuras llevan además un velo de
contraste para garantizar la legibilidad del texto blanco.

El hero es el LCP: se carga con `loading="eager"` y `fetchpriority="high"`.

## Pendiente

- Versiones **verticales o cuadradas** pensadas para móvil. Hoy se recorta la
  banda horizontal, que es lo mejor disponible pero no lo ideal.
- Fotografía propia si se quiere sustituir la de stock del hero.
