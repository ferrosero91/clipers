"use client"

import { useEffect, useMemo, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { PostCard } from "@/components/feed/post-card"
import { CreatePost } from "@/components/feed/create-post"
import { useFeedStore } from "@/store/feed-store"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import Image from "next/image"

export default function FeedPage() {
  const { posts, isLoading, hasMore, loadFeed } = useFeedStore()
  const [activeTab, setActiveTab] = useState<"foryou" | "trending">("foryou")
  const [selectedType, setSelectedType] = useState<"ALL" | "TEXT" | "IMAGE" | "VIDEO" | "CLIPER">("ALL")
  const [selectedRole, setSelectedRole] = useState<"ALL" | "CANDIDATE" | "COMPANY">("ALL")

  const displayPosts = useMemo(() => {
    let arr = [...posts]
    if (selectedType !== "ALL") {
      arr = arr.filter((p) => p.type === selectedType)
    }
    if (selectedRole !== "ALL") {
      arr = arr.filter((p) => p.user?.role === selectedRole)
    }
    if (activeTab === "trending") {
      arr.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    }
    return arr
  }, [posts, activeTab, selectedType, selectedRole])

  useEffect(() => {
    loadFeed(true)
  }, [loadFeed])

  const handleLoadMore = () => {
    loadFeed()
  }

  const handleRefresh = () => {
    loadFeed(true)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1500px]">
          <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,740px)_220px] gap-24">
            {/* Left Sidebar */}
            <aside className="space-y-6 md:sticky md:top-44 lg:top-48 md:-ml-12 lg:-ml-14 xl:-ml-16">
              <div className="bg-card border rounded-md px-2 py-5 w-full md:w-[200px] md:ml-auto md:mr-0">
                <h2 className="sr-only">Explorar</h2>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                  <TabsList className="flex flex-col w-full items-stretch gap-2 bg-transparent p-0">
                    <TabsTrigger value="foryou" className="justify-start w-full text-sm h-8 px-2 rounded-md data-[state=active]:bg-muted data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-border">Para ti</TabsTrigger>
                    <TabsTrigger value="trending" className="justify-start w-full text-sm h-8 px-2 rounded-md data-[state=active]:bg-muted data-[state=active]:font-semibold data-[state=active]:border data-[state=active]:border-border">Tendencias</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="bg-card border rounded-md p-2 w-full md:w-[200px] md:ml-auto md:mr-0">
                  <h2 className="text-xs font-semibold mb-2">Filtros</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Tipo de contenido</p>
                    <Select value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
                      <SelectTrigger className="w-full h-8 text-sm">
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos</SelectItem>
                        <SelectItem value="TEXT">Post</SelectItem>
                        <SelectItem value="IMAGE">Imagen</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                        <SelectItem value="CLIPER">Clipers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Rol del autor</p>
                    <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as any)}>
                      <SelectTrigger className="w-full h-8 text-sm">
                        <SelectValue placeholder="Selecciona rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos</SelectItem>
                        <SelectItem value="CANDIDATE">Candidatos</SelectItem>
                        <SelectItem value="COMPANY">Empresas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full h-8 text-sm" onClick={handleRefresh} disabled={isLoading}>
                      <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      Refrescar
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="md:ml-12 lg:ml-16 xl:ml-20">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Image src="/LogoClipers.png" alt="Clipers" width={40} height={40} className="h-10 w-10 rounded-lg" />
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Feed</h1>
                    <p className="text-muted-foreground">Descubre oportunidades y conecta con profesionales</p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {activeTab === "trending" && posts.length > 0 && (
                <div className="mb-8 border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Destacados de la semana</h3>
                  <div className="space-y-3">
                    {[...posts]
                      .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
                      .slice(0, 5)
                      .map((p) => (
                        <div key={p.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{p.user?.firstName} {p.user?.lastName}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{p.content}</span>
                          </div>
                          <span className="text-xs font-medium">{p.likes} 👍</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Create Post */}
              <div className="mb-8">
                <CreatePost />
              </div>

              {/* Posts Feed */}
              <div className="space-y-6">
                {displayPosts.length === 0 && !isLoading ? (
                  <div className="text-center py-12">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <RefreshCw className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">No hay posts aún</h3>
                        <p className="text-muted-foreground">Sé el primero en compartir algo interesante</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  displayPosts.map((post) => <PostCard key={post.id} post={post} />)
                )}

                {/* Load More Button */}
                {hasMore && displayPosts.length > 0 && (
                  <div className="text-center py-6">
                    <Button variant="outline" onClick={handleLoadMore} disabled={isLoading}>
                      {isLoading ? "Cargando..." : "Cargar más"}
                    </Button>
                  </div>
                )}

                {/* Loading Skeleton */}
                {isLoading && posts.length === 0 && (
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-card rounded-lg border p-6 animate-pulse">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-muted rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-32"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-full"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
