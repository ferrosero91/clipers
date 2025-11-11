"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddExperienceModal } from "../modals/add-experience-modal"
import { EditExperienceModal } from "../modals/edit-experience-modal"
import { useProfileStore } from "@/store/profile-store"
import { useToast } from "@/hooks/use-toast"
import type { ATSProfile, Experience } from "@/lib/types"
import { FiPlus, FiEdit3, FiTrash2, FiBriefcase } from "react-icons/fi"

interface ExperienceTabProps {
  atsProfile: ATSProfile | null
  isOwnProfile: boolean
}

export function ExperienceTab({ atsProfile, isOwnProfile }: ExperienceTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const { deleteExperience } = useProfileStore()
  const { toast } = useToast()

  const experiences = atsProfile?.experience || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    })
  }

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years === 0) return `${remainingMonths} mes${remainingMonths !== 1 ? "es" : ""}`
    if (remainingMonths === 0) return `${years} año${years !== 1 ? "s" : ""}`
    return `${years} año${years !== 1 ? "s" : ""} ${remainingMonths} mes${remainingMonths !== 1 ? "es" : ""}`
  }

  const handleDelete = async (experienceId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta experiencia?")) {
      try {
        await deleteExperience(experienceId)
        toast({
          title: "Experiencia eliminada",
          description: "La experiencia ha sido eliminada exitosamente.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la experiencia. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Experiencia laboral</h2>
          {isOwnProfile && (
            <Button onClick={() => setShowAddModal(true)}>
              <FiPlus className="h-4 w-4 mr-2" />
              Agregar experiencia
            </Button>
          )}
        </div>

        {/* Experience List */}
        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((experience) => (
              <Card key={experience.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div>
                        <h3 className="text-lg font-semibold">{experience.position}</h3>
                        <p className="text-muted-foreground font-medium">{experience.company}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(experience.startDate)} -{" "}
                          {experience.endDate ? formatDate(experience.endDate) : "Presente"} ·{" "}
                          {calculateDuration(experience.startDate, experience.endDate)}
                        </p>
                      </div>

                      <p className="text-muted-foreground leading-relaxed">{experience.description}</p>

                      {experience.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {experience.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {isOwnProfile && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" size="sm" onClick={() => setEditingExperience(experience)}>
                          <FiEdit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(experience.id)}>
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
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
                  <h3 className="text-lg font-semibold">No hay experiencia laboral</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? "Agrega tu experiencia laboral para mostrar tu trayectoria profesional"
                      : "Este usuario no ha agregado experiencia laboral aún"}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <FiPlus className="h-4 w-4 mr-2" />
                    Agregar primera experiencia
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <AddExperienceModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditExperienceModal
        experience={editingExperience}
        open={!!editingExperience}
        onOpenChange={(open) => !open && setEditingExperience(null)}
      />
    </>
  )
}
