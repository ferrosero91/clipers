"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useJobStore } from "@/store/job-store"
import type { JobApplication } from "@/lib/types"
import { FiMail, FiUser, FiAward } from "react-icons/fi"

interface ApplicantsListProps {
  jobId: string
  applicants: JobApplication[]
}

export function ApplicantsList({ jobId, applicants }: ApplicantsListProps) {
  const { updateApplicationStatus, getJobApplications } = useJobStore()
  const { toast } = useToast()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleUpdateStatus = async (applicationId: string, status: string) => {
    setUpdatingId(applicationId)
    try {
      await updateApplicationStatus(applicationId, status)
      await getJobApplications(jobId)
      toast({
        title: "Estado actualizado",
        description: `La aplicación ha sido ${status === "ACCEPTED" ? "aceptada" : "rechazada"}`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-success/10 text-success"
      case "REJECTED":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-warning/10 text-warning"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Aceptado"
      case "REJECTED":
        return "Rechazado"
      default:
        return "Pendiente"
    }
  }

  // Sort applicants by score (highest first)
  const sortedApplicants = [...applicants].sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-4">
      {sortedApplicants.map((app, index) => (
        <Card key={app.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header with ranking */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={app.user?.profileImage || "/placeholder.svg"} />
                      <AvatarFallback>
                        {app.user?.firstName?.[0]}
                        {app.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {app.user?.firstName} {app.user?.lastName}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FiMail className="h-3 w-3" />
                      <span>{app.user?.email}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(app.score * 100)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Compatibilidad</div>
                </div>
              </div>

              <Separator />

              {/* Match explanation */}
              {app.explanation && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">{app.explanation}</p>
                </div>
              )}

              {/* Matched skills */}
              {app.matchedSkills && app.matchedSkills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <FiAward className="h-4 w-4" />
                    <span>Habilidades coincidentes:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {app.matchedSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* ATS Profile Summary */}
              {app.atsProfile && (
                <div className="space-y-3">
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                      <FiUser className="h-4 w-4" />
                      <span>Perfil profesional:</span>
                    </div>
                    {app.atsProfile.summary && (
                      <p className="text-sm text-muted-foreground">{app.atsProfile.summary}</p>
                    )}
                    
                    {/* Experience count */}
                    {app.atsProfile.experience && app.atsProfile.experience.length > 0 && (
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{app.atsProfile.experience.length} experiencias laborales</span>
                        {app.atsProfile.education && app.atsProfile.education.length > 0 && (
                          <span>• {app.atsProfile.education.length} estudios</span>
                        )}
                        {app.atsProfile.skills && app.atsProfile.skills.length > 0 && (
                          <span>• {app.atsProfile.skills.length} habilidades</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Application message */}
              {app.applicationMessage && (
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Mensaje del candidato:
                  </p>
                  <p className="text-sm">{app.applicationMessage}</p>
                </div>
              )}

              <Separator />

              {/* Status and actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(app.status)}>
                    {getStatusText(app.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(app.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {app.status === "PENDING" && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                      disabled={updatingId === app.id}
                    >
                      {updatingId === app.id ? "Actualizando..." : "Aceptar"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                      disabled={updatingId === app.id}
                    >
                      Rechazar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {applicants.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No hay postulantes aún para este empleo.</p>
        </div>
      )}
    </div>
  )
}
