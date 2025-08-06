import { Link, useLocation } from "react-router-dom";
import { Shield, User } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/authStore.ts";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/disasters", label: "Events History" },
  { href: "/requests/assistant", label: "Activities" },
  { href: "/teams/relief", label: "Awareness" },
  { href: "/emergency-contacts", label: "Emergency Contacts" },
  { href: "/about", label: "About Us" },
  { href: "/about", label: "Contact Us" },
  { href: "/about", label: "Donation" },
];

export default function Navbar() {
  const { isAuthenticated, user, clearUser } = useAuthStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white text-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">DisasterGuard</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition ${
                    isActive
                      ? "text-red-600 bg-red-50"
                      : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
                  }`}
                  tabIndex={0}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            

            {/* <LanguageMenu /> */}

            {/* Authenticated User */}
            {isAuthenticated ? (
              <div className="relative ml-2" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full"
                >
                  <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold text-sm select-none">
                    {user?.name?.charAt(0).toUpperCase() || (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-700 hidden lg:block text-sm">
                    {user?.name}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Settings
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                          clearUser();
                          setMenuOpen(false);
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:bg-gray-100 hover:text-red-600 font-medium px-4 transition text-sm"
                >
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  type="button"
                  size="sm"
                  className="bg-red-600 text-white font-medium hover:bg-red-700 px-4 transition text-sm shadow-sm"
                >
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}