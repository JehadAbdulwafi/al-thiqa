"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/app/actions/settings"
import { useRouter } from "next/navigation"

type ProfileFormProps = {
  user: {
    id: string
    name: string | null
    email: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    }

    try {
      await updateProfile(data)
      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "فشل تحديث الملف الشخصي")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

      {success && (
        <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600">تم تحديث الملف الشخصي بنجاح!</div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">الاسم الكامل</Label>
        <Input id="name" name="name" defaultValue={user.name || ""} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">عنوان البريد الإلكتروني</Label>
        <Input id="email" name="email" type="email" defaultValue={user.email} required />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
      </Button>
    </form>
  )
}
