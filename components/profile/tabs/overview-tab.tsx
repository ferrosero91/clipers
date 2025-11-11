"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EditATSSummaryModal } from "../modals/edit-ats-summary-modal"
import { useAuthStore } from "@/store/auth-store"
import type { User, Company, ATSProfile } from "@/lib/types"
import { FiBriefcase, FiBookOpen, FiStar, FiMapPin, FiUsers, FiEdit3 } from "react-icons/fi"

interface OverviewTabProps {
  profile: User | Company | null
  atsProfile: ATSProfile | null
}

export function OverviewTab({ profile, atsProfile }: OverviewTabProps) {
  const { user } = useAuthStore()
  const [showEditSummaryModal, setShowEditSummaryModal] = useState(false)

  if (!profile) return null

  const isCompany = "name" in profile
  const isOwnProfile = user?.id === profile.id

  if (isCompany) {
    const company = profile as Company
    return (
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <FiMapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Ubicación:</span>
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FiBriefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Industria:</span>
                  <span>{company.industry}</span>
                </div>
              </div>
              <div className="space-y-2">
                {company.size && (
                  <div className="flex items-center space-x-2 text-sm">
                    <FiUsers className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Tamaño:</span>
                    <span>{company.size}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">Sitio web:</span>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-2">Descripción</h4>
              <p className="text-muted-foreground leading-relaxed">{company.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User profile
  const userProfile = profile as User

  return (
    <>
      <div className="grid gap-6">
        {/* ATS Summary */}
        {atsProfile && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resumen profesional</CardTitle>
                {isOwnProfile && (
                  <Button variant="ghost" size="sm" onClick={() => setShowEditSummaryModal(true)}>
                    <FiEdit3 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{atsProfile.summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Experience */}
          {atsProfile && atsProfile.experience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FiBriefcase className="h-5 w-5" />
                  <span>Experiencia reciente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {atsProfile.experience.slice(0, 2).map((exp) => (
                  <div key={exp.id} className="space-y-2">
                    <div>
                      <h4 className="font-medium">{exp.position}</h4>
                      <p className="text-sm text-muted-foreground">{exp.company}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{exp.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {exp.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {atsProfile && atsProfile.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FiBookOpen className="h-5 w-5" />
                  <span>Educación</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {atsProfile.education.slice(0, 2).map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">{edu.field}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Top Skills */}
        {atsProfile && atsProfile.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FiStar className="h-5 w-5" />
                <span>Habilidades principales</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {atsProfile.skills.slice(0, 10).map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="text-sm">
                    {skill.name}
                    <span className="ml-1 text-xs opacity-70">
                      {skill.level === "EXPERT"
                        ? "★★★★"
                        : skill.level === "ADVANCED"
                          ? "★★★"
                          : skill.level === "INTERMEDIATE"
                            ? "★★"
                            : "★"}
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!atsProfile && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <FiBriefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Perfil ATS no disponible</h3>
                  <p className="text-muted-foreground">
                    Sube tu primer Cliper para generar automáticamente tu perfil profesional
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit ATS Summary Modal */}
      <EditATSSummaryModal atsProfile={atsProfile} open={showEditSummaryModal} onOpenChange={setShowEditSummaryModal} />
    </>
  )
}
