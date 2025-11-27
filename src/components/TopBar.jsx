import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../pages/Dashboard'
import { getUserData } from '../utils/userStorage'

const TopBar = ({ sidebarOpen, setSidebarOpen, showBackButton = false, onBack }) => {
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  
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
    <div className="sticky top-0 z-30 bg-white border-b">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 shrink-0"
            aria-label="Open menu"
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
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 shrink-0"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Search */}
          <div className="relative flex-1 sm:w-48 sm:flex-none sm:flex-initial md:w-72 lg:w-96 max-w-full">
            <span className="pointer-events-none absolute inset-y-0 left-2 sm:left-3 flex items-center text-slate-400">
              <Icon.search className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
            <input
              placeholder="Axtar"
              className="w-full rounded-xl bg-slate-100 pl-7 sm:pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Right side icons and user */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          <Icon.globe className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 hidden sm:block" />
          <Icon.moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 hidden sm:block" />
          <div className="relative">
            <button onClick={() => setNotifOpen((v) => !v)} className="relative p-1.5 sm:p-2 rounded-lg hover:bg-slate-100">
              <Icon.bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-rose-500 rounded-full"></span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-white rounded-xl shadow-xl border p-3 z-50">
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mb-2">
                  <span>November 2025</span>
                  <button className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs">Read All</button>
                </div>
                {[1,2,3,4].map((i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-800 text-xs sm:text-sm font-semibold leading-4 sm:leading-5">Meg Griffin left you a review. Both reviews are now public.</div>
                      <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5">March 1, 2023</div>
                    </div>
                    <button className="text-rose-500 hover:text-rose-600 shrink-0">
                      <Icon.trash className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-300 flex items-center justify-center text-[10px] sm:text-xs font-semibold text-slate-700 shrink-0">
              {getInitials()}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs sm:text-sm font-semibold truncate max-w-[100px] sm:max-w-none">{displayName}</div>
              <div className="text-[10px] sm:text-xs text-emerald-600">{displayRole}</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopBar

