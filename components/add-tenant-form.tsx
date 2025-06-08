"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTenants } from "@/hooks/use-tenants"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useProperties } from "@/hooks/use-properties"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Tenant } from "@/types"
import { FileUp, X } from "lucide-react"
import { toast } from "@/components/use-toast"

interface AddTenantFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantToEdit?: Tenant | null
}

export function AddTenantForm({ open, onOpenChange, tenantToEdit }: AddTenantFormProps) {
  const { addTenant, updateTenant } = useTenants()
  const { properties } = useProperties()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyId: "",
    applicationStatus: "pending" as const,
  })
  const [documentFiles, setDocumentFiles] = useState<File[]>([])
  const [documentPreviewUrls, setDocumentPreviewUrls] = useState<string[]>([])
  const [existingDocuments, setExistingDocuments] = useState<Tenant["documents"]>([])

  useEffect(() => {
    if (tenantToEdit) {
      setFormData({
        firstName: tenantToEdit.firstName,
        lastName: tenantToEdit.lastName,
        email: tenantToEdit.email,
        phone: tenantToEdit.phone,
        propertyId: tenantToEdit.propertyId,
        applicationStatus: tenantToEdit.applicationStatus,
      })
      setExistingDocuments(tenantToEdit.documents || [])
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        propertyId: "",
        applicationStatus: "pending" as const,
      })
      setExistingDocuments([])
    }
    setDocumentFiles([])
    setDocumentPreviewUrls([])
  }, [tenantToEdit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add toast notifications for document uploads
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setDocumentFiles((prev) => [...prev, ...filesArray])

      // Create preview names for the files
      const newPreviewNames = filesArray.map((file) => file.name)
      setDocumentPreviewUrls((prev) => [...prev, ...newPreviewNames])

      toast({
        title: "Documents selected",
        description: `${filesArray.length} document(s) selected for upload.`,
      })
    }
  }

  const removeDocument = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingDocuments((prev) => prev.filter((_, i) => i !== index))
    } else {
      setDocumentFiles((prev) => prev.filter((_, i) => i !== index))
      setDocumentPreviewUrls((prev) => prev.filter((_, i) => i !== index))
    }
  }

  // Add toast notification for form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you would upload the documents to a server/storage
      const newDocumentUrls = await Promise.all(
        documentFiles.map((file) => {
          return new Promise<{ name: string; url: string; type: string }>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve({
                name: file.name,
                url: reader.result as string,
                type: file.type,
              })
            }
            reader.readAsDataURL(file)
          })
        }),
      )

      const allDocuments = [
        ...existingDocuments,
        ...newDocumentUrls.map((doc) => ({
          id: crypto.randomUUID(),
          ...doc,
        })),
      ]

      const tenantData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        propertyId: formData.propertyId,
        applicationStatus: formData.applicationStatus,
        documents: allDocuments,
        payments: tenantToEdit?.payments || [],
      }

      if (tenantToEdit) {
        await updateTenant(tenantToEdit.id, tenantData)
        toast({
          title: "Tenant updated",
          description: "Tenant information has been successfully updated.",
        })
      } else {
        await addTenant(tenantData)
        toast({
          title: "Tenant added",
          description: "New tenant has been successfully added.",
        })
      }

      if (documentFiles.length > 0) {
        toast({
          title: "Documents uploaded",
          description: `Successfully uploaded ${documentFiles.length} document(s).`,
        })
      }

      onOpenChange(false)
    } catch (error) {
      console.error("Error saving tenant:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving the tenant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="sticky top-0 bg-background pt-4 pb-2 z-10">
            <DialogTitle>{tenantToEdit ? "Edit Tenant" : "Add New Tenant"}</DialogTitle>
            <DialogDescription>
              {tenantToEdit ? "Update tenant information" : "Add a new tenant to your property"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="propertyId">Property</Label>
              <Select
                value={formData.propertyId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, propertyId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {tenantToEdit && (
              <div className="grid gap-2">
                <Label htmlFor="applicationStatus">Application Status</Label>
                <Select
                  value={formData.applicationStatus}
                  onValueChange={(value: "pending" | "approved" | "rejected") =>
                    setFormData((prev) => ({ ...prev, applicationStatus: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="documents">Documents</Label>
              <Input
                id="documents"
                name="documents"
                type="file"
                multiple
                onChange={handleDocumentChange}
                className="cursor-pointer"
              />
              <div className="text-xs text-muted-foreground">Upload tenant documents (ID proof, agreements, etc.)</div>

              {(existingDocuments.length > 0 || documentPreviewUrls.length > 0) && (
                <div className="mt-2 space-y-2">
                  {existingDocuments.map((doc, index) => (
                    <div key={doc.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{doc.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index, true)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {documentPreviewUrls.map((name, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index, false)}>
                        <X className="h-4 w-4" />
                      </Button>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

