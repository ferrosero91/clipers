"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/store/dashboard-store"
import { useAuthStore } from "@/store/auth-store"
import { Eye, Heart, MessageCircle, Briefcase, Users, TrendingUp, Plus, Bell } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { stats, recentActivity, loading, fetchDashboardStats, fetchRecentActivity } = useDashboardStore()

  useEffect(() => {
    fetchDashboardStats()
    fetchRecentActivity()
  }, [fetchDashboardStats, fetchRecentActivity])

  const isCompany = user?.role === "COMPANY"

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} h`
    return `hace ${Math.floor(diffInMinutes / 1440)} días`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{isCompany ? "Dashboard Empresarial" : "Mi Dashboard"}</h1>
          <p className="text-muted-foreground mt-1">
            {isCompany ? "Gestiona tus ofertas de trabajo y candidatos" : "Revisa tu actividad y oportunidades"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </Button>
          {isCompany && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Oferta
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isCompany ? "Candidatos Alcanzados" : "Visualizaciones Totales"}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isCompany ? stats?.candidatesReached?.toLocaleString() : stats?.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isCompany ? "Ofertas Publicadas" : "Likes Recibidos"}
            </CardTitle>
            {isCompany ? (
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Heart className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isCompany ? stats?.jobsPosted : stats?.totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +5% desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isCompany ? "Aplicaciones Recibidas" : "Comentarios"}
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isCompany ? stats?.totalApplications : stats?.totalComments}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isCompany ? "Candidatos Activos" : "Aplicaciones Enviadas"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isCompany ? "47" : stats?.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +15% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas interacciones en tu {isCompany ? "empresa" : "perfil"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0">
                  {activity.type === "like" && <Heart className="h-4 w-4 text-red-500" />}
                  {activity.type === "application" && <Briefcase className="h-4 w-4 text-blue-500" />}
                  {activity.type === "view" && <Eye className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{activity.user}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>{isCompany ? "Gestiona tu empresa" : "Mejora tu perfil"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isCompany ? (
              <>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Publicar Nueva Oferta
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Ver Candidatos
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analíticas Avanzadas
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Nuevo Cliper
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Buscar Empleos
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Actualizar Perfil
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
