import { useState, type FormEvent } from 'react';
import { createPoll } from '../api.ts';
import { useI18n } from '../i18n.tsx';
import type { Poll } from '../types.ts';
import LegalNotice from './LegalNotice.tsx';

interface OptionDraft {
  label: string;
  url: string;
  details: string;
  showExtra: boolean;
}

type OptionTextField = 'label' | 'url' | 'details';

type FormError =
  | { key: string }
  | { serverMessage?: string; fallbackKey: string };

interface CreatePollProps {
  onCreated: (poll: Poll) => void;
}

function createEmptyOption(): OptionDraft {
  return { label: '', url: '', details: '', showExtra: false };
}

export default function CreatePoll({ onCreated }: CreatePollProps) {
  const { t, translateServerError } = useI18n();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<OptionDraft[]>([
    createEmptyOption(),
    createEmptyOption(),
  ]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const handleOptionFieldChange = (index: number, field: OptionTextField, value: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, [field]: value } : opt))
    );
  };

  const toggleOptionExtra = (index: number) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, showExtra: !opt.showExtra } : opt))
    );
  };

  const addOption = () => {
    if (options.length >= 12) return;
    setOptions((prev) => [...prev, createEmptyOption()]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedQuestion = question.trim();
    const cleanedOptions = options
      .map((o) => ({
        label: o.label.trim(),
        url: o.url.trim(),
        details: o.details.trim(),
      }))
      .filter((o) => o.label);

    if (!trimmedQuestion) {
      setError({ key: 'create.errorQuestionRequired' });
      return;
    }
    if (cleanedOptions.length < 2) {
      setError({ key: 'create.errorMinOptions' });
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
      const message = err instanceof Error ? err.message : undefined;
      setError({ serverMessage: message, fallbackKey: 'create.errorCreateFailed' });
    } finally {
      setSubmitting(false);
    }
  };

  const errorMessage = error
    ? 'key' in error
      ? t(error.key)
      : translateServerError(error.serverMessage, error.fallbackKey)
    : '';

  return (
    <form className="card" onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="alert alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="poll-question">
          <span>{t('create.questionLabel')}</span>
          <span className="form-hint">{question.length}/280</span>
        </label>
        <input
          id="poll-question"
          className="input"
          type="text"
          maxLength={280}
          placeholder={t('create.questionPlaceholder')}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="poll-description">
          <span>{t('create.descriptionLabel')}</span>
          <span className="form-hint">{t('create.optional')}</span>
        </label>
        <textarea
          id="poll-description"
          className="textarea"
          maxLength={500}
          placeholder={t('create.descriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <div className="form-label">
          <span>{t('create.optionsLabel')}</span>
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
                    placeholder={t('create.optionPlaceholder', { n: idx + 1 })}
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
                    title={isExtraOpen ? t('create.hideExtraInfo') : t('create.addExtraInfo')}
                    aria-expanded={isExtraOpen}
                    aria-label={t('create.addExtraInfoAria', { n: idx + 1 })}
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
                    <span>{t('create.infoButton')}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeOption(idx)}
                    disabled={options.length <= 2}
                    title={t('create.removeOption')}
                    aria-label={t('create.removeOptionAria', { n: idx + 1 })}
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
                      placeholder={t('create.linkPlaceholder')}
                      value={opt.url}
                      onChange={(e) => handleOptionFieldChange(idx, 'url', e.target.value)}
                    />
                    <input
                      className="input input-sm"
                      type="text"
                      maxLength={240}
                      placeholder={t('create.detailsPlaceholder')}
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
              {t('create.addOption')}
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <div className="form-label">
          <span>{t('create.votingType')}</span>
        </div>
        <div className="segmented" role="group" aria-label={t('create.votingType')}>
          <button
            type="button"
            className={`segmented-btn ${!allowMultiple ? 'active' : ''}`}
            onClick={() => setAllowMultiple(false)}
          >
            {t('create.singleChoice')}
          </button>
          <button
            type="button"
            className={`segmented-btn ${allowMultiple ? 'active' : ''}`}
            onClick={() => setAllowMultiple(true)}
          >
            {t('create.multipleChoice')}
          </button>
        </div>
      </div>

      <div className="form-footer">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t('create.submitting') : t('create.submit')}
        </button>
      </div>
      <p className="legal-notice legal-hint">{t('legalNotice.noPersonalData')}</p>
      <LegalNotice action="create" />
    </form>
  );
}
