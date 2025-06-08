import { LeaseManagement } from "@/app/components/lease-management"
import { DashboardHeader } from "@/app/components/dashboard-header"

export default function LeasesPage() {
  return (
    <div className="space-y-4">
      <DashboardHeader heading="Leases" text="Manage your lease agreements" />
      <LeaseManagement />
    </div>
  )
}

