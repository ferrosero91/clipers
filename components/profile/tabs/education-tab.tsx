"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddEducationModal } from "../modals/add-education-modal"
import { EditEducationModal } from "../modals/edit-education-modal"
import { useProfileStore } from "@/store/profile-store"
import { useToast } from "@/hooks/use-toast"
import type { ATSProfile, Education } from "@/lib/types"
import { FiPlus, FiEdit3, FiTrash2, FiBookOpen } from "react-icons/fi"

interface EducationTabProps {
  atsProfile: ATSProfile | null
  isOwnProfile: boolean
}

export function EducationTab({ atsProfile, isOwnProfile }: EducationTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const { deleteEducation } = useProfileStore()
  const { toast } = useToast()

  const education = atsProfile?.education || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    })
  }

  const handleDelete = async (educationId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta educación?")) {
      try {
        await deleteEducation(educationId)
        toast({
          title: "Educación eliminada",
          description: "La información educativa ha sido eliminada exitosamente.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la educación. Inténtalo de nuevo.",
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
          <h2 className="text-2xl font-bold">Educación</h2>
          {isOwnProfile && (
            <Button onClick={() => setShowAddModal(true)}>
              <FiPlus className="h-4 w-4 mr-2" />
              Agregar educación
            </Button>
          )}
        </div>

        {/* Education List */}
        {education.length > 0 ? (
          <div className="space-y-4">
            {education.map((edu) => (
              <Card key={edu.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div>
                        <h3 className="text-lg font-semibold">{edu.degree}</h3>
                        <p className="text-muted-foreground font-medium">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.field}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : "En curso"}
                        </p>
                      </div>

                      {edu.description && <p className="text-muted-foreground leading-relaxed">{edu.description}</p>}
                    </div>

                    {isOwnProfile && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" size="sm" onClick={() => setEditingEducation(edu)}>
                          <FiEdit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(edu.id)}>
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
                  <FiBookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No hay información educativa</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? "Agrega tu formación académica para completar tu perfil"
                      : "Este usuario no ha agregado información educativa aún"}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <FiPlus className="h-4 w-4 mr-2" />
                    Agregar primera educación
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals */}
      <AddEducationModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditEducationModal
        education={editingEducation}
        open={!!editingEducation}
        onOpenChange={(open) => !open && setEditingEducation(null)}
      />
    </>
  )
}
