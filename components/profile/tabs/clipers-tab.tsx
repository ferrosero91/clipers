"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CliperCard } from "@/components/clipers/cliper-card"
import { UploadCliperModal } from "@/components/clipers/upload-cliper-modal"
import { useCliperStore } from "@/store/cliper-store"
import { useJobStore } from "@/store/job-store"
import { useAuthStore } from "@/store/auth-store"
import type { User, Company } from "@/lib/types"
import { FiPlus, FiVideo, FiBriefcase } from "react-icons/fi"

interface ClipersTabProps {
  profile: User | Company | null
  isOwnProfile: boolean
}

export function ClipersTab({ profile, isOwnProfile }: ClipersTabProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const { clipers, loadClipers, loadMyClipers } = useCliperStore()
  const { jobs, searchJobs } = useJobStore()
  const { user } = useAuthStore()

  const isCompany = profile && "name" in profile

  useEffect(() => {
    if (isCompany && isOwnProfile) {
      // Load company jobs
      searchJobs("", {}, true)
    } else if (isOwnProfile) {
      // Load user's own clipers
      loadMyClipers()
    } else {
      // Load public clipers for other users' profiles
      loadClipers(true)
    }
  }, [isCompany, isOwnProfile, loadClipers, loadMyClipers, searchJobs])

  if (isCompany) {
    // Show company jobs
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Empleos publicados</h2>
          {isOwnProfile && (
            <Button onClick={() => setShowUploadModal(true)}>
              <FiPlus className="h-4 w-4 mr-2" />
              Publicar empleo
            </Button>
          )}
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-2">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{job.location}</span>
                  <span className="text-primary font-medium">Ver detalles</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <FiBriefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No hay empleos publicados</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? "Publica tu primera oferta laboral para encontrar candidatos"
                      : "Esta empresa no ha publicado empleos aún"}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button onClick={() => setShowUploadModal(true)}>
                    <FiPlus className="h-4 w-4 mr-2" />
                    Publicar primer empleo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Show user clipers
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Mis Clipers</h2>
          {isOwnProfile && (
            <Button onClick={() => setShowUploadModal(true)}>
              <FiPlus className="h-4 w-4 mr-2" />
              Subir Cliper
            </Button>
          )}
        </div>

        {clipers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clipers.map((cliper) => (
              <CliperCard key={cliper.id} cliper={cliper} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <FiVideo className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No hay clipers</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? "Sube tu primer cliper para mostrar tu perfil profesional"
                      : "Este usuario no ha subido clipers aún"}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button onClick={() => setShowUploadModal(true)}>
                    <FiPlus className="h-4 w-4 mr-2" />
                    Subir primer Cliper
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upload Modal */}
      <UploadCliperModal open={showUploadModal} onOpenChange={setShowUploadModal} />
    </>
  )
}
