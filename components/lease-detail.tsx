"use client"

import { useState } from "react"
import type { Lease } from "@/types"
import { useLeases } from "@/hooks/use-leases"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, FileDown } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProperties } from "@/hooks/use-properties"
import { useTenants } from "@/hooks/use-tenants"
import { useToast } from "@/components/use-toast"

interface LeaseDetailProps {
  lease: Lease
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (lease: Lease) => void
}

export function LeaseDetail({ lease, open, onOpenChange, onEdit }: LeaseDetailProps) {
  const { deleteLease } = useLeases()
  const { properties } = useProperties()
  const { tenants } = useTenants()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    deleteLease(lease.id)
    setShowDeleteDialog(false)
    onOpenChange(false)

    toast({
      title: "Lease deleted",
      description: "The lease has been successfully deleted.",
      variant: "destructive",
    })
  }

  const property = properties.find((p) => p.id === lease.propertyId)
  const tenant = tenants.find((t) => t.id === lease.tenantId)

  const handleViewDocument = (docUrl: string) => {
    window.open(docUrl, "_blank")

    toast({
      title: "Opening document",
      description: "The document is being opened in a new tab.",
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle className="text-2xl">{property?.title} - Lease Details</DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    onEdit(lease)
                    onOpenChange(false)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Tenant</div>
                  <div>{tenant ? `${tenant.firstName} ${tenant.lastName}` : "Unknown Tenant"}</div>
                </div>
                <Badge variant={lease.status === "active" ? "default" : "secondary"}>{lease.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Start Date</div>
                  <div>{new Date(lease.startDate).toLocaleDateString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">End Date</div>
                  <div>{new Date(lease.endDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Monthly Rent</div>
                  <div>₹{lease.rentAmount}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Security Deposit</div>
                  <div>₹{lease.securityDeposit}</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Payment History</h3>
                {lease.payments.length > 0 ? (
                  <div className="grid gap-2">
                    {lease.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <div>{new Date(payment.date).toLocaleDateString()}</div>
                          <div className="text-sm text-muted-foreground">₹{payment.amount}</div>
                        </div>
                        <Badge variant={payment.status === "paid" ? "default" : "secondary"}>{payment.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No payment history</div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Documents</h3>
                {lease.documents.length > 0 ? (
                  <div className="grid gap-2">
                    {lease.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between">
                        <span>{doc.name}</span>
                        <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc.url)}>
                          <FileDown className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No documents uploaded</div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lease agreement and all associated records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

