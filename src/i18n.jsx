import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const SUPPORTED_LANGS = ['en', 'es'];

const TRANSLATIONS = {
  en: {
    pageTitle: 'Poll Walker — Create & Share Live Polls',
    nav: {
      newPoll: '+ New Poll',
      switchToLight: 'Switch to light mode',
      switchToDark: 'Switch to dark mode',
      switchLanguage: 'Switch to Spanish',
      languageLabel: 'Language',
    },
    hero: {
      title: 'Create a poll in seconds',
      subtitle: 'Share a link with anyone and watch votes roll in live.',
    },
    footer: 'Poll Walker — Fast, shareable live polls saved with SQLite.',
    create: {
      questionLabel: 'Poll Question',
      questionPlaceholder: 'e.g., Where should we go for team lunch on Friday?',
      descriptionLabel: 'Description',
      optional: 'Optional',
      descriptionPlaceholder: 'Add extra context or instructions for voters...',
      optionsLabel: 'Answer Options',
      optionPlaceholder: 'Option {n}',
      hideExtraInfo: 'Hide extra info',
      addExtraInfo: 'Add link or details',
      addExtraInfoAria: 'Add link or info for option {n}',
      infoButton: 'Info',
      removeOption: 'Remove option',
      removeOptionAria: 'Remove option {n}',
      linkPlaceholder: 'Link (optional) — e.g. https://restaurant.com/menu',
      detailsPlaceholder: 'Extra note (optional) — e.g. address, price, details',
      addOption: '+ Add Option',
      votingType: 'Voting Type',
      singleChoice: 'Single Choice',
      multipleChoice: 'Multiple Choice',
      submitting: 'Creating Poll...',
      submit: 'Create & Get Share Link',
      errorQuestionRequired: 'Please enter a question for your poll.',
      errorMinOptions: 'Please fill in at least 2 options.',
      errorCreateFailed: 'Could not create poll.',
    },
    poll: {
      loading: 'Loading poll...',
      notFoundTitle: 'Poll not found',
      createNew: 'Create a New Poll',
      justCreated:
        'Poll created! Copy the link below and share it with anyone to start collecting votes.',
      voteUpdated: 'Your vote has been updated!',
      voteSaved: 'Your vote has been saved!',
      alreadyVotedNotice: 'You have already voted in this poll. You can edit your vote below.',
      errorLoadFailed: 'Could not load poll.',
      errorUpdateVote: 'Failed to update vote.',
      errorSubmitVote: 'Failed to submit vote.',
      multipleChoice: 'Multiple choice',
      singleChoice: 'Single choice',
      voterSingular: 'voter',
      voterPlural: 'voters',
      voteSingular: 'vote',
      votePlural: 'votes',
      liveResults: 'Live results',
      moreInfo: 'More info',
      cancel: 'Cancel',
      showResults: 'Show Results',
      updatingVote: 'Updating Vote...',
      savingVote: 'Saving Vote...',
      updateVote: 'Update Vote',
      submitVote: 'Submit Vote',
      yourVote: 'Your vote',
      leading: 'Leading',
      backToVote: '← Back to Vote',
      editVote: 'Edit Vote',
      createOwnPoll: '+ Create Your Own Poll',
      shareLabel: 'Share this poll',
      copied: 'Copied!',
      copyLink: 'Copy Link',
      share: 'Share',
      shareText: 'Vote on this poll: {question}',
    },
    recent: {
      title: 'Recent Polls',
    },
    serverErrors: {
      'Failed to load recent polls.': 'Failed to load recent polls.',
      'Option links must be 500 characters or fewer.': 'Option links must be 500 characters or fewer.',
      'Option links must use http:// or https://.': 'Option links must use http:// or https://.',
      'Please enter a poll question.': 'Please enter a poll question.',
      'Question must be 280 characters or fewer.': 'Question must be 280 characters or fewer.',
      'Description must be 500 characters or fewer.': 'Description must be 500 characters or fewer.',
      'Each option must be 160 characters or fewer.': 'Each option must be 160 characters or fewer.',
      'Option details must be 240 characters or fewer.': 'Option details must be 240 characters or fewer.',
      'Please provide at least 2 poll options.': 'Please provide at least 2 poll options.',
      'A poll can have at most 12 options.': 'A poll can have at most 12 options.',
      'Failed to create poll.': 'Failed to create poll.',
      'Poll not found.': 'Poll not found.',
      'Failed to load poll.': 'Failed to load poll.',
      'You have already voted on this poll.': 'You have already voted on this poll.',
      'Failed to save your vote.': 'Failed to save your vote.',
      'Failed to update your vote.': 'Failed to update your vote.',
      'Select at least one option.': 'Select at least one option.',
      'This poll only allows selecting one option.': 'This poll only allows selecting one option.',
      'One or more selected options are invalid.': 'One or more selected options are invalid.',
      'You have not voted on this poll yet.': 'You have not voted on this poll yet.',
      invalidLinkUrl: 'Invalid link URL: "{url}".',
    },
  },
  es: {
    pageTitle: 'Poll Walker — Crea y comparte encuestas en vivo',
    nav: {
      newPoll: '+ Nueva encuesta',
      switchToLight: 'Cambiar a modo claro',
      switchToDark: 'Cambiar a modo oscuro',
      switchLanguage: 'Cambiar a inglés',
      languageLabel: 'Idioma',
    },
    hero: {
      title: 'Crea una encuesta en segundos',
      subtitle: 'Comparte un enlace con quien quieras y mira los votos en tiempo real.',
    },
    footer: 'Poll Walker — Encuestas en vivo rápidas y fáciles de compartir con SQLite.',
    create: {
      questionLabel: 'Pregunta de la encuesta',
      questionPlaceholder: 'ej., ¿Dónde deberíamos ir a comer el viernes?',
      descriptionLabel: 'Descripción',
      optional: 'Opcional',
      descriptionPlaceholder: 'Añade contexto adicional o instrucciones para los votantes...',
      optionsLabel: 'Opciones de respuesta',
      optionPlaceholder: 'Opción {n}',
      hideExtraInfo: 'Ocultar información extra',
      addExtraInfo: 'Añadir enlace o detalles',
      addExtraInfoAria: 'Añadir enlace o información para la opción {n}',
      infoButton: 'Info',
      removeOption: 'Eliminar opción',
      removeOptionAria: 'Eliminar opción {n}',
      linkPlaceholder: 'Enlace (opcional) — ej. https://restaurante.com/menu',
      detailsPlaceholder: 'Nota adicional (opcional) — ej. dirección, precio, detalles',
      addOption: '+ Añadir opción',
      votingType: 'Tipo de votación',
      singleChoice: 'Opción única',
      multipleChoice: 'Opción múltiple',
      submitting: 'Creando encuesta...',
      submit: 'Crear y obtener enlace',
      errorQuestionRequired: 'Por favor, escribe una pregunta para tu encuesta.',
      errorMinOptions: 'Por favor, completa al menos 2 opciones.',
      errorCreateFailed: 'No se pudo crear la encuesta.',
    },
    poll: {
      loading: 'Cargando encuesta...',
      notFoundTitle: 'Encuesta no encontrada',
      createNew: 'Crear una nueva encuesta',
      justCreated:
        '¡Encuesta creada! Copia el enlace de abajo y compártelo para empezar a recibir votos.',
      voteUpdated: '¡Tu voto ha sido actualizado!',
      voteSaved: '¡Tu voto ha sido guardado!',
      alreadyVotedNotice: 'Ya has votado en esta encuesta. Puedes editar tu voto abajo.',
      errorLoadFailed: 'No se pudo cargar la encuesta.',
      errorUpdateVote: 'No se pudo actualizar tu voto.',
      errorSubmitVote: 'No se pudo enviar tu voto.',
      multipleChoice: 'Opción múltiple',
      singleChoice: 'Opción única',
      voterSingular: 'votante',
      voterPlural: 'votantes',
      voteSingular: 'voto',
      votePlural: 'votos',
      liveResults: 'Resultados en vivo',
      moreInfo: 'Más info',
      cancel: 'Cancelar',
      showResults: 'Ver resultados',
      updatingVote: 'Actualizando voto...',
      savingVote: 'Guardando voto...',
      updateVote: 'Actualizar voto',
      submitVote: 'Enviar voto',
      yourVote: 'Tu voto',
      leading: 'Líder',
      backToVote: '← Volver a votar',
      editVote: 'Editar voto',
      createOwnPoll: '+ Crea tu propia encuesta',
      shareLabel: 'Compartir esta encuesta',
      copied: '¡Copiado!',
      copyLink: 'Copiar enlace',
      share: 'Compartir',
      shareText: 'Vota en esta encuesta: {question}',
    },
    recent: {
      title: 'Encuestas recientes',
    },
    serverErrors: {
      'Failed to load recent polls.': 'No se pudieron cargar las encuestas recientes.',
      'Option links must be 500 characters or fewer.':
        'Los enlaces de las opciones deben tener 500 caracteres o menos.',
      'Option links must use http:// or https://.':
        'Los enlaces de las opciones deben usar http:// o https://.',
      'Please enter a poll question.': 'Por favor, escribe una pregunta para la encuesta.',
      'Question must be 280 characters or fewer.':
        'La pregunta debe tener 280 caracteres o menos.',
      'Description must be 500 characters or fewer.':
        'La descripción debe tener 500 caracteres o menos.',
      'Each option must be 160 characters or fewer.':
        'Cada opción debe tener 160 caracteres o menos.',
      'Option details must be 240 characters or fewer.':
        'Los detalles de la opción deben tener 240 caracteres o menos.',
      'Please provide at least 2 poll options.': 'Por favor, añade al menos 2 opciones.',
      'A poll can have at most 12 options.': 'Una encuesta puede tener como máximo 12 opciones.',
      'Failed to create poll.': 'No se pudo crear la encuesta.',
      'Poll not found.': 'Encuesta no encontrada.',
      'Failed to load poll.': 'No se pudo cargar la encuesta.',
      'You have already voted on this poll.': 'Ya has votado en esta encuesta.',
      'Failed to save your vote.': 'No se pudo guardar tu voto.',
      'Failed to update your vote.': 'No se pudo actualizar tu voto.',
      'Select at least one option.': 'Selecciona al menos una opción.',
      'This poll only allows selecting one option.':
        'Esta encuesta solo permite seleccionar una opción.',
      'One or more selected options are invalid.':
        'Una o más opciones seleccionadas no son válidas.',
      'You have not voted on this poll yet.': 'Todavía no has votado en esta encuesta.',
      invalidLinkUrl: 'Enlace no válido: "{url}".',
    },
  },
};

