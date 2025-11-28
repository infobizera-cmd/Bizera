import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authAPI, dashboardAPI, contactsAPI } from '../services/api'
import { clearUserData } from '../utils/userStorage'
import TopBar from '../components/TopBar'

export const Icon = {
  // Professional Dashboard Icon - Layout Grid
  sidebarDashboard: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  // Professional Products Icon - Package/Box
  sidebarProducts: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  // Professional Sales Icon - Trending Up Chart
  sidebarSales: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  // Professional Tasks Icon - Clipboard with Check
  sidebarTasks: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  // Professional Customers Icon - Users/People
  sidebarCustomers: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  // Professional Expenses Icon - Dollar Sign/Wallet
  sidebarExpenses: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  // Professional Settings Icon - Gear/Cog with detailed design
  sidebarSettings: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  // Professional Logout Icon - Sign Out
  sidebarLogout: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  globe: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </svg>
  ),
  search: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="6" strokeWidth="1.8" />
      <path d="M16 16l3 3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  ),
  edit: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25z"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 6.19l1.41-1.41a2 2 0 012.83 0l1.48 1.48a2 2 0 010 2.83L19 10.31"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const StatCard = ({ title, value, trend, trendType = 'up', icon, tone = 'indigo' }) => {
  const toneClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400',
    rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400'
  }[tone]

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4">
      <div
        className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${toneClasses}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm text-slate-500 dark:text-slate-400">{title}</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">{value}</div>
        <div
          className={`text-xs sm:text-sm mt-1 ${
            trendType === 'down' ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {trend}
        </div>
      </div>
    </div>
  )
}

// Donut Pie Chart used in the middle section
const DonutPie = ({ percent, label, color }) => {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  const colorHex =
    color === 'red' ? '#F97373' : color === 'green' ? '#22C55E' : '#3B82F6'

  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="14"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={colorHex}
            strokeWidth="14"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg sm:text-xl font-extrabold text-slate-800">
            {percent}%
          </span>
        </div>
      </div>
      <div className="text-sm sm:text-base font-medium text-slate-700">
        {label}
      </div>
    </div>
  )
}

// Simple Line Chart for "Total Revenue"
const TotalRevenueChart = ({ data2024, data2025, months }) => {
  const maxValue = Math.max(...data2024, ...data2025, 40000)
  const getY = (value) => 220 - (value / maxValue) * 200
  const getX = (index) => (index / (months.length - 1 || 1)) * 680 + 40

  const juneIndex = months.indexOf('Jun')
  const octIndex = months.indexOf('Oct')

  return (
    <div className="relative h-64 sm:h-72">
      <svg className="w-full h-full" viewBox="0 0 720 240" preserveAspectRatio="xMidYMid meet">
        {/* Y axis labels */}
        <text x="16" y="40" className="text-[11px] fill-gray-400">$40k</text>
        <text x="16" y="80" className="text-[11px] fill-gray-400">$30k</text>
        <text x="16" y="120" className="text-[11px] fill-gray-400">$20k</text>
        <text x="16" y="160" className="text-[11px] fill-gray-400">$10k</text>

        {/* Grid lines */}
        {[0, 50, 100, 150, 200].map((y) => (
          <line
            // eslint-disable-next-line react/no-array-index-key
            key={y}
            x1="50"
            y1={y + 20}
            x2="700"
            y2={y + 20}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}

        {/* 2024 line */}
        <polyline
          points={data2024.map((val, i) => `${getX(i)},${getY(val)}`).join(' ')}
          fill="none"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 2025 line */}
        <polyline
          points={data2025.map((val, i) => `${getX(i)},${getY(val)}`).join(' ')}
          fill="none"
          stroke="#1D4ED8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Highlight points */}
        {data2024.map((val, i) => (
          <circle
            // eslint-disable-next-line react/no-array-index-key
            key={`2024-${i}`}
            cx={getX(i)}
            cy={getY(val)}
            r="4"
            fill="#60A5FA"
          />
        ))}
        {data2025.map((val, i) => {
          const isJune = i === juneIndex
          const isOct = i === octIndex
          const r = isJune || isOct ? 6 : 4
          const fill = isOct ? '#F97373' : '#1D4ED8'
          return (
            <circle
              // eslint-disable-next-line react/no-array-index-key
              key={`2025-${i}`}
              cx={getX(i)}
              cy={getY(val)}
              r={r}
              fill={fill}
            />
          )
        })}

        {/* Dashed highlight lines for June & Oct */}
        {juneIndex !== -1 && (
          <line
            x1={getX(juneIndex)}
            y1="30"
            x2={getX(juneIndex)}
            y2="210"
            stroke="#BFDBFE"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}
        {octIndex !== -1 && (
          <line
            x1={getX(octIndex)}
            y1="30"
            x2={getX(octIndex)}
            y2="210"
            stroke="#BFDBFE"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* X axis labels */}
        {months.map((month, i) => (
          <text
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            x={getX(i)}
            y="230"
            textAnchor="middle"
            className="text-[11px] fill-gray-400"
          >
            {month}
          </text>
        ))}
      </svg>

      {/* June tooltip badge */}
      <div className="absolute left-1/2 top-3 -translate-x-1/2">
        <div className="rounded-full bg-sky-100 text-sky-800 text-[11px] sm:text-xs px-3 py-1 shadow-sm border border-sky-200">
          $ 38.753,00
        </div>
      </div>

      {/* October tooltip badge */}
      <div className="absolute right-20 bottom-6">
        <div className="rounded-full bg-rose-100 text-rose-500 text-[11px] sm:text-xs px-3 py-1 shadow-sm border border-rose-200">
          $ 12.657,00
        </div>
      </div>

      {/* Legends */}
      <div className="absolute top-3 right-4 flex items-center gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 rounded-full bg-blue-300" />
          <span className="text-slate-500">2024</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 rounded-full bg-blue-700" />
          <span className="text-slate-500">2025</span>
        </div>
      </div>
    </div>
  )
}

// Area chart for "Chart Order"
const ChartOrderArea = ({ data, labels }) => {
  const maxValue = Math.max(...data, 500)
  const height = 160
  const width = 600
  const getY = (value) => height - (value / maxValue) * height
  const getX = (index) => (index / (labels.length - 1 || 1)) * width

  const areaPath = `M ${getX(0)},${height} ${data
    .map((val, i) => `L ${getX(i)},${getY(val)}`)
    .join(' ')} L ${getX(labels.length - 1)},${height} Z`
  const linePath = `M ${data.map((val, i) => `${getX(i)},${getY(val)}`).join(' L ')}`

  return (
    <div className="relative h-48 sm:h-56">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${width + 40} ${height + 40}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="orderGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#orderGradient)" opacity="0.4" />
        <path
          d={linePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((val, i) => (
          <circle
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            cx={getX(i)}
            cy={getY(val)}
            r="4"
            fill="#2563EB"
          />
        ))}

        {labels.map((label, i) => (
          <text
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            x={getX(i)}
            y={height + 28}
            textAnchor="middle"
            className="text-[11px] fill-gray-400"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}

// Vertical bars for "Daily Traffic"
const DailyTrafficChart = ({ data, labels }) => {
  const maxValue = Math.max(...data, 100)
  const height = 150
  const width = 320
  const getY = (value) => height - (value / maxValue) * height
  const getX = (index) => (index / (labels.length - 1 || 1)) * width + 20

  return (
    <div className="relative h-48 sm:h-56">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${width + 40} ${height + 40}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {data.map((val, i) => {
          const barHeight = (val / maxValue) * height
          return (
            <rect
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              x={getX(i) - 14}
              y={getY(val)}
              width="28"
              height={barHeight}
              rx="6"
              fill="url(#trafficGradient)"
            />
          )
        })}
        <defs>
          <linearGradient id="trafficGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>

        {labels.map((label, i) => (
          <text
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            x={getX(i)}
            y={height + 26}
            textAnchor="middle"
            className="text-[11px] fill-gray-400"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Dashboard data states
  const [metrics, setMetrics] = useState(null)
  const [salesSeries, setSalesSeries] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [contactsStats, setContactsStats] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError('')

        // Check if user is authenticated (cookie-based auth)
        const isAuthenticated = localStorage.getItem('bizera_auth') === 'true'
        if (!isAuthenticated) {
          setError('Giriş edilməyib. Zəhmət olmasa yenidən daxil olun.')
          navigate('/login', { replace: true })
          return
        }
        
        // Cookie-based auth - token is automatically sent in cookie

        // Load all data in parallel
        const [metricsResponse, salesResponse, accountsResponse, allAccountsResponse, contactsStatsResponse] = await Promise.allSettled([
          dashboardAPI.getMetrics(),
          (async () => {
            const now = new Date()
            const from = new Date(now.getFullYear() - 1, now.getMonth(), 1).toISOString()
            const to = now.toISOString()
            return dashboardAPI.getSalesSeries({ from, to, userOnly: false })
          })(),
          dashboardAPI.getAccounts(),
          dashboardAPI.getAllAccounts(),
          contactsAPI.getStats()
        ])

        // Handle metrics
        if (metricsResponse.status === 'fulfilled' && metricsResponse.value?.data) {
          console.log('Dashboard metrics received:', metricsResponse.value.data)
          setMetrics(metricsResponse.value.data)
        } else if (metricsResponse.status === 'rejected') {
          const error = metricsResponse.reason
          console.error('Error loading metrics:', error)
          // Don't logout on 401, just show error and use default data
        }

        // Handle sales series
        if (salesResponse.status === 'fulfilled' && salesResponse.value?.data) {
          setSalesSeries(salesResponse.value.data)
        } else if (salesResponse.status === 'rejected') {
          const error = salesResponse.reason
          console.error('Error loading sales series:', error)
        }

        // Handle accounts
        if (accountsResponse.status === 'fulfilled' && accountsResponse.value?.data) {
          setAccounts(Array.isArray(accountsResponse.value.data) ? accountsResponse.value.data : [])
        } else if (accountsResponse.status === 'rejected') {
          const error = accountsResponse.reason
          console.error('Error loading accounts:', error)
        }

        // Handle all accounts (transactions)
        if (allAccountsResponse.status === 'fulfilled' && allAccountsResponse.value?.data) {
          const transformedTransactions = Array.isArray(allAccountsResponse.value.data) 
            ? allAccountsResponse.value.data.map((acc, idx) => {
                // Translate transaction type
                let translatedType = t('dashboard.transactionTypes.transfer')
                if (acc.subscription) {
                  const typeLower = acc.subscription.toLowerCase()
                  if (typeLower.includes('shopping') || typeLower.includes('shop')) {
                    translatedType = t('dashboard.transactionTypes.shopping')
                  } else if (typeLower.includes('service')) {
                    translatedType = t('dashboard.transactionTypes.service')
                  } else {
                    translatedType = t('dashboard.transactionTypes.transfer')
                  }
                }
                return {
                  dir: idx % 2 === 0 ? 'up' : 'down',
                  desc: acc.accountName || acc.name || t('dashboard.defaultTransactions.spotifySubscription'),
                  id: `#${acc.id?.toString().slice(-8) || idx}`,
                  type: translatedType,
                  card: '1234 ****',
                  date: acc.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                  amount: acc.amount || (idx % 2 === 0 ? -1000 : 500)
                }
              })
            : []
          setTransactions(transformedTransactions.length > 0 ? transformedTransactions : [
            { dir: 'up', desc: t('dashboard.defaultTransactions.spotifySubscription'), id: '#12548796', type: t('dashboard.transactionTypes.shopping'), card: '1234 ****', date: '28 Jan, 12.30 AM', amount: -2500 },
            { dir: 'down', desc: t('dashboard.defaultTransactions.freepikSales'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '25 Jan, 10.40 PM', amount: 750 },
            { dir: 'up', desc: t('dashboard.defaultTransactions.mobileService'), id: '#12548796', type: t('dashboard.transactionTypes.service'), card: '1234 ****', date: '20 Jan, 10.40 PM', amount: -150 },
            { dir: 'up', desc: t('dashboard.defaultTransactions.wilson'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '15 Jan, 03.29 PM', amount: -1050 },
            { dir: 'down', desc: t('dashboard.defaultTransactions.emilly'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '14 Jan, 10.40 PM', amount: 840 }
          ])
        } else if (allAccountsResponse.status === 'rejected') {
          const error = allAccountsResponse.reason
          console.error('Error loading all accounts:', error)
          // Set default transactions on error
          setTransactions([
            { dir: 'up', desc: t('dashboard.defaultTransactions.spotifySubscription'), id: '#12548796', type: t('dashboard.transactionTypes.shopping'), card: '1234 ****', date: '28 Jan, 12.30 AM', amount: -2500 },
            { dir: 'down', desc: t('dashboard.defaultTransactions.freepikSales'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '25 Jan, 10.40 PM', amount: 750 },
            { dir: 'up', desc: t('dashboard.defaultTransactions.mobileService'), id: '#12548796', type: t('dashboard.transactionTypes.service'), card: '1234 ****', date: '20 Jan, 10.40 PM', amount: -150 },
            { dir: 'up', desc: t('dashboard.defaultTransactions.wilson'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '15 Jan, 03.29 PM', amount: -1050 },
            { dir: 'down', desc: t('dashboard.defaultTransactions.emilly'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '14 Jan, 10.40 PM', amount: 840 }
          ])
        }

        // Handle contacts stats
        if (contactsStatsResponse.status === 'fulfilled' && contactsStatsResponse.value?.data) {
          console.log('Contacts stats received:', contactsStatsResponse.value.data)
          setContactsStats(contactsStatsResponse.value.data)
        } else if (contactsStatsResponse.status === 'rejected') {
          const error = contactsStatsResponse.reason
          console.error('Error loading contacts stats:', error)
          // Set default stats on error
          setContactsStats({ totalContacts: 0 })
        }

      } catch (err) {
        console.error('Error loading dashboard data:', err)
        
        // Don't logout on 401 - just show error and use default data
        // User can still use the dashboard with default data
        setError(t('common.errorLoadingData'))
        
        // Set default data on error so user can still see the dashboard
        setMetrics(null)
        setSalesSeries(null)
        setAccounts([])
        setContactsStats({ totalContacts: 0 })
        setTransactions([
          { dir: 'up', desc: t('dashboard.defaultTransactions.spotifySubscription'), id: '#12548796', type: t('dashboard.transactionTypes.shopping'), card: '1234 ****', date: '28 Jan, 12.30 AM', amount: -2500 },
          { dir: 'down', desc: t('dashboard.defaultTransactions.freepikSales'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '25 Jan, 10.40 PM', amount: 750 },
          { dir: 'up', desc: t('dashboard.defaultTransactions.mobileService'), id: '#12548796', type: t('dashboard.transactionTypes.service'), card: '1234 ****', date: '20 Jan, 10.40 PM', amount: -150 },
          { dir: 'up', desc: t('dashboard.defaultTransactions.wilson'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '15 Jan, 03.29 PM', amount: -1050 },
          { dir: 'down', desc: t('dashboard.defaultTransactions.emilly'), id: '#12548796', type: t('dashboard.transactionTypes.transfer'), card: '1234 ****', date: '14 Jan, 10.40 PM', amount: 840 }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [navigate, t])

  // Process sales series data for charts
  const lineData2024 = useMemo(() => {
    if (!salesSeries) return [15000, 22000, 14000, 26000, 34000, 29000, 31000, 27000, 23000, 12657, 21000, 24000]
    // Transform sales series data to chart format
    // Assuming salesSeries is an array or object with data points
    if (Array.isArray(salesSeries)) {
      return salesSeries.slice(0, 12).map(item => item.value || item.amount || 0)
    }
    return [15000, 22000, 14000, 26000, 34000, 29000, 31000, 27000, 23000, 12657, 21000, 24000]
  }, [salesSeries])

  const lineData2025 = useMemo(() => {
    if (!salesSeries) return [12000, 18000, 20000, 23000, 32000, 38753, 36000, 30000, 26000, 28000, 29000, 33000]
    // Use current year data if available
    return lineData2024.map(val => val * 1.1) // Fallback: 10% increase
  }, [salesSeries, lineData2024])

  const lineMonths = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    []
  )

  const chartOrderData = useMemo(() => [180, 260, 210, 240, 280, 250, 290], [])
  const chartOrderLabels = useMemo(
    () => [
      t('dashboard.daysShort.sunday'),
      t('dashboard.daysShort.monday'),
      t('dashboard.daysShort.tuesday'),
      t('dashboard.daysShort.wednesday'),
      t('dashboard.daysShort.thursday'),
      t('dashboard.daysShort.friday'),
      t('dashboard.daysShort.saturday')
    ],
    [t]
  )

  const trafficData = useMemo(() => [40, 22, 80, 60, 50, 72, 90], [])
  const trafficLabels = useMemo(() => ['00', '04', '08', '12', '14', '16', '18'], [])

  const logout = async () => {
    try {
      // Cookie-based auth - logout will clear cookie on backend
      await authAPI.logout()
    } catch (error) {
      // Log error but still proceed with logout
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
          {/* Logo section */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700 md:flex items-center justify-between">
            <div className="text-2xl font-extrabold tracking-tight text-[#002750] dark:text-white">
              BizEra
            </div>
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

          {/* Menu items */}
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-6">{t('dashboard.title')}</h1>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="mb-6 text-center text-slate-500 dark:text-slate-400">
                {t('common.loading')}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title={t('dashboard.totalUsers')}
                value={contactsStats?.totalContacts !== undefined && contactsStats?.totalContacts !== null ? contactsStats.totalContacts.toLocaleString() : '0'}
                trend={metrics?.userTrend || `+8.5% ${t('dashboard.trendUp')}`}
                trendType={metrics?.userTrendType || 'up'}
                tone="indigo"
                icon={<Icon.user className="w-6 h-6" />}
              />
              <StatCard
                title={t('dashboard.totalOrders')}
                value={metrics?.totalOrders !== undefined && metrics?.totalOrders !== null ? metrics.totalOrders.toLocaleString() : '0'}
                trend={metrics?.orderTrend || `+1.3% ${t('dashboard.trendUp')}`}
                trendType={metrics?.orderTrendType || 'up'}
                tone="amber"
                icon={<Icon.cube className="w-6 h-6" />}
              />
              <StatCard
                title={t('dashboard.totalSales')}
                value={metrics?.totalSales !== undefined && metrics?.totalSales !== null ? `$${metrics.totalSales.toLocaleString()}` : '$0'}
                trend={metrics?.salesTrend || `-4.3% ${t('dashboard.trendDown')}`}
                trendType={metrics?.salesTrendType || 'down'}
                tone="emerald"
                icon={<Icon.chart className="w-6 h-6" />}
              />
              <StatCard
                title={t('dashboard.totalPending')}
                value={metrics?.totalPending !== undefined && metrics?.totalPending !== null ? metrics.totalPending.toLocaleString() : '0'}
                trend={metrics?.pendingTrend || `+1.8% ${t('dashboard.trendUp')}`}
                trendType={metrics?.pendingTrendType || 'up'}
                tone="rose"
                icon={<Icon.clock className="w-6 h-6" />}
              />
            </div>

            {/* Charts section */}
            <div className="mt-8 grid grid-cols-1 gap-4">
              {/* Middle Pie + Customer Map row */}
              <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1.2fr)] gap-4">
                {/* Three donut pies */}
                <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 md:p-6 flex flex-col">
                  <h2 className="text-slate-800 font-semibold text-lg sm:text-xl mb-3 sm:mb-4">
                    {t('dashboard.pieChart')}
                  </h2>
                  <div className="flex flex-wrap justify-around gap-4 sm:gap-5 md:gap-6">
                    <DonutPie percent={81} label={t('dashboard.totalOrder')} color="red" />
                    <DonutPie
                      percent={22}
                      label={t('dashboard.customerGrowth')}
                      color="green"
                    />
                    <DonutPie
                      percent={62}
                      label={t('dashboard.totalRevenue')}
                      color="blue"
                    />
                  </div>
                </div>

                {/* Customer Map bar chart */}
                <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 md:p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h2 className="text-slate-800 font-semibold text-lg sm:text-xl">
                      {t('dashboard.customerMap')}
                    </h2>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm text-slate-700"
                    >
                      {t('dashboard.weekly')}
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
                  <div className="flex-1 flex items-end">
                    <div className="w-full flex items-end justify-between gap-2 sm:gap-3">
                      {[60, 80, 65, 70, 60, 30, 55].map((val, idx) => {
                        const height = (val / 100) * 140
                        const light = idx % 2 === 0
                        return (
                          <div
                            // eslint-disable-next-line react/no-array-index-key
                            key={idx}
                            className="flex-1 flex flex-col items-center"
                          >
                            <div className="w-full h-40 flex items-end">
                              <div
                                className={`w-[55%] mx-auto rounded-full ${
                                  light
                                    ? 'bg-blue-200'
                                    : 'bg-blue-600'
                                }`}
                                style={{ height }}
                              />
                            </div>
                            <div className="mt-2 text-[11px] text-slate-400">
                              {t('dashboard.daysShort.sunday')}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Total Revenue */}
              <section className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
                  <div>
                    <h2 className="text-slate-800 font-semibold text-lg sm:text-xl">{t('dashboard.totalRevenue')}</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">{t('dashboard.compareEarnings')}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      2024
                    </button>
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                      2025
                    </button>
                  </div>
                </div>
                <TotalRevenueChart data2024={lineData2024} data2025={lineData2025} months={lineMonths} />
              </section>

              {/* Chart Order & Daily Traffic */}
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
                {/* Chart Order */}
                <section className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
                    <div>
                      <h2 className="text-slate-800 font-semibold text-lg sm:text-xl">{t('dashboard.chartOrder')}</h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {t('dashboard.chartOrderDesc')}
                      </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4-4 4m0 0-4-4m4 4V4"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {t('dashboard.saveReport')}
                    </button>
                  </div>
                  <ChartOrderArea data={chartOrderData} labels={chartOrderLabels} />
                </section>

                {/* Daily Traffic */}
                <section className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-slate-800 font-semibold text-lg sm:text-xl">{t('dashboard.dailyTraffic')}</h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">{t('dashboard.visitorsDesc')}</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs sm:text-sm font-semibold">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      +2.45%
                    </div>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-800">2.579</div>
                    <div className="text-xs text-slate-500 mt-1">{t('dashboard.visitors')}</div>
                  </div>
                  <DailyTrafficChart data={trafficData} labels={trafficLabels} />
                </section>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border">
              <div className="p-5">
                <div className="text-slate-700 font-semibold mb-4">{t('dashboard.recentTransactions')}</div>
                <div className="flex gap-6 text-sm">
                  <button className="pb-2 border-b-2 border-slate-900 font-semibold">{t('dashboard.allTransactions')}</button>
                  <button className="pb-2 text-slate-500 hover:text-slate-700">{t('dashboard.income')}</button>
                  <button className="pb-2 text-slate-500 hover:text-slate-700">{t('dashboard.expense')}</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-slate-500">
                    <tr className="text-left">
                      <th className="px-6 py-3 font-medium">{t('dashboard.description')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.transactionId')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.type')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.card')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.date')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.amount')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.receipt')}</th>
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
                <button className="text-slate-500 hover:text-slate-700">{t('common.previous')}</button>
                {[1,2,3,4].map((p) => (
                  <button key={p} className={`w-9 h-9 rounded-full ${p === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{p}</button>
                ))}
                <button className="text-slate-500 hover:text-slate-700">{t('common.next')}</button>
              </div>
            </div>

            {/* Account Details */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border">
              <div className="p-5 flex items-center justify-between">
                <div className="text-slate-800 text-lg font-extrabold">{t('dashboard.accountDetails')}</div>
                <div>
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm">
                    {t('dashboard.months.october')}
                    <svg
                      className="w-3 h-3 text-slate-500"
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
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr className="text-left">
                      <th className="px-6 py-3 font-medium">{t('dashboard.accountName')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.subscription')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.comments')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.likes')}</th>
                      <th className="px-6 py-3 font-medium">{t('dashboard.tags')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {accounts.length > 0 ? (
                      accounts.map((acc, i) => (
                        <tr key={acc.id || i} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-full bg-slate-200" />
                              <span className="font-medium text-slate-800">
                                {acc.accountName || acc.name || t('dashboard.userName')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {acc.subscription || acc.sub || t('dashboard.notAvailable')}
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {acc.comments || acc.com || t('dashboard.notAvailable')}
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {acc.likes || acc.like || t('dashboard.notAvailable')}
                          </td>
                          <td className="px-6 py-4 text-slate-700">
                            {acc.tags || acc.tag || t('dashboard.notAvailable')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      [
                        { name: t('dashboard.userName'), sub: '70K', com: '3000', like: '423', tag: '$34,295' },
                        { name: t('dashboard.userName'), sub: '157K', com: '207', like: '423', tag: '$34,295' },
                        { name: t('dashboard.userName'), sub: '57K', com: '1K', like: '423', tag: '$34,295' }
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
                      ))
                    )}
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


