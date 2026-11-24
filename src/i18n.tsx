import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const SUPPORTED_LANGS = ['en', 'es'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

type TranslationDict = {
  pageTitle: string;
  nav: {
    newPoll: string;
    switchToLight: string;
    switchToDark: string;
    switchLanguage: string;
    languageLabel: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  create: {
    questionLabel: string;
    questionPlaceholder: string;
    descriptionLabel: string;
    optional: string;
    descriptionPlaceholder: string;
    optionsLabel: string;
    optionPlaceholder: string;
    hideExtraInfo: string;
    addExtraInfo: string;
    addExtraInfoAria: string;
    infoButton: string;
    removeOption: string;
    removeOptionAria: string;
    linkPlaceholder: string;
    detailsPlaceholder: string;
    addOption: string;
    votingType: string;
    singleChoice: string;
    multipleChoice: string;
    submitting: string;
    submit: string;
    errorQuestionRequired: string;
    errorMinOptions: string;
    errorCreateFailed: string;
  };
  poll: {
    loading: string;
    notFoundTitle: string;
    createNew: string;
    justCreated: string;
    voteUpdated: string;
    voteSaved: string;
    alreadyVotedNotice: string;
    errorLoadFailed: string;
    errorUpdateVote: string;
    errorSubmitVote: string;
    multipleChoice: string;
    singleChoice: string;
    voterSingular: string;
    voterPlural: string;
    voteSingular: string;
    votePlural: string;
    liveResults: string;
    moreInfo: string;
    cancel: string;
    showResults: string;
    updatingVote: string;
    savingVote: string;
    updateVote: string;
    submitVote: string;
    yourVote: string;
    leading: string;
    backToVote: string;
    editVote: string;
    createOwnPoll: string;
    shareLabel: string;
    copied: string;
    copyLink: string;
    share: string;
    shareText: string;
    nameLabel: string;
    namePlaceholder: string;
    nameHelp: string;
    errorNameRequired: string;
    votingAs: string;
    votersTitle: string;
    anonymous: string;
    you: string;
  };
  recent: {
    title: string;
  };
  legal: {
    back: string;
    lastUpdated: string;
    footerNavLabel: string;
    titles: { aviso: string; privacidad: string; cookies: string; terminos: string };
  };
  legalNotice: {
    createBefore: string;
    voteBefore: string;
    terms: string;
    middle: string;
    privacy: string;
    after: string;
    noPersonalData: string;
    votePublic: string;
  };
  serverErrors: Record<string, string>;
};

const TRANSLATIONS: Record<Lang, TranslationDict> = {
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
      nameLabel: 'Your name',
      namePlaceholder: 'Name or nickname',
      nameHelp: 'Your name will be shown publicly next to your vote. You can use a nickname.',
      errorNameRequired: 'Please enter your name.',
      votingAs: 'Voting as {name}',
      votersTitle: 'Who voted',
      anonymous: 'Anonymous',
      you: 'you',
    },
    recent: {
      title: 'Recent Polls',
    },
    legal: {
      back: 'Back',
      lastUpdated: 'Last updated',
      footerNavLabel: 'Legal information',
      titles: {
        aviso: 'Legal notice',
        privacidad: 'Privacy policy',
        cookies: 'Cookie policy',
        terminos: 'Terms of use',
      },
    },
    legalNotice: {
      createBefore: 'By creating a poll you accept the ',
      voteBefore: 'By voting you accept the ',
      terms: 'Terms of use',
      middle: '. See also the ',
      privacy: 'Privacy policy',
      after: '.',
      noPersonalData: "Don't include other people's personal data.",
      votePublic: 'Your name and your vote will be visible to anyone who can access this poll, including via the home page list of recent polls.',
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
      'Please enter your name.': 'Please enter your name.',
      'Name must be 40 characters or fewer.': 'Name must be 40 characters or fewer.',
      'That name has already voted on this poll.': 'That name has already voted on this poll.',
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
      nameLabel: 'Tu nombre',
      namePlaceholder: 'Nombre o apodo',
      nameHelp:
        'Tu nombre se mostrará públicamente junto a tu voto. Puedes usar un apodo.',
      errorNameRequired: 'Por favor, escribe tu nombre.',
      votingAs: 'Votando como {name}',
      votersTitle: 'Quién ha votado',
      anonymous: 'Anónimo',
      you: 'tú',
    },
    recent: {
      title: 'Encuestas recientes',
    },
    legal: {
      back: 'Volver',
      lastUpdated: 'Última actualización',
      footerNavLabel: 'Información legal',
      titles: {
        aviso: 'Aviso legal',
        privacidad: 'Política de privacidad',
        cookies: 'Política de cookies',
        terminos: 'Términos de uso',
      },
    },
    legalNotice: {
      createBefore: 'Al crear una encuesta aceptas los ',
      voteBefore: 'Al votar aceptas los ',
      terms: 'Términos de uso',
      middle: '. Consulta también la ',
      privacy: 'Política de privacidad',
      after: '.',
      noPersonalData: 'No incluyas datos personales de terceros.',
      votePublic: 'Tu nombre y tu voto serán visibles para cualquiera que pueda acceder a esta encuesta, también desde la lista de encuestas recientes de la página de inicio.',
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
      'Please enter your name.': 'Por favor, escribe tu nombre.',
      'Name must be 40 characters or fewer.': 'El nombre debe tener 40 caracteres o menos.',
      'That name has already voted on this poll.': 'Ese nombre ya ha votado en esta encuesta.',
      invalidLinkUrl: 'Enlace no válido: "{url}".',
    },
  },
};

function isSupportedLang(value: string | null | undefined): value is Lang {
  return value === 'en' || value === 'es';
}

export function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const candidates =
    Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

  for (const locale of candidates) {
    if (typeof locale !== 'string') continue;
    const base = locale.toLowerCase().split('-')[0];
    if (isSupportedLang(base)) {
      return base;
    }
  }
  return 'en';
}

export function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('lang');
    if (isSupportedLang(saved)) return saved;
  } catch {
    // Ignore storage access errors
  }
  return detectBrowserLang();
}

function getNestedValue(obj: unknown, path: string): string | undefined {
  const result = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
  return typeof result === 'string' ? result : undefined;
}

type InterpolationParams = Record<string, string | number>;

function interpolate(template: string, params?: InterpolationParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    params[key] !== undefined ? String(params[key]) : match
  );
}

export interface I18nContextValue {
  lang: Lang;
  setLang: (nextLang: Lang) => void;
  toggleLang: () => void;
  t: (key: string, params?: InterpolationParams) => string;
  translateServerError: (message?: string, fallbackKey?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    // Pages that set their own title (legal pages) mark it so a language switch keeps it.
    // Relies on effect order: the child's effect (LegalLayout) runs before this provider effect.
    if (document.documentElement.dataset.customTitle) return;
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

  const setLang = useCallback((nextLang: Lang) => {
    if (!isSupportedLang(nextLang)) return;
    setLangState(nextLang);
    try {
      localStorage.setItem('lang', nextLang);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === 'es' ? 'en' : 'es';
      try {
        localStorage.setItem('lang', next);
      } catch {
        // Ignore storage access errors
      }
      return next;
    });
  }, []);

  const t = useCallback(
    (key: string, params?: InterpolationParams): string => {
      const value =
        getNestedValue(TRANSLATIONS[lang], key) ?? getNestedValue(TRANSLATIONS.en, key) ?? key;
      return interpolate(value, params);
    },
    [lang]
  );

  const translateServerError = useCallback(
    (message?: string, fallbackKey?: string): string => {
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

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, toggleLang, t, translateServerError }),
    [lang, setLang, toggleLang, t, translateServerError]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
