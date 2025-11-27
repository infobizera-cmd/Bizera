import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Icon } from './Dashboard'
import { getUserData, updateUserData, clearUserData } from '../utils/userStorage'

const Profile = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('edit')
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    dateOfBirth: '',
    permanentAddress: '',
    postalCode: '',
    userName: '',
    password: '*********',
    presentAddress: '',
    city: '',
    country: ''
  })
  const [preferences, setPreferences] = useState({
    currency: 'USD',
    timeZone: '(GMT-12:00) International Date Line West',
    digitalCurrency: true,
    merchantOrder: false,
    recommendations: true
  })
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    currentPassword: '',
    newPassword: ''
  })

  // Load user data on component mount
  useEffect(() => {
    const userData = getUserData()
    if (userData) {
      // Format birth date if available
      let formattedDate = ''
      if (userData.birthDate) {
        try {
          const date = new Date(userData.birthDate)
          if (!isNaN(date.getTime())) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December']
            formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
          }
        } catch (e) {
          formattedDate = userData.birthDate
        }
      }

      setFormData({
        name: userData.name || '',
        surname: userData.surname || '',
        email: userData.email || '',
        dateOfBirth: formattedDate,
        permanentAddress: userData.permanentAddress || userData.presentAddress || '',
        postalCode: userData.postalCode || '',
        userName: userData.userName || userData.name || '',
        password: '*********',
        presentAddress: userData.presentAddress || userData.permanentAddress || '',
        city: userData.city || '',
        country: userData.country || ''
      })
    }

    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('bizera_preferences')
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (e) {
        console.error('Error loading preferences:', e)
      }
    }

    // Load security settings from localStorage
    const savedSecurity = localStorage.getItem('bizera_security')
    if (savedSecurity) {
      try {
        setSecurity(JSON.parse(savedSecurity))
      } catch (e) {
        console.error('Error loading security settings:', e)
      }
    }
  }, [])

  const logout = async () => {
    try {
      // Cookie-based auth - logout will clear cookie on backend
      await authAPI.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local auth state
      localStorage.removeItem('bizera_auth')
      localStorage.removeItem('bizera_rememberMe')
      clearUserData()
      // Cookie will be cleared by backend on logout
      navigate('/login', { replace: true })
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = () => {
    if (activeTab === 'edit') {
      // Update user data in localStorage
      updateUserData({
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        permanentAddress: formData.permanentAddress,
        postalCode: formData.postalCode,
        userName: formData.userName,
        presentAddress: formData.presentAddress,
        city: formData.city,
        country: formData.country,
        surname: formData.surname || '',
        fullName: formData.name && formData.surname 
          ? `${formData.name} ${formData.surname}`.trim()
          : formData.name || ''
      })
      alert('Profil məlumatları uğurla yeniləndi!')
    } else if (activeTab === 'preferences') {
      // Save preferences
      localStorage.setItem('bizera_preferences', JSON.stringify(preferences))
      alert('Preferences uğurla yeniləndi!')
    } else if (activeTab === 'security') {
      // Save security settings
      localStorage.setItem('bizera_security', JSON.stringify(security))
      alert('Security məlumatları uğurla yeniləndi!')
    }
  }

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700">{label}</span>
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-64 shrink-0 flex-col bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarOpen ? 'flex' : 'hidden md:flex'}`}>
          <div className="px-8 pt-8 pb-6 border-b border-slate-200 md:flex items-center justify-between">
            <div className="text-2xl font-extrabold tracking-tight text-[#002750]">BizEra</div>
            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
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
                { label: 'Dashboard', path: '/dashboard', icon: Icon.sidebarDashboard },
                { label: 'Məhsullar', path: '/products', icon: Icon.sidebarProducts },
                { label: 'Satışlar', path: '/sales', icon: Icon.sidebarSales },
                { label: 'Tapşırıqlar', path: '/tasks', icon: Icon.sidebarTasks },
                { label: 'Müştərilər', path: '/customers', icon: Icon.sidebarCustomers },
                { label: 'Xərclər', path: '/expenses', icon: Icon.sidebarExpenses },
                { label: 'Tənzimləmələr', path: '/settings', icon: Icon.sidebarSettings }
              ].map((item) => {
                const isActive = location.pathname === item.path
                const ItemIcon = item.icon
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      navigate(item.path)
                      setSidebarOpen(false) // Close sidebar on mobile after navigation
                    }}
                    className={`w-full flex items-center px-8 py-5 border-b transition-colors ${
                      isActive
                        ? 'bg-[#003A70] text-white border-transparent'
                        : 'bg-white text-[#003A70] border-[#E6EDF5] hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon
                      className={`mr-4 h-5 w-5 ${
                        isActive ? 'text-white' : 'text-[#003A70]'
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
                className="w-full flex items-center justify-between rounded-xl bg-[#F3F7FB] px-5 py-3 text-[15px] font-semibold text-[#003A70] hover:bg-[#e7f0f9] transition-colors"
              >
                <span>Çıxış</span>
                <Icon.sidebarLogout className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 w-full md:w-auto">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="relative w-48 sm:w-72 md:w-96">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Icon.search className="w-4 h-4" />
                </span>
                <input
                  placeholder="Axtar"
                  className="w-full rounded-xl bg-slate-100 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Icon.globe className="w-5 h-5 text-slate-600" />
                <Icon.moon className="w-5 h-5 text-slate-600" />
                <div className="relative">
                  <button className="relative p-2 rounded-lg hover:bg-slate-100">
                    <Icon.bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  </button>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2"
                >
                  {(() => {
                    const userData = getUserData()
                    const displayName = userData?.fullName || 
                                     (userData?.name && userData?.surname 
                                       ? `${userData.name} ${userData.surname}`.trim()
                                       : userData?.name || 'User')
                    const displayRole = userData?.role || 'Admin'
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
                    return (
                      <>
                        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
                          {getInitials()}
                        </div>
                        <div className="hidden sm:block">
                          <div className="text-sm font-semibold">{displayName}</div>
                          <div className="text-xs text-emerald-600">{displayRole}</div>
                        </div>
                      </>
                    )
                  })()}
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003A70] mb-6">PROFILE</h1>

            {/* Tabs */}
            <div className="flex items-center gap-6 mb-8 border-b border-slate-200">
              {[
                { id: 'edit', label: 'Edit Profile' },
                { id: 'preferences', label: 'Preferences' },
                { id: 'security', label: 'Security' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#003A70] border-b-2 border-[#003A70]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Content */}
            {activeTab === 'edit' && (
              <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Profile Picture Section */}
                  <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shadow-lg">
                        <span className="text-2xl text-slate-500">MR</span>
                      </div>
                      <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center shadow-md hover:bg-blue-200 transition-colors">
                        <Icon.edit className="w-4 h-4 text-[#003A70]" />
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Your Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <svg
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                d="M19 9l-7 7-7-7"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Permanent Address
                          </label>
                          <input
                            type="text"
                            name="permanentAddress"
                            value={formData.permanentAddress}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            User Name
                          </label>
                          <input
                            type="text"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Present Address
                          </label>
                          <input
                            type="text"
                            name="presentAddress"
                            value={formData.presentAddress}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center rounded-lg bg-[#003A70] text-white text-sm font-semibold px-6 py-2.5 shadow-sm hover:bg-[#02498f] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Currency
                    </label>
                    <input
                      type="text"
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Time Zone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Time Zone
                    </label>
                    <input
                      type="text"
                      value={preferences.timeZone}
                      onChange={(e) => setPreferences({ ...preferences, timeZone: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Notification */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-4">
                      Notification
                    </label>
                    <div className="space-y-4">
                      <ToggleSwitch
                        enabled={preferences.digitalCurrency}
                        onChange={(value) => setPreferences({ ...preferences, digitalCurrency: value })}
                        label="I send or receive digita currency"
                      />
                      <ToggleSwitch
                        enabled={preferences.merchantOrder}
                        onChange={(value) => setPreferences({ ...preferences, merchantOrder: value })}
                        label="I receive merchant order"
                      />
                      <ToggleSwitch
                        enabled={preferences.recommendations}
                        onChange={(value) => setPreferences({ ...preferences, recommendations: value })}
                        label="There are recommendation for my account"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center rounded-lg bg-[#003A70] text-white text-sm font-semibold px-6 py-2.5 shadow-sm hover:bg-[#02498f] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
                <div className="space-y-8">
                  {/* Two-factor Authentication */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4">
                      Two-factor Authentication
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        Enable or disable two factor authentication
                      </span>
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
                  </div>

                  {/* Change Password */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-800 mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={security.currentPassword}
                          onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                          placeholder="********"
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={security.newPassword}
                          onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                          placeholder="********"
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center rounded-lg bg-[#003A70] text-white text-sm font-semibold px-6 py-2.5 shadow-sm hover:bg-[#02498f] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile

