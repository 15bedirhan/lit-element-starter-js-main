import i18next from 'i18next';
import en from './translations/en.js';
import tr from './translations/tr.js';

export async function setupI18n() {
  const currentLang = document.documentElement.lang || 
                     navigator.language?.split('-')[0] || 
                     'en';

  await i18next.init({
    lng: currentLang,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      tr: { translation: tr }
    },
    interpolation: {
      escapeValue: false
    }
  });

  // Update the HTML lang attribute
  document.documentElement.lang = currentLang;

  return i18next;
}

// Language change function
export function changeLanguage(lang) {
  document.documentElement.lang = lang;
  return i18next.changeLanguage(lang);
}

export { i18next };
