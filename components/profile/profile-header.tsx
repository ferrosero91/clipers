"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EditProfileModal } from "./modals/edit-profile-modal"
import { useAuthStore } from "@/store/auth-store"
import type { User, Company } from "@/lib/types"
import { Edit3, MapPin, Globe, Mail, Calendar } from "lucide-react"

interface ProfileHeaderProps {
  profile: User | Company | null
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const { user } = useAuthStore()

  if (!profile) return null

  const isOwnProfile = user?.id === profile.id
  const isCompany = "name" in profile // Company has 'name', User has 'firstName'

  return (
    <>
      <div className="bg-card rounded-lg border p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Avatar */}
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={isCompany ? (profile as Company).logo : (profile as User).profileImage || "/placeholder.svg"}
              alt={
                isCompany ? (profile as Company).name : `${(profile as User).firstName} ${(profile as User).lastName}`
              }
            />
            <AvatarFallback className="text-2xl">
              {isCompany
                ? (profile as Company).name?.[0]
                : `${(profile as User).firstName?.[0]}${(profile as User).lastName?.[0]}`}
            </AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-balance">
                  {isCompany
                    ? (profile as Company).name
                    : `${(profile as User).firstName} ${(profile as User).lastName}`}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  {isCompany ? (
                    <>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{(profile as Company).location}</span>
                      </div>
                      <Badge variant="secondary">{(profile as Company).industry}</Badge>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{(profile as User).email}</span>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {(profile as User).role.toLowerCase()}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <Button onClick={() => setShowEditModal(true)} variant="outline">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-pretty">
              {isCompany ? (profile as Company).description : "Profesional en busca de nuevas oportunidades"}
            </p>

            {/* Additional Info */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {isCompany && (profile as Company).website && (
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <a
                    href={(profile as Company).website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Sitio web
                  </a>
                </div>
              )}
              {isCompany && (profile as Company).size && (
                <div className="flex items-center space-x-1">
                  <span>{(profile as Company).size} empleados</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Miembro desde{" "}
                  {new Date(profile.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={showEditModal} onOpenChange={setShowEditModal} />
    </>
  )
}
