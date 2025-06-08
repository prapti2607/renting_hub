export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: "admin" | "user"
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  // New fields
  avatar?: string
  bio?: string
  alternativeEmail?: string
  preferredContact?: "email" | "phone" | "both"
}

export interface Property {
  id: string
  title: string
  type: "apartment" | "house" | "condo" | "townhouse" | "1rk" | "1bhk" | "2bhk" | "3bhk" | "4bhk"
  description: string
  location: string
  rentAmount: number
  deposit: number
  bedrooms: number
  bathrooms: number
  amenities: string[]
  images: string[]
  videos?: string[]
  listingType: "rent" | "sale" | "lease"
  price?: number // For sale properties
  status: "available" | "rented" | "for_sale" | "maintenance" | "sold"
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  applicationStatus: "pending" | "approved" | "rejected"
  documents: {
    id: string
    name: string
    url: string
    type: string
  }[]
  propertyId: string
  payments: {
    id: string
    date: string
    amount: number
    status: "paid" | "pending" | "overdue"
    receiptUrl?: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  leaseId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "pending" | "overdue"
  paymentMethod?: "cash" | "check" | "bank_transfer" | "credit_card" | "upi" | "online"
  receiptUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Lease {
  id: string
  propertyId: string
  tenantId: string
  startDate: string
  endDate: string
  rentAmount: number
  securityDeposit: number
  status: "active" | "expired" | "terminated"
  payments: {
    id: string
    date: string
    amount: number
    status: "paid" | "pending" | "overdue"
    method?: string
    receiptUrl?: string
    notes?: string
  }[]
  documents: {
    id: string
    name: string
    url: string
    type: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  tenantId: string
  propertyId: string
  leaseId?: string
  amount: number
  date: string
  transactionType: "rent" | "deposit" | "sale" | "fee" | "other"
  paymentMethod: "credit_card" | "debit_card" | "upi" | "bank_transfer" | "online" | "cash" | "check"
  status: "pending" | "completed" | "failed"
  receiptUrl?: string
  reference?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

