/**
 * Isla React del simulador hipotecario.
 *
 * Estado: andamiaje. Sólo valida que la integración React ↔ Astro y el acceso
 * al dominio (`src/lib/mortgage`) funcionan. La interfaz definitiva es la
 * siguiente etapa.
 *
 * HIDRATACIÓN: mientras sea un placeholder sin interacción se monta SIN
 * directiva `client:*`, de modo que Astro lo renderiza en el servidor y la
 * página no envía JavaScript al navegador.
 * Cuando tenga interacción real se hidratará con `client:visible` —no
 * `client:load`—: vive por debajo del pliegue y no debe competir por el hilo
 * principal durante la carga inicial.
 *
 * Regla: este componente NUNCA contiene fórmulas financieras. Todo cálculo se
 * delega en `src/lib/mortgage`.
 */

import {
  ANNUAL_INTEREST_RATE_DEFAULT,
  FINANCING_PERCENTAGE_DEFAULT,
  FINANCING_PERCENTAGE_MAX,
  FINANCING_PERCENTAGE_MIN,
  TERM_YEARS_DEFAULT,
  TERM_YEARS_MAX,
  TERM_YEARS_MIN,
} from '@lib/mortgage/constants';

import './simulator.css';

export interface MortgageSimulatorProps {
  /** Título accesible de la sección que envuelve al simulador. */
  heading?: string;
}

export default function MortgageSimulator({
  heading = 'Simulador de hipoteca',
}: MortgageSimulatorProps) {
  return (
    <section className="simulator" aria-labelledby="simulator-heading">
      <h2 className="simulator__title" id="simulator-heading">
        {heading}
      </h2>
      <p className="simulator__status">Simulador FINOVA — pendiente de implementación.</p>

      <dl className="simulator__defaults">
        <div>
          <dt>Tipo de interés (TIN)</dt>
          <dd>{ANNUAL_INTEREST_RATE_DEFAULT}% fijo</dd>
        </div>
        <div>
          <dt>Financiación</dt>
          <dd>
            {FINANCING_PERCENTAGE_DEFAULT}% (rango {FINANCING_PERCENTAGE_MIN}–
            {FINANCING_PERCENTAGE_MAX}%)
          </dd>
        </div>
        <div>
          <dt>Plazo</dt>
          <dd>
            {TERM_YEARS_DEFAULT} años (rango {TERM_YEARS_MIN}–{TERM_YEARS_MAX})
          </dd>
        </div>
      </dl>
    </section>
  );
}
