import { PaymentTracking } from "@/components/payment-tracking"
import { DashboardHeader } from "@/app/components/dashboard-header"

export default function PaymentsPage() {
  return (
    <div className="space-y-4">
      <DashboardHeader heading="Payments" text="Track and manage all property payments" />
      <PaymentTracking />
    </div>
  )
}

