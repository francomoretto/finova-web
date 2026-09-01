/**
 * Orquestador de la simulación: compone cuota, cuadro, fiscalidad y gastos.
 *
 * Es la ÚNICA función que la UI necesita llamar. Ningún componente debe
 * contener fórmulas financieras.
 */

import { buildAmortizationSchedule } from './amortization';
import {
  calculateFinancedCapital,
  calculateNonFinancedCapital,
  roundToCents,
} from './calculatePayment';
import { calculateEstimatedExpenses, type ExpenseRule } from './expenses';
import { calculateTaxes, type ItpRegime } from './itp';
import type { MortgageInput, MortgageResult } from './types';

export interface SimulationOptions {
  readonly itpRegimes?: readonly ItpRegime[];
  readonly expenseRules?: readonly ExpenseRule[];
  readonly referenceDate?: Date;
}

export function simulateMortgage(
  input: MortgageInput,
  options: SimulationOptions = {},
): MortgageResult {
  const { propertyPrice, financingPercentage, termYears, annualInterestRate } = input;

  const financedCapital = calculateFinancedCapital(propertyPrice, financingPercentage);
  const nonFinancedCapital = calculateNonFinancedCapital(propertyPrice, financingPercentage);

  const schedule = buildAmortizationSchedule({
    principal: financedCapital,
    annualInterestRate,
    termYears,
  });
  const monthlyPayment = schedule.rows[0]?.payment ?? 0;

  const taxes = calculateTaxes({
    taxableBase: propertyPrice,
    community: input.autonomousCommunity,
    regimes: options.itpRegimes ?? [],
    ...(options.referenceDate === undefined ? {} : { referenceDate: options.referenceDate }),
  });

  const estimatedExpenses = calculateEstimatedExpenses({
    propertyPrice,
    financedCapital,
    ...(options.expenseRules === undefined ? {} : { rules: options.expenseRules }),
  });

  const ownContribution = roundToCents(nonFinancedCapital + taxes.total + estimatedExpenses.total);

  const totalCost = roundToCents(
    financedCapital +
      nonFinancedCapital +
      schedule.totalInterest +
      taxes.total +
      estimatedExpenses.total,
  );

  return {
    financedCapital,
    nonFinancedCapital,
    monthlyPayment,
    ownContribution,
    taxes,
    estimatedExpenses,
    totalInterest: schedule.totalInterest,
    totalCost,
    amortization: schedule.rows,
  };
}
