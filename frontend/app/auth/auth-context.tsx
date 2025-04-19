"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Simplified auth context without validation
interface User {
  name: string
  email: string
  image: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: true, // Default to true to avoid auth errors
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    name: "John Doe",
    email: "john.doe@example.com",
    image: "/placeholder.svg?height=32&width=32",
  })
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const login = () => {
    setUser({
      name: "John Doe",
      email: "john.doe@example.com",
      image: "/placeholder.svg?height=32&width=32",
    })
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

