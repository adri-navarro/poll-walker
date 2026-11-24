import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  fetchPoll,
  submitVote,
  subscribeToPollResults,
  updateVote,
  type ApiError,
} from '../api.ts';
import { useI18n } from '../i18n.tsx';
import type { LiveConnectionStatus, Poll } from '../types.ts';

interface PollViewProps {
  pollId: string;
  justCreated: boolean;
  onCreateNew: () => void;
}

interface PollErrorState {
  serverMessage?: string;
  fallbackKey: string;
}

function formatLinkLabel(url: string, fallbackLabel: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return fallbackLabel;
  }
}

export default function PollView({ pollId, justCreated, onCreateNew }: PollViewProps) {
  const { t, translateServerError } = useI18n();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PollErrorState | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveConnectionStatus>('connecting');
  const [voteNoticeKey, setVoteNoticeKey] = useState('');

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/poll/${pollId}`;
  }, [pollId]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setSelectedIds([]);
    setIsEditing(false);
    setVoteNoticeKey('');

    fetchPoll(pollId)
      .then((data) => {
        if (!active) return;
        setPoll(data);
        setShowResults(Boolean(data.hasVoted));
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : undefined;
        setError({ serverMessage: message, fallbackKey: 'poll.errorLoadFailed' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const unsubscribe = subscribeToPollResults(
      pollId,
      (update) => {
        setPoll((prev) =>
          prev
            ? {
                ...prev,
                totalVoters: update.totalVoters,
                totalVotes: update.totalVotes,
                options: update.options,
              }
            : prev
        );
      },
      (status) => setLiveStatus(status)
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [pollId]);

  const toggleOption = (optionId: number) => {
    if (!poll) return;
    if (poll.allowMultiple) {
      setSelectedIds((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
      );
    } else {
      setSelectedIds([optionId]);
    }
  };

  const handleStartEdit = () => {
    if (!poll) return;
    setSelectedIds(poll.votedOptionIds || []);
    setIsEditing(true);
    setShowResults(false);
    setError(null);
    setVoteNoticeKey('');
  };

  const handleBackToVote = () => {
    setShowResults(false);
    setError(null);
    setVoteNoticeKey('');
  };

  const handleShowResults = () => {
    setIsEditing(false);
    setShowResults(true);
    setError(null);
  };

  const handleVote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    setSubmitting(true);
    setError(null);
    setVoteNoticeKey('');

    try {
      const updated = isEditing
        ? await updateVote(pollId, selectedIds)
        : await submitVote(pollId, selectedIds);
      setPoll(updated);
      setIsEditing(false);
      setShowResults(true);
      setVoteNoticeKey(isEditing ? 'poll.voteUpdated' : 'poll.voteSaved');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr.alreadyVoted && apiErr.poll) {
        setPoll(apiErr.poll);
        setIsEditing(false);
        setShowResults(true);
        setVoteNoticeKey('poll.alreadyVotedNotice');
      } else {
        setError({
          serverMessage: apiErr instanceof Error ? apiErr.message : undefined,
          fallbackKey: isEditing ? 'poll.errorUpdateVote' : 'poll.errorSubmitVote',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const input = document.getElementById('share-url-input') as HTMLInputElement | null;
      input?.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share || !poll) return;
    try {
      await navigator.share({
        title: poll.question,
        text: t('poll.shareText', { question: poll.question }),
        url: shareUrl,
      });
    } catch {
      // User cancelled share sheet
    }
  };

  const errorMessage = error
    ? translateServerError(error.serverMessage, error.fallbackKey)
    : '';
  const voteNotice = voteNoticeKey ? t(voteNoticeKey) : '';

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('poll.loading')}</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>{t('poll.notFoundTitle')}</h2>
        {errorMessage && (
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{errorMessage}</p>
        )}
        <button type="button" className="btn btn-primary" onClick={onCreateNew}>
          {t('poll.createNew')}
        </button>
      </div>
    );
  }

  const maxVotes = Math.max(0, ...poll.options.map((o) => o.votes));
  const votedSet = new Set(poll.votedOptionIds || []);

  return (
    <div className="card">
      {justCreated && <div className="alert alert-success">{t('poll.justCreated')}</div>}

      {voteNotice && <div className="alert alert-info">{voteNotice}</div>}
      {errorMessage && (
        <div className="alert alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="poll-header">
        <div className="poll-meta">
          <span className="badge badge-primary">
            {poll.allowMultiple ? t('poll.multipleChoice') : t('poll.singleChoice')}
          </span>
          <span className="badge">
            {poll.totalVoters}{' '}
            {poll.totalVoters === 1 ? t('poll.voterSingular') : t('poll.voterPlural')}
          </span>
          {liveStatus === 'connected' && (
            <span className="badge badge-live">
              <span className="live-dot" /> {t('poll.liveResults')}
            </span>
          )}
        </div>

        <h1 className="poll-question">{poll.question}</h1>
        {poll.description && <p className="poll-description">{poll.description}</p>}
      </div>

      {!showResults && (!poll.hasVoted || isEditing) ? (
        <form onSubmit={handleVote}>
          <div className="vote-options">
            {poll.options.map((option) => {
              const checked = selectedIds.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`vote-option-card ${checked ? 'selected' : ''}`}
                >
                  <input
                    type={poll.allowMultiple ? 'checkbox' : 'radio'}
                    name="poll-option"
                    checked={checked}
                    onChange={() => toggleOption(option.id)}
                  />
                  <div className="vote-option-content">
                    <span className="vote-option-label">{option.label}</span>
                    {option.details && (
                      <span className="vote-option-details">{option.details}</span>
                    )}
                    {option.url && (
                      <a
                        href={option.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="option-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span>{formatLinkLabel(option.url, t('poll.moreInfo'))}</span>
                      </a>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          <div className="poll-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleShowResults}
            >
              {isEditing ? t('poll.cancel') : t('poll.showResults')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={selectedIds.length === 0 || submitting}
            >
              {submitting
                ? isEditing
                  ? t('poll.updatingVote')
                  : t('poll.savingVote')
                : isEditing
                  ? t('poll.updateVote')
                  : t('poll.submitVote')}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="results-list">
            {poll.options.map((option) => {
              const isVoted = votedSet.has(option.id);
              const isLeader = maxVotes > 0 && option.votes === maxVotes;
              return (
                <div
                  key={option.id}
                  className={`result-item ${isVoted ? 'is-voted' : ''} ${
                    isLeader ? 'is-leader' : ''
                  }`}
                >
                  <div className="result-row-top">
                    <div className="result-label-group">
                      <div className="result-label">
                        <span>{option.label}</span>
                        {isVoted && <span className="your-vote-tag">{t('poll.yourVote')}</span>}
                        {isLeader && poll.totalVoters > 0 && (
                          <span className="leader-tag">{t('poll.leading')}</span>
                        )}
                      </div>
                      {(option.details || option.url) && (
                        <div className="result-meta">
                          {option.details && (
                            <span className="result-details">{option.details}</span>
                          )}
                          {option.url && (
                            <a
                              href={option.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="option-link"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              <span>{formatLinkLabel(option.url, t('poll.moreInfo'))}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="result-stats">
                      {option.votes}{' '}
                      {option.votes === 1 ? t('poll.voteSingular') : t('poll.votePlural')}
                      <strong>{option.percentage}%</strong>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${Math.min(100, option.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="poll-actions">
            {!poll.hasVoted ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleBackToVote}
              >
                {t('poll.backToVote')}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleStartEdit}
              >
                {t('poll.editVote')}
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onCreateNew}>
              {t('poll.createOwnPoll')}
            </button>
          </div>
        </div>
      )}

      <div className="share-box">
        <div className="share-box-label">{t('poll.shareLabel')}</div>
        <div className="share-row">
          <input
            id="share-url-input"
            className="share-input"
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(e) => e.target.select()}
          />
          <button type="button" className="btn btn-primary" onClick={handleCopyLink}>
            {copied ? t('poll.copied') : t('poll.copyLink')}
          </button>
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button type="button" className="btn btn-secondary" onClick={handleNativeShare}>
              {t('poll.share')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
