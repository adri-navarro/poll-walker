import React from 'react';
import { useI18n } from '../i18n.jsx';

export default function RecentPolls({ polls, onSelectPoll }) {
  const { t } = useI18n();

  if (!polls || polls.length === 0) return null;

  return (
    <section className="recent-section">
      <h2 className="section-title">{t('recent.title')}</h2>
      <div className="recent-grid">
        {polls.map((poll) => (
          <button
            key={poll.id}
            type="button"
            className="recent-card"
            onClick={() => onSelectPoll(poll.id)}
          >
            <div className="recent-card-title">{poll.question}</div>
            <div className="recent-card-meta">
              <span>{poll.allowMultiple ? t('poll.multipleChoice') : t('poll.singleChoice')}</span>
              <span>
                {poll.totalVoters}{' '}
                {poll.totalVoters === 1 ? t('poll.voterSingular') : t('poll.voterPlural')}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
