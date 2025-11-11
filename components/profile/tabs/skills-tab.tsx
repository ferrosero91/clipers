"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddSkillModal } from "../modals/add-skill-modal"
import { useProfileStore } from "@/store/profile-store"
import { useToast } from "@/hooks/use-toast"
import type { ATSProfile } from "@/lib/types"
import { FiPlus, FiStar, FiTrash2 } from "react-icons/fi"

interface SkillsTabProps {
  atsProfile: ATSProfile | null
  isOwnProfile: boolean
}

export function SkillsTab({ atsProfile, isOwnProfile }: SkillsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const { deleteSkill } = useProfileStore()
  const { toast } = useToast()

  const skills = atsProfile?.skills || []

  const getSkillsByCategory = (category: string) => {
    return skills.filter((skill) => skill.category === category)
  }

  const getLevelStars = (level: string) => {
    switch (level) {
      case "EXPERT":
        return "★★★★"
      case "ADVANCED":
        return "★★★"
      case "INTERMEDIATE":
        return "★★"
      case "BEGINNER":
        return "★"
      default:
        return ""
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "EXPERT":
        return "bg-success/10 text-success"
      case "ADVANCED":
        return "bg-primary/10 text-primary"
      case "INTERMEDIATE":
        return "bg-warning/10 text-warning"
      case "BEGINNER":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleDelete = async (skillId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta habilidad?")) {
      try {
        await deleteSkill(skillId)
        toast({
          title: "Habilidad eliminada",
          description: "La habilidad ha sido eliminada exitosamente.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la habilidad. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    }
  }

  const categories = [
    { key: "TECHNICAL", label: "Habilidades técnicas" },
    { key: "SOFT", label: "Habilidades blandas" },
    { key: "LANGUAGE", label: "Idiomas" },
  ]

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Habilidades</h2>
          {isOwnProfile && (
            <Button onClick={() => setShowAddModal(true)}>
              <FiPlus className="h-4 w-4 mr-2" />
              Agregar habilidad
            </Button>
          )}
        </div>

        {/* Skills by Category */}
        {skills.length > 0 ? (
          <div className="space-y-6">
            {categories.map((category) => {
              const categorySkills = getSkillsByCategory(category.key)
              if (categorySkills.length === 0) return null

              return (
                <Card key={category.key}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">{category.label}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categorySkills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{skill.name}</span>
                            <Badge className={`text-xs ${getLevelColor(skill.level)}`}>
                              {getLevelStars(skill.level)} {skill.level.toLowerCase()}
                            </Badge>
                          </div>
                          {isOwnProfile && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(skill.id)}
                              className="h-8 w-8 p-0"
                            >
                              <FiTrash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <FiStar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No hay habilidades registradas</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? "Agrega tus habilidades para mostrar tu expertise"
                      : "Este usuario no ha agregado habilidades aún"}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button onClick={() => setShowAddModal(true)}>
                    <FiPlus className="h-4 w-4 mr-2" />
                    Agregar primera habilidad
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal open={showAddModal} onOpenChange={setShowAddModal} />
    </>
  )
}
