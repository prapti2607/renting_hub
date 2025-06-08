"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Landmark, Smartphone, AlertCircle, Check, ArrowRight, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useProperties } from "@/hooks/use-properties"
import { useTenants } from "@/hooks/use-tenants"

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  propertyId: z.string().min(1, { message: "Please select a property" }),
  tenantId: z.string().min(1, { message: "Please select a tenant" }),
  transactionType: z.enum(["rent", "deposit", "sale", "fee", "other"]),
  notes: z.string().optional(),
})

const cardDetailsSchema = z.object({
  cardNumber: z.string().min(16, { message: "Card number must be 16 digits" }).max(19),
  cardHolder: z.string().min(1, { message: "Please enter card holder name" }),
  expiryDate: z.string().min(5, { message: "Please enter expiry date" }),
  cvv: z.string().min(3, { message: "CVV must be 3 or 4 digits" }).max(4),
})

const bankDetailsSchema = z.object({
  accountNumber: z.string().min(8, { message: "Please enter valid account number" }),
  ifscCode: z.string().min(11, { message: "Please enter valid IFSC code" }),
  accountHolder: z.string().min(1, { message: "Please enter account holder name" }),
})

const upiDetailsSchema = z.object({
  upiId: z.string().min(1, { message: "Please enter UPI ID" }),
})

