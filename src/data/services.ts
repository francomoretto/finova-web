/**
 * Servicios de FINOVA. Cada servicio tiene una página propia.
 *
 * `description` es un texto de trabajo, suficiente para meta descripciones y
 * navegación; el copy definitivo llegará con el diseño.
 */

export interface Service {
  readonly id: string;
  /** Ruta absoluta, siempre con barra final. */
  readonly href: string;
  readonly title: string;
  /** Título corto para menús. */
  readonly navLabel: string;
  readonly description: string;
}

export const SERVICES: readonly Service[] = [
  {
    id: 'primera-segunda-residencia',
    href: '/hipotecas-primera-segunda-residencia/',
    title: 'Hipotecas para primera y segunda residencia',
    navLabel: 'Primera y segunda residencia',
    description:
      'Financiación para la compra de vivienda habitual o segunda residencia, negociada con las entidades con las que trabaja FINOVA.',
  },
  {
    id: 'no-residentes',
    href: '/hipotecas-no-residentes/',
    title: 'Hipotecas para no residentes',
    navLabel: 'No residentes',
    description:
      'Hipotecas para personas no residentes en España que quieren comprar un inmueble en el país.',
  },
  {
    id: 'reunificacion-deudas',
    href: '/reunificacion-deudas/',
    title: 'Reunificación de deudas',
    navLabel: 'Reunificación de deudas',
    description:
      'Agrupación de préstamos y deudas en una única cuota mensual con garantía hipotecaria.',
  },
  {
    id: 'financiacion-promotores',
    href: '/financiacion-promotores/',
    title: 'Financiación para promotores',
    navLabel: 'Promotores',
    description:
      'Financiación de promociones inmobiliarias y proyectos de obra nueva para promotores.',
  },
  {
    id: 'hipotecas-100',
    href: '/hipotecas-100/',
    title: 'Hipotecas al 100%',
    navLabel: 'Hipotecas al 100%',
    description:
      'Estudio de operaciones con financiación de hasta el 100% del valor de la vivienda.',
  },
] as const;
