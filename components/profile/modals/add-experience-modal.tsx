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
import type { Experience } from "@/lib/types"

interface AddExperienceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddExperienceModal({ open, onOpenChange }: AddExperienceModalProps) {
  const { addExperience } = useProfileStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isCurrentJob, setIsCurrentJob] = useState(false)
  const [skills, setSkills] = useState("")
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const experienceData: Omit<Experience, "id"> = {
        ...formData,
        endDate: isCurrentJob ? undefined : formData.endDate,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }

      await addExperience(experienceData)

      toast({
        title: "Experiencia agregada",
        description: "Tu experiencia laboral ha sido agregada exitosamente.",
      })

      // Reset form
      setFormData({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      })
      setSkills("")
      setIsCurrentJob(false)
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar la experiencia. Inténtalo de nuevo.",
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
          <DialogTitle>Agregar experiencia laboral</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Cargo *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="ej. Desarrollador Frontend"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="ej. Tech Company S.A."
                required
              />
            </div>
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
              <Label htmlFor="endDate">Fecha de fin</Label>
              <Input
                id="endDate"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={isCurrentJob}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="currentJob"
                  checked={isCurrentJob}
                  onCheckedChange={(checked) => {
                    setIsCurrentJob(checked as boolean)
                    if (checked) {
                      setFormData({ ...formData, endDate: "" })
                    }
                  }}
                />
                <Label htmlFor="currentJob" className="text-sm">
                  Trabajo actual
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tus responsabilidades y logros en este puesto..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Habilidades utilizadas</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, Node.js (separadas por comas)"
            />
            <p className="text-sm text-muted-foreground">Separa las habilidades con comas</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Agregar experiencia"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
