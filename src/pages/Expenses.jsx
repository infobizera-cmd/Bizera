import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authAPI } from '../services/api'
import { Icon } from './Dashboard'
import { clearUserData, getUserData } from '../utils/userStorage'
import TopBar from '../components/TopBar'

const expenses = [
  {
    id: 1,
    name: 'Apple Watch Series 4',
    category: 'Digital Product',
    price: '$690.00',
    qty: 63,
    date: '20.07.2025'
  },
  {
    id: 2,
    name: 'Microsoft Headsquare',
    category: 'Digital Product',
    price: '$190.00',
    qty: 13,
    date: '20.07.2025'
  },
  {
    id: 3,
    name: "Women's Dress",
    category: 'Fashion',
    price: '$640.00',
    qty: 635,
    date: '20.07.2025'
  },
  {
    id: 4,
    name: 'Samsung A50',
    category: 'Mobile',
    price: '$400.00',
    qty: 67,
    date: '20.07.2025'
  },
  {
    id: 5,
    name: 'Camera',
    category: 'Electronic',
    price: '$420.00',
    qty: 52,
    date: '20.07.2025'
  },
  {
    id: 6,
    name: 'Microsoft Headsquare',
    category: 'Digital Product',
    price: '$190.00',
    qty: 13,
    date: '20.07.2025'
  },
  {
    id: 7,
    name: "Women's Dress",
    category: 'Fashion',
    price: '$640.00',
    qty: 635,
    date: '20.07.2025'
  }
]

const Expenses = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter expenses by search query
  const filteredExpenses = expenses.filter((expense) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      expense.name?.toLowerCase().includes(query) ||
      expense.category?.toLowerCase().includes(query) ||
      expense.price?.toLowerCase().includes(query)
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
            {/* Header: title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003A70] mb-4 sm:mb-5">
                {t('expenses.title')}
              </h1>

            {/* Expenses Table */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-[100px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_70px_100px] sm:grid-cols-[120px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_80px_120px] min-w-[700px] px-3 sm:px-6 py-2 sm:py-3 border-b border-slate-100 bg-slate-50/60 text-[10px] sm:text-xs font-medium text-slate-500">
                <div>{t('expenses.image')}</div>
                <div>{t('expenses.productName')}</div>
                <div>{t('expenses.category')}</div>
                <div>{t('expenses.price')}</div>
                <div className="text-center">{t('expenses.quantity')}</div>
                <div className="text-center">{t('expenses.date')}</div>
              </div>

              {/* Table Rows */}
              <div>
                {filteredExpenses.length === 0 ? (
                  <div className="px-3 sm:px-6 py-6 sm:py-8 text-center text-slate-500 text-sm sm:text-base">
                    {searchQuery ? t('expenses.noSearchResults') : t('expenses.noExpenses')}
                  </div>
                ) : (
                  filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="grid grid-cols-[100px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_70px_100px] sm:grid-cols-[120px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_80px_120px] min-w-[700px] px-3 sm:px-6 py-3 sm:py-4 border-t border-slate-100 hover:bg-slate-50/60 items-center text-xs sm:text-sm"
                  >
                    {/* Image placeholder */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                        <span className="text-[10px] sm:text-xs text-slate-500">IMG</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <div className="min-w-0">
                      <div className="text-xs sm:text-[13px] font-semibold text-slate-800 truncate">{expense.name}</div>
                    </div>

                    {/* Category */}
                    <div className="text-xs sm:text-[13px] text-slate-500 truncate">{expense.category}</div>

                    {/* Price */}
                    <div className="text-xs sm:text-[13px] text-slate-800 whitespace-nowrap">{expense.price}</div>

                    {/* Quantity */}
                    <div className="text-xs sm:text-[13px] text-slate-800 text-center">{expense.qty}</div>

                    {/* Date */}
                    <div className="text-xs sm:text-[13px] text-slate-800 text-center whitespace-nowrap">{expense.date}</div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Expenses

