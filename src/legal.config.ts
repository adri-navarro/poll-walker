/**
 * Legal identity and dates used by every legal page (src/legal/*) and nothing else.
 *
 * No personal owner data (name, NIF/CIF, postal address) lives here or anywhere in the repo on
 * purpose: the site is identified only by SITE_DOMAIN and every request goes to CONTACT_EMAIL.
 * Do not hardcode these details anywhere else. Bump LAST_UPDATED whenever the legal texts
 * change. No placeholders remain; keep RETENTION_MONTHS in sync with RETENTION_DAYS.
 *
 * These texts are a starting point and NOT legal advice: have them reviewed by a lawyer.
 */
export interface LegalConfig {
  CONTACT_EMAIL: string;
  HOSTING_PROVIDER: string;
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
  CONTACT_EMAIL: 'support@itsadri.dev',
  HOSTING_PROVIDER: 'EuroNodes',
  SITE_DOMAIN: 'pollwalker.itsadri.dev',
  LAST_UPDATED: '2026-11-24',
  RETENTION_MONTHS: 12,
};
