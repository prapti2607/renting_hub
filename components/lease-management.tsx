"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useLeases } from "@/hooks/use-leases"
import { AddLeaseForm } from "@/components/add-lease-form"
import { LeaseDetail } from "@/components/lease-detail"
import { useProperties } from "@/hooks/use-properties"
import { useTenants } from "@/hooks/use-tenants"
import type { Lease } from "@/types"

export function LeaseManagement() {
  const { leases } = useLeases()
  const { properties } = useProperties()
  const { tenants } = useTenants()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null)
  const [leaseToEdit, setLeaseToEdit] = useState<Lease | null>(null)

  const getPropertyTitle = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId)?.title || "Unknown Property"
  }

  const getTenantName = (tenantId: string) => {
    const tenant = tenants.find((t) => t.id === tenantId)
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : "Unknown Tenant"
  }

  const handleEdit = (lease: Lease) => {
    setLeaseToEdit(lease)
    setShowAddForm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Leases</h2>
        <Button
          onClick={() => {
            setLeaseToEdit(null)
            setShowAddForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Lease
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {leases.map((lease) => (
          <Card
            key={lease.id}
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={() => setSelectedLease(lease)}
          >
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{getPropertyTitle(lease.propertyId)}</CardTitle>
                <Badge variant={lease.status === "active" ? "default" : "secondary"}>{lease.status}</Badge>
              </div>
              <CardDescription>Tenant: {getTenantName(lease.tenantId)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Period</span>
                  <span>
                    {new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rent Amount</span>
                  <span>₹{lease.rentAmount}/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Security Deposit</span>
                  <span>₹{lease.securityDeposit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payments</span>
                  <span>{lease.payments.length} records</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddLeaseForm open={showAddForm} onOpenChange={setShowAddForm} leaseToEdit={leaseToEdit} />

      {selectedLease && (
        <LeaseDetail
          lease={selectedLease}
          open={!!selectedLease}
          onOpenChange={(open) => !open && setSelectedLease(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}

