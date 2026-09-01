/**
 * Formulario para solicitar el estudio a partir de una simulación. Andamiaje.
 *
 * El envío será siempre server-side (ver `src/lib/email/README.md`) y validará
 * con `simulatorLeadSchema` antes de tocar SMTP.
 */

import type { MortgageInput } from '@lib/mortgage/types';

export interface SimulatorLeadFormProps {
  /** Simulación que se adjunta al lead. */
  readonly simulation: MortgageInput;
  /** Endpoint al que se enviará el formulario. Pendiente de definir runtime. */
  readonly action?: string;
}

export default function SimulatorLeadForm({ simulation }: SimulatorLeadFormProps) {
  return (
    <section aria-label="Solicitar estudio">
      <p className="placeholder-note">
        Formulario pendiente de implementación. Plazo simulado: {simulation.termYears} años.
      </p>
    </section>
  );
}
