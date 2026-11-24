/**
 * Legal identity and dates used by every legal page (src/legal/*) and nothing else.
 *
 * HOW TO FILL: replace every value that starts with "[PENDIENTE" with the real data of the
 * person or entity responsible for the site (LSSI art. 10 requires name, NIF/CIF, address and
 * a contact email). Do not hardcode these details anywhere else. Bump LAST_UPDATED whenever
 * the legal texts change. Check HOSTING_PROVIDER_LOCATION with the VPS contract (datacenter
 * country) before publishing; the privacy policy prints this location next to "no international
 * transfers are expected"; that statement only holds if it is inside the EU/EEA.
 *
 * These texts are a starting point and NOT legal advice: have them reviewed by a lawyer.
 */
export interface LegalConfig {
  OWNER_NAME: string;
  OWNER_NIF: string;
  OWNER_ADDRESS: string;
  CONTACT_EMAIL: string;
  HOSTING_PROVIDER: string;
  HOSTING_PROVIDER_LOCATION: string;
  SITE_DOMAIN: string;
  /** ISO date (YYYY-MM-DD) of the last change to the legal texts. */
  LAST_UPDATED: string;
  /**
   * Months of inactivity after which a poll is deleted. Must stay consistent with the
   * RETENTION_DAYS env var (365 days is about 12 months); if the operator changes
   * RETENTION_DAYS, update this value too.
   */
  RETENTION_MONTHS: number;
}

export const LEGAL: LegalConfig = {
  OWNER_NAME: '[PENDIENTE: nombre completo o razón social]',
  OWNER_NIF: '[PENDIENTE: NIF/CIF]',
  OWNER_ADDRESS: '[PENDIENTE: domicilio postal completo]',
  CONTACT_EMAIL: '[PENDIENTE: correo electrónico de contacto]',
  HOSTING_PROVIDER: 'EuroNodes',
  HOSTING_PROVIDER_LOCATION: '[PENDIENTE: país/ubicación del centro de datos del VPS]',
  SITE_DOMAIN: '[PENDIENTE: subdominio].itsadri.dev',
  LAST_UPDATED: '2026-11-24',
  RETENTION_MONTHS: 12,
};
