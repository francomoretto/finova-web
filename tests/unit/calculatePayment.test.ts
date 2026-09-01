import { describe, expect, it } from 'vitest';

import {
  calculateFinancedCapital,
  calculateMonthlyPayment,
  calculateNonFinancedCapital,
  monthlyInterestRate,
  totalPayments,
} from '../../src/lib/mortgage/calculatePayment';

/**
 * Caso de referencia FINOVA:
 *   capital 128.000 €, 30 años (360 cuotas), tipo fijo.
 */
const REFERENCE = {
  principal: 128_000,
  termYears: 30,
  payments: 360,
} as const;

describe('totalPayments', () => {
  it('convierte años en número de cuotas mensuales', () => {
    expect(totalPayments(REFERENCE.termYears)).toBe(REFERENCE.payments);
    expect(totalPayments(5)).toBe(60);
    expect(totalPayments(40)).toBe(480);
  });
});

describe('monthlyInterestRate', () => {
  it('convierte el TIN anual en porcentaje al tipo mensual en tanto por uno', () => {
    expect(monthlyInterestRate(2.5)).toBeCloseTo(0.0020833333, 10);
    expect(monthlyInterestRate(0)).toBe(0);
  });
});

describe('calculateMonthlyPayment', () => {
  it('calcula la cuota del caso de referencia con interés positivo', () => {
    const payment = calculateMonthlyPayment({
      principal: REFERENCE.principal,
      annualInterestRate: 2.5,
      termYears: REFERENCE.termYears,
    });

    // 128.000 € · i / (1 − (1+i)^−360), con i = 2,5 % / 12
    expect(payment).toBe(505.75);
  });

  it('reparte linealmente el capital cuando el tipo es 0 %', () => {
    const payment = calculateMonthlyPayment({
      principal: REFERENCE.principal,
      annualInterestRate: 0,
      termYears: REFERENCE.termYears,
    });

    expect(payment).toBe(355.56);
  });

  it('la cuota crece con el tipo de interés', () => {
    const base = { principal: REFERENCE.principal, termYears: REFERENCE.termYears };
    const at25 = calculateMonthlyPayment({ ...base, annualInterestRate: 2.5 });
    const at3 = calculateMonthlyPayment({ ...base, annualInterestRate: 3 });

    expect(at3).toBeGreaterThan(at25);
    expect(at3).toBe(539.65);
  });

  it('la cuota decrece al alargar el plazo', () => {
    const base = { principal: REFERENCE.principal, annualInterestRate: 2.5 };
    const at30 = calculateMonthlyPayment({ ...base, termYears: 30 });
    const at40 = calculateMonthlyPayment({ ...base, termYears: 40 });

    expect(at40).toBeLessThan(at30);
  });

  it('devuelve 0 con capital 0 (caso límite)', () => {
    expect(calculateMonthlyPayment({ principal: 0, annualInterestRate: 2.5, termYears: 30 })).toBe(
      0,
    );
  });

  it('rechaza entradas imposibles', () => {
    expect(() =>
      calculateMonthlyPayment({ principal: -1, annualInterestRate: 2.5, termYears: 30 }),
    ).toThrow(RangeError);
    expect(() =>
      calculateMonthlyPayment({ principal: 100_000, annualInterestRate: 2.5, termYears: 0 }),
    ).toThrow(RangeError);
    expect(() =>
      calculateMonthlyPayment({ principal: 100_000, annualInterestRate: -1, termYears: 30 }),
    ).toThrow(RangeError);
  });
});

describe('reparto capital financiado / no financiado', () => {
  it('calcula el capital financiado a partir del porcentaje', () => {
    expect(calculateFinancedCapital(160_000, 80)).toBe(128_000);
    expect(calculateFinancedCapital(200_000, 100)).toBe(200_000);
    expect(calculateFinancedCapital(200_000, 30)).toBe(60_000);
  });

  it('el financiado y el no financiado suman el precio del inmueble', () => {
    const price = 237_450.37;
    const percentage = 80;

    expect(
      calculateFinancedCapital(price, percentage) + calculateNonFinancedCapital(price, percentage),
    ).toBeCloseTo(price, 2);
  });
});
