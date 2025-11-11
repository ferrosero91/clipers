"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProfileStore } from "@/store/profile-store"
import { useToast } from "@/hooks/use-toast"
import type { ATSProfile } from "@/lib/types"

interface EditATSSummaryModalProps {
  atsProfile: ATSProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditATSSummaryModal({ atsProfile, open, onOpenChange }: EditATSSummaryModalProps) {
  const { updateATSProfile } = useProfileStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState("")

  useEffect(() => {
    if (atsProfile) {
      setSummary(atsProfile.summary)
    }
  }, [atsProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!atsProfile) return

    setIsLoading(true)

    try {
      await updateATSProfile({ summary })

      toast({
        title: "Resumen actualizado",
        description: "Tu resumen profesional ha sido actualizado exitosamente.",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el resumen. Inténtalo de nuevo.",
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
          <DialogTitle>Editar resumen profesional</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summary">Resumen profesional *</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe tu experiencia, habilidades y objetivos profesionales..."
              rows={8}
              required
            />
            <p className="text-sm text-muted-foreground">
              Escribe un resumen que destaque tu experiencia, habilidades clave y lo que buscas en tu próximo rol.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Actualizar resumen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
