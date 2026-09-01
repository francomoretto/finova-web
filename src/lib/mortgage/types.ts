/**
 * Tipos de negocio del simulador hipotecario.
 *
 * Este módulo describe el DOMINIO, no la UI. Ningún componente debe declarar
 * sus propias estructuras financieras: siempre importa desde aquí.
 */

/** Códigos ISO 3166-2:ES de las comunidades y ciudades autónomas. */
export type AutonomousCommunityCode =
  | 'AN' // Andalucía
  | 'AR' // Aragón
  | 'AS' // Principado de Asturias
  | 'CN' // Canarias
  | 'CB' // Cantabria
  | 'CL' // Castilla y León
  | 'CM' // Castilla-La Mancha
  | 'CT' // Cataluña
  | 'CE' // Ceuta
  | 'EX' // Extremadura
  | 'GA' // Galicia
  | 'IB' // Illes Balears
  | 'RI' // La Rioja
  | 'MD' // Comunidad de Madrid
  | 'ML' // Melilla
  | 'MC' // Región de Murcia
  | 'NC' // Comunidad Foral de Navarra
  | 'PV' // País Vasco
  | 'VC'; // Comunitat Valenciana

export interface AutonomousCommunity {
  readonly code: AutonomousCommunityCode;
  readonly name: string;
}

/**
 * FINOVA simula únicamente hipoteca a tipo fijo. El tipo se mantiene como
 * unión para poder ampliarlo (variable / mixta) sin romper las firmas.
 */
export type MortgageType = 'fixed';

/** Datos que introduce el usuario en el simulador. */
export interface MortgageInput {
  /** Precio de compraventa del inmueble, en euros. */
  readonly propertyPrice: number;
  /** Porcentaje del precio que se financia (30–100). */
  readonly financingPercentage: number;
  /** Plazo en años (5–40). */
  readonly termYears: number;
  /** Tipo de interés nominal anual (TIN) en porcentaje, p. ej. 2.5. */
  readonly annualInterestRate: number;
  /** Comunidad autónoma donde radica el inmueble (determina la fiscalidad). */
  readonly autonomousCommunity: AutonomousCommunityCode;
}

/** Una fila del cuadro de amortización (sistema francés). */
export interface AmortizationRow {
  /** Número de cuota, empezando en 1. */
  readonly month: number;
  /** Año del préstamo al que pertenece la cuota, empezando en 1. */
  readonly year: number;
  /** Cuota total del periodo. */
  readonly payment: number;
  /** Parte de la cuota que corresponde a intereses. */
  readonly interest: number;
  /** Parte de la cuota que amortiza capital. */
  readonly principal: number;
  /** Capital pendiente tras pagar la cuota. */
  readonly remainingCapital: number;
}

export interface AmortizationSchedule {
  readonly rows: readonly AmortizationRow[];
  readonly totalInterest: number;
  readonly totalPaid: number;
}

/** Concepto individual dentro de un desglose (impuesto o gasto). */
export interface BreakdownItem {
  readonly id: string;
  readonly label: string;
  readonly amount: number;
}

/**
 * Resultado de un desglose calculado.
 *
 * `isAvailable === false` significa que todavía no disponemos de los datos
 * (tabla fiscal o tarifas) para esa comunidad o concepto: la UI debe mostrarlo
 * como "pendiente", nunca como 0 €.
 */
export interface BreakdownResult {
  readonly items: readonly BreakdownItem[];
  readonly total: number;
  readonly isAvailable: boolean;
  readonly notes: readonly string[];
}

/** Resultado completo de una simulación. */
export interface MortgageResult {
  /** Capital que financia la entidad. */
  readonly financedCapital: number;
  /** Parte del precio no financiada (entrada). */
  readonly nonFinancedCapital: number;
  /** Cuota mensual constante (sistema francés). */
  readonly monthlyPayment: number;
  /** Ahorro total necesario: entrada + impuestos + gastos. */
  readonly ownContribution: number;
  /** Desglose de impuestos (ITP / AJD según el caso). */
  readonly taxes: BreakdownResult;
  /** Desglose de gastos estimados (tasación, notaría, registro, gestoría…). */
  readonly estimatedExpenses: BreakdownResult;
  /** Intereses totales a lo largo de la vida del préstamo. */
  readonly totalInterest: number;
  /** Coste total de la operación: capital + intereses + impuestos + gastos. */
  readonly totalCost: number;
  /** Cuadro de amortización completo. */
  readonly amortization: readonly AmortizationRow[];
}
