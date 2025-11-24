import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const Icon = {
  globe: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </svg>
  ),
  bell: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  moon: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z" />
    </svg>
  ),
  user: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14c-4.418 0-8 2.239-8 5v2h16v-2c0-2.761-3.582-5-8-5z" />
    </svg>
  ),
  card: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" strokeWidth="1.8" />
      <path d="M2.5 9h19" strokeWidth="1.8" />
    </svg>
  ),
  up: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 0l-6 6m6-6l6 6" />
    </svg>
  ),
  down: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m0 0l6-6m-6 6l-6-6" />
    </svg>
  ),
  logout: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4-4M3 12l4 4M21 5v14a2 2 0 01-2 2h-6" />
    </svg>
  ),
  cube: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" d="M12 2l9 5-9 5-9-5 9-5z" />
      <path strokeWidth="1.8" d="M3 7v10l9 5 9-5V7" />
    </svg>
  ),
  chart: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" strokeLinecap="round" d="M3 20h18M7 16v-6M12 20V8M17 20V4" />
    </svg>
  ),
  clock: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path strokeWidth="1.8" strokeLinecap="round" d="M12 7v6l4 2" />
    </svg>
  ),
  receipt: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" d="M6 3h12a1 1 0 011 1v16l-3-2-3 2-3-2-3 2-3-2V4a1 1 0 011-1z" />
      <path strokeWidth="1.8" d="M8 8h8M8 12h8" />
    </svg>
  ),
  trash: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.8" strokeLinecap="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" />
    </svg>
  )
}

