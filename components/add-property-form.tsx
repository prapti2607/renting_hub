"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useProperties } from "@/hooks/use-properties"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Property } from "@/types"
import { X, FileVideo, AlertCircle, Upload, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/use-toast"
import { Progress } from "@/components/ui/progress"

interface AddPropertyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyToEdit?: Property | null
}

export function AddPropertyForm({ open, onOpenChange, propertyToEdit }: AddPropertyFormProps) {
  const { addProperty, updateProperty } = useProperties()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "apartment",
    description: "",
    location: "",
    rentAmount: "",
    deposit: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    amenities: "",
    listingType: "rent" as const,
  })
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [videoFiles, setVideoFiles] = useState<File[]>([])
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([])
  const [videoNames, setVideoNames] = useState<string[]>([])

  useEffect(() => {
    if (propertyToEdit) {
      setFormData({
        title: propertyToEdit.title,
        type: propertyToEdit.type,
        description: propertyToEdit.description,
        location: propertyToEdit.location,
        rentAmount: propertyToEdit.rentAmount?.toString() || "",
        deposit: propertyToEdit.deposit?.toString() || "",
        price: propertyToEdit.price?.toString() || "",
        bedrooms: propertyToEdit.bedrooms.toString(),
        bathrooms: propertyToEdit.bathrooms.toString(),
        amenities: propertyToEdit.amenities.join(", "),
        listingType: propertyToEdit.listingType || "rent",
      })
      setImages(propertyToEdit.images || [])
      setImagePreviewUrls(propertyToEdit.images || [])
      setVideos(propertyToEdit.videos || [])
      setVideoPreviewUrls(propertyToEdit.videos || [])

      // Set video names for existing videos
      if (propertyToEdit.videos && propertyToEdit.videos.length > 0) {
        setVideoNames(propertyToEdit.videos.map((_, index) => `Property Video ${index + 1}`))
      }
    } else {
      setFormData({
        title: "",
        type: "apartment",
        description: "",
        location: "",
        rentAmount: "",
        deposit: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        amenities: "",
        listingType: "rent" as const,
      })
      setImages([])
      setImageFiles([])
      setImagePreviewUrls([])
      setVideos([])
      setVideoFiles([])
      setVideoPreviewUrls([])
      setVideoNames([])
    }
  }, [propertyToEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // Create preview URLs for the selected files
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))

      setImageFiles((prev) => [...prev, ...filesArray])
      setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // Check if any video is larger than 100MB
      const invalidFiles = filesArray.filter((file) => file.size > 100 * 1024 * 1024)

      if (invalidFiles.length > 0) {
        setUploadError("Video file(s) exceed 100MB size limit. Please upload smaller files.")
        toast({
          title: "Upload Error",
          description: "Video file(s) exceed 100MB size limit. Please upload smaller files.",
          variant: "destructive",
        })
        return
      }

      setUploadError(null)

      // Create preview URLs for the selected files
      const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file))
      const newVideoNames = filesArray.map((file) => file.name)

      setVideoFiles((prev) => [...prev, ...filesArray])
      setVideoPreviewUrls((prev) => [...prev, ...newPreviewUrls])
      setVideoNames((prev) => [...prev, ...newVideoNames])

      toast({
        title: "Videos selected",
        description: `${filesArray.length} video(s) selected for upload.`,
      })
    }
  }

  const removeImage = (index: number) => {
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))

    // If it's a new file, remove from imageFiles
    if (index < imageFiles.length) {
      setImageFiles((prev) => prev.filter((_, i) => i !== index))
    }
    // If it's an existing image, remove from images
    else {
      const adjustedIndex = index - imageFiles.length
      setImages((prev) => prev.filter((_, i) => i !== adjustedIndex))
    }
  }

  const removeVideo = (index: number) => {
    setVideoPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setVideoNames((prev) => prev.filter((_, i) => i !== index))

    // If it's a new file, remove from videoFiles
    if (index < videoFiles.length) {
      setVideoFiles((prev) => prev.filter((_, i) => i !== index))
    }
    // If it's an existing video, remove from videos
    else {
      const adjustedIndex = index - videoFiles.length
      setVideos((prev) => prev.filter((_, i) => i !== adjustedIndex))
    }
  }

  const simulateUploadProgress = () => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setUploadError(null)

    try {
      // Simulate upload progress for videos
      if (videoFiles.length > 0) {
        toast({
          title: "Uploading videos",
          description: "Please wait while we upload your videos...",
        })

        const cleanup = simulateUploadProgress()

        // Wait for "upload" to complete
        await new Promise((resolve) => setTimeout(resolve, videoFiles.length * 1000))
      }

      // In a real app, you would upload the images to a server/storage
      // For this demo, we'll convert the files to data URLs
      const newImageUrls = await Promise.all(
        imageFiles.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve(reader.result as string)
            }
            reader.readAsDataURL(file)
          })
        }),
      )

      const newVideoUrls = await Promise.all(
        videoFiles.map((file) => {
          return new Promise<string>((resolve, reject) => {
            // Check file size - max 100MB
            if (file.size > 100 * 1024 * 1024) {
              reject(new Error("Video file too large (max 100MB)"))
              return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
              resolve(reader.result as string)
            }
            reader.onerror = () => {
              reject(new Error("Failed to read video file"))
            }
            reader.readAsDataURL(file)
          })
        }),
      ).catch((error) => {
        setUploadError(error.message)
        throw error
      })

      const allImages = [...images, ...newImageUrls]
      const allVideos = [...videos, ...newVideoUrls]

      // Determine property status based on listing type
      let status: Property["status"]
      if (propertyToEdit?.status === "rented" || propertyToEdit?.status === "sold") {
        status = propertyToEdit.status
      } else {
        status = formData.listingType === "sale" ? "for_sale" : "available"
      }

      const propertyData = {
        title: formData.title,
        type: formData.type as Property["type"],
        description: formData.description,
        location: formData.location,
        rentAmount: formData.listingType !== "sale" ? Number.parseFloat(formData.rentAmount) || 0 : 0,
        deposit: Number.parseFloat(formData.deposit) || 0,
        price: formData.listingType === "sale" ? Number.parseFloat(formData.price) || 0 : undefined,
        bedrooms: Number.parseInt(formData.bedrooms),
        bathrooms: Number.parseInt(formData.bathrooms),
        amenities: formData.amenities.split(",").map((item) => item.trim()),
        images: allImages,
        videos: allVideos,
        listingType: formData.listingType,
        status: status,
      }

      if (propertyToEdit) {
        await updateProperty(propertyToEdit.id, propertyData)
        toast({
          title: "Property updated",
          description: "Property has been successfully updated.",
        })
      } else {
        await addProperty(propertyData)
        toast({
          title: "Property added",
          description: "New property has been successfully added.",
        })
      }

      if (videoFiles.length > 0) {
        toast({
          title: "Videos uploaded",
          description: `Successfully uploaded ${videoFiles.length} video${videoFiles.length > 1 ? "s" : ""}.`,
        })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error saving property:", error)
      setUploadError("An error occurred while saving the property. Please try again.")
      toast({
        title: "Error",
        description: "An error occurred while saving the property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="sticky top-0 bg-background pt-4 pb-2 z-10">
            <DialogTitle>{propertyToEdit ? "Edit Property" : "Add New Property"}</DialogTitle>
            <DialogDescription>
              {propertyToEdit ? "Update property details" : "Add a new property to your portfolio"}
            </DialogDescription>
          </DialogHeader>

          {uploadError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Modern Apartment in Downtown"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="listingType">Listing Type</Label>
              <Select
                value={formData.listingType}
                onValueChange={(value: "rent" | "sale" | "lease") =>
                  setFormData((prev) => ({ ...prev, listingType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="lease">For Lease</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Property Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
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

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Property description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="123 Main St, City, State"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            {formData.listingType !== "sale" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rentAmount">Monthly Rent (₹)</Label>
                  <Input
                    id="rentAmount"
                    name="rentAmount"
                    type="number"
                    placeholder="15000"
                    value={formData.rentAmount}
                    onChange={handleChange}
                    required={formData.listingType !== "sale"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deposit">Security Deposit (₹)</Label>
                  <Input
                    id="deposit"
                    name="deposit"
                    type="number"
                    placeholder="50000"
                    value={formData.deposit}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {formData.listingType === "sale" && (
              <div className="grid gap-2">
                <Label htmlFor="price">Sale Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="5000000"
                  value={formData.price}
                  onChange={handleChange}
                  required={formData.listingType === "sale"}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="2"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amenities">Amenities</Label>
              <Input
                id="amenities"
                name="amenities"
                placeholder="Parking, Pool, Gym"
                value={formData.amenities}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="images">Property Images</Label>
              <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <div className="text-xs text-muted-foreground">You can select multiple images</div>

              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Property image ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="videos">Property Videos</Label>
              <Input
                id="videos"
                name="videos"
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
                className="cursor-pointer"
                disabled={isUploading}
              />
              <div className="text-xs text-muted-foreground">Upload videos of the property (max 100MB)</div>

              {isUploading && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground animate-pulse" />
                    <span className="text-sm">Uploading videos...</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {videoPreviewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {videoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="h-24 w-full bg-muted rounded-md flex flex-col items-center justify-center p-2">
                        <FileVideo className="h-8 w-8 text-muted-foreground mb-1" />
                        <p className="text-xs text-center truncate w-full">{videoNames[index]}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-background pt-2 pb-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {isLoading ? (
                "Saving..."
              ) : isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

