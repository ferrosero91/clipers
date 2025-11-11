"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProfileStore } from "@/store/profile-store"
import { useToast } from "@/hooks/use-toast"
import type { Skill } from "@/lib/types"

interface AddSkillModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSkillModal({ open, onOpenChange }: AddSkillModalProps) {
  const { addSkill } = useProfileStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    level: "" as Skill["level"],
    category: "" as Skill["category"],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await addSkill(formData as Omit<Skill, "id">)

      toast({
        title: "Habilidad agregada",
        description: "Tu habilidad ha sido agregada exitosamente.",
      })

      // Reset form
      setFormData({
        name: "",
        level: "" as Skill["level"],
        category: "" as Skill["category"],
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar la habilidad. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Agregar habilidad</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la habilidad *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ej. React, Liderazgo, Inglés"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as Skill["category"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TECHNICAL">Técnica</SelectItem>
                <SelectItem value="SOFT">Blanda</SelectItem>
                <SelectItem value="LANGUAGE">Idioma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Nivel *</Label>
            <Select
              value={formData.level}
              onValueChange={(value) => setFormData({ ...formData, level: value as Skill["level"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Principiante</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermedio</SelectItem>
                <SelectItem value="ADVANCED">Avanzado</SelectItem>
                <SelectItem value="EXPERT">Experto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Agregar habilidad"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
