"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Lease } from "@/types"
import { useToast } from "@/components/use-toast"

export function useLeases() {
  const [leases, setLeases] = useLocalStorage<Lease[]>("leases", [])
  const { toast } = useToast()

  const addLease = (lease: Omit<Lease, "id" | "createdAt" | "updatedAt">) => {
    const newLease: Lease = {
      ...lease,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setLeases([...leases, newLease])

    toast({
      title: "Lease added",
      description: "The lease has been successfully created.",
    })

    return newLease
  }

  const updateLease = (id: string, updates: Partial<Lease>) => {
    setLeases(
      leases.map((lease) => (lease.id === id ? { ...lease, ...updates, updatedAt: new Date().toISOString() } : lease)),
    )

    toast({
      title: "Lease updated",
      description: "The lease has been successfully updated.",
    })
  }

  const deleteLease = (id: string) => {
    setLeases(leases.filter((lease) => lease.id !== id))

    toast({
      title: "Lease deleted",
      description: "The lease has been successfully deleted.",
      variant: "destructive",
    })
  }

  const getLease = (id: string) => {
    return leases.find((lease) => lease.id === id)
  }

  const addPayment = (leaseId: string, payment: Omit<Lease["payments"][0], "id">) => {
    const lease = getLease(leaseId)
    if (!lease) return

    updateLease(leaseId, {
      payments: [...(lease.payments || []), { ...payment, id: crypto.randomUUID() }],
    })

    // Check if payment is overdue and show notification
    if (payment.status === "overdue") {
      toast({
        title: "Overdue Payment",
        description: `A payment of ₹${payment.amount} is overdue for lease #${leaseId.substring(0, 8)}`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Payment recorded",
        description: `A payment of ₹${payment.amount} has been recorded for lease #${leaseId.substring(0, 8)}`,
      })
    }

    return payment
  }

  const updatePayment = (leaseId: string, paymentId: string, updates: Partial<Lease["payments"][0]>) => {
    const lease = getLease(leaseId)
    if (!lease) return

    const updatedPayments = lease.payments.map((payment) =>
      payment.id === paymentId ? { ...payment, ...updates } : payment,
    )

    updateLease(leaseId, {
      payments: updatedPayments,
    })

    toast({
      title: "Payment updated",
      description: "The payment information has been successfully updated.",
    })
  }

  const addDocument = (leaseId: string, document: Omit<Lease["documents"][0], "id">) => {
    updateLease(leaseId, {
      documents: [...(getLease(leaseId)?.documents || []), { ...document, id: crypto.randomUUID() }],
    })

    toast({
      title: "Document added",
      description: "The document has been successfully added to the lease.",
    })
  }

  // Check for overdue payments
  const checkOverduePayments = () => {
    const today = new Date()
    let hasOverdue = false

    leases.forEach((lease) => {
      lease.payments.forEach((payment) => {
        const dueDate = new Date(payment.date)
        if (payment.status === "pending" && dueDate < today) {
          // Mark payment as overdue
          updatePayment(lease.id, payment.id, { status: "overdue" })
          hasOverdue = true
        }
      })
    })

    if (hasOverdue) {
      toast({
        title: "Overdue Payments Detected",
        description: "Some payments are now overdue. Please check the payments section.",
        variant: "destructive",
      })
    }
  }

  return {
    leases,
    addLease,
    updateLease,
    deleteLease,
    getLease,
    addPayment,
    updatePayment,
    addDocument,
    checkOverduePayments,
  }
}

