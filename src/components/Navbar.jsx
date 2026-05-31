import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogIn, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import companies from '../data/companies'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [companiesDropdownOpen, setCompaniesDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    {
      name: 'Our Companies',
      path: '#',
      dropdown: companies,
    },
    ...(isAuthenticated ? [
      {
        name: 'Projects & Activities',
        path: '/projects',
      },
    ] : []),
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Section - Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/">
                <img
                  src="/brand-header.png/sja.PNG"
                  alt="SJA"
                  className="h-14 w-auto object-contain"
                  onError={(e) => {
                    console.error('Failed to load sja image:', e.target.src);
                  }}
                  onLoad={() => {
                    console.log('SJA image loaded successfully');
                  }}
                />
              </Link>
            </div>

            {/* Center Section - Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.path} className="relative group">
                  {item.dropdown ? (
                    <>
                      <button
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors duration-200"
                        onClick={() => setCompaniesDropdownOpen(!companiesDropdownOpen)}
                      >
                        {item.name}
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100 ${
                          companiesDropdownOpen ? 'block' : 'hidden'
                        }`}
                        onMouseLeave={() => setCompaniesDropdownOpen(false)}
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setCompaniesDropdownOpen(false)}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`text-sm font-medium transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'text-teal-600'
                          : 'text-gray-700 hover:text-teal-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section - User Profile & Login/Logout */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {user.profile_photo_blob ? (
                      <img
                        src={user.profile_photo_blob}
                        alt={user.display_name || ''}
                        className="h-8 w-8 rounded-full object-cover border-2 border-teal-100"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium border-2 border-teal-100">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-700">
                      {user.display_name || ''}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Login"
                >
                  <LogIn size={16} />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            {/* Mobile User Section */}
            <div className="px-4 py-3 border-b border-gray-100">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {user.profile_photo_blob ? (
                      <img
                        src={user.profile_photo_blob}
                        alt={user.display_name || ''}
                        className="h-10 w-10 rounded-full object-cover border-2 border-teal-100"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-medium border-2 border-teal-100">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-medium text-gray-900">
                        {user.display_name || ''}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsOpen(false); handleLogout() }}
                    className="px-4 py-2 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Login"
                >
                  <LogIn size={20} />
                </Link>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                item.dropdown ? (
                  <div key={item.path}>
                    <MobileDropdown item={item} closeMenu={() => setIsOpen(false)} />
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

// MobileDropdown component used inside Navbar for mobile 'Our Companies' submenu
function MobileDropdown({ item, closeMenu }){
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full text-left flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <span>{item.name}</span>
        <svg className={`ml-2 h-4 w-4 transform transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-1 ml-4 border-l-2 border-teal-200 pl-4 space-y-1">
          {item.dropdown.map((sub) => (
            <Link 
              key={sub.path} 
              to={sub.path} 
              onClick={() => { closeMenu(); }} 
              className="block px-3 py-2 text-base text-gray-600 hover:bg-gray-50 hover:text-teal-600 rounded-md transition-colors"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Navbar