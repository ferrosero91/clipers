"use client"

import { useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useJobStore } from "@/store/job-store"
import { useAuthStore } from "@/store/auth-store"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { FiMapPin, FiBriefcase, FiClock, FiArrowLeft } from "react-icons/fi"
import { useRouter } from "next/navigation"

export default function MyApplicationsPage() {
  const { myApplications, getMyApplications, isLoading } = useJobStore()
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user?.role === "CANDIDATE") {
      getMyApplications()
    }
  }, [user, getMyApplications])

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

  if (user?.role !== "CANDIDATE") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
            <p className="text-muted-foreground">Solo los candidatos pueden ver sus aplicaciones.</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => router.push("/jobs")}>
              <FiArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">Mis Aplicaciones</h1>
                {myApplications.length > 0 && (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {myApplications.length}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                Seguimiento de tus postulaciones a empleos
              </p>
            </div>
          </div>

          {/* Applications List */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : myApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <FiBriefcase className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No tienes aplicaciones aún</h3>
                  <p className="text-muted-foreground">
                    Comienza a aplicar a empleos que se ajusten a tu perfil
                  </p>
                </div>
                <Button onClick={() => router.push("/jobs")}>
                  Explorar empleos
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {myApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={application.job?.company?.logo || "/placeholder.svg"}
                            alt={application.job?.company?.name}
                          />
                          <AvatarFallback>
                            <FiBriefcase className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg">{application.job?.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {application.job?.company?.name}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Job Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="h-4 w-4" />
                        <span>{application.job?.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiClock className="h-4 w-4" />
                        <span>
                          Aplicado{" "}
                          {formatDistanceToNow(new Date(application.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Match Score */}
                    {application.score > 0 && (
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Compatibilidad</span>
                          <span className="text-lg font-bold text-primary">
                            {Math.round(application.score * 100)}%
                          </span>
                        </div>
                        {application.explanation && (
                          <p className="text-xs text-muted-foreground">{application.explanation}</p>
                        )}
                      </div>
                    )}

                    {/* Matched Skills */}
                    {application.matchedSkills && application.matchedSkills.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Habilidades coincidentes:</p>
                        <div className="flex flex-wrap gap-1">
                          {application.matchedSkills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Application Message */}
                    {application.applicationMessage && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Tu mensaje:
                        </p>
                        <p className="text-sm">{application.applicationMessage}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (application.job) {
                            // Store job in sessionStorage and navigate
                            sessionStorage.setItem('selectedJob', JSON.stringify(application.job))
                            router.push(`/jobs?openJob=${application.job.id}`)
                          }
                        }}
                      >
                        Ver detalles del empleo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
