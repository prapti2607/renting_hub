"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { FileDown, MoreVertical, Search } from "lucide-react"
import { useToast } from "@/components/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function TransactionHistory() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  // Sample transaction data - in a real app, you would fetch this from an API
  const transactions = [
    {
      id: "txn-12345678",
      tenantId: "tenant-1",
      propertyId: "property-1",
      amount: 25000,
      date: "2023-04-15T10:30:00",
      transactionType: "rent",
      paymentMethod: "credit_card",
      status: "completed",
      receiptUrl: "#",
      tenantName: "John Doe",
      propertyName: "Skyline Apartments",
    },
    {
      id: "txn-23456789",
      tenantId: "tenant-2",
      propertyId: "property-2",
      amount: 50000,
      date: "2023-04-12T14:15:00",
      transactionType: "deposit",
      paymentMethod: "bank_transfer",
      status: "completed",
      receiptUrl: "#",
      tenantName: "Jane Smith",
      propertyName: "Green Valley Villa",
    },
    {
      id: "txn-34567890",
      tenantId: "tenant-3",
      propertyId: "property-3",
      amount: 2000000,
      date: "2023-04-10T09:45:00",
      transactionType: "sale",
      paymentMethod: "bank_transfer",
      status: "completed",
      receiptUrl: "#",
      tenantName: "Alex Johnson",
      propertyName: "Lakeside Bungalow",
    },
    {
      id: "txn-45678901",
      tenantId: "tenant-1",
      propertyId: "property-1",
      amount: 5000,
      date: "2023-04-05T16:20:00",
      transactionType: "fee",
      paymentMethod: "upi",
      status: "completed",
      receiptUrl: "#",
      tenantName: "John Doe",
      propertyName: "Skyline Apartments",
    },
    {
      id: "txn-56789012",
      tenantId: "tenant-4",
      propertyId: "property-4",
      amount: 30000,
      date: "2023-04-01T11:10:00",
      transactionType: "rent",
      paymentMethod: "debit_card",
      status: "pending",
      receiptUrl: null,
      tenantName: "Sarah Williams",
      propertyName: "Urban Heights",
    },
  ]

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.tenantName.toLowerCase().includes(searchLower) ||
      transaction.propertyName.toLowerCase().includes(searchLower) ||
      transaction.transactionType.toLowerCase().includes(searchLower) ||
      transaction.amount.toString().includes(searchLower)
    )
  })

  const handleViewReceipt = (transaction: any) => {
    setSelectedTransaction(transaction)
  }

  const downloadReceipt = (transaction: any) => {
    // In a real app, this would initiate a download
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for ${transaction.id} has been downloaded.`,
    })
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage your payment transactions</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.propertyName}</p>
                      <Badge
                        variant={transaction.status === "completed" ? "outline" : "secondary"}
                        className={
                          transaction.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""
                        }
                      >
                        {transaction.status === "completed" ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.tenantName}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="capitalize">
                        {transaction.transactionType.replace("_", " ")}
                      </Badge>
                      <span className="text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold">₹{transaction.amount.toLocaleString()}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewReceipt(transaction)}>View Receipt</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadReceipt(transaction)}>
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">No transactions found</div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Transaction Receipt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-center text-lg font-semibold">₹{selectedTransaction.amount.toLocaleString()}</p>
                <p className="text-center text-sm text-muted-foreground">
                  {selectedTransaction.status === "completed" ? "Payment Completed" : "Payment Pending"}
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-medium">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(selectedTransaction.date).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="font-medium">{selectedTransaction.propertyName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Tenant/Buyer</p>
                  <p className="font-medium">{selectedTransaction.tenantName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedTransaction.transactionType.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <p className="font-medium capitalize">{selectedTransaction.paymentMethod.replace("_", " ")}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => downloadReceipt(selectedTransaction)}>
                <FileDown className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

