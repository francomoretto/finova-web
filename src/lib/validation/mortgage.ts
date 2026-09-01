/**
 * Validación de los datos de entrada del simulador.
 *
 * Los límites provienen de `src/lib/mortgage/constants.ts`: si cambian las
 * reglas de negocio, se cambian en un único sitio.
 */

import { z } from 'zod';

import {
  ANNUAL_INTEREST_RATE_MAX,
  ANNUAL_INTEREST_RATE_MIN,
  AUTONOMOUS_COMMUNITIES,
  FINANCING_PERCENTAGE_MAX,
  FINANCING_PERCENTAGE_MIN,
  PROPERTY_PRICE_MIN,
  TERM_YEARS_MAX,
  TERM_YEARS_MIN,
} from '@lib/mortgage/constants';
import type { AutonomousCommunityCode } from '@lib/mortgage/types';

const COMMUNITY_CODES = AUTONOMOUS_COMMUNITIES.map(
  (community) => community.code,
) as AutonomousCommunityCode[];

export const autonomousCommunitySchema = z.enum(
  COMMUNITY_CODES as [AutonomousCommunityCode, ...AutonomousCommunityCode[]],
);

export const mortgageInputSchema = z.object({
  propertyPrice: z
    .number()
    .min(PROPERTY_PRICE_MIN, 'El precio del inmueble debe ser mayor que 0 €.'),
  financingPercentage: z
    .number()
    .min(FINANCING_PERCENTAGE_MIN, `La financiación mínima es del ${FINANCING_PERCENTAGE_MIN}%.`)
    .max(FINANCING_PERCENTAGE_MAX, `La financiación máxima es del ${FINANCING_PERCENTAGE_MAX}%.`),
  termYears: z
    .number()
    .int('El plazo se expresa en años completos.')
    .min(TERM_YEARS_MIN, `El plazo mínimo es de ${TERM_YEARS_MIN} años.`)
    .max(TERM_YEARS_MAX, `El plazo máximo es de ${TERM_YEARS_MAX} años.`),
  annualInterestRate: z
    .number()
    .gt(ANNUAL_INTEREST_RATE_MIN, 'El tipo de interés debe ser positivo.')
    .max(ANNUAL_INTEREST_RATE_MAX, 'El tipo de interés introducido no es razonable.'),
  autonomousCommunity: autonomousCommunitySchema,
});

export type MortgageInputSchema = z.infer<typeof mortgageInputSchema>;

/** Datos de contacto que acompañan a una simulación cuando se solicita estudio. */
export const simulatorLeadSchema = z.object({
  name: z.string().trim().min(2, 'Indica tu nombre.').max(120),
  email: z.string().trim().toLowerCase().pipe(z.email('Introduce un email válido.')),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{9,20}$/, 'Introduce un teléfono válido.')
    .optional(),
  consent: z.literal(true, {
    message: 'Debes aceptar la política de privacidad para continuar.',
  }),
  simulation: mortgageInputSchema,
});

export type SimulatorLeadInput = z.infer<typeof simulatorLeadSchema>;
