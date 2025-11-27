import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import azTranslations from './locales/az.json'
import enTranslations from './locales/en.json'
import ruTranslations from './locales/ru.json'

// Get saved language from localStorage
const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('bizera_language')
    if (saved && ['az', 'en', 'ru'].includes(saved)) {
      return saved
    }
  }
  return 'az'
}

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      az: {
        translation: azTranslations
      },
      en: {
        translation: enTranslations
      },
      ru: {
        translation: ruTranslations
      }
    },
    lng: getSavedLanguage(),
    fallbackLng: 'az',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    // Persist language changes
    detection: {
      order: ['localStorage'],
      caches: ['localStorage']
    }
  })

// Listen for language changes and save to localStorage
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bizera_language', lng)
  }
})

// Sync with localStorage on initialization
if (typeof window !== 'undefined') {
  const savedLang = localStorage.getItem('bizera_language')
  if (savedLang && ['az', 'en', 'ru'].includes(savedLang) && savedLang !== i18n.language) {
    i18n.changeLanguage(savedLang)
  }
}

export default i18n

