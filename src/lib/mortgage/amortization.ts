/**
 * Cuadro de amortización — sistema francés.
 *
 * Función pura: recibe capital, tipo y plazo, y devuelve una fila por cuota.
 * El redondeo se hace fila a fila y la última cuota absorbe el residuo, de modo
 * que el capital pendiente final es exactamente 0.
 */

import {
  calculateMonthlyPayment,
  monthlyInterestRate,
  roundToCents,
  totalPayments,
} from './calculatePayment';
import { MONTHS_PER_YEAR } from './constants';
import type { AmortizationRow, AmortizationSchedule } from './types';

export interface AmortizationParams {
  readonly principal: number;
  readonly annualInterestRate: number;
  readonly termYears: number;
}

export function buildAmortizationSchedule({
  principal,
  annualInterestRate,
  termYears,
}: AmortizationParams): AmortizationSchedule {
  const payment = calculateMonthlyPayment({ principal, annualInterestRate, termYears });
  const i = monthlyInterestRate(annualInterestRate);
  const n = totalPayments(termYears);

  const rows: AmortizationRow[] = [];
  let remaining = principal;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let month = 1; month <= n; month += 1) {
    const isLast = month === n;
    const interest = roundToCents(remaining * i);

    // La última cuota liquida el capital pendiente para evitar arrastre de redondeo.
    const principalPaid = isLast ? remaining : roundToCents(payment - interest);
    const periodPayment = isLast ? roundToCents(principalPaid + interest) : payment;

    remaining = roundToCents(remaining - principalPaid);
    totalInterest = roundToCents(totalInterest + interest);
    totalPaid = roundToCents(totalPaid + periodPayment);

    rows.push({
      month,
      year: Math.ceil(month / MONTHS_PER_YEAR),
      payment: periodPayment,
      interest,
      principal: principalPaid,
      remainingCapital: remaining,
    });
  }

  return { rows, totalInterest, totalPaid };
}

/** Agrupa el cuadro por año, útil para vistas resumidas. */
export function summarizeByYear(rows: readonly AmortizationRow[]): readonly {
  year: number;
  payment: number;
  interest: number;
  principal: number;
  remainingCapital: number;
}[] {
  const byYear = new Map<
    number,
    { year: number; payment: number; interest: number; principal: number; remainingCapital: number }
  >();

  for (const row of rows) {
    const current = byYear.get(row.year);
    if (current === undefined) {
      byYear.set(row.year, {
        year: row.year,
        payment: row.payment,
        interest: row.interest,
        principal: row.principal,
        remainingCapital: row.remainingCapital,
      });
      continue;
    }
    current.payment = roundToCents(current.payment + row.payment);
    current.interest = roundToCents(current.interest + row.interest);
    current.principal = roundToCents(current.principal + row.principal);
    current.remainingCapital = row.remainingCapital;
  }

  return [...byYear.values()];
}
