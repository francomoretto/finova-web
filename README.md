# FINOVA — web

Web corporativa de **FINOVA** (SOMOS FINOVA, S.L.), broker hipotecario e
intermediario de crédito inmobiliario inscrito en el Banco de España (E794).

Este repositorio contiene la **migración de WordPress/Elementor a código**. El
estado actual es la **fundación técnica**: arquitectura, tooling y dominio del
simulador. El diseño y el contenido definitivos son la siguiente etapa.

## Stack

| Área           | Herramienta                                         |
| -------------- | --------------------------------------------------- |
| Framework      | [Astro](https://astro.build) 7 (static por defecto) |
| Interactividad | React 19, **solo** en islas (`components/mortgage`) |
| Lenguaje       | TypeScript 6 en modo `strictest`                    |
| Estilos        | CSS propio + custom properties (design tokens)      |
| Validación     | Zod 4                                               |
| Email          | Nodemailer (server-side, pendiente de runtime)      |
| SEO            | `@astrojs/sitemap`, JSON-LD propio                  |
| Calidad        | ESLint 10, Prettier 3                               |
| Tests          | Vitest (unitarios), Playwright (E2E)                |

### Principios

1. **Astro-first**: HTML estático por defecto. Hoy **las 11 páginas se sirven
   con 0 kB de JavaScript**, incluida `/simulador-hipoteca/`.
2. **React sólo donde aporta valor**: exclusivamente en `src/components/mortgage/`.
   Cabecera, pie, páginas institucionales y contenido SEO son Astro. El
   placeholder del simulador se monta **sin directiva `client:*`**, así que se
   renderiza en el servidor y no envía React al navegador. Cuando tenga
   interacción real se hidratará con **`client:visible`** (no `client:load`).
3. **La UI no calcula**: toda la lógica financiera y fiscal vive en `src/lib/`.
   Ningún componente contiene fórmulas.
4. **Sin datos inventados**: si un tipo impositivo o una tarifa no está
   confirmada, el dato se deja vacío y se marca como pendiente.

## Requisitos

- Node.js **≥ 20.11**
- npm (el repositorio versiona `package-lock.json`)

## Instalación

```bash
npm install
```

Para los tests E2E, la primera vez:

```bash
npx playwright install chromium
```

## Scripts

| Comando                | Qué hace                                             |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo en `http://localhost:4321`    |
| `npm run build`        | Build de producción en `dist/`                       |
| `npm run preview`      | Sirve el `dist/` ya construido                       |
| `npm run typecheck`    | `astro check` (TypeScript + plantillas `.astro`)     |
| `npm run lint`         | ESLint sobre `.ts`, `.tsx` y `.astro`                |
| `npm run lint:fix`     | ESLint con autocorrección                            |
| `npm run format`       | Prettier: formatea el repositorio                    |
| `npm run format:check` | Prettier en modo verificación                        |
| `npm run test`         | Tests unitarios (Vitest)                             |
| `npm run test:watch`   | Vitest en modo watch                                 |
| `npm run test:e2e`     | Smoke tests E2E (Playwright); construye y sirve solo |

## Estructura

```
src/
├── assets/            Imágenes e iconos procesados por Astro
├── components/
│   ├── common/        Header, Footer, Button, Container (Astro)
│   ├── sections/      Bloques de página (Astro) — pendientes de diseño
│   └── mortgage/      ÚNICA zona React: islas del simulador
├── layouts/
│   └── BaseLayout.astro   <head> completo, header, main, footer
├── lib/
│   ├── mortgage/      Dominio financiero (puro, sin UI)
│   ├── validation/    Schemas Zod compartidos cliente/servidor
│   ├── seo/           Constructores de JSON-LD
│   └── email/         Documentación del envío SMTP (sin implementar)
├── data/              Datos estáticos tipados (empresa, bancos, servicios, ITP)
├── pages/             Una ruta por archivo
└── styles/            tokens · reset · typography · utilities → global.css

public/                Servido tal cual: robots.txt, favicon, fonts/
tests/unit/            Vitest
tests/e2e/             Playwright
```

### Rutas

`/` · `/simulador-hipoteca/` · `/hipotecas-primera-segunda-residencia/` ·
`/hipotecas-no-residentes/` · `/reunificacion-deudas/` ·
`/financiacion-promotores/` · `/hipotecas-100/` · `/contacto/` ·
`/aviso-legal/` · `/politica-privacidad/` · `/politica-cookies/`

Las tres páginas legales van con `noindex` y quedan fuera del sitemap hasta que
su texto esté validado jurídicamente.

## Variables de entorno

Copia `.env.example` a `.env` y rellena los valores. **`.env` nunca se versiona.**

| Variable        | Uso                                |
| --------------- | ---------------------------------- |
| `SMTP_HOST`     | Servidor SMTP                      |
| `SMTP_PORT`     | Puerto (587 STARTTLS / 465 SSL)    |
| `SMTP_SECURE`   | `true` para SSL directo (465)      |
| `SMTP_USER`     | Usuario SMTP                       |
| `SMTP_PASSWORD` | Contraseña SMTP                    |
| `CONTACT_TO`    | Destinatario de los formularios    |
| `CONTACT_FROM`  | Remitente autorizado en el dominio |

Todas son **server-side**. No se usa el prefijo `PUBLIC_` en ninguna de ellas:
Astro inlinearía su valor en el bundle del navegador. Detalle en
[`src/lib/email/README.md`](src/lib/email/README.md).

## Simulador hipotecario

El dominio está en `src/lib/mortgage/` y es **puro y testeado**:

- `calculatePayment.ts` — cuota constante, **sistema francés**.
- `amortization.ts` — cuadro de amortización mes a mes.
- `itp.ts` — motor fiscal: tipo fijo, escalas progresivas y vigencia desde/hasta.
- `expenses.ts` — motor de gastos (tasación, notaría, registro, gestoría).
- `simulate.ts` — orquestador: compone todo y devuelve un `MortgageResult`.

Parámetros de negocio (`constants.ts`): hipoteca **fija**, TIN por defecto
**2,5 %**, financiación **30–100 %**, plazo **5–40 años** (30 por defecto).

⚠️ **`src/data/itp-rates.ts` está vacío a propósito.** El motor funciona, pero
no se ha cargado ningún porcentaje fiscal sin verificar. Mientras falten datos,
`taxes.isAvailable` es `false` y la interfaz debe mostrar "pendiente", nunca 0 €.
Lo mismo aplica a las tarifas de gastos.

## Convenciones

- **TypeScript**: `strictest`. Prohibidos `any`, `@ts-ignore` y `@ts-nocheck`
  salvo justificación técnica escrita en el propio código.
- **Tipos de negocio** en `src/lib/**/types.ts`, nunca dentro de un componente.
- **CSS**: sólo tokens de `tokens.css`; nada de valores sueltos ni estilos
  inline. `!important` sólo con justificación (hoy: `prefers-reduced-motion`).
- **Estilos de componente** en su `<style>` scoped; `utilities.css` se mantiene
  deliberadamente pequeño.
- **Accesibilidad**: `lang="es"`, HTML semántico, un solo `<h1>` por página,
  jerarquía de encabezados correcta, foco visible, skip link y navegación por
  teclado.
- **Fuentes self-hosted**: nada de Google Fonts ni CDNs. Ver
  [`public/fonts/README.md`](public/fonts/README.md).
- **Sin trackers**: no hay analytics, GTM ni cookies de marketing. Cuando se
  añadan, requerirán consentimiento previo.

## Deployment

**Todavía no decidido.** El proyecto se despliega en Hostinger, pero falta
elegir entre:

- **A) Static + endpoint PHP** — Astro genera HTML estático y el formulario
  apunta a un `.php` fuera de Astro. Máximo rendimiento, hosting más barato.
- **B) Astro SSR (Node)** — se añade `@astrojs/node` y el formulario usa un
  endpoint de Astro con Nodemailer. Todo en un único stack.

Por eso **no hay ningún adapter configurado**: es una decisión irreversible en
la práctica y se toma con la información completa. Hoy el build es `static`.

## Estado actual

Hecho: tooling, arquitectura, tokens, layout, SEO técnico, rutas, dominio del
simulador con tests, validación y andamiaje de React.

Pendiente: diseño y contenido definitivos, interfaz del simulador, tabla de ITP
verificada, tarifas de gastos, envío SMTP real, tipografía self-hosted, textos
legales, imagen social (`ogImage`) y decisión de deployment.
