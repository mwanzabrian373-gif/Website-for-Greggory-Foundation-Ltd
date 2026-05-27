import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogIn } from 'lucide-react'
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
          <div className="flex flex-wrap items-center justify-between h-[160px] gap-6">
            {/* Brand Header with Logo */}
            <div className="flex items-center flex-shrink-0 min-w-[220px]" style={{ marginLeft: '-16px' }}>
              <img
                src="/brand-header.png/sja.PNG"
                alt="SJA"
                className="h-[110px] sm:h-30 w-auto object-contain max-w-[210px] sm:max-w-none"
                style={{
                  display: 'block',
                  marginLeft: '-16px',
                  position: 'relative',
                  zIndex: 10
                }}
                onError={(e) => {
                  console.error('Failed to load sja image:', e.target.src);
                }}
                onLoad={() => {
                  console.log('SJA image loaded successfully');
                }}
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 flex-wrap items-center justify-center gap-6 overflow-visible">
              {navigation.map((item, index) => (
                <div key={item.path} className="relative group whitespace-nowrap">
                  {item.dropdown ? (
                    <>
                      <button
                        className="flex items-center text-sm font-medium text-gray-700 hover:text-teal-600 transition-colors duration-200 px-1 py-1 min-h-[40px]"
                        onClick={() => setCompaniesDropdownOpen(!companiesDropdownOpen)}
                      >
                        {item.name}
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div
                        className={`absolute left-0 mt-2 w-80 bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-lg rounded-lg shadow-xl py-3 z-50 border border-blue-400/30 ${
                          companiesDropdownOpen ? 'block' : 'hidden'
                        }`}
                        onMouseLeave={() => setCompaniesDropdownOpen(false)}
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setCompaniesDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-white/20 rounded-md mx-1 transition-all duration-200"
                          >
                            <span className="break-words">{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className={item.name === 'Home' ? 'flex flex-col items-center min-h-[40px]' : 'flex items-center min-h-[40px]'}>
                      <Link
                        to={item.path}
                        className={`text-sm font-medium transition-colors duration-200 px-1 py-1 ${
                          location.pathname === item.path
                            ? 'text-teal-600'
                            : 'text-gray-700 hover:text-teal-600'
                        }`}
                      >
                        {item.name}
                      </Link>
                      {/* Show Login/Logout button directly under Home link */}
                      {item.name === 'Home' && (
                        <div className="mt-2">
                          {isAuthenticated ? (
                            <button
                              onClick={handleLogout}
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                            >
                              Logout
                            </button>
                          ) : (
                            <Link
                              to="/login"
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                            >
                              <LogIn size={14} />
                              Login
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-3 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
              {isAuthenticated && user ? (
                <>
                  {user.profile_photo_blob ? (
                    <img
                      src={user.profile_photo_blob}
                      alt={user.display_name || ''}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-700">
                    {user.display_name || ''}
                  </div>
                </>
              ) : (
                <div className="text-sm font-medium text-gray-700">
                  Guest
                </div>
              )}
            </div>
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
          <div className="md:hidden pb-4">
            <div className="flex items-center space-x-3 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 mb-4">
              {isAuthenticated && user ? (
                <>
                  {user.profile_photo_blob ? (
                    <img
                      src={user.profile_photo_blob}
                      alt={user.display_name || ''}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-700">
                    {user.display_name || ''}
                  </div>
                </>
              ) : (
                <div className="text-sm font-medium text-gray-700">
                  Guest
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                item.dropdown ? (
                  <div key={item.path} className="px-3">
                    <MobileDropdown item={item} closeMenu={() => setIsOpen(false)} />
                  </div>
                 ) : (
                   <div key={item.path} className={item.name === 'Home' ? 'flex flex-col' : ''}>
                     <Link
                       to={item.path}
                       onClick={() => setIsOpen(false)}
                       className={`px-3 py-2 rounded-md text-sm font-medium ${
                         isActive(item.path)
                           ? 'bg-teal-50 text-teal-600'
                           : 'text-gray-700 hover:bg-gray-100 hover:text-teal-600'
                       }`}
                     >
                       {item.name}
                     </Link>
                     {/* Show Login/Logout button directly under Home link on mobile */}
                     {item.name === 'Home' && (
                       <div className="ml-3 mt-1">
                         {isAuthenticated ? (
                           <button
                             onClick={() => { setIsOpen(false); handleLogout() }}
                             className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                           >
                             Logout
                           </button>
                         ) : (
                           <Link
                             to="/login"
                             onClick={() => setIsOpen(false)}
                             className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                           >
                             <LogIn size={16} />
                             Login
                           </Link>
                         )}
                       </div>
                     )}
                   </div>
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
      <button onClick={() => setOpen(!open)} className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
        <span>{item.name}</span>
        <svg className={`ml-2 h-4 w-4 transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 ml-2 border-l border-gray-200 pl-2">
          {item.dropdown.map((sub) => (
            <Link key={sub.path} to={sub.path} onClick={() => { closeMenu(); }} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Navbar