const StatCard = ({ title, value, trend, trendType = 'up', icon }) => (
  <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 flex items-center gap-4">
    <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white"
         style={{ background: 'linear-gradient(135deg,#3B82F6 0%,#10B981 100%)' }}>
      {icon}
    </div>
    <div className="min-w-0">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{value}</div>
      <div className={`text-xs sm:text-sm mt-1 ${trendType === 'down' ? 'text-rose-500' : 'text-emerald-600'}`}>
        {trend}
      </div>
    </div>
  </div>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)

  const transactions = useMemo(() => [
    { dir: 'up', desc: 'Spotify Subscription', id: '#12548796', type: 'Shopping', card: '1234 ****', date: '28 Jan, 12.30 AM', amount: -2500 },
    { dir: 'down', desc: 'Freepik Sales', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '25 Jan, 10.40 PM', amount: 750 },
    { dir: 'up', desc: 'Mobile Service', id: '#12548796', type: 'Service', card: '1234 ****', date: '20 Jan, 10.40 PM', amount: -150 },
    { dir: 'up', desc: 'Wilson', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '15 Jan, 03.29 PM', amount: -1050 },
    { dir: 'down', desc: 'Emilly', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '14 Jan, 10.40 PM', amount: 840 }
  ], [])

  const logout = async () => {
    try {
      // Call logout API
      await authAPI.logout()
    } catch (error) {
      // Log error but still proceed with logout
      console.error('Logout API error:', error)
    } finally {
      // Clear local storage and navigate regardless of API result
      localStorage.removeItem('bizera_auth')
      localStorage.removeItem('bizera_token')
      localStorage.removeItem('bizera_rememberMe')
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 p-4 border-r bg-white">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg text-white flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#3B82F6 0%,#10B981 100%)' }}>Bz</div>
            <div className="text-xl font-bold">BizEra</div>
          </div>
          {[
            { label: 'Dashboard' },
            { label: 'Məhsullar' },
            { label: 'Satışlar' },
            { label: 'Tapşırıqlar' },
            { label: 'Müştərilər' }
          ].map((item, idx) => (
            <button key={idx} className={`text-left rounded-xl px-3 py-2.5 hover:bg-slate-100 ${idx === 0 ? 'bg-slate-900 text-white hover:bg-slate-900' : 'text-slate-700'}`}>
              {item.label}
            </button>
          ))}
          <div className="mt-auto">
            <button onClick={logout} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
              Çıxış
              <Icon.logout className="w-5 h-5" />
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <input placeholder="Axtar" className="w-48 sm:w-72 md:w-96 rounded-xl bg-slate-100 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex items-center gap-2 sm:gap-3">
                <Icon.globe className="w-5 h-5 text-slate-600" />
                <Icon.moon className="w-5 h-5 text-slate-600" />
                <div className="relative">
                  <button onClick={() => setNotifOpen((v) => !v)} className="relative p-2 rounded-lg hover:bg-slate-100">
                    <Icon.bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border p-3">
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                        <span>November 2025</span>
                        <button className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">Read All</button>
                      </div>
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
                          <div className="w-9 h-9 rounded-full bg-slate-200" />
                          <div className="flex-1">
                            <div className="text-slate-800 text-sm font-semibold leading-5">Meg Griffin left you a review. Both reviews are now public.</div>
                            <div className="text-xs text-slate-500 mt-0.5">March 1, 2023</div>
                          </div>
                          <button className="text-rose-500 hover:text-rose-600">
                            <Icon.trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-300" />
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold">Moni Roy</div>
                    <div className="text-xs text-emerald-600">Admin</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Ümumi istifadəçi" value="40,689" trend="+8.5% Dünəndən yuxarı" trendType="up" icon={<Icon.user className="w-6 h-6" />} />
              <StatCard title="Ümumi sifariş" value="10,293" trend="+1.3% keçən həftədən yuxarı" trendType="up" icon={<Icon.cube className="w-6 h-6" />} />
              <StatCard title="Ümumi satış" value="$89,000" trend="-4.3% Dünəndən aşağı" trendType="down" icon={<Icon.chart className="w-6 h-6" />} />
              <StatCard title="Ümumi gözləyən" value="2040" trend="+1.8% Dünəndən yuxarı" trendType="up" icon={<Icon.clock className="w-6 h-6" />} />
            </div>

            {/* Recent Transactions */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border">
              <div className="p-5">
                <div className="text-slate-700 font-semibold mb-4">Recent Transactions</div>
                <div className="flex gap-6 text-sm">
                  <button className="pb-2 border-b-2 border-slate-900 font-semibold">All Transactions</button>
                  <button className="pb-2 text-slate-500 hover:text-slate-700">Income</button>
                  <button className="pb-2 text-slate-500 hover:text-slate-700">Expense</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-slate-500">
                    <tr className="text-left">
                      <th className="px-6 py-3 font-medium">Description</th>
                      <th className="px-6 py-3 font-medium">Transaction ID</th>
                      <th className="px-6 py-3 font-medium">Type</th>
                      <th className="px-6 py-3 font-medium">Card</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transactions.map((t, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${t.dir === 'down' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'}`}>
                            {t.dir === 'down' ? <Icon.down className="w-4 h-4" /> : <Icon.up className="w-4 h-4" />}
                          </span>
                          <span className="text-slate-800 font-medium truncate">{t.desc}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{t.id}</td>
                        <td className="px-6 py-4 text-slate-600">{t.type}</td>
                        <td className="px-6 py-4 text-slate-600">{t.card}</td>
                        <td className="px-6 py-4 text-slate-600">{t.date}</td>
                        <td className={`px-6 py-4 font-semibold ${t.amount < 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                          {t.amount < 0 ? `-$${Math.abs(t.amount).toLocaleString()}` : `+$${t.amount.toLocaleString()}`}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200">
                            <Icon.receipt className="w-4 h-4 text-slate-700" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-center gap-3 p-4">
                <button className="text-slate-500 hover:text-slate-700">Previous</button>
                {[1,2,3,4].map((p) => (
                  <button key={p} className={`w-9 h-9 rounded-full ${p === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{p}</button>
                ))}
                <button className="text-slate-500 hover:text-slate-700">Next</button>
              </div>
            </div>

            {/* Account Details */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border">
              <div className="p-5 flex items-center justify-between">
                <div className="text-slate-800 text-lg font-extrabold">Account Details</div>
                <div>
                  <button className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm">Oktyabr</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr className="text-left">
                      <th className="px-6 py-3 font-medium">Account Name</th>
                      <th className="px-6 py-3 font-medium">Subscription</th>
                      <th className="px-6 py-3 font-medium">Comments</th>
                      <th className="px-6 py-3 font-medium">Likes</th>
                      <th className="px-6 py-3 font-medium">Tags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { name: 'UserName', sub: '70K', com: '3000', like: '423', tag: '$34,295' },
                      { name: 'UserName', sub: '157K', com: '207', like: '423', tag: '$34,295' },
                      { name: 'UserName', sub: '57K', com: '1K', like: '423', tag: '$34,295' }
                    ].map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full bg-slate-200" />
                            <span className="font-medium text-slate-800">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{u.sub}</td>
                        <td className="px-6 py-4 text-slate-700">{u.com}</td>
                        <td className="px-6 py-4 text-slate-700">{u.like}</td>
                        <td className="px-6 py-4 text-slate-700">{u.tag}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard


