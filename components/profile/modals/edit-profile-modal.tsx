"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useProfileStore } from "@/store/profile-store"
import { useAuthStore } from "@/store/auth-store"
import { useToast } from "@/hooks/use-toast"
import type { User, Company } from "@/lib/types"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { profile, updateProfile, uploadUserAvatar, deleteUserAvatar } = useProfileStore()
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    description: "",
    industry: "",
    size: "",
    website: "",
    location: "",
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setAvatarFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
      setIsLoading(true)
      try {
        await uploadUserAvatar(file)
        toast({
          title: "Foto actualizada",
          description: "Tu nueva foto se guardó correctamente.",
        })
        // Limpiar selección y preview para evitar doble subida
        URL.revokeObjectURL(url)
        setAvatarPreview(null)
        setAvatarFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo subir la foto.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setAvatarPreview(null)
    }
  }

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const handleDeleteAvatar = async () => {
    setIsLoading(true)
    try {
      await deleteUserAvatar()
      setAvatarFile(null)
      setAvatarPreview(null)
      toast({
        title: "Foto eliminada",
        description: "Se eliminó tu foto de perfil.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la foto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isCompany = user?.role === "COMPANY"

  useEffect(() => {
    if (profile) {
      if (isCompany) {
        const company = profile as Company
        setFormData({
          firstName: "",
          lastName: "",
          name: company.name,
          description: company.description,
          industry: company.industry,
          size: company.size,
          website: company.website || "",
          location: company.location,
        })
      } else {
        const userProfile = profile as User
        setFormData({
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          name: "",
          description: "",
          industry: "",
          size: "",
          website: "",
          location: "",
        })
      }
    }
  }, [profile, isCompany])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isCompany) {
        await updateProfile({
          name: formData.name,
          description: formData.description,
          industry: formData.industry,
          size: formData.size,
          website: formData.website,
          location: formData.location,
        })
      } else {
        if (avatarFile) {
          await uploadUserAvatar(avatarFile)
          setAvatarFile(null)
        }
        await updateProfile({
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isCompany ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la empresa *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej. Tech Company S.A."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu empresa..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industria *</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="ej. Tecnología"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Tamaño *</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="ej. 50-100 empleados"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ej. Ciudad de México, México"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.empresa.com"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Foto de perfil</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarPreview || (profile as User)?.profileImage || "/placeholder.svg"} alt="Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>

                  {/* Input de archivo oculto */}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    aria-label="Seleccionar foto de perfil"
                  />

                  {/* Botón claro para cambiar foto */}
                  <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                    Cambiar foto
                  </Button>

                  {(profile as User)?.profileImage && (
                    <Button type="button" variant="destructive" onClick={handleDeleteAvatar} disabled={isLoading}>
                      Eliminar
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Actualizar perfil"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
