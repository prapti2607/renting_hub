"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { useTenants } from "@/hooks/use-tenants"
import { AddTenantForm } from "@/components/add-tenant-form"
import { TenantDetail } from "@/components/tenant-detail"
import { useProperties } from "@/hooks/use-properties"
import type { Tenant } from "@/types"

export function TenantList() {
  const { tenants } = useTenants()
  const { properties } = useProperties()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | null>(null)

  const getPropertyTitle = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId)?.title || "Unknown Property"
  }

  const handleEdit = (tenant: Tenant) => {
    setTenantToEdit(tenant)
    setShowAddForm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Tenants</h2>
        <Button
          onClick={() => {
            setTenantToEdit(null)
            setShowAddForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Documents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow
                key={tenant.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTenant(tenant)}
              >
                <TableCell className="font-medium">
                  {tenant.firstName} {tenant.lastName}
                </TableCell>
                <TableCell>
                  <div>{tenant.email}</div>
                  <div className="text-sm text-muted-foreground">{tenant.phone}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={tenant.applicationStatus === "approved" ? "default" : "secondary"}>
                    {tenant.applicationStatus}
                  </Badge>
                </TableCell>
                <TableCell>{getPropertyTitle(tenant.propertyId)}</TableCell>
                <TableCell>{tenant.documents.length} files</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddTenantForm open={showAddForm} onOpenChange={setShowAddForm} tenantToEdit={tenantToEdit} />

      {selectedTenant && (
        <TenantDetail
          tenant={selectedTenant}
          open={!!selectedTenant}
          onOpenChange={(open) => !open && setSelectedTenant(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}

