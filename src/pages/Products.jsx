import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authAPI, productStockAPI } from '../services/api'
import { Icon } from './Dashboard'
import { clearUserData } from '../utils/userStorage'
import TopBar from '../components/TopBar'

const Products = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Parse colors from string to array
  const parseColors = (colorsString) => {
    if (!colorsString) return []
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(colorsString)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // If not JSON, try comma-separated
      if (typeof colorsString === 'string') {
        return colorsString.split(',').map(c => c.trim()).filter(c => c)
      }
    }
    return []
  }

  // Convert colors array to string
  const colorsToString = (colors) => {
    if (!Array.isArray(colors)) return ''
    return JSON.stringify(colors)
  }

  // Load products from backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Check if user is authenticated (cookie-based auth)
        const isAuthenticated = localStorage.getItem('bizera_auth') === 'true'
        if (!isAuthenticated) {
          setError(t('products.notAuthenticated'))
          setLoading(false)
          return
        }
        
        // Cookie-based auth - token is automatically sent in cookie
        const response = await productStockAPI.getProducts()
        if (response?.data && Array.isArray(response.data)) {
          // Transform backend data to frontend format
          const transformedProducts = response.data.map((product) => ({
            id: product.id,
            name: product.name || '',
            category: product.category || '',
            price: product.price || 0,
            qty: product.count || 0,
            colors: parseColors(product.availableColors),
            // Keep original data for API calls
            originalAvailableColors: product.availableColors
          }))
          setProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Error loading products:', err)
        // Don't logout on 401, just show error
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setError(t('products.tokenExpired'))
        } else {
          setError(err.message || t('products.errorLoading'))
        }
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [t])

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 3000)
  }

  const openAddProductModal = () => {
    setEditingProduct({
      id: null,
      name: '',
      category: '',
      price: 0,
      count: 0,
      availableColors: '',
      colors: []
    })
    setIsNewProduct(true)
    setEditModalOpen(true)
  }

  const openEditModal = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name || '',
      category: product.category || '',
      price: product.price || 0,
      count: product.qty || 0,
      availableColors: product.originalAvailableColors || '',
      colors: product.colors || []
    })
    setIsNewProduct(false)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditingProduct(null)
    setIsNewProduct(false)
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    try {
      if (!editingProduct) return

      // Check if user is authenticated (cookie-based auth)
      const isAuthenticated = localStorage.getItem('bizera_auth') === 'true'
      
      if (!isAuthenticated) {
        setError(t('products.notAuthenticated'))
        showToast(t('products.notAuthenticated'), 'error')
        return
      }
      
      // Cookie-based auth - token is automatically sent in cookie

      const productData = {
        name: editingProduct.name,
        category: editingProduct.category,
        price: parseFloat(editingProduct.price) || 0,
        count: parseInt(editingProduct.count, 10) || 0,
        availableColors: colorsToString(editingProduct.colors)
      }

      if (isNewProduct) {
        // Create new product
        const response = await productStockAPI.createProduct(productData)
        if (response?.data || response?.status === 200) {
          showToast(t('products.productAdded'), 'success')
        }
      } else {
        // Update existing product
        await productStockAPI.updateProduct(editingProduct.id, productData)
        showToast(t('products.productUpdated'), 'success')
      }

      // Reload products
      const response = await productStockAPI.getProducts()
      if (response?.data && Array.isArray(response.data)) {
        const transformedProducts = response.data.map((product) => ({
          id: product.id,
          name: product.name || '',
          category: product.category || '',
          price: product.price || 0,
          qty: product.count || 0,
          colors: parseColors(product.availableColors),
          originalAvailableColors: product.availableColors
        }))
        setProducts(transformedProducts)
      }

      closeEditModal()
    } catch (err) {
      console.error('Error saving product:', err)
      setError(err.message || t('products.errorSaving'))
      showToast(isNewProduct ? t('products.errorAdding') : t('products.errorUpdating'), 'error')
    }
  }

  const openDeleteConfirm = (product) => {
    setProductToDelete(product)
    setDeleteConfirmOpen(true)
  }

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false)
    setProductToDelete(null)
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await productStockAPI.deleteProduct(productToDelete.id)
        showToast(t('products.productDeleted'), 'success')
        
        // Reload products
        const response = await productStockAPI.getProducts()
        if (response?.data && Array.isArray(response.data)) {
          const transformedProducts = response.data.map((product) => ({
            id: product.id,
            name: product.name || '',
            category: product.category || '',
            price: product.price || 0,
            qty: product.count || 0,
            colors: parseColors(product.availableColors),
            originalAvailableColors: product.availableColors
          }))
          setProducts(transformedProducts)
        }
        
        closeDeleteConfirm()
      } catch (err) {
        console.error('Error deleting product:', err)
        setError(err.message || t('products.errorDeleting'))
        showToast(t('products.errorDeletingProcess'), 'error')
      }
    }
  }

  // Filter products by search query
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    )
  })

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
          <div className="px-8 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-extrabold tracking-tight text-[#002750] dark:text-white">BizEra</div>
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
                      setSidebarOpen(false) // Close sidebar on mobile after navigation
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
            {/* Header: title + search + button */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-[22px] md:text-[26px] font-extrabold tracking-tight text-[#003A70] shrink-0">
                  {t('products.title')}
                </h1>
                <button 
                  type="button"
                  onClick={openAddProductModal}
                  className="inline-flex items-center gap-2 rounded-md bg-[#00417F] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 shadow-sm hover:bg-[#02498f] shrink-0 md:hidden"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0B4C8A] shadow-sm text-sm sm:text-base leading-none">
                    +
                  </span>
                  <span className="whitespace-nowrap">{t('products.addNew')}</span>
                </button>
              </div>
              <div className="flex items-center justify-end gap-3 sm:gap-4">
                <button 
                  type="button"
                  onClick={openAddProductModal}
                  className="inline-flex items-center gap-2 rounded-md bg-[#00417F] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 shadow-sm hover:bg-[#02498f] shrink-0"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0B4C8A] shadow-sm text-sm sm:text-base leading-none">
                    +
                  </span>
                  <span className="whitespace-nowrap">{t('products.addNew')}</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
              <div className="grid grid-cols-[120px_minmax(0,2.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_80px_140px_100px] min-w-[800px] px-4 sm:px-6 py-2 sm:py-3 border-b border-slate-100 bg-slate-50/60 text-[10px] sm:text-xs font-medium text-slate-500">
                <div>{t('products.image')}</div>
                <div>{t('products.productName')}</div>
                <div>{t('products.category')}</div>
                <div>{t('products.price')}</div>
                <div className="text-center">{t('products.quantity')}</div>
                <div className="text-center">{t('products.colors')}</div>
                <div className="text-right pr-2">{t('products.action')}</div>
              </div>

              {loading ? (
                <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-500 text-sm sm:text-base">
                  {t('common.loading')}
                </div>
              ) : error ? (
                <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-red-500 text-sm sm:text-base">
                  {error}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-500 text-sm sm:text-base">
                  {searchQuery ? t('products.noSearchResults') : t('products.noProducts')}
                </div>
              ) : (
                <div>
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="grid grid-cols-[120px_minmax(0,2.1fr)_minmax(0,1.5fr)_minmax(0,1fr)_80px_140px_100px] min-w-[800px] px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 hover:bg-slate-50/60 items-center text-xs sm:text-sm"
                    >
                      {/* Image placeholder */}
                      <div className="flex items-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                          <span className="text-[10px] sm:text-xs text-slate-500">IMG</span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-[13px] font-semibold text-slate-800 truncate">{p.name}</div>
                      </div>
                      <div className="text-xs sm:text-[13px] text-slate-500 truncate">{p.category}</div>
                      <div className="text-xs sm:text-[13px] text-slate-800 whitespace-nowrap">${p.price.toFixed(2)}</div>
                      <div className="text-xs sm:text-[13px] text-slate-800 text-center">{p.qty}</div>
                      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                        {p.colors && p.colors.length > 0 ? (
                          p.colors.slice(0, 4).map((c, idx) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <span
                              key={idx}
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-white shadow shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))
                        ) : (
                          <span className="text-[10px] sm:text-xs text-slate-400">N/A</span>
                        )}
                        {p.colors && p.colors.length > 4 && (
                          <span className="text-[10px] sm:text-xs text-slate-500">+{p.colors.length - 4}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2 pr-1 sm:pr-2 shrink-0">
                        <button 
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        >
                          <Icon.edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => openDeleteConfirm(p)}
                          className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-rose-200 bg-white text-rose-500 hover:bg-rose-50"
                        >
                          <Icon.trash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination footer */}
              <div className="flex items-center justify-end gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 bg-slate-50/60">
                <button className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
                  <span className="sr-only">{t('common.previous')}</span>
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3"
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
                <button className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
                  <span className="sr-only">{t('common.next')}</span>
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3"
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
            className="w-5 h-5 text-white"
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

      {/* Edit/Add Product Modal */}
      {editModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {isNewProduct ? t('products.addNewProduct') : t('products.editProduct')}
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
            
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('products.productNameLabel')}
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('products.categoryLabel')}
                </label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('products.priceLabel')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('products.quantityLabel')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.count}
                    onChange={(e) => setEditingProduct({ ...editingProduct, count: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('products.colorsLabel')}
                </label>
                <input
                  type="text"
                  placeholder="#111827, #9CA3AF, #F97373"
                  value={editingProduct.colors.join(', ')}
                  onChange={(e) => {
                    const colors = e.target.value.split(',').map(c => c.trim()).filter(c => c)
                    setEditingProduct({ ...editingProduct, colors })
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#003A70] focus:border-transparent outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {t('products.colorsExample')}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#003A70] text-white rounded-lg font-medium hover:bg-[#02498f] transition-colors"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{t('products.deleteProduct')}</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {t('products.deleteConfirm')}
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-slate-800">{productToDelete.name}</p>
              <p className="text-xs text-slate-500 mt-1">
                {productToDelete.category} • ${productToDelete.price.toFixed(2)} • {productToDelete.qty} ədəd
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products


