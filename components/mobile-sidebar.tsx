"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Menu, Home, Settings, Users, FileText, User, Building, CreditCard } from "lucide-react"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Properties",
      href: "/properties",
      icon: Building,
    },
    {
      title: "Tenants",
      href: "/tenants",
      icon: Users,
    },
    {
      title: "Leases",
      href: "/leases",
      icon: FileText,
    },
    {
      title: "Payments",
      href: "/payments",
      icon: CreditCard,
    },
    {
      title: "User Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[250px]">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            <span className="font-semibold">Rental Manager</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-3.5rem)]">
          <div className="flex flex-col gap-1 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href || (item.href === "/dashboard" && pathname.includes("/dashboard"))
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

