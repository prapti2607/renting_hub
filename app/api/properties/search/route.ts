import { NextResponse } from "next/server"

// Import the mock data from the parent route
import { properties } from "../route"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  // Simulate a slight delay to mimic a real API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  if (!query) {
    return NextResponse.json([])
  }

  // Filter properties based on the search query
  const filteredProperties = properties.filter(
    (property) => property.title.toLowerCase().includes(query) || property.location.toLowerCase().includes(query),
  )

  return NextResponse.json(filteredProperties)
}