export function OnlineTransactionForm() {
  const { toast } = useToast()
  const { properties } = useProperties()
  const { tenants } = useTenants()
  const [paymentTab, setPaymentTab] = useState("card")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState<any>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      transactionType: "rent",
      notes: "",
    },
  })

  const cardForm = useForm<z.infer<typeof cardDetailsSchema>>({
    resolver: zodResolver(cardDetailsSchema),
  })

  const bankForm = useForm<z.infer<typeof bankDetailsSchema>>({
    resolver: zodResolver(bankDetailsSchema),
  })

  const upiForm = useForm<z.infer<typeof upiDetailsSchema>>({
    resolver: zodResolver(upiDetailsSchema),
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let paymentDetails: any = {}
    let isValid = false

    // Validate the payment method details based on the selected tab
    if (paymentTab === "card") {
      const cardResult = await cardForm.trigger()
      if (cardResult) {
        paymentDetails = cardForm.getValues()
        isValid = true
      }
    } else if (paymentTab === "bank") {
      const bankResult = await bankForm.trigger()
      if (bankResult) {
        paymentDetails = bankForm.getValues()
        isValid = true
      }
    } else if (paymentTab === "upi") {
      const upiResult = await upiForm.trigger()
      if (upiResult) {
        paymentDetails = upiForm.getValues()
        isValid = true
      }
    }

    if (isValid) {
      const propertyDetails = properties.find((p) => p.id === values.propertyId)
      const tenantDetails = tenants.find((t) => t.id === values.tenantId)

      // Prepare transaction details for confirmation
      setTransactionDetails({
        ...values,
        paymentMethod: paymentTab,
        paymentDetails,
        property: propertyDetails,
        tenant: tenantDetails,
        date: new Date().toISOString(),
      })

      setShowConfirmation(true)
    }
  }

  const processPayment = async () => {
    setProcessingPayment(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setProcessingPayment(false)
      setShowConfirmation(false)
      setShowSuccess(true)

      // Generate a receipt ID
      const receiptId = `RCT-${Date.now().toString().slice(-8)}`

      // In a real app, you would save the transaction and receipt to your database here
    } catch (error) {
      setProcessingPayment(false)
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
      })
    }
  }

  const handleTransactionComplete = () => {
    setShowSuccess(false)
    form.reset()
    cardForm.reset()
    bankForm.reset()
    upiForm.reset()
    setPaymentTab("card")
  }

  const selectedProperty = properties.find((p) => p.id === form.watch("propertyId"))
  const selectedPropertyType = selectedProperty?.listingType || "rent"

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
          <CardDescription>Pay online for your property transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tenantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant/Buyer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tenant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.firstName} {tenant.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedPropertyType === "sale" ? (
                          <SelectItem value="sale">Property Purchase</SelectItem>
                        ) : (
                          <>
                            <SelectItem value="rent">Rent Payment</SelectItem>
                            <SelectItem value="deposit">Security Deposit</SelectItem>
                          </>
                        )}
                        <SelectItem value="fee">Maintenance Fee</SelectItem>
                        <SelectItem value="other">Other Payment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any additional information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                  <Tabs defaultValue="card" value={paymentTab} onValueChange={setPaymentTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Card
                      </TabsTrigger>
                      <TabsTrigger value="bank">
                        <Landmark className="h-4 w-4 mr-2" />
                        Bank
                      </TabsTrigger>
                      <TabsTrigger value="upi">
                        <Smartphone className="h-4 w-4 mr-2" />
                        UPI
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="card">
                      <Card>
                        <CardContent className="pt-4 space-y-4">
                          <Form {...cardForm}>
                            <div className="space-y-4">
                              <FormField
                                control={cardForm.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="1234 5678 9012 3456"
                                        {...field}
                                        maxLength={19}
                                        onChange={(e) => {
                                          // Format card number with spaces
                                          const value = e.target.value.replace(/\s/g, "")
                                          let formattedValue = ""
                                          for (let i = 0; i < value.length; i++) {
                                            if (i > 0 && i % 4 === 0) {
                                              formattedValue += " "
                                            }
                                            formattedValue += value[i]
                                          }
                                          field.onChange(formattedValue)
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={cardForm.control}
                                name="cardHolder"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Holder Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={cardForm.control}
                                  name="expiryDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiry Date</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="MM/YY"
                                          {...field}
                                          maxLength={5}
                                          onChange={(e) => {
                                            // Format expiry date
                                            let value = e.target.value.replace(/\D/g, "")
                                            if (value.length > 2) {
                                              value = value.slice(0, 2) + "/" + value.slice(2, 4)
                                            }
                                            field.onChange(value)
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={cardForm.control}
                                  name="cvv"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVV</FormLabel>
                                      <FormControl>
                                        <Input type="password" placeholder="123" {...field} maxLength={4} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </Form>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="bank">
                      <Card>
                        <CardContent className="pt-4 space-y-4">
                          <Form {...bankForm}>
                            <div className="space-y-4">
                              <FormField
                                control={bankForm.control}
                                name="accountNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Account Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter account number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={bankForm.control}
                                name="ifscCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>IFSC Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="ABCD0123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={bankForm.control}
                                name="accountHolder"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Account Holder Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </Form>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="upi">
                      <Card>
                        <CardContent className="pt-4 space-y-4">
                          <Form {...upiForm}>
                            <div className="space-y-4">
                              <FormField
                                control={upiForm.control}
                                name="upiId"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>UPI ID</FormLabel>
                                    <FormControl>
                                      <Input placeholder="name@upi" {...field} />
                                    </FormControl>
                                    <FormDescription>Enter your UPI ID (e.g., name@okaxis, name@ybl)</FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </Form>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Proceed to Pay
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
            <DialogDescription>Please review the details before completing your payment</DialogDescription>
          </DialogHeader>

          {transactionDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium">₹{transactionDetails.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Type</p>
                  <p className="font-medium capitalize">{transactionDetails.transactionType.replace("_", " ")}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="font-medium">{transactionDetails.property?.title}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tenant/Buyer</p>
                <p className="font-medium">
                  {transactionDetails.tenant?.firstName} {transactionDetails.tenant?.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium capitalize">{transactionDetails.paymentMethod}</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  By proceeding, you agree to our terms and conditions for online payments.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={processPayment} disabled={processingPayment}>
              {processingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {processingPayment ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              Payment Successful
            </DialogTitle>
            <DialogDescription>Your payment has been processed successfully</DialogDescription>
          </DialogHeader>

          {transactionDetails && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-center text-green-800 font-medium mb-1">
                  Payment of ₹{transactionDetails.amount.toLocaleString()} completed
                </p>
                <p className="text-center text-green-600 text-sm">
                  Transaction ID: TXN-{Date.now().toString().slice(-8)}
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Receipt ID</p>
                    <p className="font-medium">RCT-{Date.now().toString().slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">{new Date().toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="font-medium">{transactionDetails.property?.title}</p>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Paid By</p>
                  <p className="font-medium">
                    {transactionDetails.tenant?.firstName} {transactionDetails.tenant?.lastName}
                  </p>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800">
                  A receipt has been generated and will be available in your transaction history.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleTransactionComplete}>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

