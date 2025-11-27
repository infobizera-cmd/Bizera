import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authAPI } from '../services/api'
import { Icon } from './Dashboard'
import { clearUserData, getUserData } from '../utils/userStorage'
import TopBar from '../components/TopBar'

const Settings = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [searchQuery, setSearchQuery] = useState('')

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    businessName: '',
    businessCategory: '',
    email: '',
    phoneNumber: '',
    website: '',
    address: ''
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    paymentUpdates: true,
    marketingEmails: false,
    weeklyReports: true
  })

  // Language & Region Settings
  const [languageSettings, setLanguageSettings] = useState({
    language: 'az',
    timeZone: 'Asia/Baku',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'AZN'
  })

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAlerts: true
  })

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    fontSize: 'medium',
    compactMode: false
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const userData = getUserData()
    if (userData) {
      setGeneralSettings({
        businessName: userData.businessName || '',
        businessCategory: userData.businessCategory || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        website: '',
        address: ''
      })
    }

    // Load saved settings
    const savedNotifications = localStorage.getItem('bizera_notifications')
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (e) {
        console.error('Error loading notifications:', e)
      }
    }

    const savedLanguage = localStorage.getItem('bizera_language')
    if (savedLanguage) {
      try {
        setLanguageSettings(JSON.parse(savedLanguage))
      } catch (e) {
        console.error('Error loading language settings:', e)
      }
    }

    const savedSecurity = localStorage.getItem('bizera_security_settings')
    if (savedSecurity) {
      try {
        setSecurity(JSON.parse(savedSecurity))
      } catch (e) {
        console.error('Error loading security settings:', e)
      }
    }

    const savedAppearance = localStorage.getItem('bizera_appearance')
    if (savedAppearance) {
      try {
        setAppearance(JSON.parse(savedAppearance))
      } catch (e) {
        console.error('Error loading appearance settings:', e)
      }
    }
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const handleSaveGeneral = () => {
    // Save to localStorage
    const userData = getUserData()
    if (userData) {
      const updatedData = {
        ...userData,
        businessName: generalSettings.businessName,
        businessCategory: generalSettings.businessCategory,
        email: generalSettings.email,
        phoneNumber: generalSettings.phoneNumber
      }
      localStorage.setItem('bizera_user_data', JSON.stringify(updatedData))
    }
    showToast(t('settings.generalSaved'), 'success')
  }

  const handleSaveNotifications = () => {
    localStorage.setItem('bizera_notifications', JSON.stringify(notifications))
    showToast(t('settings.notificationsSaved'), 'success')
  }

  const handleSaveLanguage = () => {
    localStorage.setItem('bizera_language', JSON.stringify(languageSettings))
    showToast(t('settings.languageSaved'), 'success')
  }

  const handleSaveSecurity = () => {
    localStorage.setItem('bizera_security_settings', JSON.stringify(security))
    showToast(t('settings.securitySaved'), 'success')
  }

  const handleSaveAppearance = () => {
    localStorage.setItem('bizera_appearance', JSON.stringify(appearance))
    showToast(t('settings.appearanceSaved'), 'success')
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('bizera_auth')
      localStorage.removeItem('bizera_rememberMe')
      clearUserData()
      navigate('/login', { replace: true })
    }
  }

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-start justify-between py-4 border-b border-slate-100 last:border-b-0">
      <div className="flex-1 pr-4">
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        {description && (
          <div className="text-xs text-slate-500 mt-1">{description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-[#003A70]' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const settingsSections = [
    { id: 'general', label: t('settings.general'), icon: Icon.sidebarSettings },
    { id: 'notifications', label: t('settings.notifications'), icon: Icon.bell },
    { id: 'language', label: t('settings.language'), icon: Icon.globe },
    { id: 'security', label: t('settings.security'), icon: Icon.user },
    { id: 'appearance', label: t('settings.appearance'), icon: Icon.moon }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-64 shrink-0 flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarOpen ? 'flex' : 'hidden md:flex'}`}>
          <div className="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 md:flex items-center justify-between">
            <div className="text-2xl font-extrabold tracking-tight text-[#002750] dark:text-white">BizEra</div>
            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 flex flex-col text-[15px] font-semibold">
            <div className="flex-1 flex flex-col">
              {[
                { label: t('sidebar.dashboard'), path: '/dashboard', icon: Icon.sidebarDashboard },
                { label: t('sidebar.products'), path: '/products', icon: Icon.sidebarProducts },
                { label: t('sidebar.sales'), path: '/sales', icon: Icon.sidebarSales },
                { label: t('sidebar.tasks'), path: '/tasks', icon: Icon.sidebarTasks },
                { label: t('sidebar.customers'), path: '/customers', icon: Icon.sidebarCustomers },
                { label: t('sidebar.expenses'), path: '/expenses', icon: Icon.sidebarExpenses },
                { label: t('sidebar.settings'), path: '/settings', icon: Icon.sidebarSettings }
              ].map((item) => {
                const isActive = location.pathname === item.path
                const ItemIcon = item.icon
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center px-8 py-5 border-b transition-colors ${
                      isActive
                        ? 'bg-[#003A70] text-white border-transparent'
                        : 'bg-white dark:bg-slate-800 text-[#003A70] dark:text-slate-200 border-[#E6EDF5] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <ItemIcon
                      className={`mr-4 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-[#003A70] dark:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="px-4 pb-4 pt-3">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-between rounded-xl bg-[#F3F7FB] dark:bg-slate-700 px-5 py-3 text-[15px] font-semibold text-[#003A70] dark:text-white hover:bg-[#e7f0f9] dark:hover:bg-slate-600 transition-colors"
              >
                <span>{t('common.logout')}</span>
                <Icon.sidebarLogout className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 w-full md:w-auto">
          {/* Top bar */}
          <TopBar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Content */}
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003A70] mb-6">{t('settings.title')}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
              {/* Settings Sidebar */}
              <div className="bg-white rounded-2xl shadow-sm border p-4">
                <div className="space-y-1">
                  {settingsSections.map((section) => {
                    const SectionIcon = section.icon
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? 'bg-[#003A70] text-white'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <SectionIcon className={`w-5 h-5 ${activeSection === section.id ? 'text-white' : 'text-slate-600'}`} />
                        <span className="text-sm font-semibold">{section.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Settings Content */}
              <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
                {/* General Settings */}
                {activeSection === 'general' && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{t('settings.generalTitle')}</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Biznes Adı
                        </label>
                        <input
                          type="text"
                          value={generalSettings.businessName}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, businessName: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Biznes adınızı daxil edin"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Biznes Kateqoriyası
                        </label>
                        <input
                          type="text"
                          value={generalSettings.businessCategory}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, businessCategory: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Biznes kateqoriyanızı daxil edin"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={generalSettings.email}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Telefon Nömrəsi
                        </label>
                        <input
                          type="tel"
                          value={generalSettings.phoneNumber}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+994 XX XXX XX XX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Veb Sayt
                        </label>
                        <input
                          type="url"
                          value={generalSettings.website}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, website: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Ünvan
                        </label>
                        <textarea
                          value={generalSettings.address}
                          onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                          rows={3}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ünvanınızı daxil edin"
                        />
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={handleSaveGeneral}
                          className="inline-flex items-center justify-center rounded-lg bg-[#003A70] text-white text-sm font-semibold px-6 py-2.5 shadow-sm hover:bg-[#02498f] transition-colors"
                        >
                          {t('common.save')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Settings */}
                {activeSection === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{t('settings.notificationsTitle')}</h2>
                    <div className="space-y-0">
                      <ToggleSwitch
                        enabled={notifications.emailNotifications}
                        onChange={(value) => setNotifications({ ...notifications, emailNotifications: value })}
                        label="Email Bildirişləri"
                        description="Email vasitəsilə bildirişlər alın"
                      />
                      <ToggleSwitch
                        enabled={notifications.pushNotifications}
                        onChange={(value) => setNotifications({ ...notifications, pushNotifications: value })}
                        label="Push Bildirişləri"
                        description="Brauzer push bildirişləri"
                      />
                      <ToggleSwitch
                        enabled={notifications.smsNotifications}
                        onChange={(value) => setNotifications({ ...notifications, smsNotifications: value })}
                        label="SMS Bildirişləri"
                        description="SMS vasitəsilə bildirişlər alın"
                      />
                      <ToggleSwitch
                        enabled={notifications.orderUpdates}
                        onChange={(value) => setNotifications({ ...notifications, orderUpdates: value })}
                        label="Sifariş Yeniləmələri"
                        description="Yeni sifarişlər və status dəyişiklikləri haqqında bildiriş"
                      />
                      <ToggleSwitch
                        enabled={notifications.paymentUpdates}
                        onChange={(value) => setNotifications({ ...notifications, paymentUpdates: value })}
                        label="Ödəniş Yeniləmələri"
                        description="Ödəniş statusu haqqında bildiriş"
                      />
                      <ToggleSwitch
                        enabled={notifications.marketingEmails}
                        onChange={(value) => setNotifications({ ...notifications, marketingEmails: value })}
                        label="Marketinq Email-ləri"
                        description="Xüsusi təkliflər və yeniliklər haqqında email"
                      />
                      <ToggleSwitch
                        enabled={notifications.weeklyReports}
                        onChange={(value) => setNotifications({ ...notifications, weeklyReports: value })}
                        label="Həftəlik Hesabatlar"
                        description="Həftəlik biznes hesabatları"
                      />
                    </div>
                    <div className="flex justify-end pt-6 mt-6 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleSaveNotifications}
                        className="inline-flex items-center justify-center rounded-lg bg-[#003A70] text-white text-sm font-semibold px-6 py-2.5 shadow-sm hover:bg-[#02498f] transition-colors"
                      >
                        Yadda Saxla
                      </button>
                    </div>
                  </div>
                )}

                {/* Language & Region Settings */}
                {activeSection === 'language' && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{t('settings.languageTitle')}</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Dil
                        </label>
                        <select
                          value={languageSettings.language}
                          onChange={(e) => setLanguageSettings({ ...languageSettings, language: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="az">Azərbaycan</option>
                          <option value="en">English</option>
                          <option value="ru">Русский</option>
                          <option value="tr">Türkçe</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Vaxt Zonası
                        </label>
                        <select
                          value={languageSettings.timeZone}
                          onChange={(e) => setLanguageSettings({ ...languageSettings, timeZone: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Asia/Baku">(GMT+4) Bakı, Azərbaycan</option>
                          <option value="Europe/London">(GMT+0) London, UK</option>
                          <option value="America/New_York">(GMT-5) New York, USA</option>
                          <option value="Europe/Moscow">(GMT+3) Moskva, Rusiya</option>
                          <option value="Europe/Istanbul">(GMT+3) İstanbul, Türkiyə</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tarix Formatı
                        </label>
                        <select
                          value={languageSettings.dateFormat}
                          onChange={(e) => setLanguageSettings({ ...languageSettings, dateFormat: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Vaxt Formatı
                        </label>
                        <select
                          value={languageSettings.timeFormat}
                          onChange={(e) => setLanguageSettings({ ...languageSettings, timeFormat: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="24h">24 saatlıq (14:30)</option>
                          <option value="12h">12 saatlıq (2:30 PM)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Valyuta
                        </label>
                        <select
                          value={languageSettings.currency}
                          onChange={(e) => setLanguageSettings({ ...languageSettings, currency: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="AZN">AZN - Azərbaycan Manatı</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="RUB">RUB - Russian Ruble</option>
                          <option value="TRY">TRY - Turkish Lira</option>
                        </select>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={handleSaveLanguage}
                          className="inline-flex items-center justify-center rounded-lg bg-[#003A70] text-white text-sm font-semibold px-6 py-2.5 shadow-sm hover:bg-[#02498f] transition-colors"
                        >
                          {t('common.save')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeSection === 'security' && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{t('settings.securityTitle')}</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b border-slate-100">
                        <div className="flex-1 pr-4">
                          <div className="text-sm font-semibold text-slate-800">İki Faktorlu Autentifikasiya</div>
                          <div className="text-xs text-slate-500 mt-1">Hesabınızı əlavə təhlükəsizlik üçün aktivləşdirin</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSecurity({ ...security, twoFactorAuth: !security.twoFactorAuth })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            security.twoFactorAuth ? 'bg-[#003A70]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Sessiya Vaxtı (dəqiqə)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="120"
                          value={security.sessionTimeout}
                          onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value, 10) || 30 })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Fəaliyyət olmadıqda sessiya neçə dəqiqədən sonra bağlanacaq</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Şifrə Müddəti (gün)
                        </label>
                        <input
                          type="number"
                          min="30"
                          max="365"
                          value={security.passwordExpiry}
                          onChange={(e) => setSecurity({ ...security, passwordExpiry: parseInt(e.target.value, 10) || 90 })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Şifrə neçə gündən sonra yenilənməlidir</p>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-slate-100">
                        <div className="flex-1 pr-4">
                          <div className="text-sm font-semibold text-slate-800">Giriş Xəbərdarlıqları</div>
                          <div className="text-xs text-slate-500 mt-1">Yeni girişlər haqqında bildiriş alın</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            security.loginAlerts ? 'bg-[#003A70]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={handleSaveSecurity}
                          className="inline-flex items-center justify-center rounded-lg bg-[#003A70] text-white text-sm font-semibold px-6 py-2.5 shadow-sm hover:bg-[#02498f] transition-colors"
                        >
                          {t('common.save')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeSection === 'appearance' && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">{t('settings.appearanceTitle')}</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tema
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setAppearance({ ...appearance, theme: 'light' })}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              appearance.theme === 'light'
                                ? 'border-[#003A70] bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300" />
                              <span className="text-sm font-semibold text-slate-800">Açıq</span>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAppearance({ ...appearance, theme: 'dark' })}
                            className={`p-4 rounded-lg border-2 transition-colors ${
                              appearance.theme === 'dark'
                                ? 'border-[#003A70] bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-300" />
                              <span className="text-sm font-semibold text-slate-800">Qaranlıq</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Şrift Ölçüsü
                        </label>
                        <select
                          value={appearance.fontSize}
                          onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="small">Kiçik</option>
                          <option value="medium">Orta</option>
                          <option value="large">Böyük</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b border-slate-100">
                        <div className="flex-1 pr-4">
                          <div className="text-sm font-semibold text-slate-800">Kompakt Rejim</div>
                          <div className="text-xs text-slate-500 mt-1">Daha az boşluq, daha çox məlumat</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAppearance({ ...appearance, compactMode: !appearance.compactMode })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            appearance.compactMode ? 'bg-[#003A70]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={handleSaveAppearance}
                          className="inline-flex items-center justify-center rounded-lg bg-[#003A70] text-white text-sm font-semibold px-6 py-2.5 shadow-sm hover:bg-[#02498f] transition-colors"
                        >
                          {t('common.save')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 ${
            toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {toast.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default Settings

