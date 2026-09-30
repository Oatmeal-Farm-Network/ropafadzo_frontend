import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from './i18n.js';

export const LANGUAGES = [
  // ── Americas & British Isles ────────────────────────────────────
  { code: 'en',    name: 'English',              native: 'English',             region: 'Americas & British Isles' },
  { code: 'es',    name: 'Spanish',              native: 'Español',             region: 'Americas & British Isles' },
  { code: 'fr',    name: 'French',               native: 'Français',            region: 'Americas & British Isles' },
  { code: 'pt',    name: 'Portuguese',           native: 'Português',           region: 'Americas & British Isles' },
  { code: 'ht',    name: 'Haitian Creole',       native: 'Kreyòl Ayisyen',      region: 'Americas & British Isles' },
  { code: 'cy',    name: 'Welsh',                native: 'Cymraeg',             region: 'Americas & British Isles' },
  { code: 'ga',    name: 'Irish',                native: 'Gaeilge',             region: 'Americas & British Isles' },
  { code: 'gd',    name: 'Scottish Gaelic',      native: 'Gàidhlig',            region: 'Americas & British Isles' },

  // ── Western Europe ──────────────────────────────────────────────
  { code: 'de',    name: 'German',               native: 'Deutsch',             region: 'Western Europe' },
  { code: 'it',    name: 'Italian',              native: 'Italiano',            region: 'Western Europe' },
  { code: 'nl',    name: 'Dutch',                native: 'Nederlands',          region: 'Western Europe' },
  { code: 'ca',    name: 'Catalan',              native: 'Català',              region: 'Western Europe' },
  { code: 'eu',    name: 'Basque',               native: 'Euskara',             region: 'Western Europe' },
  { code: 'gl',    name: 'Galician',             native: 'Galego',              region: 'Western Europe' },

  // ── Northern Europe ─────────────────────────────────────────────
  { code: 'sv',    name: 'Swedish',              native: 'Svenska',             region: 'Northern Europe' },
  { code: 'no',    name: 'Norwegian',            native: 'Norsk',               region: 'Northern Europe' },
  { code: 'da',    name: 'Danish',               native: 'Dansk',               region: 'Northern Europe' },
  { code: 'fi',    name: 'Finnish',              native: 'Suomi',               region: 'Northern Europe' },

  // ── Eastern & Central Europe ────────────────────────────────────
  { code: 'pl',    name: 'Polish',               native: 'Polski',              region: 'Eastern & Central Europe' },
  { code: 'ro',    name: 'Romanian',             native: 'Română',              region: 'Eastern & Central Europe' },
  { code: 'cs',    name: 'Czech',                native: 'Čeština',             region: 'Eastern & Central Europe' },
  { code: 'sk',    name: 'Slovak',               native: 'Slovenčina',          region: 'Eastern & Central Europe' },
  { code: 'hu',    name: 'Hungarian',            native: 'Magyar',              region: 'Eastern & Central Europe' },
  { code: 'hr',    name: 'Croatian',             native: 'Hrvatski',            region: 'Eastern & Central Europe' },
  { code: 'bg',    name: 'Bulgarian',            native: 'Български',           region: 'Eastern & Central Europe' },
  { code: 'sr',    name: 'Serbian',              native: 'Српски',              region: 'Eastern & Central Europe' },
  { code: 'sq',    name: 'Albanian',             native: 'Shqip',               region: 'Eastern & Central Europe' },
  { code: 'sl',    name: 'Slovenian',            native: 'Slovenščina',         region: 'Eastern & Central Europe' },
  { code: 'lt',    name: 'Lithuanian',           native: 'Lietuvių',            region: 'Eastern & Central Europe' },
  { code: 'lv',    name: 'Latvian',              native: 'Latviešu',            region: 'Eastern & Central Europe' },
  { code: 'et',    name: 'Estonian',             native: 'Eesti',               region: 'Eastern & Central Europe' },
  { code: 'uk',    name: 'Ukrainian',            native: 'Українська',          region: 'Eastern & Central Europe' },
  { code: 'ru',    name: 'Russian',              native: 'Русский',             region: 'Eastern & Central Europe' },
  { code: 'be',    name: 'Belarusian',           native: 'Беларуская',          region: 'Eastern & Central Europe' },
  { code: 'mk',    name: 'Macedonian',           native: 'Македонски',          region: 'Eastern & Central Europe' },

  // ── Mediterranean & Near East ───────────────────────────────────
  { code: 'el',    name: 'Greek',                native: 'Ελληνικά',            region: 'Mediterranean & Near East' },
  { code: 'tr',    name: 'Turkish',              native: 'Türkçe',              region: 'Mediterranean & Near East' },
  { code: 'mt',    name: 'Maltese',              native: 'Malti',               region: 'Mediterranean & Near East' },
  { code: 'ar',    name: 'Arabic',               native: 'العربية',             region: 'Mediterranean & Near East' },

  // ── South Asia ──────────────────────────────────────────────────
  { code: 'hi',    name: 'Hindi',                native: 'हिन्दी',               region: 'South Asia' },
  { code: 'bn',    name: 'Bengali',              native: 'বাংলা',               region: 'South Asia' },
  { code: 'ta',    name: 'Tamil',                native: 'தமிழ்',               region: 'South Asia' },
  { code: 'te',    name: 'Telugu',               native: 'తెలుగు',              region: 'South Asia' },
  { code: 'mr',    name: 'Marathi',              native: 'मराठी',               region: 'South Asia' },
  { code: 'gu',    name: 'Gujarati',             native: 'ગુજરાતી',             region: 'South Asia' },
  { code: 'kn',    name: 'Kannada',              native: 'ಕನ್ನಡ',               region: 'South Asia' },
  { code: 'ml',    name: 'Malayalam',            native: 'മലയാളം',              region: 'South Asia' },
  { code: 'pa',    name: 'Punjabi',              native: 'ਪੰਜਾਬੀ',              region: 'South Asia' },
  { code: 'ur',    name: 'Urdu',                 native: 'اردو',                region: 'South Asia' },
  { code: 'or',    name: 'Odia',                 native: 'ଓଡ଼ିଆ',               region: 'South Asia' },
  { code: 'as',    name: 'Assamese',             native: 'অসমীয়া',             region: 'South Asia' },
  { code: 'ne',    name: 'Nepali',               native: 'नेपाली',              region: 'South Asia' },
  { code: 'si',    name: 'Sinhala',              native: 'සිංහල',               region: 'South Asia' },

  // ── Southeast & East Asia ───────────────────────────────────────
  { code: 'ms',    name: 'Malay',                native: 'Bahasa Melayu',       region: 'Southeast & East Asia' },
  { code: 'tl',    name: 'Filipino',             native: 'Filipino',            region: 'Southeast & East Asia' },
  { code: 'vi',    name: 'Vietnamese',           native: 'Tiếng Việt',          region: 'Southeast & East Asia' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', native: '中文（简体）',         region: 'Southeast & East Asia' },
  { code: 'zh-TW', name: 'Chinese (Traditional)',native: '中文（繁體）',         region: 'Southeast & East Asia' },
  { code: 'ja',    name: 'Japanese',             native: '日本語',               region: 'Southeast & East Asia' },
  { code: 'ko',    name: 'Korean',               native: '한국어',               region: 'Southeast & East Asia' },
  { code: 'hmn',   name: 'Hmong',                native: 'Hmoob',               region: 'Southeast & East Asia' },

  // ── East Africa (US diaspora) ───────────────────────────────────
  { code: 'so',    name: 'Somali',               native: 'Soomaali',            region: 'East Africa' },
  { code: 'am',    name: 'Amharic',              native: 'አማርኛ',               region: 'East Africa' },
];

const STORAGE_KEY = 'ofn_language';

const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, languageName: 'English' });

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'en'
  );

  const setLanguage = (code) => {
    localStorage.setItem(STORAGE_KEY, code);
    setLanguageState(code);
    i18n.changeLanguage(code);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    const rtl = ['ar', 'ur'];
    document.documentElement.dir = rtl.includes(language) ? 'rtl' : 'ltr';
    i18n.changeLanguage(language);
  }, [language]);

  const entry = LANGUAGES.find(l => l.code === language);
  const languageName = entry ? entry.name : 'English';
  const nativeName   = entry ? entry.native : 'English';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageName, nativeName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
