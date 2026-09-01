/**
 * Entidades financieras con las que trabaja FINOVA.
 *
 * `logo` queda opcional a propósito: los archivos aún no existen. Cuando estén,
 * se colocarán en `src/assets/images/banks/` y se referenciarán desde aquí.
 */

export interface Bank {
  /** Identificador estable en kebab-case. Se usa en URLs y claves. */
  readonly id: string;
  /** Nombre comercial tal y como debe mostrarse. */
  readonly name: string;
  /** Ruta al logotipo. Pendiente. */
  readonly logo?: string;
}

export const BANKS: readonly Bank[] = [
  { id: 'ing', name: 'ING' },
  { id: 'ibercaja', name: 'Ibercaja' },
  { id: 'eurocaja', name: 'Eurocaja' },
  { id: 'uci', name: 'UCI' },
  { id: 'unicaja', name: 'Unicaja' },
  { id: 'caja-rural-asturias', name: 'Caja Rural de Asturias' },
  { id: 'santander', name: 'Santander' },
  { id: 'sabadell', name: 'Sabadell' },
  { id: 'abanca', name: 'Abanca' },
  { id: 'bankinter', name: 'Bankinter' },
  { id: 'banco-pichincha', name: 'Banco Pichincha' },
] as const;

export function findBankById(id: string): Bank | undefined {
  return BANKS.find((bank) => bank.id === id);
}
