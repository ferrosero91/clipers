"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Briefcase, Users } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, checkAuth } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/feed")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null // Will redirect to feed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Tu futuro profesional
              <span className="text-primary"> en video</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Conecta con oportunidades laborales a través de videos cortos profesionales. Muestra tu personalidad y
              habilidades más allá del CV tradicional.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Clipers Profesionales</h3>
              <p className="text-muted-foreground">
                Crea videos cortos que muestren tu personalidad y habilidades profesionales
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto">
                <Briefcase className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Matching Inteligente</h3>
              <p className="text-muted-foreground">
                Nuestro algoritmo conecta tu perfil con las oportunidades más relevantes
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Red Profesional</h3>
              <p className="text-muted-foreground">Conecta con empresas y profesionales de tu sector académico</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Únete a la revolución profesional</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Profesionales</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary">500+</div>
              <div className="text-muted-foreground">Empresas</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-success">2K+</div>
              <div className="text-muted-foreground">Empleos</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-warning">95%</div>
              <div className="text-muted-foreground">Satisfacción</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
