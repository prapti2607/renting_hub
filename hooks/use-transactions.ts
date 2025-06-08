"use client"

import { useLocalStorage } from "./use-local-storage"
import type { Transaction } from "@/types"
import { useToast } from "@/components/use-toast"

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", [])
  const { toast } = useToast()

  const addTransaction = (transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTransactions([newTransaction, ...transactions])

    // Show notification for successful transaction
    toast({
      title: "Transaction Successful",
      description: `${transaction.transactionType === "sale" ? "Purchase" : "Payment"} of ₹${transaction.amount.toLocaleString()} has been recorded.`,
    })

    return newTransaction
  }

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updates, updatedAt: new Date().toISOString() } : transaction,
      ),
    )
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id))
  }

  const getTransaction = (id: string) => {
    return transactions.find((transaction) => transaction.id === id)
  }

  const generateReceipt = (transactionId: string) => {
    const transaction = getTransaction(transactionId)
    if (!transaction) return null

    // In a real app, you would generate a PDF receipt here
    // For demo purposes, we'll just return a receipt URL
    const receiptUrl = `receipt-${transaction.id}.pdf`

    // Update the transaction with the receipt URL
    updateTransaction(transactionId, { receiptUrl })

    return receiptUrl
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    generateReceipt,
  }
}

