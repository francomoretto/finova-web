/**
 * Navegación del sitio.
 *
 * Fuente única de verdad: Header y Footer consumen estas listas, nunca
 * escriben URLs a mano. Si una ruta cambia, se cambia aquí y en ningún sitio más.
 *
 * Los enlaces a secciones de la portada usan rutas ABSOLUTAS con hash
 * (`/#proceso`, no `#proceso`) para que funcionen también desde páginas
 * interiores.
 */

import { SERVICES } from './services';

export interface NavItem {
  /** Destino. Ruta absoluta desde la raíz del sitio. */
  readonly href: string;
  /** Texto visible del enlace. */
  readonly label: string;
  /**
   * Ruta de página con la que se marca el estado activo.
   * `null` en anclas de la portada: no se resalta ninguna sección sin scrollspy.
   */
  readonly matchPath: string | null;
}

/** Navegación principal: cabecera y columna "Navegación" del pie. */
export const mainNavigation: readonly NavItem[] = [
  { href: '/', label: 'Inicio', matchPath: '/' },
  { href: '/#proceso', label: 'Proceso', matchPath: null },
  { href: '/#sobre-finova', label: 'Sobre Finova', matchPath: null },
  { href: '/simulador-hipoteca/', label: 'Simulador', matchPath: '/simulador-hipoteca/' },
  { href: '/#contacto', label: 'Contacto', matchPath: null },
] as const;

/** Servicios. Derivado de `services.ts` para no duplicar rutas ni nombres. */
export const serviceNavigation: readonly NavItem[] = SERVICES.map((service) => ({
  href: service.href,
  label: service.title,
  matchPath: service.href,
}));

/** Páginas legales. */
export const legalNavigation: readonly NavItem[] = [
  { href: '/aviso-legal/', label: 'Aviso legal', matchPath: '/aviso-legal/' },
  {
    href: '/politica-privacidad/',
    label: 'Política de privacidad',
    matchPath: '/politica-privacidad/',
  },
  { href: '/politica-cookies/', label: 'Política de cookies', matchPath: '/politica-cookies/' },
] as const;

/** Llamada a la acción principal, compartida por cabecera y menú móvil. */
export const primaryCta = {
  href: '/simulador-hipoteca/',
  label: 'Estudiar mi hipoteca',
} as const;

/**
 * ¿Debe marcarse este enlace como página actual?
 * Sólo para rutas de página reales; los anclas de la portada nunca se marcan.
 */
export function isActiveNavItem(item: NavItem, currentPath: string): boolean {
  return item.matchPath !== null && item.matchPath === currentPath;
}
