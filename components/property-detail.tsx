"use client"

import { useState } from "react"
import type { Property } from "@/types"
import { useProperties } from "@/hooks/use-properties"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ChevronLeft, ChevronRight, Play, AlertCircle } from "lucide-react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useTenants } from "@/hooks/use-tenants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/use-toast"

interface PropertyDetailProps {
  property: Property
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (property: Property) => void
}

export function PropertyDetail({ property, open, onOpenChange, onEdit }: PropertyDetailProps) {
  const { deleteProperty } = useProperties()
  const { tenants } = useTenants()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videoError, setVideoError] = useState<string | null>(null)

  const propertyTenants = tenants.filter((tenant) => tenant.propertyId === property.id)

  const handleDelete = () => {
    deleteProperty(property.id)
    setShowDeleteDialog(false)
    onOpenChange(false)

    toast({
      title: "Property deleted",
      description: "The property has been successfully deleted.",
      variant: "destructive",
    })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  const handleVideoError = () => {
    setVideoError("There was an error playing this video. The format may be unsupported.")
    toast({
      title: "Video Error",
      description: "There was an error playing this video. The format may be unsupported.",
      variant: "destructive",
    })
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default"
      case "rented":
        return "secondary"
      case "for_sale":
        return "outline"
      case "sold":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "for_sale":
        return "For Sale"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle className="text-2xl">{property.title}</DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    onEdit(property)
                    onOpenChange(false)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            <div className="relative">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                {property.images.length > 0 ? (
                  <Image
                    src={property.images[currentImageIndex] || "/placeholder.svg?height=400&width=600"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                )}

                {property.videos && property.videos.length > 0 && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-2 right-2 rounded-full"
                    onClick={() => setShowVideoDialog(true)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {property.images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {property.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full bg-white ${
                          index === currentImageIndex ? "opacity-100" : "opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative h-16 w-24 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=64&width=96"}
                      alt={`${property.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="tenants" className="flex-1">
                  Tenants
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    {property.listingType === "sale" || property.status === "for_sale" ? (
                      <div className="text-2xl font-bold">
                        ₹{property.price?.toLocaleString() || property.rentAmount.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-2xl font-bold">
                        ₹{property.rentAmount.toLocaleString()}
                        <span className="text-muted-foreground text-sm font-normal">/month</span>
                      </div>
                    )}
                    <Badge variant={getBadgeVariant(property.status)}>{formatStatus(property.status)}</Badge>
                  </div>

                  {property.deposit > 0 && (
                    <div className="text-sm">
                      <span className="font-semibold">Security Deposit:</span> ₹{property.deposit.toLocaleString()}
                    </div>
                  )}

                  <div className="text-muted-foreground">{property.location}</div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="font-semibold">{property.bedrooms}</span> beds
                    </div>
                    <div>
                      <span className="font-semibold">{property.bathrooms}</span> baths
                    </div>
                    <div>
                      <span className="font-semibold capitalize">{property.type}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-muted-foreground">{property.description}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Created: </span>
                        {new Date(property.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Updated: </span>
                        {new Date(property.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tenants">
                {propertyTenants.length > 0 ? (
                  <div className="space-y-4">
                    {propertyTenants.map((tenant) => (
                      <Card key={tenant.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle>
                              {tenant.firstName} {tenant.lastName}
                            </CardTitle>
                            <Badge variant={tenant.applicationStatus === "approved" ? "default" : "secondary"}>
                              {tenant.applicationStatus}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-sm text-muted-foreground">Email: </span>
                                <span>{tenant.email}</span>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Phone: </span>
                                <span>{tenant.phone}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Documents: </span>
                              <span>{tenant.documents.length} files</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No tenants assigned to this property.</div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {property.videos && property.videos.length > 0 && (
        <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Property Video</DialogTitle>
            </DialogHeader>
            <div className="aspect-video relative rounded-lg overflow-hidden">
              {videoError ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="text-center p-4">
                    <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
                    <p className="text-destructive font-medium">{videoError}</p>
                    <Button variant="outline" className="mt-2" onClick={() => setVideoError(null)}>
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <video
                  src={property.videos[currentVideoIndex]}
                  controls
                  className="w-full h-full"
                  poster={property.images[0] || "/placeholder.svg?height=400&width=600"}
                  onError={handleVideoError}
                />
              )}
            </div>
            {property.videos.length > 1 && !videoError && (
              <div className="flex justify-center gap-2 mt-2">
                {property.videos.map((_, index) => (
                  <Button
                    key={index}
                    variant={index === currentVideoIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCurrentVideoIndex(index)
                      setVideoError(null)
                    }}
                  >
                    Video {index + 1}
                  </Button>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

