"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Property, Tenant } from "@/types"
import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentDetailProps {
  payment: any
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant | undefined
  property: Property | undefined
}

export function PaymentDetail({ payment, open, onOpenChange, tenant, property }: PaymentDetailProps) {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "outline"
      case "pending":
        return "default"
      case "overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
              <p className="text-lg font-semibold">₹{payment.amount.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Badge variant={getBadgeVariant(payment.status)} className="mt-1">
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
              <p>{new Date(payment.date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Method</h3>
              <p>{payment.method ? payment.method.replace("_", " ") : "N/A"}</p>
            </div>
          </div>

          {payment.receiptUrl && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Receipt</h3>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={payment.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  View Receipt
                </a>
              </Button>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Tenant</h3>
            {tenant ? (
              <div>
                <p className="font-medium">
                  {tenant.firstName} {tenant.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{tenant.email}</p>
                <p className="text-sm text-muted-foreground">{tenant.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Tenant information not available</p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Property</h3>
            {property ? (
              <div>
                <p className="font-medium">{property.title}</p>
                <p className="text-sm text-muted-foreground">{property.location}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Property information not available</p>
            )}
          </div>

          {payment.notes && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <p className="text-sm">{payment.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

