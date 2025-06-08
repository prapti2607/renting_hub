"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Property } from "@/types"
import { useToast } from "@/components/use-toast"

export function useProperties() {
  const [properties, setProperties] = useLocalStorage<Property[]>("properties", [])
  const { toast } = useToast()

  // Fix property not displaying after adding by ensuring state updates
  const addProperty = (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    const newProperty: Property = {
      ...property,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Update state with new property
    setProperties((prevProperties) => [...prevProperties, newProperty])

    toast({
      title: "Property added",
      description: "The property has been successfully added.",
    })

    return newProperty
  }

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(
      properties.map((property) =>
        property.id === id ? { ...property, ...updates, updatedAt: new Date().toISOString() } : property,
      ),
    )

    toast({
      title: "Property updated",
      description: "The property has been successfully updated.",
    })
  }

  const deleteProperty = (id: string) => {
    setProperties(properties.filter((property) => property.id !== id))

    toast({
      title: "Property deleted",
      description: "The property has been successfully deleted.",
      variant: "destructive",
    })
  }

  const getProperty = (id: string) => {
    return properties.find((property) => property.id === id)
  }

  // Ensure property status updates correctly
  const markPropertyAsRented = (propertyId: string) => {
    const property = getProperty(propertyId)
    if (property && property.status === "available") {
      updateProperty(propertyId, { status: "rented" })

      toast({
        title: "Property status updated",
        description: "The property has been marked as rented.",
      })
    }
  }

  // Mark property as available when a tenant is removed
  const markPropertyAsAvailable = (propertyId: string) => {
    const property = getProperty(propertyId)
    if (property && property.status === "rented") {
      updateProperty(propertyId, { status: "available" })

      toast({
        title: "Property status updated",
        description: "The property has been marked as available.",
      })
    }
  }

  return {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    getProperty,
    markPropertyAsRented,
    markPropertyAsAvailable,
  }
}

