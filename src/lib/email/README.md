# Envío de email (SMTP)

Todavía **no** hay implementación de envío. Falta decidir el runtime de
producción (ver `README.md` > Deployment), y esa decisión condiciona dónde vive
el transporte.

## Regla no negociable

El envío ocurre **exclusivamente server-side**. Las credenciales SMTP nunca
llegan al navegador.

- Las variables se leen de `process.env` (o `import.meta.env` sin prefijo
  `PUBLIC_`), nunca desde un componente cliente.
- **Nunca** usar el prefijo `PUBLIC_` para nada relacionado con SMTP: Astro
  inlinea esas variables en el bundle del cliente.
- El formulario del navegador hace `POST` a un endpoint del servidor; ese
  endpoint valida con Zod (`src/lib/validation/`) y sólo entonces envía.

## Variables de entorno

Definidas en `.env.example`:

```
SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD,
CONTACT_TO, CONTACT_FROM
```

## Cuando se decida el runtime

- **Astro SSR (Node)** → crear `src/pages/api/contacto.ts` con
  `export const prerender = false` y usar Nodemailer directamente aquí.
- **Static + endpoint PHP en Hostinger** → el formulario apunta a un `.php`
  fuera de Astro; Nodemailer se retiraría de las dependencias y la validación
  del cliente seguiría viviendo en `src/lib/validation/`.

En ambos casos, antes de enviar:

1. Validar el payload con el schema de Zod correspondiente.
2. Comprobar el consentimiento RGPD.
3. Aplicar una protección anti-spam (honeypot y/o rate limiting).
