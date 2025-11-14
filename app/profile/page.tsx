"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { CompanyProfileHeader } from "@/components/company/company-profile-header"
import { CompanyProfileTabs } from "@/components/company/company-profile-tabs"
import { useProfileStore } from "@/store/profile-store"
import { useAuthStore } from "@/store/auth-store"
import { apiClient } from "@/lib/api"
import type { Company } from "@/lib/types"

export default function ProfilePage() {
  const { profile, atsProfile, isLoading, loadProfile, loadATSProfile } = useProfileStore()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("overview")
  const [company, setCompany] = useState<Company | null>(null)
  const [loadingCompany, setLoadingCompany] = useState(false)

  useEffect(() => {
    if (user) {
      if (user.role === "COMPANY") {
        // Load company profile
        const loadCompany = async () => {
          try {
            setLoadingCompany(true)
            const companyData = await apiClient.get<Company>(`/companies/user/${user.id}`)
            setCompany(companyData)
          } catch (error) {
            console.error("Error loading company:", error)
          } finally {
            setLoadingCompany(false)
          }
        }
        loadCompany()
      } else {
        loadProfile()
        if (user.role === "CANDIDATE") {
          loadATSProfile()
        }
      }
    }
  }, [user, loadProfile, loadATSProfile])

  if (isLoading || loadingCompany) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="bg-card rounded-lg border p-8">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-muted rounded-full"></div>
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-48"></div>
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-4 bg-muted rounded w-64"></div>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-8 h-96"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {user?.role === "COMPANY" ? (
            <>
              <CompanyProfileHeader company={company} isOwnProfile={true} />
              <CompanyProfileTabs company={company} activeTab={activeTab} onTabChange={setActiveTab} isOwnProfile={true} />
            </>
          ) : (
            <>
              <ProfileHeader profile={profile} />
              <ProfileTabs profile={profile} atsProfile={atsProfile} activeTab={activeTab} onTabChange={setActiveTab} />
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
