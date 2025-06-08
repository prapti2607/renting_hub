"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PropertyGalleryProps {
  images: string[]
  videos?: string[]
}

export function PropertyGallery({ images, videos = [] }: PropertyGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState(images[0] || videos[0] || "")
  const [selectedType, setSelectedType] = useState(images[0] ? "image" : "video")

  const allMedia = [...images.map((src) => ({ type: "image", src })), ...videos.map((src) => ({ type: "video", src }))]

  const handleThumbnailClick = (src: string, type: string) => {
    setSelectedMedia(src)
    setSelectedType(type)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        {selectedType === "image" ? (
          <Image src={selectedMedia || "/placeholder.svg"} alt="Property" fill className="object-cover" priority />
        ) : (
          <video src={selectedMedia} controls className="h-full w-full object-cover">
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {allMedia.map((media, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(media.src, media.type)}
            className={cn(
              "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md",
              selectedMedia === media.src && "ring-2 ring-primary",
            )}
          >
            {media.type === "image" ? (
              <Image
                src={media.src || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="relative h-full w-full bg-muted">
                <video src={media.src} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-white"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
