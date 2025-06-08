"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, FileText, AlertCircle, Calendar, Plus } from "lucide-react"
import { useProperties } from "@/hooks/use-properties"
import { useLeases } from "@/hooks/use-leases"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/property-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const { properties } = useProperties()
  const { leases } = useLeases()

  // Determine leased properties
  const leasedPropertyIds = new Set(
    leases.filter((lease) => lease.status === "active").map((lease) => lease.propertyId)
  )

  // Map properties with dynamic status
  const propertiesWithDynamicStatus = properties.map((property) => ({
    ...property,
    dynamicStatus: leasedPropertyIds.has(property.id) ? "rented" : "available",
  }))

  const availableProperties = propertiesWithDynamicStatus.filter((p) => p.dynamicStatus === "available").length
  const totalProperties = properties.length
  const activeLeases = leases.filter((l) => l.status === "active").length

  const lastYearDate = new Date()
  lastYearDate.setFullYear(lastYearDate.getFullYear() - 1)
  const propertiesLastYear = properties.filter((p) => new Date(p.createdAt) > lastYearDate).length

  const latestProperties = [...propertiesWithDynamicStatus]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

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
            <p className="text-xs text-muted-foreground">Out of {totalProperties} total properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeases}</div>
            <p className="text-xs text-muted-foreground">Currently active lease agreements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Added (Last Year)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertiesLastYear}</div>
            <p className="text-xs text-muted-foreground">New properties in your portfolio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leases.reduce(
                (count, lease) => count + lease.payments.filter((payment) => payment.status === "pending").length,
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Payments awaiting confirmation</p>
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
            <a href="/properties">
              <Plus className="mr-2 h-4 w-4" />
              View All Properties
            </a>
          </Button>
        </div>

        <TabsContent value="available" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {propertiesWithDynamicStatus
              .filter((property) => property.dynamicStatus === "available")
              .slice(0, 3)
              .map((property) => (
                <PropertyCard key={property.id} property={{ ...property, status: property.dynamicStatus }} />
              ))}
            {propertiesWithDynamicStatus.filter((property) => property.dynamicStatus === "available").length === 0 && (
              <p className="col-span-3 text-center py-4 text-muted-foreground">No available properties found.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="latest" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestProperties.map((property) => (
              <PropertyCard key={property.id} property={{ ...property, status: property.dynamicStatus }} />
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
