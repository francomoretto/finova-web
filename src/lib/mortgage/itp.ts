/**
 * Fiscalidad de la compraventa — arquitectura de ITP/AJD.
 *
 * IMPORTANTE: este módulo contiene el MOTOR, no los datos. Los tipos
 * impositivos reales viven en `src/data/itp-rates.ts` y hoy están vacíos a
 * propósito: no se inventa ningún porcentaje fiscal.
 *
 * El motor soporta desde ya:
 *   - tipo fijo por comunidad autónoma
 *   - escalas progresivas por tramos
 *   - vigencia desde / hasta (para actualizaciones normativas)
 */

import { roundToCents } from './calculatePayment';
import type { AutonomousCommunityCode, BreakdownResult } from './types';

/** Un tramo de una escala progresiva. `upTo === null` significa "en adelante". */
export interface ItpBracket {
  /** Límite superior del tramo, en euros. */
  readonly upTo: number | null;
  /** Tipo aplicable al tramo, en porcentaje. */
  readonly rate: number;
}

export type ItpRule =
  | { readonly kind: 'flat'; readonly rate: number }
  | { readonly kind: 'progressive'; readonly brackets: readonly ItpBracket[] };

/** Régimen fiscal vigente en una comunidad durante un periodo concreto. */
export interface ItpRegime {
  readonly community: AutonomousCommunityCode;
  readonly rule: ItpRule;
  /** Fecha ISO (YYYY-MM-DD) de entrada en vigor. */
  readonly validFrom: string;
  /** Fecha ISO de fin de vigencia, o `null` si sigue vigente. */
  readonly validUntil: string | null;
  /** Referencia normativa o fuente del dato. */
  readonly source: string;
}

function isWithinValidity(regime: ItpRegime, referenceDate: Date): boolean {
  const from = Date.parse(regime.validFrom);
  if (Number.isNaN(from) || referenceDate.getTime() < from) {
    return false;
  }
  if (regime.validUntil === null) {
    return true;
  }
  const until = Date.parse(regime.validUntil);
  return !Number.isNaN(until) && referenceDate.getTime() <= until;
}

/** Localiza el régimen vigente para una comunidad en una fecha dada. */
export function findItpRegime(
  regimes: readonly ItpRegime[],
  community: AutonomousCommunityCode,
  referenceDate: Date = new Date(),
): ItpRegime | null {
  const matches = regimes
    .filter((regime) => regime.community === community && isWithinValidity(regime, referenceDate))
    .sort((a, b) => Date.parse(b.validFrom) - Date.parse(a.validFrom));

  return matches[0] ?? null;
}

/** Aplica una regla fiscal a una base imponible. */
export function applyItpRule(taxableBase: number, rule: ItpRule): number {
  if (taxableBase <= 0) {
    return 0;
  }

  if (rule.kind === 'flat') {
    return roundToCents((taxableBase * rule.rate) / 100);
  }

  let remaining = taxableBase;
  let previousLimit = 0;
  let total = 0;

  for (const bracket of rule.brackets) {
    if (remaining <= 0) {
      break;
    }
    const limit = bracket.upTo ?? Number.POSITIVE_INFINITY;
    const span = Math.min(remaining, limit - previousLimit);
    if (span > 0) {
      total += (span * bracket.rate) / 100;
      remaining -= span;
    }
    previousLimit = limit;
  }

  return roundToCents(total);
}

export interface ItpCalculationParams {
  /** Base imponible: normalmente el precio de compraventa. */
  readonly taxableBase: number;
  readonly community: AutonomousCommunityCode;
  readonly regimes: readonly ItpRegime[];
  readonly referenceDate?: Date;
}

/**
 * Calcula los impuestos de la compraventa.
 *
 * Si no hay régimen cargado para la comunidad, devuelve un desglose con
 * `isAvailable: false`: la UI debe indicar "pendiente de confirmar", nunca 0 €.
 */
export function calculateTaxes({
  taxableBase,
  community,
  regimes,
  referenceDate,
}: ItpCalculationParams): BreakdownResult {
  const regime = findItpRegime(regimes, community, referenceDate ?? new Date());

  if (regime === null) {
    return {
      items: [],
      total: 0,
      isAvailable: false,
      notes: [
        `Todavía no hay tipos impositivos cargados para la comunidad "${community}". Pendiente de la tabla fiscal definitiva.`,
      ],
    };
  }

  const amount = applyItpRule(taxableBase, regime.rule);

  return {
    items: [{ id: 'itp', label: 'Impuesto de Transmisiones Patrimoniales (ITP)', amount }],
    total: amount,
    isAvailable: true,
    notes: [regime.source],
  };
}
