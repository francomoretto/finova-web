/**
 * Gastos estimados de la operación (tasación, notaría, registro, gestoría…).
 *
 * Igual que en `itp.ts`: aquí está el motor; las tarifas concretas se cargarán
 * cuando estén confirmadas. No se inventan importes.
 */

import { roundToCents } from './calculatePayment';
import type { BreakdownResult } from './types';

export type ExpenseBase = 'propertyPrice' | 'financedCapital';

export type ExpenseCalculation =
  | { readonly kind: 'fixed'; readonly amount: number }
  | { readonly kind: 'percentage'; readonly rate: number; readonly base: ExpenseBase }
  | {
      readonly kind: 'percentageWithBounds';
      readonly rate: number;
      readonly base: ExpenseBase;
      readonly min: number;
      readonly max: number;
    };

export interface ExpenseRule {
  readonly id: string;
  readonly label: string;
  readonly calculation: ExpenseCalculation;
}

/**
 * Tarifas de gastos. VACÍO A PROPÓSITO.
 *
 * TODO(FINOVA): cargar aquí (o en `src/data/`) los importes reales de tasación,
 * notaría, registro y gestoría una vez confirmados por negocio.
 */
export const DEFAULT_EXPENSE_RULES: readonly ExpenseRule[] = [];

export interface ExpensesParams {
  readonly propertyPrice: number;
  readonly financedCapital: number;
  readonly rules?: readonly ExpenseRule[];
}

function resolveBase(base: ExpenseBase, propertyPrice: number, financedCapital: number): number {
  return base === 'propertyPrice' ? propertyPrice : financedCapital;
}

function applyRule(rule: ExpenseRule, propertyPrice: number, financedCapital: number): number {
  const { calculation } = rule;

  if (calculation.kind === 'fixed') {
    return roundToCents(calculation.amount);
  }

  const base = resolveBase(calculation.base, propertyPrice, financedCapital);
  const raw = (base * calculation.rate) / 100;

  if (calculation.kind === 'percentage') {
    return roundToCents(raw);
  }

  return roundToCents(Math.min(Math.max(raw, calculation.min), calculation.max));
}

/**
 * Calcula los gastos estimados. Sin reglas cargadas devuelve
 * `isAvailable: false` para que la UI no muestre un 0 € engañoso.
 */
export function calculateEstimatedExpenses({
  propertyPrice,
  financedCapital,
  rules = DEFAULT_EXPENSE_RULES,
}: ExpensesParams): BreakdownResult {
  if (rules.length === 0) {
    return {
      items: [],
      total: 0,
      isAvailable: false,
      notes: ['Tarifas de gastos pendientes de confirmar (tasación, notaría, registro, gestoría).'],
    };
  }

  const items = rules.map((rule) => ({
    id: rule.id,
    label: rule.label,
    amount: applyRule(rule, propertyPrice, financedCapital),
  }));

  const total = roundToCents(items.reduce((sum, item) => sum + item.amount, 0));

  return { items, total, isAvailable: true, notes: [] };
}
