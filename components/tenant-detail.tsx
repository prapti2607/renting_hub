"use client"

import { useState } from "react"
import type { Tenant } from "@/types"
import { useTenants } from "@/hooks/use-tenants"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { toast } from "@/components/use-toast"

interface TenantDetailProps {
  tenant: Tenant
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (tenant: Tenant) => void
}

export function TenantDetail({ tenant, open, onOpenChange, onEdit }: TenantDetailProps) {
  const { deleteTenant } = useTenants()
  const { properties } = useProperties()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    deleteTenant(tenant.id)
    setShowDeleteDialog(false)
    onOpenChange(false)
  }

  const property = properties.find((p) => p.id === tenant.propertyId)

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
              <DialogTitle className="text-2xl">
                {tenant.firstName} {tenant.lastName}
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    onEdit(tenant)
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
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div>{tenant.email}</div>
                </div>
                <Badge variant={tenant.applicationStatus === "approved" ? "default" : "secondary"}>
                  {tenant.applicationStatus}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Phone</div>
                <div>{tenant.phone}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Property</div>
                <div>{property?.title || "No property assigned"}</div>
              </div>

              <Tabs defaultValue="documents">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="pt-4">
                  {tenant.documents.length > 0 ? (
                    <div className="grid gap-2">
                      {tenant.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center gap-2">
                            <FileDown className="h-4 w-4 text-muted-foreground" />
                            <span>{doc.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{doc.type}</Badge>
                            <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc.url)}>
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No documents uploaded</div>
                  )}
                </TabsContent>

                <TabsContent value="payments" className="pt-4">
                  {tenant.payments && tenant.payments.length > 0 ? (
                    <div className="space-y-3">
                      {tenant.payments.map((payment) => (
                        <Card key={payment.id}>
                          <CardHeader className="py-2 px-4">
                            <div className="flex justify-between items-center">
                              <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                              <Badge
                                variant={
                                  payment.status === "paid"
                                    ? "default"
                                    : payment.status === "pending"
                                      ? "outline"
                                      : "destructive"
                                }
                              >
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="text-sm text-muted-foreground">
                              {new Date(payment.date).toLocaleDateString()}
                            </div>
                            {payment.receiptUrl && (
                              <a
                                href={payment.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1"
                              >
                                <FileDown className="h-3 w-3" />
                                View Receipt
                              </a>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-4">No payment history</div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tenant and remove all associated records.
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

