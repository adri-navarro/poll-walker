import { useCallback, useEffect, useState } from 'react';
import { fetchRecentPolls } from './api.ts';
import { useI18n } from './i18n.tsx';
import type { RecentPollSummary } from './types.ts';
import CreatePoll from './components/CreatePoll.tsx';
import PollView from './components/PollView.tsx';
import RecentPolls from './components/RecentPolls.tsx';
import AppLink from './components/AppLink.tsx';
import AvisoLegal from './legal/AvisoLegal.tsx';
import Privacidad from './legal/Privacidad.tsx';
import Cookies from './legal/Cookies.tsx';
import Terminos from './legal/Terminos.tsx';
import { NAVIGATE_EVENT, navigate } from './navigation.ts';

type Theme = 'light' | 'dark';

const LEGAL_ROUTES = {
  '/aviso-legal': 'aviso',
  '/privacidad': 'privacidad',
  '/cookies': 'cookies',
  '/terminos': 'terminos',
} as const;
type LegalPage = (typeof LEGAL_ROUTES)[keyof typeof LEGAL_ROUTES];

type Route = { poll: string | null; legal: LegalPage | null };

function parseRoute(pathname: string): Route {
  const match = pathname.match(/^\/poll\/([A-Za-z0-9_-]+)\/?$/);
  if (match) return { poll: match[1], legal: null };
  const key = pathname.replace(/\/+$/, '') as keyof typeof LEGAL_ROUTES;
  return { poll: null, legal: LEGAL_ROUTES[key] ?? null };
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Ignore storage access errors
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const { lang, toggleLang, t } = useI18n();
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const pollId = route.poll;
  const legalPage = route.legal;
  const [justCreatedId, setJustCreatedId] = useState<string | null>(null);
  const [recentPolls, setRecentPolls] = useState<RecentPollSummary[]>([]);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('theme')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Ignore storage access errors
      }
      return next;
    });
  };

  const loadRecent = useCallback(() => {
    fetchRecentPolls()
      .then(setRecentPolls)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onLocationChange = () => {
      setRoute(parseRoute(window.location.pathname));
      setJustCreatedId(null);
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener(NAVIGATE_EVENT, onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener(NAVIGATE_EVENT, onLocationChange);
    };
  }, []);

  useEffect(() => {
    if (!pollId && !legalPage) {
      loadRecent();
    }
  }, [pollId, legalPage, loadRecent]);

  const navigateHome = () => navigate('/');

  const navigateToPoll = (id: string, created = false) => {
    navigate(`/poll/${id}`);
    setJustCreatedId(created ? id : null);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button type="button" className="brand" onClick={navigateHome}>
            <span className="brand-icon" aria-hidden="true">
              📊
            </span>
            <span>Poll Walker</span>
          </button>

          <div className="topbar-actions">
            {pollId && (
              <button type="button" className="btn btn-secondary" onClick={navigateHome}>
                {t('nav.newPoll')}
              </button>
            )}
            <button
              type="button"
              className="lang-toggle"
              onClick={toggleLang}
              aria-label={t('nav.switchLanguage')}
              title={t('nav.switchLanguage')}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{lang.toUpperCase()}</span>
            </button>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
              title={theme === 'dark' ? t('nav.switchToLight') : t('nav.switchToDark')}
            >
              {theme === 'dark' ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="main-container">
        {legalPage === 'aviso' ? (
          <AvisoLegal />
        ) : legalPage === 'privacidad' ? (
          <Privacidad />
        ) : legalPage === 'cookies' ? (
          <Cookies />
        ) : legalPage === 'terminos' ? (
          <Terminos />
        ) : pollId ? (
          <PollView
            pollId={pollId}
            justCreated={justCreatedId === pollId}
            onCreateNew={navigateHome}
          />
        ) : (
          <>
            <div className="hero">
              <h1>{t('hero.title')}</h1>
              <p>{t('hero.subtitle')}</p>
            </div>
            <CreatePoll onCreated={(poll) => navigateToPoll(poll.id, true)} />
            <RecentPolls polls={recentPolls} onSelectPoll={(id) => navigateToPoll(id, false)} />
          </>
        )}
      </main>

      <footer className="footer">
        <p>{t('footer')}</p>
        <nav className="footer-links" aria-label={t('legal.footerNavLabel')}>
          <AppLink href="/aviso-legal">{t('legal.titles.aviso')}</AppLink>
          <span aria-hidden="true">·</span>
          <AppLink href="/privacidad">{t('legal.titles.privacidad')}</AppLink>
          <span aria-hidden="true">·</span>
          <AppLink href="/cookies">{t('legal.titles.cookies')}</AppLink>
          <span aria-hidden="true">·</span>
          <AppLink href="/terminos">{t('legal.titles.terminos')}</AppLink>
        </nav>
      </footer>
    </div>
  );
}
