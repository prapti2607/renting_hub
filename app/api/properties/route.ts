import { NextResponse } from "next/server"

// Mock data for properties
const properties = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    location: "123 Main St, Downtown",
    price: 1500,
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 850,
    imageUrl: "/placeholder.svg?height=400&width=600",
    tenantId: null,
    status: "Available",
  },
  {
    id: "2",
    title: "Spacious Family Home",
    location: "456 Oak Ave, Suburbia",
    price: 2200,
    bedrooms: 4,
    bathrooms: 2.5,
    squareFeet: 1800,
    imageUrl: "/placeholder.svg?height=400&width=600",
    tenantId: "tenant-123",
    status: "Rented",
  },
  {
    id: "3",
    title: "Cozy Studio Apartment",
    location: "789 Pine St, Midtown",
    price: 950,
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 500,
    imageUrl: "/placeholder.svg?height=400&width=600",
    tenantId: null,
    status: "Available",
  },
  {
    id: "4",
    title: "Luxury Penthouse",
    location: "101 Skyline Blvd, Highrise",
    price: 3500,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1500,
    imageUrl: "/placeholder.svg?height=400&width=600",
    tenantId: null,
    status: "Available",
  },
]

export async function GET() {
  // Simulate a slight delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(properties)
}

export async function POST(request: Request) {
  try {
    // In a real app, you would save the data to a database
    // For now, we'll just return a success response
    return NextResponse.json({ success: true, message: "Property added successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error adding property:", error)
    return NextResponse.json({ success: false, message: "Failed to add property" }, { status: 500 })
  }
}
