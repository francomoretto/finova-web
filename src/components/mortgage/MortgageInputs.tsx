/**
 * Formulario de entrada del simulador. Andamiaje: la API de props ya está
 * definida, la interfaz llegará con el diseño.
 */

import type { MortgageInput } from '@lib/mortgage/types';

export interface MortgageInputsProps {
  readonly value: MortgageInput;
  readonly onChange: (value: MortgageInput) => void;
  /** Errores por campo, tal y como los devuelve el schema de Zod. */
  readonly errors?: Partial<Record<keyof MortgageInput, string>>;
}

export default function MortgageInputs({ value }: MortgageInputsProps) {
  return (
    <fieldset>
      <legend>Datos de la operación</legend>
      <p className="placeholder-note">
        Controles pendientes de implementación. Precio actual: {value.propertyPrice} €.
      </p>
    </fieldset>
  );
}
