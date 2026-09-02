# Assets de marca

Logotipos oficiales de FINOVA, procedentes del material de la web actual
(`web-actual/`, fuera del repositorio). Astro los optimiza y versiona.

| Archivo                 | Origen                       | Tamaño   | Uso                      |
| ----------------------- | ---------------------------- | -------- | ------------------------ |
| `logo-finova.png`       | `Recurso 18@150x.png`        | 778×329  | Fondos claros (cabecera) |
| `logo-finova-white.png` | `recurso_9_transparente.png` | 1800×761 | Fondos oscuros (pie)     |

Ambos incluyen isotipo, marca y la bajada «Intermediación hipotecaria».
Proporción 2,36:1.

## Cómo se usan

Sólo a través de [`Logo.astro`](../../components/common/Logo.astro), que expone
`tone="dark" | "light"`. Header y Footer no conocen los nombres de archivo: si
cambian, se cambia únicamente ese componente. El alto se controla con la custom
property `--logo-height`.

## Pendiente

- **SVG oficiales.** Hoy sólo tenemos PNG. Si existe la versión vectorial,
  sustituirla: escala mejor y pesa menos.
- Las líneas diagonales de la marca están en `public/brand/` (SVG), porque se
  usan como `background-image` desde CSS.
