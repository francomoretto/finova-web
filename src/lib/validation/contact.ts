/**
 * Validación del formulario de contacto.
 *
 * Un único schema compartido por cliente y servidor: la lógica de validación
 * no se duplica dentro de los componentes.
 */

import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Indica tu nombre.').max(120, 'El nombre es demasiado largo.'),
  email: z.string().trim().toLowerCase().pipe(z.email('Introduce un email válido.')),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{9,20}$/, 'Introduce un teléfono válido.')
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Cuéntanos brevemente qué necesitas (mínimo 10 caracteres).')
    .max(2000, 'El mensaje es demasiado largo.'),
  /** Consentimiento RGPD: obligatorio. */
  consent: z.literal(true, {
    message: 'Debes aceptar la política de privacidad para continuar.',
  }),
  /** Honeypot anti-spam: debe llegar vacío. */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
