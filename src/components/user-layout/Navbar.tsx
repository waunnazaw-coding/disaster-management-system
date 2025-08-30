import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, Phone, Clock, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { NotificationDropdown } from "../Notification/NotificationDropdown";
import { useSignalR } from "@/hooks/useSignalR";
import { useNotificationStore } from "@/store/notificationStore";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";


// Top utility bar with emergency info
function UtilityBar() {
  return (
    <div className="bg-red-600 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Emergency: 199 | 192 | 191</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>24/7 Response Available</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/disasters/impact-survey" className="hover:underline">Survey</Link>
            <Link to="/emergency-contacts" className="hover:underline">Emergency Contacts</Link>
            <Link to="/donations" className="hover:underline">Donate Now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Navigation items config
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/disasters', label: 'Disaster Events' },
  { href: '/activities', label: 'Activities' },
  { href: '/awareness', label: 'Awareness' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  // Using React Router's useLocation hook to get current path
  const location = useLocation()
  const pathname = location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const connection = useSignalR();
  const { addNotification, incrementUnreadCount } = useNotificationStore();
  const { getDashboardPath, getDashboardLabel } = useRoleNavigation();

  useEffect(() => {
    if (!connection) return;

    const handler = (notification: any) => {
      addNotification({
        ...notification,
        createdAt: notification.createdAt
          ? new Date(notification.createdAt)
          : new Date(),
      });
      incrementUnreadCount();
    };

    connection.on("ReceiveNotification", handler);

    return () => {
      connection.off("ReceiveNotification", handler);
    };
  }, [connection, addNotification, incrementUnreadCount]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    console.log('Auth changed', { isAuthenticated, user })
  }, [isAuthenticated, user])


  return (
    <>
      <UtilityBar />
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" aria-label="DisasterGuard Myanmar homepage">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">DisasterGuard</span>
                <p className="text-xs text-red-600 font-medium">Myanmar</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1" role="menubar" aria-label="Primary Navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    role="menuitem"
                  >
                    {item.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Notification dropdown for authenticated users */}
            {/* {isAuthenticated && (
              <div>
                <NotificationDropdown />
              </div>
            )} */}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <div>
                  <NotificationDropdown />
                </div>
              )}
              {/* User Menu or Authentication Buttons */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                    aria-label="User menu"
                    type="button"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      {/* <p className="text-xs text-gray-500">{user?.role}</p> */}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 border border-gray-100"
                      role="menu"
                      aria-label="User menu dropdown"
                    >
                      <div className="p-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        {/* <p className="text-sm text-gray-500">{user?.role}</p> */}
                      </div>
                      <div className="py-2">
                        {/* <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                        >
                          Profile
                        </Link> */}
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                        >
                          Settings
                        </Link>
                        <Link
                          to={getDashboardPath()}
                          className="block px-4 py-2 text-sm text-blue-900 hover:bg-blue-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {getDashboardLabel()}
                        </Link>
                        <Link
                          to="/notifications"
                          className="block px-4 py-2 text-sm text-blue-900 hover:bg-blue-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Notifications
                        </Link>
                      </div>
                      <div className="py-2 border-t border-gray-100">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={async () => {
                            await logout();  // await completion to ensure state is updated
                            navigate('/login');
                          }}
                          role="menuitem"
                          type="button"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                type="button"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white" role="menu" aria-label="Mobile Navigation">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                        isActive
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-700 hover:text-red-600 hover:bg-gray-50',
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  )
                })}

                {!isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200 space-y-2" role="none">
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                      role="menuitem"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white hover:bg-red-700"
                      onClick={() => setMobileMenuOpen(false)}
                      role="menuitem"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
