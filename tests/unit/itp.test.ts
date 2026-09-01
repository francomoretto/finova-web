import { describe, expect, it } from 'vitest';

import {
  applyItpRule,
  calculateTaxes,
  findItpRegime,
  type ItpRegime,
} from '../../src/lib/mortgage/itp';
import { ITP_REGIMES } from '../../src/data/itp-rates';

/**
 * Los regímenes de este archivo son FICTICIOS y existen sólo para probar el
 * motor. La tabla fiscal real vive en `src/data/itp-rates.ts` y está vacía.
 */
const FIXTURE_FLAT: ItpRegime = {
  community: 'AS',
  rule: { kind: 'flat', rate: 10 },
  validFrom: '2025-01-01',
  validUntil: null,
  source: 'Fixture de test — no es un dato fiscal real',
};

const FIXTURE_PROGRESSIVE: ItpRegime = {
  community: 'MD',
  rule: {
    kind: 'progressive',
    brackets: [
      { upTo: 100_000, rate: 10 },
      { upTo: null, rate: 20 },
    ],
  },
  validFrom: '2025-01-01',
  validUntil: null,
  source: 'Fixture de test — no es un dato fiscal real',
};

describe('applyItpRule', () => {
  it('aplica un tipo fijo', () => {
    expect(applyItpRule(200_000, FIXTURE_FLAT.rule)).toBe(20_000);
  });

  it('aplica una escala progresiva por tramos', () => {
    // 100.000 al 10 % + 100.000 al 20 %
    expect(applyItpRule(200_000, FIXTURE_PROGRESSIVE.rule)).toBe(30_000);
  });

  it('no supera el primer tramo cuando la base es menor', () => {
    expect(applyItpRule(50_000, FIXTURE_PROGRESSIVE.rule)).toBe(5_000);
  });

  it('devuelve 0 con base imponible nula', () => {
    expect(applyItpRule(0, FIXTURE_FLAT.rule)).toBe(0);
  });
});

describe('findItpRegime', () => {
  const expired: ItpRegime = { ...FIXTURE_FLAT, validUntil: '2025-06-30' };

  it('respeta la vigencia desde/hasta', () => {
    expect(findItpRegime([expired], 'AS', new Date('2025-03-01'))).not.toBeNull();
    expect(findItpRegime([expired], 'AS', new Date('2025-09-01'))).toBeNull();
    expect(findItpRegime([expired], 'AS', new Date('2024-01-01'))).toBeNull();
  });

  it('devuelve null si la comunidad no tiene régimen cargado', () => {
    expect(findItpRegime([FIXTURE_FLAT], 'CT', new Date('2025-03-01'))).toBeNull();
  });
});

describe('calculateTaxes', () => {
  it('marca el desglose como no disponible si no hay datos fiscales', () => {
    const result = calculateTaxes({ taxableBase: 200_000, community: 'AS', regimes: [] });

    expect(result.isAvailable).toBe(false);
    expect(result.total).toBe(0);
    expect(result.notes.length).toBeGreaterThan(0);
  });

  it('calcula el impuesto cuando hay régimen vigente', () => {
    const result = calculateTaxes({
      taxableBase: 200_000,
      community: 'AS',
      regimes: [FIXTURE_FLAT],
      referenceDate: new Date('2025-03-01'),
    });

    expect(result.isAvailable).toBe(true);
    expect(result.total).toBe(20_000);
  });
});

describe('tabla fiscal del proyecto', () => {
  it('sigue vacía: no se publican porcentajes sin verificar', () => {
    expect(ITP_REGIMES).toHaveLength(0);
  });
});
