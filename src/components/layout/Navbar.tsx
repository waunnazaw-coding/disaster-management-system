"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Badge } from "../ui/badge"

import {
  Menu,
  Shield,
  AlertTriangle,
  Heart,
  FileText,
  Home
 
} from "lucide-react"
import { useStore } from "../../store/useStore"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { currentUser } = useStore()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/events", label: "Disaster Events", icon: AlertTriangle },
    { href: "/report", label: "Report Disaster", icon: AlertTriangle },
    { href: "/donate", label: "Donate", icon: Heart },
    { href: "/helpcenter", label: "Help Centers", icon: FileText },
  ]

  const roleBasedItems = {
    admin: [{ href: "/admin", label: "Admin Dashboard", icon: Shield }],
    organization: [{ href: "/organization", label: "Organization", icon: FileText }],
  }

  // Get user role if available (modify according to your user object)
  const userRole = currentUser?.role

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">DisasterGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-2 text-sm font-medium ${
                  location.pathname === item.href ? "text-white" : "text-white/80 hover:text-white"
                } transition-colors`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* {currentUser && userRole && roleBasedItems[userRole as keyof typeof roleBasedItems]?.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
                <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-white/30">
                  3
                </Badge>
              </Link>
            ))}

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                        <AvatarFallback className="bg-white/20 text-white">
                          {currentUser.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{currentUser.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{currentUser.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/my-reports">
                        <FileText className="mr-2 h-4 w-4" />
                        My Reports
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-white text-blue-600 hover:bg-white/90">
                  <Link to="/auth/register">Register</Link>
                </Button>
              </div>
            )} */}
            <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Link to="/auth/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-white text-blue-600 hover:bg-white/90">
                  <Link to="/auth/register">Register</Link>
                </Button>
              </div>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 text-lg font-medium ${
                      location.pathname === item.href ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                    } transition-colors`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                {currentUser && userRole && roleBasedItems[userRole as keyof typeof roleBasedItems]?.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    <Badge variant="secondary">3</Badge>
                  </Link>
                ))}

                {!currentUser && (
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button asChild variant="outline" onClick={() => setIsOpen(false)}>
                      <Link to="/auth/login">Login</Link>
                    </Button>
                    <Button asChild onClick={() => setIsOpen(false)}>
                      <Link to="/auth/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}