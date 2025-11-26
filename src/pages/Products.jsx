import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Icon } from './Dashboard'
import { clearUserData, getUserData } from '../utils/userStorage'

const products = [
  {
    id: 1,
    name: 'Apple Watch Series 4',
    category: 'Digital Product',
    price: '$690.00',
    qty: 63,
    colors: ['#111827', '#9CA3AF', '#F97373']
  },
  {
    id: 2,
    name: 'Microsoft Headsquare',
    category: 'Digital Product',
    price: '$190.00',
    qty: 13,
    colors: ['#111827', '#1D4ED8', '#F97373', '#EAB308']
  },
  {
    id: 3,
    name: "Women's Dress",
    category: 'Fashion',
    price: '$640.00',
    qty: 635,
    colors: ['#7C2D12', '#1D4ED8', '#1D4ED8']
  },
  {
    id: 4,
    name: 'Samsung A50',
    category: 'Mobile',
    price: '$400.00',
    qty: 67,
    colors: ['#111827', '#111827', '#BE123C']
  },
  {
    id: 5,
    name: 'Camera',
    category: 'Electronic',
    price: '$420.00',
    qty: 52,
    colors: ['#111827', '#111827', '#BE123C']
  },
  {
    id: 6,
    name: 'Microsoft Headsquare',
    category: 'Digital Product',
    price: '$190.00',
    qty: 13,
    colors: ['#111827', '#1D4ED8', '#F97373', '#EAB308']
  },
  {
    id: 7,
    name: "Women's Dress",
    category: 'Fashion',
    price: '$640.00',
    qty: 635,
    colors: ['#7C2D12', '#1D4ED8', '#1D4ED8']
  }
]

const Products = () => {
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
            {/* Header: title + centered search + button */}
            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-5">
              <h1 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-[#003A70]">
                Product Stock
              </h1>
              <div className="flex-1 flex items-center gap-3 sm:gap-4">
                <div className="relative flex-1 max-w-md mx-auto">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <Icon.search className="w-4 h-4" />
                  </span>
                  <input
                    placeholder="Search product name"
                    className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>
                <button className="inline-flex items-center gap-2 rounded-md bg-[#00417F] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 shadow-sm hover:bg-[#02498f]">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#0B4C8A] shadow-sm text-base leading-none">
                    +
                  </span>
                  <span>Add New Contact</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="grid grid-cols-[120px_minmax(0,2.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_80px_140px_100px] px-6 py-3 border-b border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500">
                <div>Şəkil</div>
                <div>Məhsulun adı</div>
                <div>Kateqoriya</div>
                <div>Qiymət</div>
                <div className="text-center">Say</div>
                <div className="text-center">Mövcud rənglər</div>
                <div className="text-right pr-2">Action</div>
              </div>

              <div>
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-[120px_minmax(0,2.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_80px_140px_100px] px-6 py-4 border-t border-slate-100 hover:bg-slate-50/60 items-center text-sm"
                  >
                    {/* Image placeholder */}
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                        <span className="text-xs text-slate-500">IMG</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[13px] font-semibold text-slate-800">{p.name}</div>
                    </div>
                    <div className="text-[13px] text-slate-500">{p.category}</div>
                    <div className="text-[13px] text-slate-800">{p.price}</div>
                    <div className="text-[13px] text-slate-800 text-center">{p.qty}</div>
                    <div className="flex items-center justify-center gap-2">
                      {p.colors.map((c, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-white shadow"
                          style={{ backgroundColor: c }}
                        />
                      ))}
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
                ))}
              </div>

              {/* Pagination footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
                <button className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M15 6l-6 6 6 6"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Products