export function detectBrowserLang() {
  if (typeof navigator === 'undefined') return 'en';
  const candidates =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const locale of candidates) {
    if (typeof locale !== 'string') continue;
    const base = locale.toLowerCase().split('-')[0];
    if (SUPPORTED_LANGS.includes(base)) {
      return base;
    }
  }
  return 'en';
}

export function getInitialLang() {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  } catch {
    // Ignore storage access errors
  }
  return detectBrowserLang();
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function interpolate(template, params) {
  if (!params || typeof template !== 'string') return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    params[key] !== undefined ? String(params[key]) : match
  );
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    const title = TRANSLATIONS[lang]?.pageTitle || TRANSLATIONS.en.pageTitle;
    document.title = title;
  }, [lang]);

  useEffect(() => {
    const handleLanguageChange = () => {
      try {
        if (!localStorage.getItem('lang')) {
          setLangState(detectBrowserLang());
        }
      } catch {
        setLangState(detectBrowserLang());
      }
    };
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const setLang = useCallback((nextLang) => {
    if (!SUPPORTED_LANGS.includes(nextLang)) return;
    setLangState(nextLang);
    try {
      localStorage.setItem('lang', nextLang);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === 'es' ? 'en' : 'es';
      try {
        localStorage.setItem('lang', next);
      } catch {
        // Ignore storage access errors
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key, params) => {
      const value =
        getNestedValue(TRANSLATIONS[lang], key) ?? getNestedValue(TRANSLATIONS.en, key) ?? key;
      return interpolate(value, params);
    },
    [lang]
  );

  const translateServerError = useCallback(
    (message, fallbackKey) => {
      if (!message) return fallbackKey ? t(fallbackKey) : '';
      const direct = TRANSLATIONS[lang]?.serverErrors?.[message];
      if (direct) return direct;

      const invalidUrlMatch = message.match(/^Invalid link URL: "(.*)"\.$/);
      if (invalidUrlMatch) {
        return interpolate(
          TRANSLATIONS[lang]?.serverErrors?.invalidLinkUrl ||
            TRANSLATIONS.en.serverErrors.invalidLinkUrl,
          { url: invalidUrlMatch[1] }
        );
      }

      return message;
    },
    [lang, t]
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t, translateServerError }),
    [lang, setLang, toggleLang, t, translateServerError]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
