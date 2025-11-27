import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import bizeraLogo from '../assets/bizera.png'
import bizeraLogoMobile from '../assets/bizera2.png'
import { authAPI } from '../services/api'
import { saveUserData, getUserData } from '../utils/userStorage'
// import FeatureCard from '../components/FeatureCard'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Check for registration success and email from query params
  useEffect(() => {
    const registered = searchParams.get('registered')
    const email = searchParams.get('email')
    
    if (registered === 'true' && email) {
      setSuccessMessage('Qeydiyyat uğurla tamamlandı! İndi daxil ola bilərsiniz.')
      setFormData(prev => ({
        ...prev,
        email: decodeURIComponent(email)
      }))
      // Clear query params from URL without navigation
      window.history.replaceState({}, '', '/login')
    }
  }, [searchParams])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error and success message when user types
    if (error) setError('')
    if (successMessage) setSuccessMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const email = formData.email.trim()
      const password = formData.password

      if (!email || !password) {
        throw new Error('Zəhmət olmasa email və şifrəni daxil edin')
      }

      const response = await authAPI.login(email, password)
      console.log('Login response:', response)
      console.log('Response status:', response?.status)

      // Mark as authenticated if response is successful (200 or 201)
      // With cookie-based auth, token is stored in cookie automatically by backend
      if (response?.status === 200 || response?.status === 201) {
        // Cookie-based authentication - token is automatically stored in cookie by backend
        // We just need to mark user as authenticated
        localStorage.setItem('bizera_auth', 'true')
        console.log('User authenticated - cookie should be stored by backend')
        
        // Wait a bit for cookie to be set, then check
        setTimeout(() => {
          const cookies = document.cookie
          if (!cookies || cookies.length === 0) {
            console.warn('⚠️ WARNING: No cookies found after login!')
            console.warn('Backend cookie set etməlidir. Network tab-da Set-Cookie header-ını yoxlayın.')
          } else {
            console.log('✅ Cookies found after login')
          }
        }, 500)
        
        // Store rememberMe preference
        if (formData.rememberMe) {
          localStorage.setItem('bizera_rememberMe', 'true')
        } else {
          localStorage.removeItem('bizera_rememberMe')
        }

        // Save or update user data from API response
        if (response?.data?.user) {
          saveUserData({
            ...response.data.user,
            email: response.data.user.email || email,
            userId: response.data.user.id || response.data.user.userId || response.data.userId
          })
          if (response.data.user.id || response.data.user.userId || response.data.userId) {
            localStorage.setItem('bizera_userId', response.data.user.id || response.data.user.userId || response.data.userId)
          }
        } else if (response?.data?.userId) {
          localStorage.setItem('bizera_userId', response.data.userId)
          const existingData = getUserData()
          if (existingData) {
            saveUserData({
              ...existingData,
              userId: response.data.userId
            })
          }
        } else {
          const existingData = getUserData()
          if (!existingData) {
            const emailParts = email.split('@')
            const name = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1)
            saveUserData({
              name: name,
              surname: '',
              email: email,
              role: 'Admin'
            })
          }
        }
        
        // Navigate to dashboard on success
        navigate('/dashboard', { replace: true })
      } else {
        throw new Error('Daxil olma uğursuz oldu. Zəhmət olmasa yenidən cəhd edin.')
      }
    } catch (err) {
      console.error('Login error:', err)
      
      // Handle different error formats
      let errorMsg = 'Daxil olma uğursuz oldu. Zəhmət olmasa email və şifrəni yoxlayın.'
      
      if (err.message) {
        errorMsg = err.message
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error
      } else if (typeof err === 'string') {
        errorMsg = err
      }
      
      // Handle specific error cases
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        errorMsg = 'Email və ya şifrə yanlışdır. Zəhmət olmasa yenidən cəhd edin.'
      } else if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
        errorMsg = 'İstifadəçi tapılmadı. Zəhmət olmasa email ünvanınızı yoxlayın.'
      } else if (errorMsg.includes('400') || errorMsg.includes('Bad Request')) {
        errorMsg = 'Email və ya şifrə düzgün deyil. Zəhmət olmasa yenidən cəhd edin.'
      }
      
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Marketing Section */}
      <div className="hidden lg:flex gradient-primary flex-1 flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mb-8 lg:mb-0">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 md:p-3.5 lg:p-4 flex items-center justify-center">
            <img 
              src={bizeraLogo} 
              alt="BizEra Logo" 
              className="h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 w-auto"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">BizEra</span>
            <span className="text-white/80 text-sm sm:text-base md:text-lg">Ultra Analytics Platform</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center my-8 lg:my-0">
  <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-5 sm:mb-6 md:mb-7 leading-tight tracking-tight drop-shadow-lg">
    Gəl, BizEra ilə davam edək
  </h1>
  <p className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl leading-relaxed drop-shadow-md">
    Panelinə daxil ol və real-time analitika dalğasını yenidən hiss et.
  </p>
