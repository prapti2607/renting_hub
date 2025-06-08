"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Building,
  Users,
  FileText,
  Settings,
  CreditCard,
  User,
  Home,
  Search,
  CreditCardIcon as OnlinePayment,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/dashboard" && "bg-accent text-accent-foreground",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/properties"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/properties" && "bg-accent text-accent-foreground",
              )}
            >
              <Building className="mr-2 h-4 w-4" />
              Properties
            </Link>
            <Link
              href="/tenants"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/tenants" && "bg-accent text-accent-foreground",
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Tenants
            </Link>
            <Link
              href="/leases"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/leases" && "bg-accent text-accent-foreground",
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              Leases
            </Link>
            <Link
              href="/payments"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/payments" && "bg-accent text-accent-foreground",
              )}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </Link>
            <Link
              href="/search"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/search" && "bg-accent text-accent-foreground",
              )}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
            <Link
              href="/online-transactions"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/online-transactions" && "bg-accent text-accent-foreground",
              )}
            >
              <OnlinePayment className="mr-2 h-4 w-4" />
              Online Transactions
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
          <div className="space-y-1">
            <Link
              href="/profile"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/profile" && "bg-accent text-accent-foreground",
              )}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className={cn(
                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === "/settings" && "bg-accent text-accent-foreground",
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

