"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { Property } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: Property
  className?: string
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
    }
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
    <Card className={cn("overflow-hidden transition-all hover:shadow-lg", className)}>
      <CardHeader className="p-0">
        <div className="relative h-[200px] w-full">
          <Image
            src={property.images[currentImageIndex] || "/placeholder.svg?height=200&width=300"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <Badge variant={getBadgeVariant(property.status)} className="absolute top-2 right-2">
            {formatStatus(property.status)}
          </Badge>

          {property.images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100 w-8 h-8"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-100 w-8 h-8"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full bg-white opacity-50",
                      index === currentImageIndex && "opacity-100",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold truncate">{property.title}</h3>
            {property.status === "for_sale" ? (
              <span className="font-bold">₹{property.price?.toLocaleString()}</span>
            ) : (
              <span className="font-bold">₹{property.rentAmount.toLocaleString()}/mo</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{property.location}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm">
              {property.bedrooms} beds • {property.bathrooms} baths
            </span>
            {property.deposit > 0 && (
              <span className="text-xs text-muted-foreground">Deposit: ₹{property.deposit.toLocaleString()}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

