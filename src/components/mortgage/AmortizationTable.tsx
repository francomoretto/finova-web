/**
 * Cuadro de amortización. Andamiaje.
 *
 * Las filas llegan ya calculadas desde `buildAmortizationSchedule`.
 */

import type { AmortizationRow } from '@lib/mortgage/types';

export interface AmortizationTableProps {
  readonly rows: readonly AmortizationRow[];
  /** Agrupar por año en lugar de mostrar las 360+ cuotas. */
  readonly groupByYear?: boolean;
}

export default function AmortizationTable({ rows }: AmortizationTableProps) {
  return (
    <section aria-label="Cuadro de amortización">
      <p className="placeholder-note">
        Tabla pendiente de implementación. Cuotas calculadas: {rows.length}.
      </p>
    </section>
  );
}
