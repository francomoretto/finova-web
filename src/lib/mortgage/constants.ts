/**
 * Parámetros de negocio del simulador FINOVA.
 *
 * Cualquier límite o valor por defecto vive aquí. La UI y los esquemas de
 * validación (src/lib/validation) los consumen; no se duplican en ningún sitio.
 */

import type { AutonomousCommunity, MortgageType } from './types';

/** FINOVA simula únicamente hipoteca a tipo fijo. */
export const MORTGAGE_TYPE: MortgageType = 'fixed';

/** Porcentaje de financiación sobre el precio del inmueble. */
export const FINANCING_PERCENTAGE_MIN = 30;
export const FINANCING_PERCENTAGE_MAX = 100;
export const FINANCING_PERCENTAGE_DEFAULT = 80;

/** Plazo en años. */
export const TERM_YEARS_MIN = 5;
export const TERM_YEARS_MAX = 40;
export const TERM_YEARS_DEFAULT = 30;

/** TIN por defecto de FINOVA, en porcentaje anual. */
export const ANNUAL_INTEREST_RATE_DEFAULT = 2.5;
/** Cotas de sanidad para la validación de entrada, no una oferta comercial. */
export const ANNUAL_INTEREST_RATE_MIN = 0;
export const ANNUAL_INTEREST_RATE_MAX = 20;

/** Precio del inmueble. */
export const PROPERTY_PRICE_MIN = 1;
export const PROPERTY_PRICE_DEFAULT = 200_000;

export const MONTHS_PER_YEAR = 12;

export const AUTONOMOUS_COMMUNITIES: readonly AutonomousCommunity[] = [
  { code: 'AN', name: 'Andalucía' },
  { code: 'AR', name: 'Aragón' },
  { code: 'AS', name: 'Principado de Asturias' },
  { code: 'IB', name: 'Illes Balears' },
  { code: 'CN', name: 'Canarias' },
  { code: 'CB', name: 'Cantabria' },
  { code: 'CL', name: 'Castilla y León' },
  { code: 'CM', name: 'Castilla-La Mancha' },
  { code: 'CT', name: 'Cataluña' },
  { code: 'CE', name: 'Ceuta' },
  { code: 'EX', name: 'Extremadura' },
  { code: 'GA', name: 'Galicia' },
  { code: 'MD', name: 'Comunidad de Madrid' },
  { code: 'MC', name: 'Región de Murcia' },
  { code: 'ML', name: 'Melilla' },
  { code: 'NC', name: 'Comunidad Foral de Navarra' },
  { code: 'PV', name: 'País Vasco' },
  { code: 'RI', name: 'La Rioja' },
  { code: 'VC', name: 'Comunitat Valenciana' },
] as const;

/** Comunidad preseleccionada: sede de FINOVA. */
export const AUTONOMOUS_COMMUNITY_DEFAULT = 'AS';
