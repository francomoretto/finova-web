/**
 * Cálculo de la cuota hipotecaria — sistema francés (cuota constante).
 *
 * Funciones puras, sin dependencias de UI ni de datos externos.
 *
 *   cuota = C · i / (1 − (1 + i)^−n)
 *
 *   C = capital financiado
 *   i = tipo de interés del periodo (TIN anual / 12)
 *   n = número total de cuotas (años · 12)
 */

import { MONTHS_PER_YEAR } from './constants';

/** Redondea a céntimos evitando el sesgo binario de `toFixed`. */
export function roundToCents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Convierte un TIN anual en porcentaje (2.5) al tipo mensual en tanto por uno. */
export function monthlyInterestRate(annualInterestRate: number): number {
  return annualInterestRate / 100 / MONTHS_PER_YEAR;
}

/** Número total de cuotas del préstamo. */
export function totalPayments(termYears: number): number {
  return Math.round(termYears * MONTHS_PER_YEAR);
}

/** Capital que financia la entidad, a partir del precio y el % de financiación. */
export function calculateFinancedCapital(
  propertyPrice: number,
  financingPercentage: number,
): number {
  return roundToCents((propertyPrice * financingPercentage) / 100);
}

/** Parte del precio que aporta el comprador (entrada), sin impuestos ni gastos. */
export function calculateNonFinancedCapital(
  propertyPrice: number,
  financingPercentage: number,
): number {
  return roundToCents(propertyPrice - calculateFinancedCapital(propertyPrice, financingPercentage));
}

export interface MonthlyPaymentParams {
  /** Capital financiado, en euros. */
  readonly principal: number;
  /** TIN anual en porcentaje, p. ej. 2.5. */
  readonly annualInterestRate: number;
  /** Plazo en años. */
  readonly termYears: number;
}

/**
 * Cuota mensual constante del sistema francés.
 *
 * Con tipo 0 % degenera en el reparto lineal `capital / n`.
 *
 * @throws {RangeError} si el capital es negativo o el plazo no es positivo.
 */
export function calculateMonthlyPayment({
  principal,
  annualInterestRate,
  termYears,
}: MonthlyPaymentParams): number {
  if (!Number.isFinite(principal) || principal < 0) {
    throw new RangeError('El capital financiado debe ser un número no negativo.');
  }
  if (!Number.isFinite(termYears) || termYears <= 0) {
    throw new RangeError('El plazo debe ser mayor que cero.');
  }
  if (!Number.isFinite(annualInterestRate) || annualInterestRate < 0) {
    throw new RangeError('El tipo de interés debe ser un número no negativo.');
  }

  const n = totalPayments(termYears);
  const i = monthlyInterestRate(annualInterestRate);

  if (i === 0) {
    return roundToCents(principal / n);
  }

  const payment = (principal * i) / (1 - Math.pow(1 + i, -n));
  return roundToCents(payment);
}
