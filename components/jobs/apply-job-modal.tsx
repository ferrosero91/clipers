"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Job } from "@/lib/types"

interface ApplyJobModalProps {
  job: Job
  open: boolean
  onOpenChange: (open: boolean) => void
  onApply: (message?: string) => Promise<void>
}

export function ApplyJobModal({ job, open, onOpenChange, onApply }: ApplyJobModalProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await onApply(message.trim() || undefined)
      setMessage("")
      onOpenChange(false)
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al enviar la aplicación")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aplicar a {job.title}</DialogTitle>
          <DialogDescription>
            {job.company?.name && `en ${job.company.name}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje para el reclutador (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Cuéntale al reclutador por qué eres el candidato ideal para este puesto..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/500 caracteres
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar aplicación"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
