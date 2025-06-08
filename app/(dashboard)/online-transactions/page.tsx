import { DashboardHeader } from "@/app/components/dashboard-header"
import { OnlineTransactionForm } from "@/components/online-transaction-form"
import { TransactionHistory } from "@/components/transaction-history"

export default function OnlineTransactionsPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Online Transactions" text="Make and manage online payments for your properties" />

      <div className="grid gap-6 md:grid-cols-2">
        <OnlineTransactionForm />
        <TransactionHistory />
      </div>
    </div>
  )
}

