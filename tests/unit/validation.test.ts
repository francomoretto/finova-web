import { describe, expect, it } from 'vitest';

import { contactSchema } from '../../src/lib/validation/contact';
import { mortgageInputSchema } from '../../src/lib/validation/mortgage';

const VALID_SIMULATION = {
  propertyPrice: 160_000,
  financingPercentage: 80,
  termYears: 30,
  annualInterestRate: 2.5,
  autonomousCommunity: 'AS',
} as const;

describe('mortgageInputSchema', () => {
  it('acepta una entrada válida', () => {
    expect(mortgageInputSchema.safeParse(VALID_SIMULATION).success).toBe(true);
  });

  it('exige un precio mayor que 0', () => {
    expect(mortgageInputSchema.safeParse({ ...VALID_SIMULATION, propertyPrice: 0 }).success).toBe(
      false,
    );
  });

  it('acota la financiación al rango 30–100 %', () => {
    expect(
      mortgageInputSchema.safeParse({ ...VALID_SIMULATION, financingPercentage: 29 }).success,
    ).toBe(false);
    expect(
      mortgageInputSchema.safeParse({ ...VALID_SIMULATION, financingPercentage: 101 }).success,
    ).toBe(false);
    expect(
      mortgageInputSchema.safeParse({ ...VALID_SIMULATION, financingPercentage: 100 }).success,
    ).toBe(true);
  });

  it('acota el plazo al rango 5–40 años', () => {
    expect(mortgageInputSchema.safeParse({ ...VALID_SIMULATION, termYears: 4 }).success).toBe(
      false,
    );
    expect(mortgageInputSchema.safeParse({ ...VALID_SIMULATION, termYears: 41 }).success).toBe(
      false,
    );
    expect(mortgageInputSchema.safeParse({ ...VALID_SIMULATION, termYears: 5 }).success).toBe(true);
  });

  it('exige un tipo de interés positivo y razonable', () => {
    expect(
      mortgageInputSchema.safeParse({ ...VALID_SIMULATION, annualInterestRate: 0 }).success,
    ).toBe(false);
    expect(
      mortgageInputSchema.safeParse({ ...VALID_SIMULATION, annualInterestRate: 99 }).success,
    ).toBe(false);
  });

  it('rechaza comunidades autónomas desconocidas', () => {
    expect(
      mortgageInputSchema.safeParse({ ...VALID_SIMULATION, autonomousCommunity: 'XX' }).success,
    ).toBe(false);
  });
});

describe('contactSchema', () => {
  const VALID_CONTACT = {
    name: 'Ana García',
    email: 'ana@example.com',
    subject: 'Consulta sobre hipoteca',
    message: 'Quiero información sobre una hipoteca.',
    consent: true,
  };

  it('acepta un contacto válido', () => {
    expect(contactSchema.safeParse(VALID_CONTACT).success).toBe(true);
  });

  it('exige el consentimiento RGPD', () => {
    expect(contactSchema.safeParse({ ...VALID_CONTACT, consent: false }).success).toBe(false);
  });

  it('rechaza emails inválidos', () => {
    expect(contactSchema.safeParse({ ...VALID_CONTACT, email: 'no-es-un-email' }).success).toBe(
      false,
    );
  });

  it('rechaza mensajes demasiado cortos', () => {
    expect(contactSchema.safeParse({ ...VALID_CONTACT, message: 'hola' }).success).toBe(false);
  });

  it('exige un asunto', () => {
    const { subject: _subject, ...withoutSubject } = VALID_CONTACT;
    expect(contactSchema.safeParse(withoutSubject).success).toBe(false);
    expect(contactSchema.safeParse({ ...VALID_CONTACT, subject: 'ab' }).success).toBe(false);
  });

  it('el teléfono es opcional pero se valida si viene', () => {
    expect(contactSchema.safeParse({ ...VALID_CONTACT, phone: '+34 985 12 34 56' }).success).toBe(
      true,
    );
    expect(contactSchema.safeParse({ ...VALID_CONTACT, phone: 'no-es-un-teléfono' }).success).toBe(
      false,
    );
  });

  it('rechaza el envío si el honeypot viene relleno', () => {
    expect(contactSchema.safeParse({ ...VALID_CONTACT, website: 'spam' }).success).toBe(false);
  });
});
