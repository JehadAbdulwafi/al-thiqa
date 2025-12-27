"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createInquiry, updateInquiry } from "@/app/actions/inquiries"

interface InquiryFormProps {
  inquiry?: {
    id: string
    name: string
    age: number | null
    address: string | null
    country: string | null
    place: string | null
    type: "BUY" | "RENT"
    budget: string | null
    notes: string | null
    status: "PENDING" | "CONTACTED" | "CLOSED"
  }
}

export function InquiryForm({ inquiry }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    country: "",
    place: "",
    type: "Buy" as "Buy" | "Rent",
    budget: "",
    status: "Pending" as "Pending" | "Contacted" | "Closed",
    notes: "",
  })

  useEffect(() => {
    if (inquiry) {
      setFormData({
        name: inquiry.name || "",
        age: inquiry.age?.toString() || "",
        address: inquiry.address || "",
        country: inquiry.country || "",
        place: inquiry.place || "",
        type: inquiry.type || "BUY",
        budget: inquiry.budget?.toString() || "",
        status: inquiry.status || "PENDING",
        notes: inquiry.notes || "",
      })
    }
  }, [inquiry])

  const isEditing = !!inquiry

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const formDataForAction = new FormData(form)

    try {
      if (isEditing) {
        await updateInquiry(inquiry.id, formDataForAction)
      } else {
        await createInquiry(formDataForAction)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="30"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="USA"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="place">Place</Label>
                <Input
                  id="place"
                  name="place"
                  placeholder="New York"
                  value={formData.place}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buy">Buy</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  placeholder="500000"
                  value={formData.budget}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  required
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional notes about the inquiry..."
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Inquiry" : "Create Inquiry"}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={isSubmitting}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}