"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/use-toast"
import { UserIcon, Camera, Edit } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserProfileForm } from "@/components/user-profile-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [isUploading, setIsUploading] = useState(false)

  if (!user) return null

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile) return

    setIsUploading(true)

    try {
      // In a real app, you would upload the file to a server
      // For this demo, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Convert file to data URL
      const reader = new FileReader()
      const avatarUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(avatarFile)
      })

      // Update user profile
      await updateUserProfile({ avatar: avatarUrl })

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully.",
      })

      setAvatarFile(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your profile picture will be shown across the system</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatarPreview || undefined} />
                <AvatarFallback className="text-4xl">
                  <UserIcon className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Upload new picture</span>
              </label>
              <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            {avatarFile && (
              <Button size="sm" onClick={handleAvatarUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save Picture"}
              </Button>
            )}

            <div className="text-center">
              <h3 className="font-medium">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <UserProfileForm user={user} isEditing={isEditing} onCancel={() => setIsEditing(false)} />
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">First Name</Label>
                    <p className="font-medium">{user.firstName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Last Name</Label>
                    <p className="font-medium">{user.lastName}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="font-medium">{user.email}</p>
                </div>

                {user.bio && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Bio</Label>
                    <p>{user.bio}</p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">City</Label>
                    <p className="font-medium">{user.city || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">State</Label>
                    <p className="font-medium">{user.state || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Phone</Label>
                    <p className="font-medium">{user.phone || "Not specified"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

