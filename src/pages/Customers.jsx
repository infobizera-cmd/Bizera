import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Icon } from './Dashboard'
import { clearUserData, getUserData } from '../utils/userStorage'

const customers = Array.from({ length: 8 }).map((_, idx) => ({
  id: `#9785`,
  name: 'Moni Roy',
  phone: '+999999999',
  email: 'MoniRoy@gmail.com',
  status: idx % 2 === 0 ? 'Online' : 'Offline'
}))

const Customers = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      localStorage.removeItem('bizera_auth')
      localStorage.removeItem('bizera_token')
      localStorage.removeItem('bizera_rememberMe')
      clearUserData()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200">
          <div className="px-8 pt-8 pb-6 border-b border-slate-200">
            <div className="text-2xl font-extrabold tracking-tight text-[#002750]">BizEra</div>
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
                    onClick={() => navigate(item.path)}
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
        <main className="flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
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
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
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
            {/* Header row */}
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003A70]">
                Contact
              </h1>
              <button className="inline-flex items-center gap-2 rounded-md bg-[#00417F] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 shadow-sm hover:bg-[#02498f]">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0B4C8A] shadow-sm text-base leading-none">
                  +
                </span>
                <span>Add New Contact</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="grid grid-cols-[70px_minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1.6fr)_minmax(0,1.6fr)_120px_110px] px-6 py-3 border-b border-slate-100 bg-slate-50/70 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-[#003A70] focus:ring-[#003A70]"
                  />
                </div>
                <div>ID</div>
                <div>Ad Soyad</div>
                <div>Əlaqə nömrəsi</div>
                <div>Customer`s Mails</div>
                <div className="text-center">Status</div>
                <div className="text-right pr-2">Action</div>
              </div>

              <div>
                {customers.map((c, idx) => {
                  const online = c.status === 'Online'
                  return (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={idx}
                      className="grid grid-cols-[70px_minmax(0,1.1fr)_minmax(0,1.5fr)_minmax(0,1.6fr)_minmax(0,1.6fr)_120px_110px] px-6 py-4 border-t border-slate-100 items-center text-sm hover:bg-slate-50/60"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-[#003A70] focus:ring-[#003A70]"
                        />
                      </div>

                      <div className="text-[13px] text-slate-700">{c.id}</div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                          <span className="text-xs font-semibold text-slate-600">MR</span>
                        </div>
                        <div className="text-[13px] font-semibold text-slate-800">
                          {c.name}
                        </div>
                      </div>

                      <div className="text-[13px] text-emerald-500">{c.phone}</div>
                      <div className="text-[13px] text-rose-500">{c.email}</div>

                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${
                            online
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
                          {online ? 'Online' : 'Offline'}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pr-2">
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                          <Icon.edit className="w-4 h-4" />
                        </button>
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 bg-white text-rose-500 hover:bg-rose-50">
                          <Icon.trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Customers


