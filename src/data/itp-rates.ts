/**
 * Tipos de ITP por comunidad autónoma.
 *
 * ⚠️ VACÍO A PROPÓSITO. No se incorpora ningún porcentaje fiscal sin la tabla
 * definitiva verificada: un dato fiscal inventado es peor que no tener dato.
 *
 * El motor (`src/lib/mortgage/itp.ts`) ya soporta:
 *   - tipo fijo:        { kind: 'flat', rate: 8 }
 *   - escala progresiva:{ kind: 'progressive', brackets: [{ upTo: 400000, rate: 8 }, { upTo: null, rate: 10 }] }
 *   - vigencia:         validFrom / validUntil
 *
 * Ejemplo de la forma que tendrá cada entrada (comentado, valores NO reales):
 *
 * {
 *   community: 'AS',
 *   rule: { kind: 'progressive', brackets: [{ upTo: 300000, rate: 0 }, { upTo: null, rate: 0 }] },
 *   validFrom: '2026-01-01',
 *   validUntil: null,
 *   source: 'Decreto Legislativo … del Principado de Asturias',
 * }
 *
 * TODO(FINOVA): cargar la tabla fiscal verificada antes de publicar el simulador.
 */

import type { ItpRegime } from '@lib/mortgage/itp';

export const ITP_REGIMES: readonly ItpRegime[] = [];
