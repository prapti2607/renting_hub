"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLeases } from "@/hooks/use-leases"
import { useTenants } from "@/hooks/use-tenants"
import { useProperties } from "@/hooks/use-properties"
import { AddPaymentForm } from "@/components/add-payment-form"
import { PaymentDetail } from "@/components/payment-detail"
import { AlertCircle, Check, Clock, Plus, Send, FileDown } from "lucide-react"
import { useToast } from "@/components/use-toast"
import { Input } from "@/components/ui/input"

export function PaymentTracking() {
  const { leases, addPayment, updatePayment } = useLeases()
  const { tenants } = useTenants()
  const { properties } = useProperties()
  const { toast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Extract all payments from all leases
  const allPayments = leases.flatMap((lease) =>
    lease.payments.map((payment) => ({
      ...payment,
      leaseId: lease.id,
      propertyId: lease.propertyId,
      tenantId: lease.tenantId,
      rentAmount: lease.rentAmount,
    })),
  )

  // Filter payments based on search
  const filteredPayments = allPayments.filter((payment) => {
    if (!searchTerm) return true

    const lease = leases.find((l) => l.id === payment.leaseId)
    if (!lease) return false

    // Search by payment amount
    if (payment.amount.toString().includes(searchTerm)) return true

    // Search by payment date
    if (new Date(payment.date).toLocaleDateString().includes(searchTerm)) return true

    // Search by payment status
    if (payment.status.toLowerCase().includes(searchTerm.toLowerCase())) return true

    return false
  })

  // Group payments by status
  const pendingPayments = filteredPayments.filter((p) => p.status === "pending")
  const overduePayments = filteredPayments.filter((p) => p.status === "overdue")
  const paidPayments = filteredPayments.filter((p) => p.status === "paid")

  const handleSendReminder = async (payment: any) => {
    const tenant = tenants.find((t) => t.id === payment.tenantId)

    // In a real app, this would send an actual email
    // For demo purposes, we'll just show a toast
    toast({
      title: "Payment reminder sent",
      description: `Reminder sent to ${tenant?.firstName} ${tenant?.lastName} for payment of ₹${payment.amount.toLocaleString()}`,
    })
  }

  const handleMarkAsPaid = async (payment: any) => {
    const lease = leases.find((l) => l.id === payment.leaseId)
    if (!lease) return

    const updatedPayments = lease.payments.map((p) =>
      p.id === payment.id ? { ...p, status: "paid", date: new Date().toISOString() } : p,
    )

    await updatePayment(lease.id, payment.id, { status: "paid", date: new Date().toISOString() })

    // In a real app, you would update the tenant's payment history here
    const tenant = tenants.find((t) => t.id === payment.tenantId)
    if (tenant) {
      // Update tenant payment history
    }

    toast({
      title: "Payment marked as paid",
      description: `Payment of ₹${payment.amount.toLocaleString()} has been marked as paid.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment Tracking</h2>
          <p className="text-muted-foreground">Manage and track all lease payments</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Search</CardTitle>
          <CardDescription>Search for payments by amount, date, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Input
                placeholder="Search by amount, date, or status"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Payments
          <Badge variant="outline">{pendingPayments.length}</Badge>
        </h3>

        {pendingPayments.length > 0 ? (
          <div className="space-y-4">
            {pendingPayments.map((payment) => {
              const tenant = tenants.find((t) => t.id === payment.tenantId)
              const property = properties.find((p) => p.id === payment.propertyId)

              return (
                <Card key={payment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {tenant?.firstName} {tenant?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{property?.title}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Due: {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge>Pending</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleSendReminder(payment)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reminder
                        </Button>
                        <Button size="sm" onClick={() => handleMarkAsPaid(payment)}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No pending payments found.</div>
        )}

        <h3 className="text-xl font-semibold flex items-center gap-2 mt-8">
          <AlertCircle className="h-5 w-5" />
          Overdue Payments
          <Badge variant="outline">{overduePayments.length}</Badge>
        </h3>

        {overduePayments.length > 0 ? (
          <div className="space-y-4">
            {overduePayments.map((payment) => {
              const tenant = tenants.find((t) => t.id === payment.tenantId)
              const property = properties.find((p) => p.id === payment.propertyId)

              return (
                <Card key={payment.id} className="overflow-hidden border-destructive">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {tenant?.firstName} {tenant?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{property?.title}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                        <div className="text-sm text-destructive">
                          Due: {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="destructive">Overdue</Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleSendReminder(payment)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reminder
                        </Button>
                        <Button size="sm" onClick={() => handleMarkAsPaid(payment)}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No overdue payments found.</div>
        )}

        <h3 className="text-xl font-semibold flex items-center gap-2 mt-8">
          <Check className="h-5 w-5" />
          Paid Payments
          <Badge variant="outline">{paidPayments.length}</Badge>
        </h3>

        {paidPayments.length > 0 ? (
          <div className="space-y-4">
            {paidPayments.map((payment) => {
              const tenant = tenants.find((t) => t.id === payment.tenantId)
              const property = properties.find((p) => p.id === payment.propertyId)

              return (
                <Card key={payment.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                      <div className="space-y-1">
                        <div className="font-medium">
                          {tenant?.firstName} {tenant?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{property?.title}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          Paid: {new Date(payment.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Paid
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedPayment(payment)}>
                          View Details
                        </Button>
                        {payment.receiptUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                              <FileDown className="h-4 w-4 mr-1" />
                              Receipt
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No paid payments found.</div>
        )}
      </div>

      <AddPaymentForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        leases={leases}
        tenants={tenants}
        properties={properties}
        onAddPayment={addPayment}
      />

      {selectedPayment && (
        <PaymentDetail
          payment={selectedPayment}
          open={!!selectedPayment}
          onOpenChange={(open) => !open && setSelectedPayment(null)}
          tenant={tenants.find((t) => t.id === selectedPayment.tenantId)}
          property={properties.find((p) => p.id === selectedPayment.propertyId)}
        />
      )}
    </div>
  )
}

