"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/auth/auth-context"
import { Button } from "../components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Menu, X, PlusCircle, LayoutDashboard, LogOut, User } from "lucide-react"

interface HeaderProps {
  showNavLinks?: boolean
}

export default function Header({ showNavLinks = true }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <nav className="responsive-container" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <span className="sr-only">SUMA</span>
              <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110">
                S
              </div>
              <span className="ml-2 text-2xl font-bold gradient-text">SUMA</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link
                  href="/host/create-room"
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Create Room
                </Link>
              </>
            ) : (
              showNavLinks && (
                <>
                  <a
                    href="#features"
                    className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    How it works
                  </a>
                </>
              )
            )}
            <div className="ml-10 space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border-2 border-primary/20">
                        <AvatarImage src={user?.image} alt={user?.name || ""} />
                        <AvatarFallback className="gradient-bg text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/host/create-room" className="cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Create Room</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button className="gradient-bg">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href="/host/create-room"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-secondary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <PlusCircle className="h-5 w-5 mr-3" />
                    Create Room
                  </Link>
                </>
              ) : (
                showNavLinks && (
                  <>
                    <a
                      href="#features"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-secondary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="h-5 w-5 mr-3 flex items-center justify-center">•</span>
                      Features
                    </a>
                    <a
                      href="#how-it-works"
                      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-secondary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="h-5 w-5 mr-3 flex items-center justify-center">•</span>
                      How it works
                    </a>
                  </>
                )
              )}
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 rounded-md text-base font-medium text-foreground flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={user?.image} alt={user?.name || ""} />
                      <AvatarFallback className="gradient-bg text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-white gradient-bg transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-white gradient-bg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

