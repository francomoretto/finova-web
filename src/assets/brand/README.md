# Assets de marca

Directorio para el logotipo de FINOVA. **Está vacío a propósito: todavía no
existe el archivo definitivo y no se generan logos falsos.**

## Archivos que faltan

| Archivo                 | Uso                                           |
| ----------------------- | --------------------------------------------- |
| `logo-finova.svg`       | Cabecera y fondos claros (tinta azul marino)  |
| `logo-finova-white.svg` | Pie de página y fondos oscuros (tinta blanca) |

## Cómo incorporarlos

1. Colocar ambos SVG en este directorio (`src/assets/brand/`, no en `public/`:
   así Astro los optimiza y les pone hash de caché).
2. Abrir [`src/components/common/Logo.astro`](../../components/common/Logo.astro)
   y seguir las instrucciones del comentario que hay al principio: sustituir el
   logotipo tipográfico provisional por el `<img>`/SVG inline.
3. No hace falta tocar `Header.astro` ni `Footer.astro`: ambos consumen
   `Logo.astro` y no saben cómo está dibujada la marca.

## Requisitos del SVG

- `viewBox` presente y sin `width`/`height` fijos, para que escale.
- Sin texto convertido a `<text>`: los trazos deben ir vectorizados (`<path>`).
- Sin referencias a fuentes ni a recursos externos.
- Colores planos; nada de degradados ni filtros innecesarios.
- Optimizado (SVGO o equivalente) antes de subirlo.

El nombre accesible NO va dentro del SVG: lo aporta `Logo.astro`, para no
duplicar texto ante los lectores de pantalla.

## Favicon

`public/favicon.svg` es una marca tipográfica provisional. Debe sustituirse por
la versión oficial cuando exista.
