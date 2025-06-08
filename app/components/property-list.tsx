"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useProperties } from "@/hooks/use-properties"
import { AddPropertyForm } from "@/components/add-property-form"
import { PropertyDetail } from "@/components/property-detail"
import { PropertyCard } from "@/components/property-card"
import type { Property } from "@/types"

export function PropertyList() {
  const { properties } = useProperties()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null)

  const handleEdit = (property: Property) => {
    setPropertyToEdit(property)
    setShowAddForm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Properties</h2>
        <Button
          onClick={() => {
            setPropertyToEdit(null)
            setShowAddForm(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div key={property.id} className="cursor-pointer" onClick={() => setSelectedProperty(property)}>
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      <AddPropertyForm open={showAddForm} onOpenChange={setShowAddForm} propertyToEdit={propertyToEdit} />

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          open={!!selectedProperty}
          onOpenChange={(open) => !open && setSelectedProperty(null)}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}

