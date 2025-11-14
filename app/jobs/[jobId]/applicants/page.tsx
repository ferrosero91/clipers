"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useJobStore } from "@/store/job-store"
import { useAuthStore } from "@/store/auth-store"
import { ApplicantsList } from "@/components/jobs/applicants-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FiArrowLeft, FiBriefcase } from "react-icons/fi"
import type { Job } from "@/lib/types"
import { apiClient } from "@/lib/api"

export default function JobApplicantsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string
  const { user } = useAuthStore()
  const { applicants, getJobApplications, isLoading } = useJobStore()
  const [job, setJob] = useState<Job | null>(null)
  const [loadingJob, setLoadingJob] = useState(true)

  useEffect(() => {
    const loadJobAndApplicants = async () => {
      try {
        setLoadingJob(true)
        const jobData = await apiClient.get<Job>(`/jobs/${jobId}`)
        setJob(jobData)
        
        if (user?.role === "COMPANY") {
          await getJobApplications(jobId)
        }
      } catch (error) {
        console.error("Error loading job:", error)
      } finally {
        setLoadingJob(false)
      }
    }

    if (jobId && user) {
      loadJobAndApplicants()
    }
  }, [jobId, user, getJobApplications])

  if (user?.role !== "COMPANY") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
            <p className="text-muted-foreground">
              Solo las empresas pueden ver los candidatos de sus empleos.
            </p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const pendingApplicants = applicants.filter((app) => app.status === "PENDING")
  const acceptedApplicants = applicants.filter((app) => app.status === "ACCEPTED")
  const rejectedApplicants = applicants.filter((app) => app.status === "REJECTED")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/jobs")}
              className="mb-4"
            >
              <FiArrowLeft className="h-4 w-4 mr-2" />
              Volver a empleos
            </Button>

            {loadingJob ? (
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
            ) : job ? (
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                <p className="text-muted-foreground">
                  Gestiona los candidatos que han aplicado a esta oferta
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Candidatos</h1>
                <p className="text-muted-foreground">Empleo no encontrado</p>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-2">
              <CardHeader className="pb-3">
                <p className="text-sm text-muted-foreground">Total Candidatos</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{applicants.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Postulaciones totales</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-warning/20 bg-warning/5">
              <CardHeader className="pb-3">
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-warning">{pendingApplicants.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Por revisar</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-success/20 bg-success/5">
              <CardHeader className="pb-3">
                <p className="text-sm text-muted-foreground">Aceptados</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-success">{acceptedApplicants.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Candidatos seleccionados</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <p className="text-sm text-muted-foreground">Rechazados</p>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-destructive">{rejectedApplicants.length}</p>
                <p className="text-xs text-muted-foreground mt-1">No seleccionados</p>
              </CardContent>
            </Card>
          </div>

          {/* Applicants Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                Todos ({applicants.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pendientes ({pendingApplicants.length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Aceptados ({acceptedApplicants.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rechazados ({rejectedApplicants.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-6 bg-muted rounded w-1/3"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                          <div className="h-4 bg-muted rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <ApplicantsList jobId={jobId} applicants={applicants} />
              )}
            </TabsContent>

            <TabsContent value="pending">
              <ApplicantsList jobId={jobId} applicants={pendingApplicants} />
            </TabsContent>

            <TabsContent value="accepted">
              <ApplicantsList jobId={jobId} applicants={acceptedApplicants} />
            </TabsContent>

            <TabsContent value="rejected">
              <ApplicantsList jobId={jobId} applicants={rejectedApplicants} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
