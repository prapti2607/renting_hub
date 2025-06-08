"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function DevPage() {
  const router = useRouter()

  const clearAuthAndRedirect = (path: string) => {
    // Clear auth cookie
    document.cookie = "user-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    // Clear localStorage
    localStorage.removeItem("auth-storage")
    // Redirect
    router.push(path)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Development Tools</CardTitle>
          <CardDescription>Use these tools to help with development and testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => clearAuthAndRedirect("/login")}>
            Clear Auth & Go to Login
          </Button>
          <Button className="w-full" variant="outline" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

