"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompanyOverviewTab } from "./tabs/company-overview-tab"
import { CompanyJobsTab } from "./tabs/company-jobs-tab"
import type { Company } from "@/lib/types"

interface CompanyProfileTabsProps {
  company: Company | null
  activeTab: string
  onTabChange: (tab: string) => void
  isOwnProfile?: boolean
}

export function CompanyProfileTabs({ company, activeTab, onTabChange, isOwnProfile = false }: CompanyProfileTabsProps) {
  if (!company) {
    return null
  }

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="jobs">Empleos</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <CompanyOverviewTab company={company} isOwnProfile={isOwnProfile} />
      </TabsContent>

      <TabsContent value="jobs">
        <CompanyJobsTab company={company} isOwnProfile={isOwnProfile} />
      </TabsContent>
    </Tabs>
  )
}
