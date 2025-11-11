"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useProfileStore } from "@/store/profile-store"
import { useToast } from "@/hooks/use-toast"
import type { Education } from "@/lib/types"

interface AddEducationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddEducationModal({ open, onOpenChange }: AddEducationModalProps) {
  const { addEducation } = useProfileStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isCurrentStudy, setIsCurrentStudy] = useState(false)
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const educationData: Omit<Education, "id"> = {
        ...formData,
        endDate: isCurrentStudy ? undefined : formData.endDate,
      }

      await addEducation(educationData)

      toast({
        title: "Educación agregada",
        description: "Tu información educativa ha sido agregada exitosamente.",
      })

      // Reset form
      setFormData({
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      })
      setIsCurrentStudy(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar la educación. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar educación</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institución *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="ej. Universidad Nacional"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Título *</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="ej. Licenciatura, Maestría, Doctorado"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field">Campo de estudio *</Label>
            <Input
              id="field"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              placeholder="ej. Ingeniería en Sistemas, Administración de Empresas"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio *</Label>
              <Input
                id="startDate"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de graduación</Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isCurrentStudy}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="currentStudy"
                  checked={isCurrentStudy}
                  onCheckedChange={(checked) => {
                    setIsCurrentStudy(checked as boolean)
                    if (checked) {
                      setFormData({ ...formData, endDate: "" })
                    }
                  }}
                />
                <Label htmlFor="currentStudy" className="text-sm">
                  Estudiando actualmente
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Menciona logros académicos, proyectos destacados, etc."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Agregar educación"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
