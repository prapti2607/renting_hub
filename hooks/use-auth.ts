"use client"

import { useLocalStorage } from "./use-local-storage"
import type { User } from "@/types"
import { useRouter } from "next/navigation"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthStore {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

export function useAuth() {
  const [users, setUsers] = useLocalStorage<User[]>("users", [])
  const { user, setUser, token, setToken } = useAuthStore()
  const router = useRouter()

  // Initialize with a default user if none exists
  const initializeDefaultUser = () => {
    if (users.length === 0) {
      const defaultUser: User = {
        id: "default-user",
        email: "admin@example.com",
        password: "password",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      }
      setUsers([defaultUser])

      // Auto-login with default user for development
      setUser(defaultUser)
      const token = btoa(JSON.stringify({ id: defaultUser.id, email: defaultUser.email }))
      setToken(token)
      document.cookie = `user-token=${token}; path=/`
    }
  }

  // Call this function to ensure we have a default user
  initializeDefaultUser()

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }

    // Update in local storage
    setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)))

    // Update in auth store
    setUser(updatedUser)

    return updatedUser
  }

  const register = async (userData: Omit<User, "id" | "role">) => {
    const existingUser = users.find((u) => u.email === userData.email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      role: "user",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    }

    setUsers([...users, newUser])

    // Generate a simple token (in a real app, this would be a JWT)
    const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email }))

    // Set both user and token
    setUser(newUser)
    setToken(token)

    // Set cookie for middleware
    document.cookie = `user-token=${token}; path=/`

    return newUser
  }

  const login = async (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      // Generate a simple token (in a real app, this would be a JWT)
      const token = btoa(JSON.stringify({ id: user.id, email: user.email }))

      // Set both user and token
      setUser(user)
      setToken(token)

      // Set cookie for middleware
      document.cookie = `user-token=${token}; path=/`

      return user
    }
    return null
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    // Remove the cookie
    document.cookie = "user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
  }

  return {
    user,
    token,
    register,
    login,
    logout,
    updateUserProfile,
  }
}

