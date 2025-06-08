"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLeases } from "@/hooks/use-leases"
import { useProperties } from "@/hooks/use-properties"
import { useTenants } from "@/hooks/use-tenants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Lease } from "@/types"

interface AddLeaseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leaseToEdit?: Lease | null
}

export function AddLeaseForm({ open, onOpenChange, leaseToEdit }: AddLeaseFormProps) {
  const { addLease, updateLease } = useLeases()
  const { properties } = useProperties()
  const { tenants } = useTenants()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    propertyId: "",
    tenantId: "",
    startDate: "",
    endDate: "",
    rentAmount: "",
    securityDeposit: "",
    status: "active" as const,
  })

  useEffect(() => {
    if (leaseToEdit) {
      setFormData({
        propertyId: leaseToEdit.propertyId,
        tenantId: leaseToEdit.tenantId,
        startDate: new Date(leaseToEdit.startDate).toISOString().split("T")[0],
        endDate: new Date(leaseToEdit.endDate).toISOString().split("T")[0],
        rentAmount: leaseToEdit.rentAmount.toString(),
        securityDeposit: leaseToEdit.securityDeposit.toString(),
        status: leaseToEdit.status,
      })
    } else {
      setFormData({
        propertyId: "",
        tenantId: "",
        startDate: "",
        endDate: "",
        rentAmount: "",
        securityDeposit: "",
        status: "active" as const,
      })
    }
  }, [leaseToEdit]) // Removed 'open' from dependencies

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const leaseData = {
        propertyId: formData.propertyId,
        tenantId: formData.tenantId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        rentAmount: Number.parseFloat(formData.rentAmount),
        securityDeposit: Number.parseFloat(formData.securityDeposit),
        status: formData.status,
        payments: leaseToEdit?.payments || [],
        documents: leaseToEdit?.documents || [],
      }

      if (leaseToEdit) {
        await updateLease(leaseToEdit.id, leaseData)
      } else {
        await addLease(leaseData)
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error saving lease:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="sticky top-0 bg-background pt-4 pb-2 z-10">
            <DialogTitle>{leaseToEdit ? "Edit Lease" : "Add New Lease"}</DialogTitle>
            <DialogDescription>
              {leaseToEdit ? "Update lease details" : "Create a new lease agreement"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="propertyId">Property</Label>
              <Select
                value={formData.propertyId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, propertyId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tenantId">Tenant</Label>
              <Select
                value={formData.tenantId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tenantId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {`${tenant.firstName} ${tenant.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rentAmount">Monthly Rent</Label>
                <Input
                  id="rentAmount"
                  name="rentAmount"
                  type="number"
                  placeholder="1500"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="securityDeposit">Security Deposit</Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  placeholder="1500"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {leaseToEdit && (
              <div className="grid gap-2">
                <Label htmlFor="status">Lease Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "expired" | "terminated") =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 bg-background pt-2 pb-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

