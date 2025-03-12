"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { Bell, User, Sun, Moon, Settings, DollarSign, Menu, X, Shield, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/contexts/theme-context"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {authService} from "@/services/api";
import { useAuthStore } from "@/stores/useAuthStore"

// Add type definition for roles
type RoleType = string | { name: string };

const NavLinks = () => (
  <>
    <Link href="/" className="text-white hover:text-pink-400 transition-colors">
      Home
    </Link>
    <Link href="/dev-forum/trending" className="text-white hover:text-pink-400 transition-colors">
      Trending
    </Link>
    <Link href="/dev-forum/latest" className="text-white hover:text-pink-400 transition-colors">
      Latest
    </Link>
    <Link href="/dev-forum/categories" className="text-white hover:text-pink-400 transition-colors">
      Categories
    </Link>
    <Link href="/dev-forum/courses" className="text-white hover:text-pink-400 transition-colors">
      Courses
    </Link>
    <Link href="/dev-forum/documentation" className="text-white hover:text-pink-400 transition-colors">
      Documentation
    </Link>
    <Link href="/dev-forum/pricing" className="text-white hover:text-pink-400 transition-colors">
      Pricing
    </Link>
    <Link href="/dev-forum/economics" className="text-white hover:text-pink-400 transition-colors">
      Economics
    </Link>
    <Link href="/dev-forum/tokensphere" className="text-white hover:text-pink-400 transition-colors">
      Tokensphere
    </Link>
  </>
)

export function ForumHeader() {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, loading, logout, fetchUser } = useAuthStore()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // Check for admin role whenever user data changes
  useEffect(() => {
    if (user && user.roles) {
      console.log("User roles:", user.roles); // Debug log
      
      const hasAdminRole = Array.isArray(user.roles) && user.roles.some((role: RoleType) => {
        if (typeof role === 'string') {
          return role === 'ADMIN' || role === 'ROLE_ADMIN';
        } else if (role && typeof role === 'object') {
          return role.name === 'ADMIN' || role.name === 'ROLE_ADMIN';
        }
        return false;
      });
      
      console.log("Is admin:", hasAdminRole); // Debug log
      setIsAdmin(hasAdminRole);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  // For debugging
  const debugUserRoles = () => {
    console.log("Current user data:", user);
    console.log("Admin status:", isAdmin);
    // Force isAdmin to true for testing
    setIsAdmin(true);
  }

  return (
    <header className="border-b border-white border-opacity-20 bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-gray-800 dark:to-gray-900 backdrop-filter backdrop-blur-lg bg-opacity-30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold text-white">
            ElpForum
          </Link>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:text-pink-400">
            <Bell className="h-5 w-5" />
          </Button>
          <Button onClick={toggleTheme} variant="ghost" size="icon" className="text-white hover:text-pink-400">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {!isAuthenticated ? (
            <>
              <div className="hidden md:block">
                <Button variant="outline" asChild className="text-white border-white hover:bg-white hover:text-purple-900">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
              <div className="hidden md:block">
                <Button variant="outline" asChild className="text-white border-white hover:bg-white hover:text-purple-900">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/avatars/01.png"} alt={user?.username} />
                    <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 bg-[#1a1f2e] border border-gray-700 text-white" 
                align="end" 
                forceMount
                sideOffset={5}
              >
                <DropdownMenuItem asChild>
                  <Link href="/dev-forum/me" className="flex items-center hover:bg-[#2a3754] focus:bg-[#2a3754] cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dev-forum/settings" className="flex items-center hover:bg-[#2a3754] focus:bg-[#2a3754] cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dev-forum/pricing" className="flex items-center hover:bg-[#2a3754] focus:bg-[#2a3754] cursor-pointer">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Pricing</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dev-forum/admin" className="flex items-center hover:bg-[#2a3754] focus:bg-[#2a3754] cursor-pointer">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/moderator/documentation" className="flex items-center hover:bg-[#2a3754] focus:bg-[#2a3754] cursor-pointer">
                        <BookOpen className="mr-2 h-4 w-4" />
                        <span>Moderator Documentation</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-[#2a3754] focus:bg-[#2a3754] cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={debugUserRoles}
                  className="hover:bg-[#2a3754] focus:bg-[#2a3754] cursor-pointer"
                >
                  Debug Admin Access
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-pink-400">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[400px] bg-[#1a1f2e] border-l border-gray-700"
            >
              <nav className="flex flex-col space-y-4">
                <NavLinks />
                {!isAuthenticated && (
                  <>
                    <Link href="/register" className="text-white hover:text-pink-400 transition-colors">
                      Register
                    </Link>
                    <Link href="/login" className="text-white hover:text-pink-400 transition-colors">
                      Login
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link href="/dev-forum/admin" className="text-white hover:text-pink-400 transition-colors">
                      Admin Dashboard
                    </Link>
                    <Link href="/moderator/documentation" className="text-white hover:text-pink-400 transition-colors">
                      Moderator Documentation
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

