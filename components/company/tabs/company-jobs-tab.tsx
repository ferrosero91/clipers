"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { Company, Job } from "@/lib/types"
import { FiMapPin, FiDollarSign, FiBriefcase, FiPlus } from "react-icons/fi"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface CompanyJobsTabProps {
  company: Company
  isOwnProfile?: boolean
}

export function CompanyJobsTab({ company, isOwnProfile }: CompanyJobsTabProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get<Job[]>(`/jobs/company/${company.id}`)
        setJobs(response)
      } catch (error) {
        console.error("Error loading company jobs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (company.id) {
      loadJobs()
    }
  }, [company.id])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "bg-success/10 text-success"
      case "PART_TIME":
        return "bg-warning/10 text-warning"
      case "CONTRACT":
        return "bg-secondary/10 text-secondary"
      case "INTERNSHIP":
        return "bg-primary/10 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "Tiempo completo"
      case "PART_TIME":
        return "Medio tiempo"
      case "CONTRACT":
        return "Contrato"
      case "INTERNSHIP":
        return "Prácticas"
      default:
        return type
    }
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `Desde $${min.toLocaleString()}`
    if (max) return `Hasta $${max.toLocaleString()}`
    return null
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <FiBriefcase className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isOwnProfile ? "No has publicado empleos aún" : "No hay empleos disponibles"}
              </h3>
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "Comienza a publicar ofertas laborales para atraer talento"
                  : "Esta empresa no tiene ofertas activas en este momento"}
              </p>
            </div>
            {isOwnProfile && (
              <Button onClick={() => router.push("/jobs")}>
                <FiPlus className="h-4 w-4 mr-2" />
                Publicar empleo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {isOwnProfile && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">{jobs.length} empleo{jobs.length !== 1 ? "s" : ""} publicado{jobs.length !== 1 ? "s" : ""}</p>
          <Button size="sm" onClick={() => router.push("/jobs")}>
            <FiPlus className="h-4 w-4 mr-2" />
            Nuevo empleo
          </Button>
        </div>
      )}

      {jobs.map((job) => (
        <Card
          key={job.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push(`/jobs`)}
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Publicado{" "}
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
                <Badge className={getTypeColor(job.type)}>{getTypeText(job.type)}</Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

              {/* Details */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <FiMapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {formatSalary(job.salaryMin, job.salaryMax) && (
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="h-4 w-4" />
                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{job.skills.length - 5}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              {isOwnProfile && (
                <div className="flex justify-end pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/jobs/${job.id}/applicants`)
                    }}
                  >
                    Ver candidatos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
