import { useEffect, type ReactNode } from 'react';
import AppLink from '../components/AppLink.tsx';
import { useI18n } from '../i18n.tsx';
import { LEGAL } from '../legal.config.ts';

interface LegalLayoutProps {
  titleKey: 'aviso' | 'privacidad' | 'cookies' | 'terminos';
  children: ReactNode;
}

export default function LegalLayout({ titleKey, children }: LegalLayoutProps) {
  const { t } = useI18n();
  const title = t(`legal.titles.${titleKey}`);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.customTitle = '1';
    document.title = `${title} — Poll Walker`;
    return () => {
      delete root.dataset.customTitle;
      document.title = t('pageTitle');
    };
  }, [title, t]);

  return (
    <article className="card legal-page">
      <AppLink href="/" className="legal-back">
        ← {t('legal.back')}
      </AppLink>
      <h1>{title}</h1>
      <p className="legal-updated">
        {t('legal.lastUpdated')}: <time dateTime={LEGAL.LAST_UPDATED}>{LEGAL.LAST_UPDATED}</time>
      </p>
      {children}
    </article>
  );
}

/** mailto link when a real address is configured; plain text while it is still a placeholder. */
export function Email() {
  const email = LEGAL.CONTACT_EMAIL;
  return email.includes('@') && !email.startsWith('[') ? (
    <a href={`mailto:${email}`}>{email}</a>
  ) : (
    <strong>{email}</strong>
  );
}
