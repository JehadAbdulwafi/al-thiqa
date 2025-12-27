"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePassword } from "@/app/actions/settings"

export function PasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (newPassword !== confirmPassword) {
      setError("كلمات المرور الجديدة غير متطابقة")
      setIsSubmitting(false)
      return
    }

    if (newPassword.length < 6) {
      setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل")
      setIsSubmitting(false)
      return
    }

    try {
      await changePassword({ currentPassword, newPassword })
      setSuccess(true)
      e.currentTarget?.reset()
    } catch (err: any) {
      setError(err.message || "فشل تغيير كلمة المرور")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

      {success && (
        <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600">تم تغيير كلمة المرور بنجاح!</div>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
        <Input id="newPassword" name="newPassword" type="password" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جارٍ التغيير..." : "تغيير كلمة المرور"}
      </Button>
    </form>
  )
}
