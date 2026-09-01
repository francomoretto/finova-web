/**
 * Resumen de resultados de la simulación. Andamiaje.
 *
 * Recibe un `MortgageResult` ya calculado: no calcula nada por su cuenta.
 */

import type { MortgageResult } from '@lib/mortgage/types';

export interface MortgageResultsProps {
  readonly result: MortgageResult;
}

export default function MortgageResults({ result }: MortgageResultsProps) {
  return (
    <section aria-label="Resultado de la simulación">
      <p className="placeholder-note">
        Presentación de resultados pendiente. Cuota calculada: {result.monthlyPayment} €/mes.
      </p>
    </section>
  );
}
