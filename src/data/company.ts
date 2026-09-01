/**
 * Datos corporativos de FINOVA.
 *
 * Fuente única de verdad para SEO, avisos legales y pie de página.
 * NO añadir aquí teléfono, redes sociales ni ningún dato sin confirmar.
 */

export const COMPANY = {
  /** Marca comercial. */
  brand: 'FINOVA',
  /** Razón social. */
  legalName: 'SOMOS FINOVA, S.L.',
  nif: 'B88977665',
  activity: 'Broker hipotecario · Intermediario de Crédito Inmobiliario',
  email: 'info@somosfinova.com',
  address: {
    street: 'Calle Melquiades Álvarez, 26, 1º A',
    postalCode: '33003',
    city: 'Oviedo',
    region: 'Asturias',
    country: 'ES',
  },
  registrations: {
    /** Registro del Banco de España. */
    bankOfSpain: 'E794',
    /** Asociado ANICI. */
    anici: '021',
  },
} as const;

/** URL canónica de producción. Debe coincidir con `site` en astro.config.mjs. */
export const SITE_URL = 'https://somosfinova.com';

export const SITE = {
  name: COMPANY.brand,
  url: SITE_URL,
  locale: 'es_ES',
  lang: 'es',
  defaultTitle: 'FINOVA · Broker hipotecario',
  defaultDescription:
    'FINOVA es un intermediario de crédito inmobiliario registrado en el Banco de España que negocia tu hipoteca con más de una decena de entidades.',
  // Sin imagen social por defecto: no existe todavía y no se declara un archivo
  // inexistente. Cuando exista, se pasa por la prop `ogImage` de BaseLayout.
} as const;
