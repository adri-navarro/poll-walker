import { useI18n } from '../i18n.tsx';
import AppLink from './AppLink.tsx';

/** One-line notice under submit buttons. No checkbox: the legal basis is not consent. */
export default function LegalNotice({ action }: { action: 'create' | 'vote' }) {
  const { t } = useI18n();
  return (
    <>
      {action === 'vote' && <p className="legal-notice legal-hint">{t('legalNotice.votePublic')}</p>}
      <p className="legal-notice">
      {t(action === 'create' ? 'legalNotice.createBefore' : 'legalNotice.voteBefore')}
      <AppLink href="/terminos">{t('legalNotice.terms')}</AppLink>
      {t('legalNotice.middle')}
      <AppLink href="/privacidad">{t('legalNotice.privacy')}</AppLink>
      {t('legalNotice.after')}
      </p>
    </>
  );
}
