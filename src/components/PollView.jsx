import React, { useEffect, useMemo, useState } from 'react';
import { fetchPoll, submitVote, subscribeToPollResults, updateVote } from '../api.js';

function formatLinkLabel(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'More info';
  }
}

export default function PollView({ pollId, justCreated, onCreateNew }) {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liveStatus, setLiveStatus] = useState('connecting');
  const [voteNotice, setVoteNotice] = useState('');

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/poll/${pollId}`;
  }, [pollId]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setSelectedIds([]);
    setIsEditing(false);
    setVoteNotice('');

    fetchPoll(pollId)
      .then((data) => {
        if (!active) return;
        setPoll(data);
        setShowResults(Boolean(data.hasVoted));
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Could not load poll.');
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

  const toggleOption = (optionId) => {
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
    setError('');
    setVoteNotice('');
  };

  const handleBackToVote = () => {
    setShowResults(false);
    setError('');
    setVoteNotice('');
  };

  const handleShowResults = () => {
    setIsEditing(false);
    setShowResults(true);
    setError('');
  };

  const handleVote = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    setSubmitting(true);
    setError('');
    setVoteNotice('');

    try {
      const updated = isEditing
        ? await updateVote(pollId, selectedIds)
        : await submitVote(pollId, selectedIds);
      setPoll(updated);
      setIsEditing(false);
      setShowResults(true);
      setVoteNotice(isEditing ? 'Your vote has been updated!' : 'Your vote has been saved!');
    } catch (err) {
      if (err.alreadyVoted && err.poll) {
        setPoll(err.poll);
        setIsEditing(false);
        setShowResults(true);
        setVoteNotice('You have already voted in this poll. You can edit your vote below.');
      } else {
        setError(err.message || (isEditing ? 'Failed to update vote.' : 'Failed to submit vote.'));
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
      const input = document.getElementById('share-url-input');
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
        text: `Vote on this poll: ${poll.question}`,
        url: shareUrl,
      });
    } catch {
      // User cancelled share sheet
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Loading poll...</p>
      </div>
    );
  }

  if (error && !poll) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Poll not found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{error}</p>
        <button type="button" className="btn btn-primary" onClick={onCreateNew}>
          Create a New Poll
        </button>
      </div>
    );
  }

  const maxVotes = Math.max(0, ...poll.options.map((o) => o.votes));
  const votedSet = new Set(poll.votedOptionIds || []);

  return (
    <div className="card">
      {justCreated && (
        <div className="alert alert-success">
          Poll created! Copy the link below and share it with anyone to start collecting votes.
        </div>
      )}

      {voteNotice && <div className="alert alert-info">{voteNotice}</div>}
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="poll-header">
        <div className="poll-meta">
          <span className="badge badge-primary">
            {poll.allowMultiple ? 'Multiple choice' : 'Single choice'}
          </span>
          <span className="badge">
            {poll.totalVoters} {poll.totalVoters === 1 ? 'voter' : 'voters'}
          </span>
          {liveStatus === 'connected' && (
            <span className="badge badge-live">
              <span className="live-dot" /> Live results
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
                        <span>{formatLinkLabel(option.url)}</span>
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
              {isEditing ? 'Cancel' : 'Show Results'}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={selectedIds.length === 0 || submitting}
            >
              {submitting
                ? isEditing
                  ? 'Updating Vote...'
                  : 'Saving Vote...'
                : isEditing
                  ? 'Update Vote'
                  : 'Submit Vote'}
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
                        {isVoted && <span className="your-vote-tag">Your vote</span>}
                        {isLeader && poll.totalVoters > 0 && (
                          <span className="leader-tag">Leading</span>
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
                              <span>{formatLinkLabel(option.url)}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="result-stats">
                      {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
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
                ← Back to Vote
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleStartEdit}
              >
                Edit Vote
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onCreateNew}>
              + Create Your Own Poll
            </button>
          </div>
        </div>
      )}

      <div className="share-box">
        <div className="share-box-label">Share this poll</div>
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
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button type="button" className="btn btn-secondary" onClick={handleNativeShare}>
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
