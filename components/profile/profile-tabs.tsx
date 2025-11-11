"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./tabs/overview-tab"
import { ExperienceTab } from "./tabs/experience-tab"
import { EducationTab } from "./tabs/education-tab"
import { SkillsTab } from "./tabs/skills-tab"
import { ClipersTab } from "./tabs/clipers-tab"
import { useAuthStore } from "@/store/auth-store"
import type { User, Company, ATSProfile } from "@/lib/types"

interface ProfileTabsProps {
  profile: User | Company | null
  atsProfile: ATSProfile | null
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ProfileTabs({ profile, atsProfile, activeTab, onTabChange }: ProfileTabsProps) {
  const { user } = useAuthStore()

  if (!profile) return null

  const isOwnProfile = user?.id === profile.id
  const isCandidate = "firstName" in profile && (profile as User).role === "CANDIDATE"
  const isCompany = "name" in profile

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        {isCandidate && <TabsTrigger value="experience">Experiencia</TabsTrigger>}
        {isCandidate && <TabsTrigger value="education">Educación</TabsTrigger>}
        {isCandidate && <TabsTrigger value="skills">Habilidades</TabsTrigger>}
        <TabsTrigger value="clipers">{isCompany ? "Empleos" : "Clipers"}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab profile={profile} atsProfile={atsProfile} />
      </TabsContent>

      {isCandidate && (
        <>
          <TabsContent value="experience">
            <ExperienceTab atsProfile={atsProfile} isOwnProfile={isOwnProfile} />
          </TabsContent>

          <TabsContent value="education">
            <EducationTab atsProfile={atsProfile} isOwnProfile={isOwnProfile} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsTab atsProfile={atsProfile} isOwnProfile={isOwnProfile} />
          </TabsContent>
        </>
      )}

      <TabsContent value="clipers">
        <ClipersTab profile={profile} isOwnProfile={isOwnProfile} />
      </TabsContent>
    </Tabs>
  )
}
