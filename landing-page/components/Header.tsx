"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { isLoggedIn, getUsername, logout } from "@/app/utils/auth"
import { Button } from "@/app/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/avatar"
import { User, LogOut } from "lucide-react"

interface HeaderProps {
  showNavLinks?: boolean
}

export default function Header({ showNavLinks = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
    setUsername(getUsername())
  }, [])

  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    setUsername(null)
    // Redirect to home page after logout
    window.location.href = "/"
  }

  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.preventDefault()
      const target = e.target as HTMLAnchorElement
      const targetId = target.getAttribute("href")?.slice(1)
      const targetElement = document.getElementById(targetId || "")
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach((link) => {
      link.addEventListener("click", handleScroll)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleScroll)
      })
    }
  }, [isMenuOpen])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="sr-only">SUMA</span>
              <img className="h-10 w-auto" src="/placeholder.svg?height=40&width=40" alt="SUMA Logo" />
              <span className="ml-2 text-2xl font-bold text-indigo-600">SUMA</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-base font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/host/create-room"
                  className="text-base font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Create Room
                </Link>
              </>
            ) : (
              showNavLinks && (
                <>
                  <a
                    href="#features"
                    className="text-base font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-base font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    How it works
                  </a>
                </>
              )
            )}
            <div className="ml-10 space-x-4">
              {loggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={username || ""} />
                        <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Welcome,</p>
                        <p className="text-xs leading-none text-muted-foreground">{username}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href="/login"
                  className="inline-block bg-indigo-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {loggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/host/create-room"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                  >
                    Create Room
                  </Link>
                </>
              ) : (
                showNavLinks && (
                  <>
                    <a
                      href="#features"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                    >
                      Features
                    </a>
                    <a
                      href="#how-it-works"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                    >
                      How it works
                    </a>
                  </>
                )
              )}
              {loggedIn ? (
                <>
                  <div className="px-3 py-2 rounded-md text-base font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    <span>{username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-2 inline" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
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

