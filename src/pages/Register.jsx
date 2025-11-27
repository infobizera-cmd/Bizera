import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import bizeraLogo from '../assets/bizera.png'
import bizeraLogoMobile from '../assets/bizera2.png'
import { authAPI } from '../services/api'
import { saveUserData } from '../utils/userStorage'
// import FeatureCard from '../components/FeatureCard'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    businessCategory: '',
    businessName: '',
    birthDate: '',
    phoneNumber: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const businessCategories = useMemo(() => [
    t('auth.selectCategory'),
    'Retail',
    'E-commerce',
    'SaaS',
    'Fintech',
    'Healthcare',
    'Education',
    'Other'
  ], [t])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setError('')
    setIsLoading(true)

    try {
      // Validate business category
      if (!formData.businessCategory || formData.businessCategory === t('auth.selectCategory')) {
        throw new Error(t('auth.registerError'))
      }

      const response = await authAPI.register({
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim(),
        password: formData.password,
        businessCategory: formData.businessCategory,
        businessName: formData.businessName.trim(),
        birthDate: formData.birthDate,
        phoneNumber: formData.phoneNumber.trim()
      })

      // Check if registration was successful (200 or 201 status)
      if (response.status === 200 || response.status === 201) {
        // Save user data to localStorage
        const userId = response.data?.user?.id || response.data?.user?.userId || response.data?.userId
        saveUserData({
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          email: formData.email.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          birthDate: formData.birthDate,
          businessName: formData.businessName.trim(),
          businessCategory: formData.businessCategory,
          role: t('common.admin'), // Default role
          userId: userId
        })

        // Store userId separately for easy access
        if (userId) {
          localStorage.setItem('bizera_userId', userId)
        }

        // Store token if provided by backend
        if (response.data?.token) {
          localStorage.setItem('bizera_token', response.data.token)
          localStorage.setItem('bizera_auth', 'true')
          // If token provided, go directly to dashboard
          navigate('/dashboard', { replace: true })
        } else {
          // If no token, redirect to login page with email pre-filled
          // User needs to login after registration
          const email = encodeURIComponent(formData.email.trim())
          navigate(`/login?registered=true&email=${email}`, { replace: true })
        }
      } else {
        throw new Error(t('auth.registerError'))
      }
    } catch (err) {
      setError(err.message || t('auth.registerError'))
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
    BizEra ilə yeni biznesinə start ver
  </h1>
  <p className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl leading-relaxed drop-shadow-md">
    Şəxsi panelini yaradaraq komandana axsmart analitik dünyanı aç.
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

      {/* Right Panel - Register Form */}
      <div className="bg-gray-50 w-full lg:flex-1 min-h-screen lg:min-h-0 flex flex-col items-center justify-start lg:justify-center pt-5 sm:pt-6 md:pt-7 p-4 sm:p-6 md:p-8 lg:p-11 overflow-hidden">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex justify-center mb-5 sm:mb-6 md:mb-7 lg:hidden">
            <img 
              src={bizeraLogoMobile} 
              alt="BizEra Logo" 
              className="h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 w-auto"
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-7">
            <Link
              to="/login"
              className="flex-1 bg-gray-100 text-gray-600 text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl font-semibold text-sm sm:text-base transition-colors hover:bg-gray-200"
            >
              {t('auth.login')}
            </Link>
            <Link
              to="/register"
              className="flex-1 gradient-primary text-white text-center py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl font-semibold text-sm sm:text-base transition-opacity hover:opacity-90 shadow-md"
            >
              {t('auth.register')}
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            {/* Name and Surname Row */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-gray-900 text-xs sm:text-sm font-bold mb-1.5">
                  {t('auth.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('auth.name')}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Surname Field */}
              <div>
                <label htmlFor="surname" className="block text-gray-900 text-xs sm:text-sm font-bold mb-1.5">
                  {t('auth.surname')}
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder={t('auth.surname')}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-900 text-xs sm:text-sm font-bold mb-1.5">
                {t('auth.emailAddress')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@bizera.ai"
                className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-900 text-xs sm:text-sm font-bold mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ultra təhlükəsiz şifrə"
                  className="w-full pr-10 px-3 sm:px-3.5 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all placeholder:text-gray-400"
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
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a3 3 0 004.24 4.24" />
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M9.88 5.09A10.33 10.33 0 0112 5c7 0 10 7 10 7a17.6 17.6 0 01-5.06 5.94M6.61 6.61A17.89 17.89 0 002 12s3 7 10 7a10.4 10.4 0 004.39-.91" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Business Category and Name Row */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              {/* Business Category Field */}
              <div>
                <label htmlFor="businessCategory" className="block text-gray-900 text-xs sm:text-sm font-bold mb-1.5">
                  {t('auth.businessCategory')}
                </label>
                <div className="relative">
                  <select
                    id="businessCategory"
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm appearance-none cursor-pointer transition-all text-gray-700"
                    required
                  >
                    {businessCategories.map((category, index) => (
                      <option key={index} value={category === t('auth.selectCategory') ? '' : category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Business Name Field */}
              <div>
                <label htmlFor="businessName" className="block text-gray-900 text-xs sm:text-sm font-bold mb-1.5">
                  {t('auth.businessName')}
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="BizEra Store"
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Birth Date and Phone Row */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              {/* Birth Date Field */}
              <div>
                <label htmlFor="birthDate" className="block text-gray-900 text-xs sm:text-sm font-bold mb-1.5">
                  {t('auth.birthDate')}
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all text-gray-700"
                  required
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-900 text-xs sm:text-sm font-bold mb-1.5">
                  {t('auth.phoneNumber')}
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+994"
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm transition-all placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-primary text-white py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base transition-opacity hover:opacity-90 shadow-lg mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('common.loading') : t('auth.createAccount')}
            </button>

            {/* Login Link */}
            <Link
              to="/login"
              className="block w-full bg-white border-2 border-gray-300 text-gray-700 py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base text-center transition-colors hover:bg-gray-50 mt-3"
            >
              {t('auth.alreadyHaveAccount')}
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register