</div>


        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-8 lg:mt-0">
          <FeatureCard 
            label="AI INSIGHT" 
            value="+35%" 
            subtitle="Growth prediction boost"
          />
          <FeatureCard 
            label="BIZSCORE" 
            value="92" 
            subtitle="Stability index"
          />
        </div> */}
      </div>

      {/* Right Panel - Login Form */}
      <div className="bg-gray-50 w-full lg:flex-1 min-h-screen lg:min-h-0 flex flex-col items-center justify-start lg:justify-center pt-6 sm:pt-8 md:pt-10 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:hidden">
            <img 
              src={bizeraLogoMobile} 
              alt="BizEra Logo" 
              className="h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 w-auto"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12">
            <Link
              to="/login"
              className="flex-1 gradient-primary text-white text-center py-3 sm:py-3.5 px-4 rounded-2xl font-semibold text-base sm:text-lg transition-opacity hover:opacity-90 shadow-md"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex-1 bg-gray-100 text-gray-600 text-center py-3 sm:py-3.5 px-4 rounded-2xl font-semibold text-base sm:text-lg transition-colors hover:bg-gray-200"
            >
              Register
            </Link>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form 
            onSubmit={handleSubmit} 
            className="space-y-5 sm:space-y-6"
            noValidate
          >
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-900 text-sm sm:text-base font-bold mb-2.5">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@bizera.ai"
                className="w-full px-4 py-3 sm:py-3.5 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all placeholder:text-gray-400"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-900 text-sm sm:text-base font-bold mb-2.5">
                Şifrə
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Şifrənizi daxil edin"
                  className="w-full pr-11 px-4 py-3 sm:py-3.5 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base transition-all placeholder:text-gray-400"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Şifrəni gizlə' : 'Şifrəni göstər'}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a3 3 0 004.24 4.24" />
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A10.33 10.33 0 0112 5c7 0 10 7 10 7a17.6 17.6 0 01-5.06 5.94M6.61 6.61A17.89 17.89 0 002 12s3 7 10 7a10.4 10.4 0 004.39-.91" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="ml-2.5 text-gray-800 text-sm sm:text-base font-medium group-hover:text-gray-900">Məni yadda saxla</span>
              </label>
              <Link
                to="#"
                className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-bold transition-colors"
              >
                Şifrəni unutdun?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-primary text-white py-4 sm:py-4.5 md:py-5 rounded-lg font-bold text-base sm:text-lg md:text-xl transition-opacity hover:opacity-90 shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Yüklənir...' : 'Daxil ol'}
            </button>

            {/* Create Account Button */}
            <Link
              to="/register"
              className="block w-full bg-white border-2 border-gray-300 text-gray-700 py-4 sm:py-4.5 md:py-5 rounded-lg font-bold text-base sm:text-lg md:text-xl text-center transition-colors hover:bg-gray-50 mt-3"
            >
              Yeni hesab yarat
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login