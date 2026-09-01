/**
 * JSON-LD (schema.org).
 *
 * Sólo se declaran datos confirmados. No se inventan teléfonos, redes sociales
 * ni valoraciones.
 *
 * El grafo GLOBAL es Organization + WebSite + WebPage, y nada más.
 *
 * FINOVA es un **Intermediario de Crédito Inmobiliario** inscrito en el Banco
 * de España, NO una entidad financiera: por eso NO se usa `FinancialService`
 * (ni `BankOrCreditUnion`) a nivel global, ya que implicaría que FINOVA concede
 * crédito por cuenta propia. Los `Service` concretos se añadirán en las páginas
 * de servicio cuando tengan contenido propio.
 */

import { COMPANY, SITE, SITE_URL } from '@data/company';

/** Nodo JSON-LD serializable. */
export type JsonLd = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function buildOrganizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: COMPANY.brand,
    legalName: COMPANY.legalName,
    url: SITE_URL,
    email: COMPANY.email,
    taxID: COMPANY.nif,
    description: COMPANY.activity,
    areaServed: { '@type': 'Country', name: 'España' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.address.street,
      postalCode: COMPANY.address.postalCode,
      addressLocality: COMPANY.address.city,
      addressRegion: COMPANY.address.region,
      addressCountry: COMPANY.address.country,
    },
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'Registro de Intermediarios de Crédito Inmobiliario (Banco de España)',
        value: COMPANY.registrations.bankOfSpain,
      },
      {
        '@type': 'PropertyValue',
        name: 'Asociado ANICI',
        value: COMPANY.registrations.anici,
      },
    ],
  };
}

export function buildWebSiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE.name,
    inLanguage: SITE.lang,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export interface WebPageSchemaParams {
  readonly title: string;
  readonly description: string;
  readonly canonical: string;
}

export function buildWebPageSchema({ title, description, canonical }: WebPageSchemaParams): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: canonical,
    name: title,
    description,
    inLanguage: SITE.lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
  };
}

export interface BreadcrumbItem {
  readonly name: string;
  readonly url: string;
}

export function buildBreadcrumbSchema(items: readonly BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
