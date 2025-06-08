"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, FileText, AlertCircle, Calendar, Plus, ArrowUp, ArrowDown } from "lucide-react"
import { useProperties } from "@/hooks/use-properties"
import { useLeases } from "@/hooks/use-leases"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart, LineChart } from "@/components/charts"

export default function DashboardPage() {
  const router = useRouter()
  const { properties } = useProperties()
  const { leases } = useLeases()

  // Calculate statistics
  const availableProperties = properties.filter((p) => p.status === "available").length
  const totalProperties = properties.length
  const activeLeases = leases.filter((l) => l.status === "active").length
  const rentedProperties = properties.filter((p) => p.status === "rented").length
  const forSaleProperties = properties.filter((p) => p.status === "for_sale").length

  // Calculate properties added in the last year
  const lastYearDate = new Date()
  lastYearDate.setFullYear(lastYearDate.getFullYear() - 1)
  const propertiesLastYear = properties.filter((p) => new Date(p.createdAt) > lastYearDate).length

  // Get latest properties (up to 3)
  const latestProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  // Calculate total rent amount
  const totalRentAmount = properties.reduce((total, property) => {
    if (property.status === "rented") {
      return total + property.rentAmount
    }
    return total
  }, 0)

  // Calculate pending payments
  const pendingPayments = leases.reduce(
    (count, lease) => count + lease.payments.filter((payment) => payment.status === "pending").length,
    0,
  )

  // Generate monthly data for charts
  const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()

    // Last 6 months
    const labels = []
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      labels.push(months[monthIndex])
    }

    // Random data for demo purposes
    return {
      labels,
      datasets: [
        {
          label: "Properties Added",
          data: labels.map(() => Math.floor(Math.random() * 5) + 1),
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgb(59, 130, 246)",
        },
        {
          label: "Properties Rented",
          data: labels.map(() => Math.floor(Math.random() * 3) + 1),
          backgroundColor: "rgba(16, 185, 129, 0.5)",
          borderColor: "rgb(16, 185, 129)",
        },
      ],
    }
  }

  const generateRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentMonth = new Date().getMonth()

    // Last 6 months
    const labels = []
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      labels.push(months[monthIndex])
    }

    // Random data for demo purposes
    return {
      labels,
      datasets: [
        {
          label: "Monthly Revenue (₹)",
          data: labels.map(() => Math.floor(Math.random() * 50000) + 20000),
          borderColor: "rgb(99, 102, 241)",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          tension: 0.3,
          fill: true,
        },
      ],
    }
  }

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProperties}</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">Out of {totalProperties} total properties</span>
              <span className="ml-auto flex items-center text-xs text-green-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                {Math.round((availableProperties / totalProperties) * 100) || 0}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeases}</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">Currently active lease agreements</span>
              <span className="ml-auto flex items-center text-xs text-green-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                {rentedProperties} rented
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRentAmount.toLocaleString()}</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">From {rentedProperties} rented properties</span>
              <span className="ml-auto flex items-center text-xs text-green-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                {forSaleProperties} for sale
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground">Payments awaiting confirmation</span>
              {pendingPayments > 0 ? (
                <span className="ml-auto flex items-center text-xs text-red-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Needs attention
                </span>
              ) : (
                <span className="ml-auto flex items-center text-xs text-green-500">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  All clear
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Statistics</CardTitle>
            <CardDescription>Monthly property additions and rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart data={generateMonthlyData()} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue from properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart data={generateRevenueData()} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="available">Available Properties</TabsTrigger>
            <TabsTrigger value="latest">Latest Additions</TabsTrigger>
          </TabsList>
          <Button size="sm" asChild>
            <Link href="/properties">
              <Plus className="mr-2 h-4 w-4" />
              View All Properties
            </Link>
          </Button>
        </div>

        <TabsContent value="available" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties
              .filter((property) => property.status === "available")
              .slice(0, 3)
              .map((property) => (
                <div key={property.id} className="cursor-pointer" onClick={() => handlePropertyClick(property.id)}>
                  <PropertyCard property={property} />
                </div>
              ))}
            {properties.filter((property) => property.status === "available").length === 0 && (
              <p className="col-span-3 text-center py-4 text-muted-foreground">No available properties found.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="latest" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestProperties.map((property) => (
              <div key={property.id} className="cursor-pointer" onClick={() => handlePropertyClick(property.id)}>
                <PropertyCard property={property} />
              </div>
            ))}
            {latestProperties.length === 0 && (
              <p className="col-span-3 text-center py-4 text-muted-foreground">No properties found.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

