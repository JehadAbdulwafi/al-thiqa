"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type InquiryFormProps = {
  inquiry?: any | null
  onSave: (data: any) => void
  onCancel: () => void
}

export function InquiryForm({ inquiry, onSave, onCancel }: InquiryFormProps) {
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
        type: inquiry.type || "Buy",
        budget: inquiry.budget || "",
        status: inquiry.status || "Pending",
        notes: inquiry.notes || "",
      })
    }
  }, [inquiry])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      age: Number.parseInt(formData.age) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="border-neutral-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
            className="border-neutral-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          className="border-neutral-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
            className="border-neutral-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="place">Place/Area *</Label>
          <Input
            id="place"
            value={formData.place}
            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            required
            placeholder="e.g., Dubai Marina"
            className="border-neutral-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property Type *</Label>
        <RadioGroup
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as "Buy" | "Rent" })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Buy" id="buy" />
            <Label htmlFor="buy" className="font-normal cursor-pointer">
              Buy
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Rent" id="rent" />
            <Label htmlFor="rent" className="font-normal cursor-pointer">
              Rent
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget *</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            required
            placeholder="e.g., $500,000 or $3,000/mo"
            className="border-neutral-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
            <SelectTrigger className="border-neutral-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional information about the inquiry..."
          rows={4}
          className="border-neutral-200 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-neutral-200">
        <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
          Save Inquiry
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-neutral-200 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
