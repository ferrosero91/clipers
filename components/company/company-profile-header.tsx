"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { EditCompanyModal } from "./edit-company-modal"
import { useAuthStore } from "@/store/auth-store"
import type { Company } from "@/lib/types"
import { FiMapPin, FiBriefcase, FiGlobe, FiCalendar, FiUsers, FiEdit2 } from "react-icons/fi"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface CompanyProfileHeaderProps {
  company: Company | null
  isOwnProfile?: boolean
}

export function CompanyProfileHeader({ company, isOwnProfile = false }: CompanyProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const { user } = useAuthStore()

  if (!company) {
    return null
  }

  const currentYear = new Date().getFullYear()
  const yearsInBusiness = company.foundedYear ? currentYear - company.foundedYear : null

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Company Logo */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
              <AvatarFallback className="text-2xl">
                <FiBriefcase className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>

            {/* Company Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                  {company.industry && (
                    <Badge variant="secondary" className="mt-2">
                      {company.industry}
                    </Badge>
                  )}
                </div>
                {isOwnProfile && (
                  <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                    <FiEdit2 className="h-4 w-4 mr-2" />
                    Editar perfil
                  </Button>
                )}
              </div>

              {/* Company Details */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {company.location && (
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                )}
                {company.size && (
                  <div className="flex items-center space-x-2">
                    <FiUsers className="h-4 w-4" />
                    <span>{company.size}</span>
                  </div>
                )}
                {company.foundedYear && (
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="h-4 w-4" />
                    <span>
                      Fundada en {company.foundedYear}
                      {yearsInBusiness && ` • ${yearsInBusiness} años`}
                    </span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center space-x-2">
                    <FiGlobe className="h-4 w-4" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Sitio web
                    </a>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div className="text-sm text-muted-foreground">
                <FiCalendar className="inline h-3 w-3 mr-1" />
                Miembro desde{" "}
                {formatDistanceToNow(new Date(company.createdAt), {
                  addSuffix: false,
                  locale: es,
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isOwnProfile && <EditCompanyModal open={showEditModal} onOpenChange={setShowEditModal} company={company} />}
    </>
  )
}
