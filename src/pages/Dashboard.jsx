import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../services/api'
import { clearUserData, getUserData } from '../utils/userStorage'

export const Icon = {
  sidebarDashboard: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path
        d="M12 7v4.2L14.5 13"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sidebarProducts: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M12 2.5L4 6.5v11l8 4 8-4v-11L12 2.5z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 6.5l8 4 8-4M12 10.5v11"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sidebarSales: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M4 19.5h16"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M6 15.5l3.5-4 3 3 5.5-7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="15.5" r="1" fill="currentColor" />
      <circle cx="9.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="12.5" cy="14.5" r="1" fill="currentColor" />
      <circle cx="18" cy="7.5" r="1" fill="currentColor" />
    </svg>
  ),
  sidebarTasks: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect
        x="6"
        y="4"
        width="12"
        height="16"
        rx="2"
        strokeWidth="1.6"
      />
      <path
        d="M9 3.5h6"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9 9.5h6M9 13.5h4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 9.5l1 1.2 2-2.7"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sidebarCustomers: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="9" cy="9" r="3" strokeWidth="1.6" />
      <path
        d="M4.5 18.5C5.3 16 7 14.5 9 14.5s3.7 1.5 4.5 4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.5" strokeWidth="1.6" />
      <path
        d="M14.5 17c.7-1.8 2-2.9 3.5-2.9 1.2 0 2.3.6 3 1.9"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  sidebarExpenses: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2.5"
        strokeWidth="1.6"
      />
      <path
        d="M3 10h18"
        strokeWidth="1.6"
      />
      <rect
        x="6.5"
        y="12.5"
        width="4"
        height="3"
        rx="1"
        strokeWidth="1.4"
      />
      <circle cx="17" cy="13.5" r="1" fill="currentColor" />
    </svg>
  ),
  sidebarSettings: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="3.2" strokeWidth="1.6" />
      <path
        d="M19.4 13.5l1-1.7-1-1.8-2 .1a4.7 4.7 0 00-.7-1.2l1.1-1.7-1.4-1.4-1.7 1.1a4.7 4.7 0 00-1.2-.7l-.1-2h-2l-.1 2a4.7 4.7 0 00-1.2.7L7 5.8 5.6 7.2l1.1 1.7a4.7 4.7 0 00-.7 1.2l-2-.1-1 1.8 1 1.7 2-.1a4.7 4.7 0 00.7 1.2L5.6 18l1.4 1.4 1.7-1.1a4.7 4.7 0 001.2.7l.1 2h2l.1-2a4.7 4.7 0 001.2-.7l1.7 1.1 1.4-1.4-1.1-1.7a4.7 4.7 0 00.7-1.2z"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sidebarLogout: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M10 5H6.8A2.8 2.8 0 004 7.8v8.4A2.8 2.8 0 006.8 19H10"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 8l3 4-3 4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 12H17"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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
    indigo: 'bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-100 text-amber-500',
    emerald: 'bg-emerald-100 text-emerald-500',
    rose: 'bg-rose-100 text-rose-500'
  }[tone]

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4">
      <div
        className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${toneClasses}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">{value}</div>
        <div
          className={`text-xs sm:text-sm mt-1 ${
            trendType === 'down' ? 'text-rose-500' : 'text-emerald-600'
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
  const [notifOpen, setNotifOpen] = useState(false)

  const transactions = useMemo(
    () => [
    { dir: 'up', desc: 'Spotify Subscription', id: '#12548796', type: 'Shopping', card: '1234 ****', date: '28 Jan, 12.30 AM', amount: -2500 },
    { dir: 'down', desc: 'Freepik Sales', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '25 Jan, 10.40 PM', amount: 750 },
    { dir: 'up', desc: 'Mobile Service', id: '#12548796', type: 'Service', card: '1234 ****', date: '20 Jan, 10.40 PM', amount: -150 },
    { dir: 'up', desc: 'Wilson', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '15 Jan, 03.29 PM', amount: -1050 },
    { dir: 'down', desc: 'Emilly', id: '#12548796', type: 'Transfer', card: '1234 ****', date: '14 Jan, 10.40 PM', amount: 840 }
    ],
    []
  )

  const lineData2024 = useMemo(
    () => [15000, 22000, 14000, 26000, 34000, 29000, 31000, 27000, 23000, 12657, 21000, 24000],
    []
  )
  const lineData2025 = useMemo(
    () => [12000, 18000, 20000, 23000, 32000, 38753, 36000, 30000, 26000, 28000, 29000, 33000],
    []
  )
  const lineMonths = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    []
  )

  const chartOrderData = useMemo(() => [180, 260, 210, 240, 280, 250, 290], [])
  const chartOrderLabels = useMemo(
    () => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    []
  )

  const trafficData = useMemo(() => [40, 22, 80, 60, 50, 72, 90], [])
  const trafficLabels = useMemo(() => ['00', '04', '08', '12', '14', '16', '18'], [])

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
      clearUserData()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200">
          {/* Logo section */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-200">
            <div className="text-2xl font-extrabold tracking-tight text-[#002750]">
              BizEra
            </div>
          </div>

          {/* Menu items – one‑to‑one with Figma */}
          <nav className="flex-1 flex flex-col text-[15px] font-semibold">
            {/* Yuxarı əsas menyu elementləri (Tənzimləmələr daxil) */}
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

            {/* Aşağıda yalnız bir böyük Çıxış düyməsi */}
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-6">Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title="Ümumi istifadəçi"
                value="40,689"
                trend="+8.5% Dünəndən yuxarı"
                trendType="up"
                tone="indigo"
                icon={<Icon.user className="w-6 h-6" />}
              />
              <StatCard
                title="Ümumi sifariş"
                value="10,293"
                trend="+1.3% keçən həftədən yuxarı"
                trendType="up"
                tone="amber"
                icon={<Icon.cube className="w-6 h-6" />}
              />
              <StatCard
                title="Ümumi satış"
                value="$89,000"
                trend="-4.3% Dünəndən aşağı"
                trendType="down"
                tone="emerald"
                icon={<Icon.chart className="w-6 h-6" />}
              />
              <StatCard
                title="Ümumi gözləyən"
                value="2040"
                trend="+1.8% Dünəndən yuxarı"
                trendType="up"
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
                    Pie Chart
                  </h2>
                  <div className="flex flex-wrap justify-around gap-4 sm:gap-5 md:gap-6">
                    <DonutPie percent={81} label="Total Order" color="red" />
                    <DonutPie
                      percent={22}
                      label="Customer Growth"
                      color="green"
                    />
                    <DonutPie
                      percent={62}
                      label="Total Revenue"
                      color="blue"
                    />
                  </div>
                </div>

                {/* Customer Map bar chart */}
                <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 md:p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <h2 className="text-slate-800 font-semibold text-lg sm:text-xl">
                      Customer Map
                    </h2>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm text-slate-700"
                    >
                      Weekly
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
                              Sun
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
                    <h2 className="text-slate-800 font-semibold text-lg sm:text-xl">Total Revenue</h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Compare your earnings between 2024 and 2025.</p>
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
                      <h2 className="text-slate-800 font-semibold text-lg sm:text-xl">Chart Order</h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Lorem ipsum dolor sit amet, consectetur adip.
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
                      Save Report
                    </button>
                  </div>
                  <ChartOrderArea data={chartOrderData} labels={chartOrderLabels} />
                </section>

                {/* Daily Traffic */}
                <section className="bg-white rounded-2xl shadow-sm border p-4 sm:p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-slate-800 font-semibold text-lg sm:text-xl">Daily Traffic</h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">Visitors for your store today.</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs sm:text-sm font-semibold">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      +2.45%
                    </div>
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <div className="text-2xl sm:text-3xl font-bold text-slate-800">2.579</div>
                    <div className="text-xs text-slate-500 mt-1">Visitors</div>
                  </div>
                  <DailyTrafficChart data={trafficData} labels={trafficLabels} />
                </section>
              </div>
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
                  <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm">
                    Oktyabr
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


