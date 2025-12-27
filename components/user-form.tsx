"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUser, updateUser } from "@/app/actions/users"

type UserFormProps = {
  user?: {
    id: string
    name: string | null
    email: string
    role: string
  }
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    password: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "USER",
        password: "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const form = e.currentTarget
    const formDataForAction = new FormData(form)

    // Add state values to FormData if they are not already there
    formDataForAction.set('name', formData.name);
    formDataForAction.set('email', formData.email);
    formDataForAction.set('role', formData.role);
    if (!user) { // only add password for new users
        formDataForAction.set('password', formData.password);
    }

    try {
      if (user) {
        await updateUser(user.id, {
            name: formData.name,
            email: formData.email,
            role: formData.role as "ADMIN" | "USER"
        })
      } else {
        await createUser({
            name: formData.name,
            email: formData.email,
            role: formData.role as "ADMIN" | "USER",
            password: formData.password
        })
      }
      router.push("/admin/users")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "فشل حفظ المستخدم")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">الاسم</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
      </div>

      {!user && (
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} required />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">الدور</Label>
        <Select name="role" value={formData.role} onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الدور" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">مستخدم</SelectItem>
            <SelectItem value="ADMIN">مدير</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جارٍ الحفظ..." : user ? "تحديث المستخدم" : "إنشاء مستخدم"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          إلغاء
        </Button>
      </div>
    </form>
  )
}