"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { CreateJobModal } from "@/components/jobs/create-job-modal"
import { useJobStore } from "@/store/job-store"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FiPlus, FiSearch, FiBriefcase, FiRefreshCw } from "react-icons/fi"

export default function JobsPage() {
  const { jobs, isLoading, hasMore, searchJobs, filters } = useJobStore()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    searchJobs("", {}, true)
  }, [searchJobs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchJobs(searchQuery, filters, true)
  }

  const handleLoadMore = () => {
    searchJobs(searchQuery, filters)
  }

  const handleRefresh = () => {
    searchJobs(searchQuery, filters, true)
  }

  const isCompany = user?.role === "COMPANY"

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Empleos</h1>
              <p className="text-muted-foreground">
                {isCompany ? "Gestiona tus ofertas laborales" : "Descubre oportunidades que se ajusten a tu perfil"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <FiRefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
              {isCompany && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <FiPlus className="h-4 w-4 mr-2" />
                  Publicar empleo
                </Button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-8">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar empleos por título, empresa o habilidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                Buscar
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                Filtros
              </Button>
            </form>

            {showFilters && <JobFilters />}
          </div>

          {/* Jobs Grid */}
          {jobs.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <FiBriefcase className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {searchQuery || Object.keys(filters).length > 0
                      ? "No se encontraron empleos"
                      : "No hay empleos disponibles"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery || Object.keys(filters).length > 0
                      ? "Intenta ajustar tus criterios de búsqueda"
                      : isCompany
                        ? "Publica tu primera oferta laboral"
                        : "Vuelve pronto para ver nuevas oportunidades"}
                  </p>
                </div>
                {isCompany && !searchQuery && Object.keys(filters).length === 0 && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    <FiPlus className="h-4 w-4 mr-2" />
                    Publicar primer empleo
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && jobs.length > 0 && (
                <div className="text-center py-8">
                  <Button variant="outline" onClick={handleLoadMore} disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Cargar más empleos"}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Loading Skeleton */}
          {isLoading && jobs.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Job Modal */}
        {isCompany && <CreateJobModal open={showCreateModal} onOpenChange={setShowCreateModal} />}
      </div>
    </ProtectedRoute>
  )
}
