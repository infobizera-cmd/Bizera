import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authAPI, todoAPI } from '../services/api'
import { Icon } from './Dashboard'
import { clearUserData, getUserData } from '../utils/userStorage'
import TopBar from '../components/TopBar'

const Tasks = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [notifOpen, setNotifOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [allTasks, setAllTasks] = useState([]) // Store all tasks for filtering
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isNewTask, setIsNewTask] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Format date for display (ISO to "17 Nov" format)
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return ''
    try {
      const date = new Date(isoDate)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${date.getDate()} ${months[date.getMonth()]}`
    } catch (e) {
      return isoDate
    }
  }

  // Format date for API (to ISO format)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return new Date().toISOString()
    try {
      return new Date(dateString).toISOString()
    } catch (e) {
      return new Date().toISOString()
    }
  }

  // Load todos from backend
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true)
        setError('')
        const userData = getUserData()
        const userId = userData?.userId || localStorage.getItem('bizera_userId')
        
        if (!userId) {
          setError('İstifadəçi ID tapılmadı. Zəhmət olmasa yenidən daxil olun.')
          setLoading(false)
          return
        }

        const response = await todoAPI.getTodos(userId)
        if (response?.data) {
          // Transform backend data to frontend format
          const transformedTasks = Array.isArray(response.data) 
            ? response.data.map((todo) => ({
                id: todo.id,
                title: todo.title || '',
                time: todo.startTime || '09:00',
                date: formatDateForDisplay(todo.date),
                tag: todo.category || 'Work',
                done: todo.isCompleted || false,
                // Keep original data for API calls
                originalDate: todo.date,
                originalStartTime: todo.startTime,
                originalEndTime: todo.endTime,
                originalCategory: todo.category
              }))
            : []
          setAllTasks(transformedTasks)
          setTasks(transformedTasks)
        }
      } catch (err) {
        console.error('Error loading todos:', err)
        setError(err.message || 'Todo-ları yükləmək mümkün olmadı.')
      } finally {
        setLoading(false)
      }
    }

    loadTodos()
  }, [])

  // Filter tasks by selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = allTasks.filter((task) => {
        if (!task.originalDate) return false
        const taskDate = new Date(task.originalDate)
        const selected = new Date(selectedDate)
        return (
          taskDate.getDate() === selected.getDate() &&
          taskDate.getMonth() === selected.getMonth() &&
          taskDate.getFullYear() === selected.getFullYear()
        )
      })
      setTasks(filtered)
    } else {
      setTasks(allTasks)
    }
  }, [selectedDate, allTasks])

  const toggleTask = async (id) => {
    try {
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      const userData = getUserData()
      const userId = userData?.userId || localStorage.getItem('bizera_userId')
      
      if (!userId) {
        setError('İstifadəçi ID tapılmadı.')
        return
      }

      // Update task in backend
      await todoAPI.updateTodo(id, userId, {
        title: task.title,
        isCompleted: !task.done,
        date: task.originalDate || formatDateForAPI(new Date()),
        startTime: task.originalStartTime || task.time,
        endTime: task.originalEndTime || task.time,
        category: task.originalCategory || task.tag
      })

      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      )
    } catch (err) {
      console.error('Error toggling task:', err)
      setError(err.message || 'Tapşırığı yeniləmək mümkün olmadı.')
    }
  }

  const deleteTask = async (id) => {
    try {
      const userData = getUserData()
      const userId = userData?.userId || localStorage.getItem('bizera_userId')
      
      if (!userId) {
        setError('İstifadəçi ID tapılmadı.')
        return
      }

      await todoAPI.deleteTodo(id, userId)
      
      // Remove from local state
      setTasks((prev) => prev.filter((t) => t.id !== id))
      setAllTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      setError(err.message || 'Tapşırığı silmək mümkün olmadı.')
      showToast('Tapşırıq silinərkən xəta baş verdi', 'error')
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const openAddTaskModal = () => {
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    
    setEditingTask({
      id: null,
      title: 'New Task',
      date: formattedDate,
      startTime: '09:00',
      endTime: '10:00',
      category: 'Work'
    })
    setIsNewTask(true)
    setEditModalOpen(true)
  }

  const openEditModal = (task) => {
    setEditingTask({
      id: task.id,
      title: task.title,
      date: task.originalDate ? new Date(task.originalDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      startTime: task.originalStartTime || task.time || '09:00',
      endTime: task.originalEndTime || task.time || '10:00',
      category: task.originalCategory || task.tag || 'Work'
    })
    setIsNewTask(false)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditingTask(null)
    setIsNewTask(false)
  }

  const handleEditTask = async (e) => {
    e.preventDefault()
    try {
      const userData = getUserData()
      const userId = userData?.userId || localStorage.getItem('bizera_userId')
      
      if (!userId || !editingTask) {
        setError('İstifadəçi ID tapılmadı.')
        return
      }

      if (isNewTask) {
        // Create new task
        const newTask = {
          title: editingTask.title,
          date: formatDateForAPI(editingTask.date),
          startTime: editingTask.startTime,
          endTime: editingTask.endTime,
          category: editingTask.category
        }

        const response = await todoAPI.createTodo(userId, newTask)
        
        if (response?.data) {
          showToast('Tapşırıq uğurla əlavə edildi!', 'success')
        }
      } else {
        // Update existing task
        const updatedTask = {
          title: editingTask.title,
          isCompleted: tasks.find(t => t.id === editingTask.id)?.done || false,
          date: formatDateForAPI(editingTask.date),
          startTime: editingTask.startTime,
          endTime: editingTask.endTime,
          category: editingTask.category
        }

        await todoAPI.updateTodo(editingTask.id, userId, updatedTask)
        showToast('Tapşırıq uğurla yeniləndi!', 'success')
      }
      
      // Reload todos
      const todosResponse = await todoAPI.getTodos(userId)
      if (todosResponse?.data) {
        const transformedTasks = Array.isArray(todosResponse.data) 
          ? todosResponse.data.map((todo) => ({
              id: todo.id,
              title: todo.title || '',
              time: todo.startTime || '09:00',
              date: formatDateForDisplay(todo.date),
              tag: todo.category || 'Work',
              done: todo.isCompleted || false,
              originalDate: todo.date,
              originalStartTime: todo.startTime,
              originalEndTime: todo.endTime,
              originalCategory: todo.category
            }))
          : []
        setAllTasks(transformedTasks)
        setTasks(transformedTasks)
      }
      
      closeEditModal()
    } catch (err) {
      console.error('Error saving task:', err)
      setError(err.message || 'Tapşırığı yadda saxlaq mümkün olmadı.')
      showToast(isNewTask ? 'Tapşırıq əlavə edilərkən xəta baş verdi' : 'Tapşırıq yenilənərkən xəta baş verdi', 'error')
    }
  }

  const openDeleteConfirm = (task) => {
    setTaskToDelete(task)
    setDeleteConfirmOpen(true)
  }

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false)
    setTaskToDelete(null)
  }

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id)
      showToast('Tapşırıq uğurla silindi!', 'success')
      closeDeleteConfirm()
    }
  }

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
      localStorage.removeItem('bizera_userId')
      clearUserData()
      // Cookie will be cleared by backend on logout
      navigate('/login', { replace: true })
    }
  }

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Adjust for Monday as first day (0 = Monday, 6 = Sunday)
    const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1
    
    const days = []
    
    // Add previous month's days
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = adjustedStartingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      })
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      })
    }
    
    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      })
    }
    
    return days
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    )
  }

  const hasTasks = (date) => {
    return allTasks.some((task) => {
      if (!task.originalDate) return false
      const taskDate = new Date(task.originalDate)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  const formatMonthYear = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[date.getMonth()]} ${date.getFullYear()}`
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
            <div className="text-2xl font-extrabold tracking-tight text-[#002750] dark:text-white">
              BizEra
            </div>
            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              aria-label="Close menu"
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
            {/* Page title + main action */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003A70]">
                {t('tasks.title')}
              </h1>
              <button 
                onClick={openAddTaskModal}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-[#003A70] text-white text-xs sm:text-sm font-semibold pl-3 pr-4 py-2 shadow-sm hover:bg-[#02498f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-base leading-none">
                  +
                </span>
                <span>{t('tasks.addNew')}</span>
              </button>
            </div>

            {/* Calendar title */}
            <h2 className="text-lg font-semibold text-slate-800 mb-4 sm:mb-5">
              {t('tasks.calendar')}
            </h2>

            {/* Calendar + small month card */}
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2.3fr)_minmax(0,1.1fr)] gap-5">
              {/* Left main calendar */}
              <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-5">
                  <div className="flex items-center gap-4 text-sm text-slate-700">
                    <button 
                      type="button"
                      onClick={handlePrevMonth}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50"
                    >
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
                    <span className="font-semibold text-slate-800">{formatMonthYear(currentDate)}</span>
                    <button 
                      type="button"
                      onClick={handleNextMonth}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50"
                    >
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
                    {t('tasks.last2Weeks')}
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
                    {/* Calendar Grid Header */}
                    <div className="grid grid-cols-[80px_repeat(15,minmax(0,1fr))] text-[11px] text-slate-400 mb-2">
                      <div className="px-2 py-1">Time</div>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((d) => (
                        <div key={d} className="px-2 py-1 text-center">
                          {d}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid Body */}
                    <div className="relative border border-slate-100 rounded-xl bg-gradient-to-b from-slate-50 to-white">
                      {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map(
                        (t, idx) => {
                          const year = currentDate.getFullYear()
                          const month = currentDate.getMonth()
                          
                          return (
                            <div
                              key={t}
                              className="grid grid-cols-[80px_repeat(15,minmax(0,1fr))] text-[11px] text-slate-400"
                            >
                              <div className="px-2 py-6 border-t border-slate-100">{t}</div>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((dayNum) => {
                                const dayDate = new Date(year, month, dayNum)
                                const dayHasTasks = hasTasks(dayDate)
                                const dayIsSelected = isSelected(dayDate)
                                
                                return (
                                  <div
                                    key={dayNum}
                                    className={`border-t border-l border-slate-100 relative ${
                                      idx === 0 ? 'first:rounded-tr-xl' : ''
                                    } ${dayIsSelected ? 'bg-blue-50/50' : ''}`}
                                  >
                                    {dayHasTasks && (
                                      <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#003A70]" />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )
                        }
                      )}

                      {/* Render tasks on calendar grid */}
                      <div className="absolute inset-0 pointer-events-none overflow-visible">
                        {(() => {
                          const year = currentDate.getFullYear()
                          const month = currentDate.getMonth()
                          
                          return allTasks
                            .filter((task) => {
                              if (!task.originalDate) return false
                              const taskDate = new Date(task.originalDate)
                              return (
                                taskDate.getMonth() === month &&
                                taskDate.getFullYear() === year &&
                                taskDate.getDate() >= 1 &&
                                taskDate.getDate() <= 15
                              )
                            })
                            .map((task) => {
                              if (!task.originalDate) return null
                              const taskDate = new Date(task.originalDate)
                              const dayIndex = taskDate.getDate() - 1
                              const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']
                              const timeIndex = timeSlots.findIndex((t) => t === task.time)
                              
                              if (dayIndex < 0 || dayIndex >= 15 || timeIndex < 0) return null
                              
                              // Calculate position using percentage-based positioning
                              const dayPercent = (dayIndex / 15) * 100
                              const timeRowHeight = 68 // Approximate row height
                              const topOffset = 24 + (timeIndex * timeRowHeight) + 2
                              
                              // Determine task width (can span multiple days based on endTime)
                              let daySpan = 1
                              if (task.originalEndTime) {
                                const startTime = task.time
                                const endTime = task.originalEndTime
                                const startHour = parseInt(startTime.split(':')[0])
                                const endHour = parseInt(endTime.split(':')[0])
                                daySpan = Math.max(1, Math.ceil((endHour - startHour) / 1))
                              }
                              
                              const colors = [
                                'bg-indigo-500/90',
                                'bg-slate-500/90',
                                'bg-amber-400',
                                'bg-indigo-600',
                                'bg-slate-500'
                              ]
                              const colorIndex = task.id % colors.length
                              
                              return (
                                <div
                                  key={task.id}
                                  className={`absolute rounded-lg ${colors[colorIndex]} text-white text-xs flex items-center px-3 shadow-sm pointer-events-auto cursor-pointer hover:opacity-80`}
                                  style={{
                                    left: `calc(80px + ${dayPercent}% + 2px)`,
                                    top: `${topOffset}px`,
                                    width: `calc(${(daySpan / 15) * 100}% - 4px)`,
                                    minWidth: '120px',
                                    height: '36px'
                                  }}
                                >
                                  {task.title.length > 25 ? `${task.title.substring(0, 25)}...` : task.title}
                                </div>
                              )
                            })
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side small month calendar */}
              <div className="rounded-[26px] bg-[#F5FBFF] border border-[#E0ECFA] shadow-sm p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-[#003A70]"
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
                  <div className="text-center text-lg font-extrabold text-[#003A70]">
                    {formatMonthYear(currentDate)}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 text-[#003A70]"
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
                  {getDaysInMonth(currentDate).map((dayObj, idx) => {
                    const dayDate = dayObj.date
                    const dayIsToday = isToday(dayDate)
                    const dayIsSelected = isSelected(dayDate)
                    const dayHasTasks = hasTasks(dayDate)
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDateClick(dayDate)}
                        className="flex items-center justify-center py-1"
                      >
                        <div
                          className={`relative flex items-center justify-center w-8 h-8 rounded-full text-[11px] transition-colors ${
                            dayIsToday
                              ? 'bg-[#003A70] text-white shadow-sm'
                              : dayIsSelected
                              ? 'border border-[#003A70] text-[#003A70] bg-white'
                              : dayObj.isCurrentMonth
                              ? 'text-slate-600 hover:bg-slate-100'
                              : 'text-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          {dayObj.day}
                          {dayHasTasks && !dayIsToday && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#003A70]" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
                {selectedDate && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="mt-3 text-xs text-[#003A70] hover:underline"
                  >
                    {t('tasks.showAllTasks')}
                  </button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Tasks List */}
            <section className="mt-8 bg-white rounded-2xl shadow-sm border">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800">{t('tasks.tasksList')}</h2>
              </div>
              {loading ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  {t('tasks.loading')}
                </div>
              ) : tasks.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-500">
                  {t('tasks.noTasks')}
                </div>
              ) : (
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
                        <button 
                          type="button"
                          onClick={() => openEditModal(task)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        >
                          <Icon.edit className="w-4 h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => openDeleteConfirm(task)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 bg-white text-rose-500 hover:bg-rose-50"
                        >
                          <Icon.trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              )}
            </section>

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
                  className={`w-5 h-5 ${toast.type === 'success' ? 'text-white' : 'text-white'}`}
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

            {/* Edit Modal */}
            {editModalOpen && editingTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">
                      {isNewTask ? 'Yeni Tapşırıq Yarat' : 'Tapşırığı Redaktə Et'}
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
                  
                  <form onSubmit={handleEditTask} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Başlıq
                      </label>
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tarix
                      </label>
                      <input
                        type="date"
                        value={editingTask.date}
                        onChange={(e) => setEditingTask({ ...editingTask, date: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Başlama Vaxtı
                        </label>
                        <input
                          type="time"
                          value={editingTask.startTime}
                          onChange={(e) => setEditingTask({ ...editingTask, startTime: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Bitmə Vaxtı
                        </label>
                        <input
                          type="time"
                          value={editingTask.endTime}
                          onChange={(e) => setEditingTask({ ...editingTask, endTime: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Kateqoriya
                      </label>
                      <select
                        value={editingTask.category}
                        onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                        required
                      >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Important">Important</option>
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
            {deleteConfirmOpen && taskToDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Tapşırığı Sil</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Bu tapşırığı silmək istədiyinizə əminsiniz?
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-slate-800">{taskToDelete.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {taskToDelete.date} • {taskToDelete.time} • {taskToDelete.tag}
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
        </main>
      </div>
    </div>
  )
}

export default Tasks


