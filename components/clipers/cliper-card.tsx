"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CliperModal } from "./cliper-modal"
import type { Cliper } from "@/lib/types"
import { Play, Clock, User, MoreHorizontal } from "lucide-react"

interface CliperCardProps {
  cliper: Cliper
}

export function CliperCard({ cliper }: CliperCardProps) {
  const [showModal, setShowModal] = useState(false)

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
        return "Error"
      case "UPLOADED":
        return "Subido"
      default:
        return status
    }
  }

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        {/* Video Container - Facebook/TikTok Style */}
        <div className="relative aspect-video bg-muted overflow-hidden" onClick={() => setShowModal(true)}>
          {cliper.thumbnailUrl ? (
            <img
              src={cliper.thumbnailUrl || "/placeholder.svg"}
              alt={cliper.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <Play className="h-12 w-12 text-primary/60" />
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play className="h-6 w-6 text-primary ml-1" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={`text-xs ${getStatusColor(cliper.status)}`}>{getStatusText(cliper.status)}</Badge>
          </div>

          {/* Duration */}
          {cliper.duration > 0 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>
                {Math.floor(cliper.duration / 60)}:{(cliper.duration % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header - User Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">Usuario</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(cliper.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </p>
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base line-clamp-2">{cliper.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{cliper.description}</p>
            </div>

            {/* Skills */}
            {cliper.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cliper.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {cliper.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{cliper.skills.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>👍 Me gusta</span>
                <span>💬 Comentar</span>
                <span>📤 Compartir</span>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cliper Modal */}
      <CliperModal cliper={cliper} open={showModal} onOpenChange={setShowModal} />
    </>
  )
}
