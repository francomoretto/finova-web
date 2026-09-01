import { describe, expect, it } from 'vitest';

import { buildAmortizationSchedule, summarizeByYear } from '../../src/lib/mortgage/amortization';

const REFERENCE = {
  principal: 128_000,
  annualInterestRate: 2.5,
  termYears: 30,
} as const;

describe('buildAmortizationSchedule', () => {
  const schedule = buildAmortizationSchedule(REFERENCE);

  it('genera una fila por cuota (30 años → 360 cuotas)', () => {
    expect(schedule.rows).toHaveLength(360);
    expect(schedule.rows.at(0)?.month).toBe(1);
    expect(schedule.rows.at(-1)?.month).toBe(360);
  });

  it('asigna el año correcto a cada cuota', () => {
    expect(schedule.rows.at(0)?.year).toBe(1);
    expect(schedule.rows.at(11)?.year).toBe(1);
    expect(schedule.rows.at(12)?.year).toBe(2);
    expect(schedule.rows.at(-1)?.year).toBe(30);
  });

  it('deja el capital pendiente exactamente a 0 en la última cuota', () => {
    expect(schedule.rows.at(-1)?.remainingCapital).toBe(0);
  });

  it('amortiza exactamente el capital financiado', () => {
    const amortized = schedule.rows.reduce((sum, row) => sum + row.principal, 0);
    expect(amortized).toBeCloseTo(REFERENCE.principal, 2);
  });

  it('cada cuota es interés + capital', () => {
    for (const row of schedule.rows) {
      expect(row.interest + row.principal).toBeCloseTo(row.payment, 2);
    }
  });

  it('los intereses decrecen y la amortización crece (sistema francés)', () => {
    const first = schedule.rows.at(0);
    const last = schedule.rows.at(-1);

    expect(first).toBeDefined();
    expect(last).toBeDefined();
    expect(last!.interest).toBeLessThan(first!.interest);
    expect(last!.principal).toBeGreaterThan(first!.principal);
  });

  it('el total pagado es capital + intereses', () => {
    expect(schedule.totalPaid).toBeCloseTo(REFERENCE.principal + schedule.totalInterest, 1);
  });

  it('con tipo 0 % no genera intereses', () => {
    const zero = buildAmortizationSchedule({ ...REFERENCE, annualInterestRate: 0 });

    expect(zero.totalInterest).toBe(0);
    expect(zero.rows.at(-1)?.remainingCapital).toBe(0);
    expect(zero.totalPaid).toBeCloseTo(REFERENCE.principal, 2);
  });

  it('soporta el plazo mínimo de negocio (5 años → 60 cuotas)', () => {
    const short = buildAmortizationSchedule({ ...REFERENCE, termYears: 5 });

    expect(short.rows).toHaveLength(60);
    expect(short.rows.at(-1)?.remainingCapital).toBe(0);
    expect(short.totalInterest).toBeLessThan(buildAmortizationSchedule(REFERENCE).totalInterest);
  });
});

describe('summarizeByYear', () => {
  it('agrupa las 360 cuotas en 30 años', () => {
    const summary = summarizeByYear(buildAmortizationSchedule(REFERENCE).rows);

    expect(summary).toHaveLength(30);
    expect(summary.at(0)?.year).toBe(1);
    expect(summary.at(-1)?.remainingCapital).toBe(0);
  });
});
