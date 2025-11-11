"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { useProfileStore } from "@/store/profile-store"
import { useAuthStore } from "@/store/auth-store"

export default function ProfilePage() {
  const { profile, atsProfile, isLoading, loadProfile, loadATSProfile } = useProfileStore()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (user) {
      loadProfile()
      if (user.role === "CANDIDATE") {
        loadATSProfile()
      }
    }
  }, [user, loadProfile, loadATSProfile])

  if (isLoading) {
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
          <ProfileHeader profile={profile} />
          <ProfileTabs profile={profile} atsProfile={atsProfile} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
