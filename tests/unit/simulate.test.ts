import { describe, expect, it } from 'vitest';

import { simulateMortgage } from '../../src/lib/mortgage/simulate';
import type { MortgageInput } from '../../src/lib/mortgage/types';

const INPUT: MortgageInput = {
  propertyPrice: 160_000,
  financingPercentage: 80,
  termYears: 30,
  annualInterestRate: 2.5,
  autonomousCommunity: 'AS',
};

describe('simulateMortgage', () => {
  const result = simulateMortgage(INPUT);

  it('reparte capital financiado y entrada', () => {
    expect(result.financedCapital).toBe(128_000);
    expect(result.nonFinancedCapital).toBe(32_000);
  });

  it('devuelve la cuota del caso de referencia', () => {
    expect(result.monthlyPayment).toBe(505.75);
  });

  it('devuelve el cuadro de amortización completo', () => {
    expect(result.amortization).toHaveLength(360);
  });

  it('marca impuestos y gastos como no disponibles mientras falten los datos', () => {
    expect(result.taxes.isAvailable).toBe(false);
    expect(result.estimatedExpenses.isAvailable).toBe(false);
  });

  it('el coste total incluye capital e intereses', () => {
    expect(result.totalCost).toBeCloseTo(INPUT.propertyPrice + result.totalInterest, 1);
  });

  it('la aportación propia parte de la entrada', () => {
    expect(result.ownContribution).toBe(32_000);
  });
});
