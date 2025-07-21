"use client";

import { Link, useLocation } from "react-router-dom";
import { Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageMenu from "../user-layout/LanguageMenu";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect, useRef } from "react";
import type { Notification } from "../../types/user";
import NotificationDropdown from "./NotificationDropdown";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/disasters", label: "Disaster Events" },
  { href: "/requests/assistant", label: "Assistance Request" },
  { href: "/teams/relief", label: "Relief Teams" },
  { href: "/about", label: "About Us" },
];

// Mock notifications - replace with actual API call
const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "Your disaster report #123 has been verified",
    type: "success",
    isRead: false,
    createdAt: new Date().toISOString(),
    relatedEntityId: 123,
  },
  {
    id: 2,
    message: "New assistance request requires your attention",
    type: "info",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    relatedEntityId: 456,
  },
  {
    id: 3,
    message: "Your donation has been successfully distributed",
    type: "success",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    relatedEntityId: 789,
  },
];

export default function UpdatedNavbar() {
  const { isAuthenticated, userName, clearUser } = useAuthStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
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

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-blue-700 bg-blue-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and title with increased gap */}
          <Link
            to="/"
            className="flex items-center gap-4 hover:opacity-80 transition"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
              <Shield className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="font-bold text-lg">DisasterGuard</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative text-sm font-semibold px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "text-white after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-yellow-400"
                      : "text-white/80 hover:text-white hover:bg-blue-800/50"
                  }`}
                  tabIndex={0}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <LanguageMenu />

            {/* Authenticated User */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notification Dropdown */}
                <NotificationDropdown
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                />

                {/* User Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full"
                  >
                    <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 font-semibold text-xs select-none">
                      {userName?.charAt(0).toUpperCase() || (
                        <User className="h-5 w-5 text-blue-900" />
                      )}
                    </div>
                    <span className="text-white/90 hidden md:block text-sm">
                      {userName}
                    </span>
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-blue-900 hover:bg-blue-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        onClick={() => {
                          clearUser();
                          setMenuOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:bg-blue-800/60 hover:text-white font-medium px-5 transition text-sm"
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  type="button"
                  size="sm"
                  className="bg-white text-blue-900 font-semibold hover:bg-blue-100 px-5 border border-transparent transition text-sm"
                >
                  <Link to="/signup">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
