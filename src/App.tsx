import { useCallback, useEffect, useState } from 'react';
import { fetchRecentPolls } from './api.ts';
import { useI18n } from './i18n.tsx';
import type { RecentPollSummary } from './types.ts';
import CreatePoll from './components/CreatePoll.tsx';
import PollView from './components/PollView.tsx';
import RecentPolls from './components/RecentPolls.tsx';

type Theme = 'light' | 'dark';

function parsePollIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/poll\/([A-Za-z0-9_-]+)\/?$/);
  return match ? match[1] : null;
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
  const [pollId, setPollId] = useState<string | null>(() =>
    parsePollIdFromPath(window.location.pathname)
  );
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
    const onPopState = () => {
      setPollId(parsePollIdFromPath(window.location.pathname));
      setJustCreatedId(null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (!pollId) {
      loadRecent();
    }
  }, [pollId, loadRecent]);

  const navigateHome = () => {
    window.history.pushState({}, '', '/');
    setPollId(null);
    setJustCreatedId(null);
  };

  const navigateToPoll = (id: string, created = false) => {
    window.history.pushState({}, '', `/poll/${id}`);
    setPollId(id);
    setJustCreatedId(created ? id : null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {pollId ? (
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

      <footer className="footer">{t('footer')}</footer>
    </div>
  );
}
