import React, { useState } from 'react';
import { createPoll } from '../api.js';

function createEmptyOption() {
  return { label: '', url: '', details: '', showExtra: false };
}

export default function CreatePoll({ onCreated }) {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState([createEmptyOption(), createEmptyOption()]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleOptionFieldChange = (index, field, value) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    );
  };

  const toggleOptionExtra = (index) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, showExtra: !opt.showExtra } : opt))
    );
  };

  const addOption = () => {
    if (options.length >= 12) return;
    setOptions((prev) => [...prev, createEmptyOption()]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedQuestion = question.trim();
    const cleanedOptions = options
      .map((o) => ({
        label: o.label.trim(),
        url: o.url.trim(),
        details: o.details.trim(),
      }))
      .filter((o) => o.label);

    if (!trimmedQuestion) {
      setError('Please enter a question for your poll.');
      return;
    }
    if (cleanedOptions.length < 2) {
      setError('Please fill in at least 2 options.');
      return;
    }

    setSubmitting(true);
    try {
      const poll = await createPoll({
        question: trimmedQuestion,
        description: description.trim(),
        options: cleanedOptions,
        allowMultiple,
      });
      onCreated(poll);
    } catch (err) {
      setError(err.message || 'Could not create poll.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="poll-question">
          <span>Poll Question</span>
          <span className="form-hint">{question.length}/280</span>
        </label>
        <input
          id="poll-question"
          className="input"
          type="text"
          maxLength={280}
          placeholder="e.g., Where should we go for team lunch on Friday?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="poll-description">
          <span>Description</span>
          <span className="form-hint">Optional</span>
        </label>
        <textarea
          id="poll-description"
          className="textarea"
          maxLength={500}
          placeholder="Add extra context or instructions for voters..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <div className="form-label">
          <span>Answer Options</span>
          <span className="form-hint">{options.length}/12</span>
        </div>

        <div className="options-list">
          {options.map((opt, idx) => {
            const hasExtra = Boolean(opt.url.trim() || opt.details.trim());
            const isExtraOpen = opt.showExtra || hasExtra;
            return (
              <div key={idx} className="option-editor-item">
                <div className="option-input-row">
                  <span className="option-index">{idx + 1}</span>
                  <input
                    className="input"
                    type="text"
                    maxLength={160}
                    placeholder={`Option ${idx + 1}`}
                    value={opt.label}
                    onChange={(e) => handleOptionFieldChange(idx, 'label', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && idx === options.length - 1 && options.length < 12) {
                        e.preventDefault();
                        addOption();
                      }
                    }}
                  />
                  <button
                    type="button"
                    className={`btn-info-toggle ${isExtraOpen ? 'active' : ''}`}
                    onClick={() => toggleOptionExtra(idx)}
                    title={isExtraOpen ? 'Hide extra info' : 'Add link or details'}
                    aria-expanded={isExtraOpen}
                    aria-label={`Add link or info for option ${idx + 1}`}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span>Info</span>
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeOption(idx)}
                    disabled={options.length <= 2}
                    title="Remove option"
                    aria-label={`Remove option ${idx + 1}`}
                  >
                    ✕
                  </button>
                </div>

                {isExtraOpen && (
                  <div className="option-extra-fields">
                    <input
                      className="input input-sm"
                      type="text"
                      inputMode="url"
                      maxLength={500}
                      placeholder="Link (optional) — e.g. https://restaurant.com/menu"
                      value={opt.url}
                      onChange={(e) => handleOptionFieldChange(idx, 'url', e.target.value)}
                    />
                    <input
                      className="input input-sm"
                      type="text"
                      maxLength={240}
                      placeholder="Extra note (optional) — e.g. address, price, details"
                      value={opt.details}
                      onChange={(e) => handleOptionFieldChange(idx, 'details', e.target.value)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {options.length < 12 && (
          <div style={{ marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={addOption}>
              + Add Option
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <div className="form-label">
          <span>Voting Type</span>
        </div>
        <div className="segmented" role="group" aria-label="Voting type">
          <button
            type="button"
            className={`segmented-btn ${!allowMultiple ? 'active' : ''}`}
            onClick={() => setAllowMultiple(false)}
          >
            Single Choice
          </button>
          <button
            type="button"
            className={`segmented-btn ${allowMultiple ? 'active' : ''}`}
            onClick={() => setAllowMultiple(true)}
          >
            Multiple Choice
          </button>
        </div>
      </div>

      <div className="form-footer">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating Poll...' : 'Create & Get Share Link'}
        </button>
      </div>
    </form>
  );
}
