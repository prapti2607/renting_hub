"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/use-toast"
import type { Lease, Property, Tenant } from "@/types"
import { FileUp, X } from "lucide-react"

interface AddPaymentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leases: Lease[]
  tenants: Tenant[]
  properties: Property[]
  onAddPayment: (leaseId: string, payment: any) => void
}

export function AddPaymentForm({ open, onOpenChange, leases, tenants, properties, onAddPayment }: AddPaymentFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    leaseId: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    status: "paid",
    method: "cash",
    notes: "",
  })
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptName, setReceiptName] = useState<string>("")

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setReceiptFile(file)
      setReceiptName(file.name)
    }
  }

  const removeReceipt = () => {
    setReceiptFile(null)
    setReceiptName("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let receiptUrl = ""

      if (receiptFile) {
        // In a real app, you would upload the receipt to a server/storage
        const reader = new FileReader()
        receiptUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(receiptFile)
        })
      }

      const payment = {
        id: crypto.randomUUID(),
        amount: Number.parseFloat(formData.amount),
        date: formData.date,
        status: formData.status as "paid" | "pending" | "overdue",
        method: formData.method,
        notes: formData.notes,
        receiptUrl: receiptUrl || undefined,
      }

      await onAddPayment(formData.leaseId, payment)

      // Also update the tenant's payment history
      const lease = leases.find((l) => l.id === formData.leaseId)
      if (lease) {
        const tenant = tenants.find((t) => t.id === lease.tenantId)
        if (tenant) {
          // In a real app, you would update the tenant's payment history here
          toast({
            title: "Payment recorded",
            description: "The payment has been added to the tenant's history.",
          })
        }
      }

      toast({
        title: "Payment recorded",
        description: "The payment has been successfully recorded.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedLease = leases.find((lease) => lease.id === formData.leaseId)
  const tenant = selectedLease ? tenants.find((t) => t.id === selectedLease.tenantId) : null
  const property = selectedLease ? properties.find((p) => p.id === selectedLease.propertyId) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="leaseId">Lease</Label>
            <Select value={formData.leaseId} onValueChange={(value) => handleChange("leaseId", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a lease" />
              </SelectTrigger>
              <SelectContent>
                {leases.map((lease) => {
                  const tenant = tenants.find((t) => t.id === lease.tenantId)
                  const property = properties.find((p) => p.id === lease.propertyId)
                  return (
                    <SelectItem key={lease.id} value={lease.id}>
                      {property?.title} - {tenant?.firstName} {tenant?.lastName}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedLease && (
            <div className="p-3 bg-muted rounded-md text-sm">
              <div>
                <span className="font-medium">Tenant:</span> {tenant?.firstName} {tenant?.lastName}
              </div>
              <div>
                <span className="font-medium">Property:</span> {property?.title}
              </div>
              <div>
                <span className="font-medium">Monthly Rent:</span> ₹{selectedLease.rentAmount.toLocaleString()}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Payment Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={formData.method} onValueChange={(value) => handleChange("method", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="online">Other Online Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Payment Receipt</Label>
            <Input
              id="receipt"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleReceiptChange}
              className="cursor-pointer"
            />
            <div className="text-xs text-muted-foreground">Upload receipt or proof of payment</div>

            {receiptName && (
              <div className="flex items-center justify-between bg-muted p-2 rounded-md mt-2">
                <div className="flex items-center gap-2">
                  <FileUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{receiptName}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={removeReceipt}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes about this payment"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Recording..." : "Record Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

