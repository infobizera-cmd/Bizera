import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../contexts/ThemeContext'
import { Icon } from '../pages/Dashboard'
import { getUserData } from '../utils/userStorage'

// Professional SVG Icons
const GlobeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
)

const MoonIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9 9 0 1020.354 15.354z" />
  </svg>
)

const SunIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const BellIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const TopBar = ({ sidebarOpen, setSidebarOpen, showBackButton = false, onBack, searchQuery, onSearchChange }) => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [notifOpen, setNotifOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const notifRef = useRef(null)
  const langRef = useRef(null)
  
  const userData = getUserData()
  const displayName = userData?.fullName || 
                   (userData?.name && userData?.surname 
                     ? `${userData.name} ${userData.surname}`.trim()
                     : userData?.name || 'User')
  const displayRole = userData?.role || t('common.admin')
  
  const getInitials = () => {
    if (userData?.name && userData?.surname) {
      return `${userData.name.charAt(0)}${userData.surname.charAt(0)}`.toUpperCase()
    }
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase()
    }
    if (userData?.fullName) {
      const parts = userData.fullName.split(' ')
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
      }
      return userData.fullName.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const changeLanguage = (lng) => {
    // Change language using i18n
    i18n.changeLanguage(lng).then(() => {
      // Save to localStorage (i18n.on('languageChanged') will also save it, but we do it here too for immediate persistence)
      if (typeof window !== 'undefined') {
        localStorage.setItem('bizera_language', lng)
      }
      setLangOpen(false)
    })
  }

  const languages = [
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false)
      }
    }

    if (notifOpen || langOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notifOpen, langOpen])

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0"
            aria-label={t('common.openMenu')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Back Button (optional) */}
          {showBackButton && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0"
              aria-label={t('common.goBack')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Search */}
          <div className="relative flex-1 sm:w-48 sm:flex-none sm:flex-initial md:w-72 lg:w-96 max-w-full">
            <span className="pointer-events-none absolute inset-y-0 left-2 sm:left-3 flex items-center text-slate-400 dark:text-slate-500">
              <SearchIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchQuery || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white pl-7 sm:pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>
        
        {/* Right side icons and user */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label={t('common.changeLanguage')}
            >
              <GlobeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-[#003A70] text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {i18n.language === lang.code && (
                      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label={t('common.toggleTheme')}
          >
            {theme === 'dark' ? (
              <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label={t('common.notifications')}
            >
              <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-rose-500 rounded-full"></span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50">
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">
                  <span>{new Date().toLocaleDateString(i18n.language === 'az' ? 'az-AZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' })}</span>
                  <button className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs">
                    {t('common.readAll')}
                  </button>
                </div>
                {[1,2,3,4].length === 0 ? (
                  <div className="text-center py-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {t('common.noNotifications')}
                  </div>
                ) : (
                  [1,2,3,4].map((i) => (
                    <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 dark:bg-slate-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold leading-4 sm:leading-5">
                          {t('common.notifications')}
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {new Date().toLocaleDateString(i18n.language === 'az' ? 'az-AZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <button className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 shrink-0" aria-label={t('common.delete')}>
                        <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 shrink-0">
              {getInitials()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs sm:text-sm font-semibold truncate max-w-[100px] sm:max-w-none text-slate-800 dark:text-slate-200">
                {displayName}
              </div>
              <div className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400">{displayRole}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopBar
