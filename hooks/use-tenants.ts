"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Tenant } from "@/types"
import { useProperties } from "./use-properties"
import { useToast } from "@/components/use-toast"

export function useTenants() {
  const [tenants, setTenants] = useLocalStorage<Tenant[]>("tenants", [])
  const { markPropertyAsRented, markPropertyAsAvailable } = useProperties()
  const { toast } = useToast()

  // Add toast notifications for tenant actions
  const addTenant = (tenant: Omit<Tenant, "id" | "createdAt" | "updatedAt">) => {
    const newTenant: Tenant = {
      ...tenant,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTenants([...tenants, newTenant])

    // Mark property as rented if tenant is approved
    if (tenant.applicationStatus === "approved" && tenant.propertyId) {
      markPropertyAsRented(tenant.propertyId)
    }

    toast({
      title: "Tenant added",
      description: "The tenant has been successfully added.",
    })

    return newTenant
  }

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    const tenant = getTenant(id)

    setTenants(tenants.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)))

    // Handle property status changes based on application status
    if (tenant && updates.applicationStatus) {
      if (updates.applicationStatus === "approved" && tenant.propertyId) {
        markPropertyAsRented(tenant.propertyId)

        toast({
          title: "Property status updated",
          description: "The property has been marked as rented.",
        })
      } else if (updates.applicationStatus === "rejected" && tenant.propertyId) {
        // Check if there are other approved tenants for this property
        const otherApprovedTenants = tenants.some(
          (t) => t.id !== id && t.propertyId === tenant.propertyId && t.applicationStatus === "approved",
        )

        if (!otherApprovedTenants) {
          markPropertyAsAvailable(tenant.propertyId)
        }
      }
    }

    // Handle property changes
    if (tenant && updates.propertyId) {
      // If property changed, update old and new property statuses
      if (tenant.propertyId !== updates.propertyId) {
        // Check if there are other approved tenants for the old property
        const otherApprovedTenants = tenants.some(
          (t) => t.id !== id && t.propertyId === tenant.propertyId && t.applicationStatus === "approved",
        )

        if (!otherApprovedTenants) {
          markPropertyAsAvailable(tenant.propertyId)
        }

        // Mark new property as rented if tenant is approved
        if (tenant.applicationStatus === "approved" || updates.applicationStatus === "approved") {
          markPropertyAsRented(updates.propertyId)
        }
      }
    }

    toast({
      title: "Tenant updated",
      description: "The tenant information has been successfully updated.",
    })
  }

  const deleteTenant = (id: string) => {
    const tenant = getTenant(id)

    if (tenant && tenant.propertyId && tenant.applicationStatus === "approved") {
      // Check if there are other approved tenants for this property
      const otherApprovedTenants = tenants.some(
        (t) => t.id !== id && t.propertyId === tenant.propertyId && t.applicationStatus === "approved",
      )

      if (!otherApprovedTenants) {
        markPropertyAsAvailable(tenant.propertyId)
      }
    }

    setTenants(tenants.filter((tenant) => tenant.id !== id))

    toast({
      title: "Tenant deleted",
      description: "The tenant has been successfully removed.",
      variant: "destructive",
    })
  }

  const getTenant = (id: string) => {
    return tenants.find((tenant) => tenant.id === id)
  }

  const addDocument = (tenantId: string, document: Omit<Tenant["documents"][0], "id">) => {
    updateTenant(tenantId, {
      documents: [...(getTenant(tenantId)?.documents || []), { ...document, id: crypto.randomUUID() }],
    })

    toast({
      title: "Document added",
      description: "The document has been successfully added to the tenant.",
    })
  }

  const addPayment = (tenantId: string, payment: Omit<Tenant["payments"][0], "id">) => {
    updateTenant(tenantId, {
      payments: [...(getTenant(tenantId)?.payments || []), { ...payment, id: crypto.randomUUID() }],
    })

    toast({
      title: "Payment recorded",
      description: "The payment has been successfully recorded for the tenant.",
    })
  }

  return {
    tenants,
    addTenant,
    updateTenant,
    deleteTenant,
    getTenant,
    addDocument,
    addPayment,
  }
}

