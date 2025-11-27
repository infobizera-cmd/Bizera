import { useNavigate, useLocation } from 'react-router-dom'
import { Icon } from '../pages/Dashboard'

const Sidebar = ({ sidebarOpen, setSidebarOpen, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Icon.sidebarDashboard },
    { label: 'Məhsullar', path: '/products', icon: Icon.sidebarProducts },
    { label: 'Satışlar', path: '/sales', icon: Icon.sidebarSales },
    { label: 'Tapşırıqlar', path: '/tasks', icon: Icon.sidebarTasks },
    { label: 'Müştərilər', path: '/customers', icon: Icon.sidebarCustomers },
    { label: 'Xərclər', path: '/expenses', icon: Icon.sidebarExpenses },
    { label: 'Tənzimləmələr', path: '/settings', icon: Icon.sidebarSettings }
  ]

  const handleNavigation = (path) => {
    navigate(path)
    setSidebarOpen(false) // Close sidebar on mobile after navigation
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-64 shrink-0 flex-col bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${sidebarOpen ? 'flex' : 'hidden md:flex'}`}>
        {/* Logo section */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#002750]">
            BizEra
          </div>
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

        {/* Menu items */}
        <nav className="flex-1 flex flex-col text-sm sm:text-[15px] font-semibold overflow-y-auto">
          <div className="flex-1 flex flex-col">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path
              const ItemIcon = item.icon
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-6 sm:px-8 py-4 sm:py-5 border-b transition-colors ${
                    isActive
                      ? 'bg-[#003A70] text-white border-transparent'
                      : 'bg-white text-[#003A70] border-[#E6EDF5] hover:bg-slate-50'
                  }`}
                >
                  <ItemIcon
                    className={`mr-3 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5 ${
                      isActive ? 'text-white' : 'text-[#003A70]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Logout button */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 sm:pt-3">
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-between rounded-xl bg-[#F3F7FB] px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-[15px] font-semibold text-[#003A70] hover:bg-[#e7f0f9] transition-colors"
            >
              <span>Çıxış</span>
              <Icon.sidebarLogout className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

