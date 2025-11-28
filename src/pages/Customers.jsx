import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authAPI, contactsAPI, countryCodesAPI } from '../services/api'
import { Icon } from './Dashboard'
import { clearUserData } from '../utils/userStorage'
import TopBar from '../components/TopBar'

const Customers = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [isNewContact, setIsNewContact] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [countryCodes, setCountryCodes] = useState([
    { code: '+994', country: 'Azərbaycan', flag: '🇦🇿' },
    { code: '+7', country: 'Rusiya', flag: '🇷🇺' },
    { code: '+1', country: 'ABŞ/Kanada', flag: '🇺🇸' },
    { code: '+90', country: 'Türkiyə', flag: '🇹🇷' }
  ])

  // Load country codes from backend
  useEffect(() => {
    const loadCountryCodes = async () => {
      try {
        const response = await countryCodesAPI.getCountryCodes()
        console.log('Country codes API response:', response)
        
        // Handle different response formats
        let countriesData = null
        if (Array.isArray(response?.data)) {
          countriesData = response.data
        } else if (Array.isArray(response)) {
          countriesData = response
        } else if (response?.data && typeof response.data === 'string') {
          // If response is a string, try to parse it
          try {
            countriesData = JSON.parse(response.data)
          } catch (e) {
            console.error('Failed to parse country codes:', e)
          }
        }
        
        console.log('Parsed countries data:', countriesData)
        
        if (countriesData && Array.isArray(countriesData) && countriesData.length > 0) {
          // Filter only Azerbaijan, Turkey, Russia, and USA
          // More flexible matching - check by code first
          const targetCodes = ['+994', '+90', '+7', '+1', '994', '90', '7', '1']
          
          const filtered = countriesData.filter((country) => {
            const countryCode = (country.code || '').toString().trim()
            const countryName = (country.country || '').toLowerCase()
            
            // Check by code first (most reliable)
            const matchesCode = targetCodes.some(target => 
              countryCode === target || 
              countryCode === `+${target}` || 
              countryCode === target.replace('+', '')
            )
            
            // Also check by country name
            const allowedPatterns = [
              'azərbaycan', 'azerbaijan', 'az',
              'türkiyə', 'turkey', 'tr',
              'rusiya', 'russia', 'ru',
              'abş', 'usa', 'united states', 'us', 'america', 'canada'
            ]
            
            const matchesName = allowedPatterns.some(pattern => 
              countryName.includes(pattern)
            )
            
            return matchesCode || matchesName
          })
          
          console.log('Filtered countries:', filtered)
          
          // Map backend data to frontend format
          const mappedCodes = filtered.map((country) => {
            let code = (country.code || '').toString().trim()
            // Ensure code starts with +
            if (code && !code.startsWith('+')) {
              code = `+${code}`
            }
            
            return {
              code: code,
              country: country.country || '',
              flag: country.flag || ''
            }
          }).filter(c => c.code && c.code.length > 0) // Remove entries without code
          
          // Ensure we have at least the 4 required countries
          const requiredCodes = [
            { code: '+994', country: 'Azərbaycan', flag: '🇦🇿' },
            { code: '+7', country: 'Rusiya', flag: '🇷🇺' },
            { code: '+1', country: 'ABŞ', flag: '🇺🇸' },
            { code: '+90', country: 'Türkiyə', flag: '🇹🇷' }
          ]
          
          // Merge backend data with required codes
          const finalCodes = requiredCodes.map(req => {
            const found = mappedCodes.find(m => m.code === req.code)
            return found || req
          })
          
          console.log('Final country codes to set:', finalCodes)
          setCountryCodes(finalCodes)
        } else {
          console.log('No country codes data received, using defaults')
          // Keep default country codes
        }
      } catch (err) {
        console.error('Error loading country codes:', err)
        // Keep default country codes on error
      }
    }

    loadCountryCodes()
  }, [])

  // Load contacts from backend
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await contactsAPI.getContacts()
        if (response?.data && Array.isArray(response.data)) {
          setCustomers(response.data)
        }
      } catch (err) {
        console.error('Error loading contacts:', err)
        setError(err.message || 'Kontaktları yükləmək mümkün olmadı.')
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const openAddContactModal = () => {
    const defaultCode = countryCodes.length > 0 ? countryCodes[0].code : '+994'
    setEditingContact({
      id: null,
      name: '',
      countryCode: defaultCode,
      phoneNumber: '',
      email: '',
      status: 'Online'
    })
    setIsNewContact(true)
    setEditModalOpen(true)
  }

  const openEditModal = (contact) => {
    // Parse phone number to extract country code
    let phoneNumber = contact.phoneNumber || ''
    
    // Remove any spaces and dashes first
    phoneNumber = phoneNumber.replace(/\s+/g, '').replace(/-/g, '').replace(/[()]/g, '')
    
    // Remove duplicate country codes if exists (e.g., +994+994...)
    const countryCodePatterns = ['+994', '+7', '+1', '+90']
    for (const pattern of countryCodePatterns) {
      if (phoneNumber.startsWith(pattern + pattern)) {
        phoneNumber = phoneNumber.substring(pattern.length)
        break
      }
    }
    
    let countryCode = countryCodes.length > 0 ? countryCodes[0].code : '+994'
    let phone = phoneNumber
    
    // Check if phone number starts with a country code (try longest first)
    const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length)
    for (const country of sortedCodes) {
      if (phoneNumber.startsWith(country.code)) {
        countryCode = country.code
        phone = phoneNumber.substring(country.code.length)
        break
      }
    }
    
    setEditingContact({
      id: contact.id,
      name: contact.name || '',
      countryCode: countryCode,
      phoneNumber: phone,
      email: contact.email || '',
      status: contact.status || 'Online'
    })
    setIsNewContact(false)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditingContact(null)
    setIsNewContact(false)
  }

  const handleSaveContact = async (e) => {
    e.preventDefault()
    try {
      if (!editingContact) return

      // Clean phone number - remove any existing country code and spaces
      let cleanPhoneNumber = editingContact.phoneNumber.replace(/\s+/g, '').replace(/-/g, '')
      
      // Remove country code if it already exists in phone number
      const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length)
      for (const country of sortedCodes) {
        if (cleanPhoneNumber.startsWith(country.code)) {
          cleanPhoneNumber = cleanPhoneNumber.substring(country.code.length)
          break
        }
      }
      
      // Combine country code and cleaned phone number
      const fullPhoneNumber = `${editingContact.countryCode}${cleanPhoneNumber}`
      
      const contactData = {
        name: editingContact.name,
        phoneNumber: fullPhoneNumber,
        email: editingContact.email,
        status: editingContact.status,
        CountryCode: editingContact.countryCode // Backend requires CountryCode field
      }

      if (isNewContact) {
        // Create new contact
        const response = await contactsAPI.createContact(contactData)
        if (response?.data) {
          showToast('Kontakt uğurla əlavə edildi!', 'success')
        }
      } else {
        // Update existing contact
        const updateData = {
          id: editingContact.id,
          displayId: 0,
          ...contactData
        }
        await contactsAPI.updateContact(editingContact.id, updateData)
        showToast('Kontakt uğurla yeniləndi!', 'success')
      }

      // Reload contacts
      const response = await contactsAPI.getContacts()
      if (response?.data && Array.isArray(response.data)) {
        setCustomers(response.data)
      }

      closeEditModal()
    } catch (err) {
      console.error('Error saving contact:', err)
      setError(err.message || 'Kontaktı yadda saxlaq mümkün olmadı.')
      showToast(isNewContact ? 'Kontakt əlavə edilərkən xəta baş verdi' : 'Kontakt yenilənərkən xəta baş verdi', 'error')
    }
  }

  const openDeleteConfirm = (contact) => {
    setContactToDelete(contact)
    setDeleteConfirmOpen(true)
  }

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false)
    setContactToDelete(null)
  }

  const confirmDelete = async () => {
    if (contactToDelete) {
      try {
        await contactsAPI.deleteContact(contactToDelete.id)
        showToast('Kontakt uğurla silindi!', 'success')
        
        // Reload contacts
        const response = await contactsAPI.getContacts()
        if (response?.data && Array.isArray(response.data)) {
          setCustomers(response.data)
        }
        
        closeDeleteConfirm()
      } catch (err) {
        console.error('Error deleting contact:', err)
        setError(err.message || 'Kontaktı silmək mümkün olmadı.')
        showToast('Kontakt silinərkən xəta baş verdi', 'error')
      }
    }
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  // Filter customers by search query
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      customer.name?.toLowerCase().includes(query) ||
      customer.phoneNumber?.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.displayId?.toString().includes(query)
    )
  })

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
              aria-label={t('common.closeMenu')}
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
            {/* Header row */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#003A70] dark:text-white shrink-0">
                {t('customers.title')}
              </h1>
              <button 
                type="button"
                onClick={openAddContactModal}
                className="inline-flex items-center gap-2 rounded-md bg-[#00417F] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 shadow-sm hover:bg-[#02498f] shrink-0"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0B4C8A] shadow-sm text-sm sm:text-base leading-none">
                  +
                </span>
                <span className="whitespace-nowrap">{t('customers.addNew')}</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
              <div className="grid grid-cols-[50px_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1.6fr)_minmax(0,1.6fr)_100px_90px] sm:grid-cols-[70px_minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1.6fr)_minmax(0,1.6fr)_120px_110px] min-w-[700px] px-3 sm:px-6 py-2 sm:py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-700/50 text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#003A70] focus:ring-[#003A70]"
                  />
                </div>
                <div>{t('customers.id')}</div>
                <div>{t('customers.name')}</div>
                <div>{t('customers.phone')}</div>
                <div>{t('customers.email')}</div>
                <div className="text-center">{t('customers.status')}</div>
                <div className="text-right pr-2">{t('common.edit')}</div>
              </div>

              {loading ? (
                <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                  {t('common.loading')}
                </div>
              ) : error ? (
                <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-red-500 dark:text-red-400 text-sm sm:text-base">
                  {error}
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                  {searchQuery ? t('customers.noSearchResults') : t('customers.noCustomers')}
                </div>
              ) : (
                <div>
                  {filteredCustomers.map((c) => {
                    const online = c.status === 'Online'
                    return (
                      <div
                        key={c.id}
                        className="grid grid-cols-[50px_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1.6fr)_minmax(0,1.6fr)_100px_90px] sm:grid-cols-[70px_minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1.6fr)_minmax(0,1.6fr)_120px_110px] min-w-[700px] px-3 sm:px-6 py-3 sm:py-4 border-t border-slate-100 dark:border-slate-700 items-center text-xs sm:text-sm hover:bg-slate-50/60 dark:hover:bg-slate-700/50"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-[#003A70] focus:ring-[#003A70]"
                          />
                        </div>

                        <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300">
                          {c.displayId ? `#${c.displayId}` : 'N/A'}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden flex items-center justify-center">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                              {getInitials(c.name)}
                            </span>
                          </div>
                          <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                            {c.name || 'N/A'}
                          </div>
                        </div>

                        <div className="text-xs sm:text-[13px] text-emerald-500 dark:text-emerald-400 truncate">
                          {(() => {
                            const phone = c.phoneNumber || ''
                            if (!phone) return 'N/A'
                            
                            // Remove any duplicate country codes (e.g., +994 +994...)
                            let cleaned = phone.replace(/\s+/g, '')
                            
                            // Remove duplicate country codes at the start
                            const countryCodePatterns = ['+994', '+7', '+1', '+90']
                            for (const pattern of countryCodePatterns) {
                              if (cleaned.startsWith(pattern + pattern)) {
                                cleaned = cleaned.substring(pattern.length)
                                break
                              }
                            }
                            
                            // Format phone number for display (add spaces for readability)
                            if (cleaned.startsWith('+994')) {
                              // Azerbaijan format: +994 70 123 45 67
                              if (cleaned.length >= 12) {
                                const code = cleaned.substring(0, 4)
                                const operator = cleaned.substring(4, 6)
                                const part1 = cleaned.substring(6, 9)
                                const part2 = cleaned.substring(9, 11)
                                const part3 = cleaned.substring(11, 13)
                                return `${code} ${operator} ${part1} ${part2} ${part3}`.trim()
                              }
                            } else if (cleaned.startsWith('+7')) {
                              // Russia format: +7 701 234 56 78
                              if (cleaned.length >= 11) {
                                const code = cleaned.substring(0, 2)
                                const operator = cleaned.substring(2, 5)
                                const part1 = cleaned.substring(5, 8)
                                const part2 = cleaned.substring(8, 10)
                                const part3 = cleaned.substring(10, 12)
                                return `${code} ${operator} ${part1} ${part2} ${part3}`.trim()
                              }
                            } else if (cleaned.startsWith('+1')) {
                              // USA format: +1 (701) 234-5678
                              if (cleaned.length >= 11) {
                                const code = cleaned.substring(0, 2)
                                const area = cleaned.substring(2, 5)
                                const part1 = cleaned.substring(5, 8)
                                const part2 = cleaned.substring(8, 12)
                                return `${code} (${area}) ${part1}-${part2}`.trim()
                              }
                            } else if (cleaned.startsWith('+90')) {
                              // Turkey format: +90 532 123 45 67
                              if (cleaned.length >= 12) {
                                const code = cleaned.substring(0, 3)
                                const operator = cleaned.substring(3, 6)
                                const part1 = cleaned.substring(6, 9)
                                const part2 = cleaned.substring(9, 11)
                                const part3 = cleaned.substring(11, 13)
                                return `${code} ${operator} ${part1} ${part2} ${part3}`.trim()
                              }
                            }
                            return cleaned || phone || 'N/A'
                          })()}
                        </div>
                        <div className="text-xs sm:text-[13px] text-rose-500 dark:text-rose-400 truncate">{c.email || 'N/A'}</div>

                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium ${
                              online
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-current mr-1 sm:mr-1.5" />
                            {online ? t('customers.online') : t('customers.offline')}
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 sm:gap-2 pr-1 sm:pr-2 shrink-0">
                          <button 
                            type="button"
                            onClick={() => openEditModal(c)}
                            className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                          >
                            <Icon.edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => openDeleteConfirm(c)}
                            className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                          >
                            <Icon.trash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
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
          style={{
            transform: 'translateX(0)',
            opacity: 1
          }}
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

      {/* Edit/Add Contact Modal */}
      {editModalOpen && editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {isNewContact ? 'Yeni Kontakt Əlavə Et' : 'Kontaktı Redaktə Et'}
              </h3>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Əlaqə Nömrəsi
                </label>
                <div className="flex gap-2">
                  <select
                    value={editingContact.countryCode}
                    onChange={(e) => setEditingContact({ ...editingContact, countryCode: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none bg-white min-w-[140px]"
                  >
                    {countryCodes.length > 0 ? (
                      countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag ? `${country.flag} ${country.code}` : `${country.code} ${country.country || ''}`}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="+994">🇦🇿 +994 Azərbaycan</option>
                        <option value="+7">🇷🇺 +7 Rusiya</option>
                        <option value="+1">🇺🇸 +1 ABŞ</option>
                        <option value="+90">🇹🇷 +90 Türkiyə</option>
                      </>
                    )}
                  </select>
                  <input
                    type="tel"
                    value={editingContact.phoneNumber}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      setEditingContact({ ...editingContact, phoneNumber: value })
                    }}
                    placeholder="701234567"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Nömrə: {editingContact.countryCode}{editingContact.phoneNumber || 'XXXXXXXXX'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={editingContact.status}
                  onChange={(e) => setEditingContact({ ...editingContact, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                  required
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#003A70] text-white rounded-lg font-medium hover:bg-[#02498f] transition-colors"
                >
                  Yadda saxla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Kontaktı Sil</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Bu kontaktı silmək istədiyinizə əminsiniz?
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-slate-800">{contactToDelete.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {contactToDelete.phoneNumber} • {contactToDelete.email}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                Ləğv et
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers


