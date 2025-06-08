"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User } from "../types"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<User>
  register: (userData: Omit<User, "id" | "role">) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Load user and token from AsyncStorage on app start
    loadAuthState()
  }, [])

  const loadAuthState = async () => {
    try {
      const [storedUser, storedToken] = await Promise.all([AsyncStorage.getItem("user"), AsyncStorage.getItem("token")])

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
    } catch (error) {
      console.error("Error loading auth state:", error)
    }
  }

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: "1",
      email,
      password,
      firstName: "John",
      lastName: "Doe",
      role: "user",
    }

    const mockToken = "mock-token"

    // Store in AsyncStorage
    await Promise.all([
      AsyncStorage.setItem("user", JSON.stringify(mockUser)),
      AsyncStorage.setItem("token", mockToken),
    ])

    setUser(mockUser)
    setToken(mockToken)

    return mockUser
  }

  const register = async (userData: Omit<User, "id" | "role">) => {
    // Simulate API call
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      role: "user",
    }

    const mockToken = "mock-token"

    // Store in AsyncStorage
    await Promise.all([AsyncStorage.setItem("user", JSON.stringify(newUser)), AsyncStorage.setItem("token", mockToken)])

    setUser(newUser)
    setToken(mockToken)

    return newUser
  }

  const logout = async () => {
    // Clear AsyncStorage
    await Promise.all([AsyncStorage.removeItem("user"), AsyncStorage.removeItem("token")])

    setUser(null)
    setToken(null)
  }

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

