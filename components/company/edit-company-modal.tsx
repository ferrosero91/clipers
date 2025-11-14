"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import type { Company } from "@/lib/types"
import { FiPlus, FiX } from "react-icons/fi"

interface EditCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company
}

export function EditCompanyModal({ open, onOpenChange, company }: EditCompanyModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    name: company.name || "",
    description: company.description || "",
    industry: company.industry || "",
    size: company.size || "",
    location: company.location || "",
    website: company.website || "",
    foundedYear: company.foundedYear?.toString() || "",
    mission: company.mission || "",
    vision: company.vision || "",
    culture: company.culture || "",
    employeeCount: company.employeeCount?.toString() || "",
  })

  const [benefits, setBenefits] = useState<string[]>(company.benefits || [])
  const [newBenefit, setNewBenefit] = useState("")
  
  const [values, setValues] = useState<string[]>(company.values || [])
  const [newValue, setNewValue] = useState("")
  
  const [socialMedia, setSocialMedia] = useState<string[]>(company.socialMedia || [])
  const [newSocialMedia, setNewSocialMedia] = useState("")

  useEffect(() => {
    if (open) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        industry: company.industry || "",
        size: company.size || "",
        location: company.location || "",
        website: company.website || "",
        foundedYear: company.foundedYear?.toString() || "",
        mission: company.mission || "",
        vision: company.vision || "",
        culture: company.culture || "",
        employeeCount: company.employeeCount?.toString() || "",
      })
      setBenefits(company.benefits || [])
      setValues(company.values || [])
      setSocialMedia(company.socialMedia || [])
    }
  }, [open, company])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()])
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index))
  }

  const addValue = () => {
    if (newValue.trim() && !values.includes(newValue.trim())) {
      setValues([...values, newValue.trim()])
      setNewValue("")
    }
  }

  const removeValue = (index: number) => {
    setValues(values.filter((_, i) => i !== index))
  }

  const addSocialMedia = () => {
    if (newSocialMedia.trim() && !socialMedia.includes(newSocialMedia.trim())) {
      setSocialMedia([...socialMedia, newSocialMedia.trim()])
      setNewSocialMedia("")
    }
  }

  const removeSocialMedia = (index: number) => {
    setSocialMedia(socialMedia.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("El nombre de la empresa es requerido")
      return
    }

    setIsSubmitting(true)

    try {
      const updateData = {
        ...formData,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        employeeCount: formData.employeeCount ? parseInt(formData.employeeCount) : null,
        benefits,
        values,
        socialMedia,
      }

      await apiClient.put(`/companies/${company.id}`, updateData)

      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente",
      })

      // Reload page to show updated data
      window.location.reload()
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar el perfil")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar perfil de empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nombre de la empresa *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industria</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Tamaño</Label>
              <Input
                id="size"
                placeholder="1-10, 11-50, 51-200, etc."
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio web</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://ejemplo.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">Año de fundación</Label>
              <Input
                id="foundedYear"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.foundedYear}
                onChange={(e) => handleInputChange("foundedYear", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCount">Número de empleados</Label>
              <Input
                id="employeeCount"
                type="number"
                min="1"
                value={formData.employeeCount}
                onChange={(e) => handleInputChange("employeeCount", e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe tu empresa..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mission">Misión</Label>
              <Textarea
                id="mission"
                placeholder="¿Cuál es la misión de tu empresa?"
                value={formData.mission}
                onChange={(e) => handleInputChange("mission", e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vision">Visión</Label>
              <Textarea
                id="vision"
                placeholder="¿Cuál es la visión de tu empresa?"
                value={formData.vision}
                onChange={(e) => handleInputChange("vision", e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Culture */}
          <div className="space-y-2">
            <Label htmlFor="culture">Cultura organizacional</Label>
            <Textarea
              id="culture"
              placeholder="Describe la cultura de tu empresa..."
              value={formData.culture}
              onChange={(e) => handleInputChange("culture", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Values */}
          <div className="space-y-3">
            <Label>Valores corporativos</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Agregar valor..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addValue())}
              />
              <Button type="button" onClick={addValue} size="sm">
                <FiPlus className="h-4 w-4" />
              </Button>
            </div>
            {values.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {values.map((value, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-muted px-3 py-1 rounded-full text-sm">
                    <span>{value}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeValue(index)}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <FiX className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <Label>Beneficios</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Agregar beneficio..."
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
              />
              <Button type="button" onClick={addBenefit} size="sm">
                <FiPlus className="h-4 w-4" />
              </Button>
            </div>
            {benefits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-primary/10 px-3 py-1 rounded-full text-sm">
                    <span>{benefit}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBenefit(index)}
                      className="h-4 w-4 p-0 hover:bg-transparent"
                    >
                      <FiX className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <Label>Redes sociales</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="https://linkedin.com/company/..."
                value={newSocialMedia}
                onChange={(e) => setNewSocialMedia(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSocialMedia())}
              />
              <Button type="button" onClick={addSocialMedia} size="sm">
                <FiPlus className="h-4 w-4" />
              </Button>
            </div>
            {socialMedia.length > 0 && (
              <div className="space-y-2">
                {socialMedia.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm truncate">{link}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSocialMedia(index)}
                    >
                      <FiX className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
