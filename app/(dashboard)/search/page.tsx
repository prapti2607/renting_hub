"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProperties } from "@/hooks/use-properties"
import { DashboardHeader } from "@/app/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { PropertyCard } from "@/components/property-card"
import { Search, Filter, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function SearchPage() {
  const router = useRouter()
  const { properties } = useProperties()
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyType, setPropertyType] = useState<string>("")
  const [availability, setAvailability] = useState<string>("")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [filteredProperties, setFilteredProperties] = useState(properties)
  const [location, setLocation] = useState<string>("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [isSearching, setIsSearching] = useState(false)

  // Extract unique locations from properties
  const uniqueLocations = Array.from(
    new Set(
      properties.map((p) => {
        const parts = p.location.split(",")
        return parts[1]?.trim() || parts[0]?.trim()
      }),
    ),
  ).filter(Boolean)

  // Filter properties based on search and filters
  useEffect(() => {
    let result = properties

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (propertyType && propertyType !== "all") {
      result = result.filter((p) => p.type === propertyType)
    }

    if (location && location !== "all") {
      result = result.filter((p) => p.location.includes(location))
    }

    if (availability && availability !== "all") {
      if (availability === "rent") {
        result = result.filter((p) => p.listingType === "rent" || (!p.listingType && p.status === "available"))
      } else if (availability === "sale") {
        result = result.filter((p) => p.listingType === "sale" || p.status === "for_sale")
      } else if (availability === "lease") {
        result = result.filter((p) => p.listingType === "lease")
      }
    }

    result = result.filter((p) => {
      const amount = p.listingType === "sale" ? p.price || 0 : p.rentAmount
      return amount >= priceRange[0] && amount <= priceRange[1]
    })

    setFilteredProperties(result)
  }, [searchTerm, propertyType, availability, priceRange, location, properties])

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`)
  }

  const handleSearch = () => {
    setIsSearching(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setPropertyType("")
    setLocation("")
    setAvailability("")
    setPriceRange([0, 100000])
  }

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Property Search" text="Find your perfect property" />

      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
          <CardDescription>Refine your search with specific criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, location, or description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="w-full md:w-[180px] space-y-2">
                <label className="text-sm font-medium">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="1rk">1RK</SelectItem>
                    <SelectItem value="1bhk">1BHK</SelectItem>
                    <SelectItem value="2bhk">2BHK</SelectItem>
                    <SelectItem value="3bhk">3BHK</SelectItem>
                    <SelectItem value="4bhk">4BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All locations</SelectItem>
                    {uniqueLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any status</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="lease">For Lease</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Budget</label>
                  <span className="text-sm text-muted-foreground">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 100000]}
                  min={0}
                  max={100000}
                  step={1000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search Properties
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} found
          </span>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-6">
        <Tabs>
        <TabsContent value="grid" className="mt-0">
          {filteredProperties.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <div key={property.id} className="cursor-pointer" onClick={() => handlePropertyClick(property.id)}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No properties found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search filters</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          {filteredProperties.length > 0 ? (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePropertyClick(property.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-[200px] md:h-auto md:w-[280px] flex-shrink-0">
                      <img
                        src={property.images[0] || "/placeholder.svg?height=200&width=280"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        variant={
                          property.status === "available"
                            ? "default"
                            : property.status === "for_sale"
                              ? "outline"
                              : "secondary"
                        }
                        className="absolute top-2 right-2"
                      >
                        {property.status === "for_sale"
                          ? "For Sale"
                          : property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        {property.status === "for_sale" ? (
                          <span className="font-bold">₹{property.price?.toLocaleString()}</span>
                        ) : (
                          <span className="font-bold">₹{property.rentAmount.toLocaleString()}/mo</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <p className="text-sm">{property.location}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{property.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <span className="text-sm">
                          {property.bedrooms} beds • {property.bathrooms} baths
                        </span>
                        <span className="text-sm capitalize">{property.type}</span>
                        {property.deposit > 0 && (
                          <span className="text-sm">Deposit: ₹{property.deposit.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {property.amenities.slice(0, 3).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="font-normal">
                            {amenity}
                          </Badge>
                        ))}
                        {property.amenities.length > 3 && (
                          <Badge variant="outline" className="font-normal">
                            +{property.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <div className="flex justify-center mb-4">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No properties found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search filters</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

