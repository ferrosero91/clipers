"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useCliperStore } from "@/store/cliper-store"
import type { Cliper } from "@/lib/types"
import { FiPlay, FiDownload, FiShare2, FiUser, FiClock, FiTag } from "react-icons/fi"

interface CliperModalProps {
  cliper: Cliper
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CliperModal({ cliper, open, onOpenChange }: CliperModalProps) {
  const [currentCliper, setCurrentCliper] = useState(cliper)
  const { getCliperStatus } = useCliperStore()

  useEffect(() => {
    setCurrentCliper(cliper)
  }, [cliper])

  useEffect(() => {
    if (open && cliper.status === "PROCESSING") {
      const interval = setInterval(async () => {
        try {
          const updatedCliper = await getCliperStatus(cliper.id)
          setCurrentCliper(updatedCliper)
          if (updatedCliper.status !== "PROCESSING") {
            clearInterval(interval)
          }
        } catch (error) {
          console.error("Error checking cliper status:", error)
        }
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [open, cliper.id, cliper.status, getCliperStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-success/10 text-success"
      case "PROCESSING":
        return "bg-warning/10 text-warning"
      case "FAILED":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "DONE":
        return "Procesado"
      case "PROCESSING":
        return "Procesando"
      case "FAILED":
        return "Error en procesamiento"
      case "UPLOADED":
        return "Subido"
      default:
        return status
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Cliper: {currentCliper.title}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Player - Facebook/TikTok Style */}
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              {currentCliper.status === "DONE" && currentCliper.videoUrl ? (
                <video controls className="w-full h-full">
                  <source src={currentCliper.videoUrl} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  {currentCliper.status === "PROCESSING" ? (
                    <div className="text-center space-y-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground">Procesando video...</p>
                    </div>
                  ) : currentCliper.status === "FAILED" ? (
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                        <FiPlay className="h-6 w-6 text-destructive" />
                      </div>
                      <p className="text-sm text-destructive">Error al procesar el video</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <FiPlay className="h-12 w-12 text-primary/60" />
                      <p className="text-sm text-muted-foreground">Video no disponible</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Video Actions */}
            <div className="flex items-center justify-between">
              <Badge className={`${getStatusColor(currentCliper.status)}`}>{getStatusText(currentCliper.status)}</Badge>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <FiDownload className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
                <Button variant="outline" size="sm">
                  <FiShare2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </div>

          {/* Cliper Details - Facebook Style */}
          <div className="space-y-6">
            {/* Header - Creator Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <FiUser className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">Usuario</p>
                <p className="text-sm text-muted-foreground">Candidato • {formatDistanceToNow(new Date(currentCliper.createdAt), { addSuffix: true, locale: es })}</p>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-balance">{currentCliper.title}</h2>
              <p className="text-muted-foreground text-pretty">{currentCliper.description}</p>
            </div>

            {/* Skills */}
            {currentCliper.skills.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold">Habilidades destacadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentCliper.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Video Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Información del video</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FiClock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {currentCliper.duration > 0
                      ? `${Math.floor(currentCliper.duration / 60)}:${(currentCliper.duration % 60)
                          .toString()
                          .padStart(2, "0")}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiTag className="h-4 w-4 text-muted-foreground" />
                  <span>{currentCliper.skills.length} habilidades identificadas</span>
                </div>
              </div>
            </div>

            {/* Transcription */}
            {currentCliper.transcription && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold">Transcripción</h3>
                  <div className="bg-muted/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm leading-relaxed">{currentCliper.transcription}</p>
                  </div>
                </div>
              </>
            )}

            {/* Social Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <span>📤</span>
                  <span>Compartir</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
