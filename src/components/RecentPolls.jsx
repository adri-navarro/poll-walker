import React from 'react';

export default function RecentPolls({ polls, onSelectPoll }) {
  if (!polls || polls.length === 0) return null;

  return (
    <section className="recent-section">
      <h2 className="section-title">Recent Polls</h2>
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
              <span>{poll.allowMultiple ? 'Multiple choice' : 'Single choice'}</span>
              <span>
                {poll.totalVoters} {poll.totalVoters === 1 ? 'voter' : 'voters'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
