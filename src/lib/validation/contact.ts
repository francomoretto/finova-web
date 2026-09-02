/**
 * Validación del formulario de contacto.
 *
 * Un único schema compartido por cliente y servidor: la lógica de validación
 * no se duplica dentro de los componentes.
 *
 * `CONTACT_LIMITS` es la fuente única de los límites: lo consumen tanto este
 * schema como los atributos HTML del formulario
 * (`src/components/sections/home/ContactSection.astro`), de modo que la
 * validación del navegador y la del servidor no puedan divergir.
 */

import { z } from 'zod';

export const CONTACT_LIMITS = {
  name: { min: 2, max: 120 },
  subject: { min: 3, max: 150 },
  message: { min: 10, max: 2000 },
  email: { max: 254 },
  phone: { min: 9, max: 20 },
} as const;

/** Teléfono: dígitos, espacios, paréntesis, guiones y prefijo internacional. */
export const PHONE_PATTERN = '[+0-9 ()-]{9,20}';

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.name.min, 'Indica tu nombre.')
    .max(CONTACT_LIMITS.name.max, 'El nombre es demasiado largo.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(CONTACT_LIMITS.email.max)
    .pipe(z.email('Introduce un email válido.')),
  phone: z
    .string()
    .trim()
    .regex(new RegExp(`^${PHONE_PATTERN}$`), 'Introduce un teléfono válido.')
    .optional(),
  subject: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.subject.min, 'Indica el asunto de tu consulta.')
    .max(CONTACT_LIMITS.subject.max, 'El asunto es demasiado largo.'),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.message.min, 'Cuéntanos brevemente qué necesitas (mínimo 10 caracteres).')
    .max(CONTACT_LIMITS.message.max, 'El mensaje es demasiado largo.'),
  /** Consentimiento RGPD: obligatorio. */
  consent: z.literal(true, {
    message: 'Debes aceptar la política de privacidad para continuar.',
  }),
  /** Honeypot anti-spam: debe llegar vacío. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
