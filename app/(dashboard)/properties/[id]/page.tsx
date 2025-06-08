"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useProperties } from "@/hooks/use-properties"
import { PropertyDetail } from "@/components/property-detail"
import { AddPropertyForm } from "@/components/add-property-form"
import { DashboardHeader } from "@/app/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Play } from "lucide-react"
import { useToast } from "@/components/use-toast"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { properties, getProperty } = useProperties()
  const { toast } = useToast()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      const propertyId = Array.isArray(params.id) ? params.id[0] : params.id
      const foundProperty = getProperty(propertyId)

      if (foundProperty) {
        setProperty(foundProperty)
      }

      setLoading(false)
    }
  }, [params.id, properties, getProperty])

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleBack = () => {
    router.back()
  }

  const handleVideoError = () => {
    setVideoError("There was an error playing this video. The format may be unsupported.")
    toast({
      title: "Video Error",
      description: "There was an error playing this video. The format may be unsupported.",
      variant: "destructive",
    })
  }

  const playVideo = (index: number) => {
    setVideoError(null)
    setShowDetailDialog(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <div className="grid gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="space-y-6">
        <DashboardHeader heading="Property Not Found" text="The property you're looking for doesn't exist" />
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DashboardHeader heading={property.title} text={property.location} />
        </div>
        <Button onClick={() => setShowDetailDialog(true)}>View Details</Button>
      </div>

      <div
        className="aspect-video relative rounded-lg overflow-hidden cursor-pointer"
        onClick={() => setShowDetailDialog(true)}
      >
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">No image available</div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Property Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="text-2xl font-bold">
                {property.listingType === "sale" || property.status === "for_sale" ? (
                  <>₹{property.price?.toLocaleString() || property.rentAmount.toLocaleString()}</>
                ) : (
                  <>
                    ₹{property.rentAmount.toLocaleString()}
                    <span className="text-muted-foreground text-sm font-normal">/month</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === "available"
                      ? "bg-green-100 text-green-800"
                      : property.status === "for_sale"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {property.status === "for_sale"
                    ? "For Sale"
                    : property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
              </div>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{property.bedrooms}</span> beds
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{property.bathrooms}</span> baths
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold capitalize">{property.type}</span>
              </div>
            </div>

            {property.deposit > 0 && (
              <div className="text-sm">
                <span className="font-semibold">Security Deposit:</span> ₹{property.deposit.toLocaleString()}
              </div>
            )}

            <div className="pt-2">
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity: string) => (
              <div key={amenity} className="px-3 py-1 bg-muted rounded-full text-sm">
                {amenity}
              </div>
            ))}
          </div>

          {property.videos && property.videos.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Videos</h2>
              <div className="grid gap-2">
                {property.videos.map((video: string, index: number) => (
                  <div
                    key={index}
                    className="p-3 bg-muted rounded-lg flex items-center gap-2 cursor-pointer hover:bg-muted/80 transition-colors"
                    onClick={() => playVideo(index)}
                  >
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Play className="h-4 w-4 text-primary" />
                    </div>
                    <span>Property Video {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDetailDialog && (
        <PropertyDetail
          property={property}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          onEdit={handleEdit}
        />
      )}

      <AddPropertyForm open={showEditForm} onOpenChange={setShowEditForm} propertyToEdit={property} />
    </div>
  )
}

