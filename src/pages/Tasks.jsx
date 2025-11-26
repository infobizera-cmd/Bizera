import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../services/api'
import { Icon } from './Dashboard'
import { clearUserData, getUserData } from '../utils/userStorage'

const initialTasks = [
  {
    id: 1,
    title: 'Meeting with CEO',
    time: '09:00',
    date: '17 Nov',
    tag: 'Work',
    done: false
  },
  {
    id: 2,
    title: 'Meeting with CEO',
    time: '09:00',
    date: '17 Nov',
    tag: 'Work',
    done: false
  },
  {
    id: 3,
    title: 'Meeting with CEO',
    time: '09:00',
    date: '17 Nov',
    tag: 'Work',
    done: true
  },
  {
    id: 4,
    title: 'Meeting with CEO',
    time: '09:00',
    date: '17 Nov',
    tag: 'Work',
    done: false
  },
  {
    id: 5,
    title: 'Meeting with CEO',
    time: '09:00',
    date: '17 Nov',
    tag: 'Work',
    done: false
  }
]

const Tasks = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [notifOpen, setNotifOpen] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

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
        {/* Sidebar (Dashboard ilə eyni stil) */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200">
          <div className="px-8 pt-8 pb-6 border-b border-slate-200">
            <div className="text-2xl font-extrabold tracking-tight text-[#002750]">
              BizEra
            </div>
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
                  <button
                    onClick={() => setNotifOpen((v) => !v)}
                    className="relative p-2 rounded-lg hover:bg-slate-100"
                  >
                    <Icon.bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border p-3">
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                        <span>November 2025</span>
                        <button className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
                          Read All
                        </button>
                      </div>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          // eslint-disable-next-line react/no-array-index-key
                          key={i}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50"
                        >
                          <div className="w-9 h-9 rounded-full bg-slate-200" />
                          <div className="flex-1">
                            <div className="text-slate-800 text-sm font-semibold leading-5">
                              Meg Griffin left you a review. Both reviews are now public.
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              March 1, 2023
                            </div>
                          </div>
                          <button className="text-rose-500 hover:text-rose-600">
                            <Icon.trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
            {/* Page title + main action */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003A70]">
                To-Do List
              </h1>
              <button className="inline-flex items-center gap-2 rounded-full bg-[#003A70] text-white text-xs sm:text-sm font-semibold pl-3 pr-4 py-2 shadow-sm hover:bg-[#02498f]">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-base leading-none">
                  +
                </span>
                <span>Add New Task</span>
              </button>
            </div>

            {/* Calendar title */}
            <h2 className="text-lg font-semibold text-slate-800 mb-4 sm:mb-5">
              Calendar
            </h2>

            {/* Calendar + small month card */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.3fr)_minmax(0,1.1fr)] gap-5">
              {/* Left main calendar */}
              <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-4 text-sm text-slate-700">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50">
                      <span className="sr-only">Previous month</span>
                      <svg
                        className="w-3 h-3 text-slate-600"
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
                    <span className="font-semibold text-slate-800">November 2025</span>
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50">
                      <span className="sr-only">Next month</span>
                      <svg
                        className="w-3 h-3 text-slate-600"
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
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm text-slate-700 shadow-sm">
                    Last 2 weeks
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-2 overflow-x-auto">
                  <div className="min-w-[720px]">
                    <div className="grid grid-cols-[80px_repeat(15,minmax(0,1fr))] text-[11px] text-slate-400 mb-2">
                      <div className="px-2 py-1">Time</div>
                      {[
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '10',
                        '11',
                        '12',
                        '13',
                        '14',
                        '15'
                      ].map((d) => (
                        <div key={d} className="px-2 py-1 text-center">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="relative border border-slate-100 rounded-xl bg-gradient-to-b from-slate-50 to-white">
                      {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map(
                        (t, idx) => (
                          <div
                            key={t}
                            className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] text-[11px] text-slate-400"
                          >
                            <div className="px-2 py-6 border-t border-slate-100">{t}</div>
                            {Array.from({ length: 15 }).map((_, i) => (
                              <div
                                // eslint-disable-next-line react/no-array-index-key
                                key={i}
                                className={`border-t border-l border-slate-100 ${
                                  idx === 0 ? 'first:rounded-tr-xl' : ''
                                }`}
                              />
                            ))}
                          </div>
                        )
                      )}

                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute left-[120px] top-[24px] w-52 h-9 rounded-lg bg-indigo-500/90 text-white text-xs flex items-center px-3 shadow-sm">
                          Champion&apos;s league Campaign
                        </div>
                        <div className="absolute left-[140px] top-[92px] w-64 h-10 rounded-lg bg-slate-500/90 text-white text-xs flex items-center px-3 shadow-sm">
                          Front end - Website
                        </div>
                        <div className="absolute left-[420px] top-[40px] w-52 h-9 rounded-lg bg-amber-400 text-white text-xs flex items-center px-3 shadow-sm">
                          Oreo Treat...
                        </div>
                        <div className="absolute left-[360px] top-[160px] w-64 h-10 rounded-lg bg-indigo-600 text-white text-xs flex items-center px-3 shadow-sm">
                          Online Courses Page
                        </div>
                        <div className="absolute left-[180px] top-[220px] w-52 h-9 rounded-lg bg-slate-500 text-white text-xs flex items-center px-3 shadow-sm">
                          Mobile App Rework
                        </div>
                        <div className="absolute left-[420px] top-[260px] w-56 h-9 rounded-lg bg-slate-500 text-white text-xs flex items-center px-3 shadow-sm">
                          Landing Page D..
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side small month calendar */}
              <div className="rounded-[26px] bg-[#F5FBFF] border border-[#E0ECFA] shadow-sm p-6 flex flex-col">
                <div className="text-center text-lg font-extrabold text-[#003A70] mb-3">
                  November 2025
                </div>
                <div className="mt-1 pt-3 mb-3 border-t border-[#D3E2F5]">
                  <div className="grid grid-cols-7 text-[11px] text-slate-500 text-center">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
                      <div key={w} className="py-0.5">
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-slate-600">
                  {[
                    '29',
                    '30',
                    '31',
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '09',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                    '24',
                    '25',
                    '26',
                    '27',
                    '28',
                    '29',
                    '30'
                  ].map((d, idx) => {
                    const isToday = d === '17'
                    const isSelected = d === '08'
                    return (
                      <div
                        // eslint-disable-next-line react/no-array-index-key
                        key={idx}
                        className="flex items-center justify-center py-1"
                      >
                        {d ? (
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-[11px] ${
                              isToday
                                ? 'bg-[#003A70] text-white shadow-sm'
                                : isSelected
                                ? 'border border-[#003A70] text-[#003A70]'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {d}
                          </div>
                        ) : (
                          <span />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <section className="mt-8 bg-white rounded-2xl shadow-sm border">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800">Tasks List</h2>
              </div>
              <div className="divide-y">
                {tasks.map((task) => {
                  const active = task.done
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between px-6 py-4 sm:py-5 ${
                        active ? 'bg-[#DCE7FF]' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`w-6 h-6 rounded-md border flex items-center justify-center ${
                            active
                              ? 'border-transparent bg-[#003A70] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {active && (
                            <svg
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                d="M5 13l4 4L19 7"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                        <div className="flex flex-col">
                          <div
                            className={`text-sm sm:text-base font-semibold ${
                              active ? 'text-[#003A70] line-through' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </div>
                          <div
                            className={`flex items-center gap-4 mt-1 text-[11px] sm:text-xs ${
                              active ? 'text-white/90' : 'text-slate-500'
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <Icon.clock
                                className={`w-3.5 h-3.5 ${
                                  active ? 'text-white' : 'text-slate-400'
                                }`}
                              />
                              <span>{task.time}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Icon.card
                                className={`w-3.5 h-3.5 ${
                                  active ? 'text-white' : 'text-slate-400'
                                }`}
                              />
                              <span>{task.date}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Icon.receipt
                                className={`w-3.5 h-3.5 ${
                                  active ? 'text-white' : 'text-slate-400'
                                }`}
                              />
                              <span>{task.tag}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
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
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Tasks


