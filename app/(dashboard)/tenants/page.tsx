import { TenantList } from "@/app/components/tenant-list"
import { DashboardHeader } from "@/app/components/dashboard-header"

export default function TenantsPage() {
  return (
    <div className="space-y-4">
      <DashboardHeader heading="Tenants" text="Manage your tenants" />
      <TenantList />
    </div>
  )
}

