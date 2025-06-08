"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, token, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    if (!user || !token) {
      router.push("/login")
    }
  }, [user, token, router])

  if (!user || !token) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1">
        <header className="border-b bg-white shadow-sm">
          <div className="flex h-14 items-center px-4 justify-between">
            <h2 className="text-lg font-semibold">Renting Hub</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.firstName} {user.lastName}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  logout()
                  router.push("/login")
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

