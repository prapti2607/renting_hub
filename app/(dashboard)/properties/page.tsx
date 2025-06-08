import { PropertyList } from "@/app/components/property-list"
import { DashboardHeader } from "@/app/components/dashboard-header"

export default function PropertiesPage() {
  return (
    <div className="space-y-4">
      <DashboardHeader heading="Properties" text="Manage your rental properties" />
      <PropertyList />
    </div>
  )
}

