"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UploadCliperModal } from "@/components/clipers/upload-cliper-modal"
import { useCliperStore } from "@/store/cliper-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Share2, Play, RefreshCw, MoreHorizontal } from "lucide-react"
import type { Cliper, Comment } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CliperPlayer } from "@/components/clipers/cliper-player"

export default function ClipersPage() {
  const { clipers, isLoading, hasMore, loadClipers, deleteCliper } = useCliperStore()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [engagement, setEngagement] = useState<Record<string, { postId?: string; likes: number; isLiked: boolean; comments: number }>>({})
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentsList, setCommentsList] = useState<Comment[]>([])
  const [activeCliper, setActiveCliper] = useState<Cliper | null>(null)
  const [newComment, setNewComment] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  // Vista simplificada estilo YouTube: sin observer ni autoplay (limpieza de estados heredados)

  useEffect(() => {
    loadClipers(true)
  }, [loadClipers])


  const handleShare = async (cliper: Cliper) => {
    const shareUrl = cliper.videoUrl ?? `${window.location.origin}/clipers?cliper=${cliper.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: cliper.title, text: cliper.description, url: shareUrl })
        toast({ title: "Compartido", description: "Cliper compartido correctamente." })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast({ title: "Copiado", description: "Enlace del cliper copiado al portapapeles." })
      }
    } catch {
      toast({ title: "Error", description: "No se pudo compartir el cliper.", variant: "destructive" })
    }
  }

  const handleLoadMore = () => {
    loadClipers()
  }

  const handleDelete = async (cliperId: string) => {
    try {
      await deleteCliper(cliperId)
      toast({ title: "Eliminado", description: "Reel eliminado correctamente." })
    } catch {
      toast({ title: "Error", description: "No se pudo eliminar el reel.", variant: "destructive" })
    }
  }

  const handleViewProfile = (cliper: Cliper) => {
    const targetId = cliper.userId || cliper.user?.id
    if (targetId) {
      router.push(`/profile/${targetId}`)
    } else {
      toast({ title: "Perfil no disponible", description: "No se encontró el usuario del reel.", variant: "destructive" })
    }
  }

  const ensurePost = async (cliper: Cliper): Promise<string> => {
    const existing = engagement[cliper.id]?.postId
    if (existing) return existing
    try {
      const res = await apiClient.post('/posts', {
        content: cliper.title || '',
        type: 'VIDEO',
        imageUrl: null,
        videoUrl: cliper.videoUrl,
      })
      const postId = res.data?.id ?? res.data?.data?.id ?? res.data?.data?.data?.id
      setEngagement((prev) => ({
        ...prev,
        [cliper.id]: { postId, likes: 0, isLiked: false, comments: 0 }
      }))
      return postId
    } catch (e) {
      toast({ title: "Error", description: "No se pudo preparar el post para este reel.", variant: "destructive" })
      throw e
    }
  }

  const handleLike = async (cliper: Cliper) => {
    try {
      const postId = await ensurePost(cliper)
      await apiClient.post(`/posts/${postId}/like`)
      setEngagement((prev) => {
        const curr = prev[cliper.id] || { postId, likes: 0, isLiked: false, comments: 0 }
        const isLiked = !curr.isLiked
        const likes = Math.max(0, curr.likes + (isLiked ? 1 : -1))
        return { ...prev, [cliper.id]: { ...curr, isLiked, likes } }
      })
    } catch {
      toast({ title: "Error", description: "No se pudo dar me gusta al reel.", variant: "destructive" })
    }
  }

  const openComments = async (cliper: Cliper) => {
    try {
      const postId = await ensurePost(cliper)
      const res = await apiClient.get(`/posts/${postId}/comments`)
      const comments = res.data?.data ?? res.data
      setCommentsList(comments || [])
      setActiveCliper(cliper)
      setCommentsOpen(true)
      setEngagement((prev) => {
        const curr = prev[cliper.id] || { postId, likes: 0, isLiked: false, comments: 0 }
        return { ...prev, [cliper.id]: { ...curr, comments: Array.isArray(comments) ? comments.length : curr.comments } }
      })
    } catch {
      toast({ title: "Error", description: "No se pudieron cargar los comentarios.", variant: "destructive" })
    }
  }

  const submitComment = async () => {
    if (!activeCliper || !newComment.trim()) return
    try {
      const postId = await ensurePost(activeCliper)
      const res = await apiClient.post(`/posts/${postId}/comments`, { content: newComment.trim() })
      const saved = res.data?.data ?? res.data?.data ?? res.data
      setCommentsList((prev) => [...prev, saved])
      setNewComment("")
      setEngagement((prev) => {
        const curr = prev[activeCliper.id] || { postId, likes: 0, isLiked: false, comments: 0 }
        return { ...prev, [activeCliper.id]: { ...curr, comments: curr.comments + 1 } }
      })
    } catch {
      toast({ title: "Error", description: "No se pudo enviar el comentario.", variant: "destructive" })
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Clipers</h1>
              <p className="text-muted-foreground">Presenta tu perfil profesional con videos cortos</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
              <Button onClick={() => setShowUploadModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Subir Cliper
              </Button>
            </div>
          </div>

          {/* Feed de Videos - Estilo Facebook/YouTube */}
          {clipers.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    No hay clipers aún
                  </h3>
                  <p className="text-muted-foreground">
                    Crea tu primer cliper para mostrar tu perfil profesional
                  </p>
                </div>
                <Button onClick={() => setShowUploadModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Subir tu primer Cliper
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Feed vertical centrado estilo Facebook */}
              <div className="max-w-2xl mx-auto space-y-8">
                {clipers.map((cliper) => (
                  <div key={cliper.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Header del post */}
                    <div className="p-4 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={cliper.user?.profileImage || "/placeholder.svg"} />
                            <AvatarFallback>{cliper.user?.firstName?.[0] ?? "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm cursor-pointer hover:underline" onClick={() => handleViewProfile(cliper)}>
                              {cliper.user ? `${cliper.user.firstName} ${cliper.user.lastName}` : "Usuario"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(cliper.createdAt), { addSuffix: true, locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-xs ${
                            cliper.status === "DONE" ? "bg-green-100 text-green-800" :
                            cliper.status === "PROCESSING" ? "bg-yellow-100 text-yellow-800" :
                            cliper.status === "FAILED" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {cliper.status === "DONE" ? "Listo" : cliper.status === "PROCESSING" ? "Procesando" : cliper.status === "FAILED" ? "Error" : cliper.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={async () => {
                                  const ok = window.confirm("¿Seguro que deseas eliminar este cliper?")
                                  if (!ok) return
                                  try {
                                    await deleteCliper(cliper.id)
                                    toast({ title: "Eliminado", description: "Cliper eliminado correctamente." })
                                  } catch {
                                    toast({ title: "Error", description: "No se pudo eliminar el cliper.", variant: "destructive" })
                                  }
                                }}
                                className="text-red-600"
                              >
                                Eliminar cliper
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>

                    {/* Título y descripción */}
                    {(cliper.title || cliper.description) && (
                      <div className="px-4 pb-3">
                        {cliper.title && (
                          <h3 className="font-semibold text-base mb-1">{cliper.title}</h3>
                        )}
                        {cliper.description && (
                          <p className="text-sm text-muted-foreground">{cliper.description}</p>
                        )}
                      </div>
                    )}

                    {/* Video Player - Más grande */}
                    <div className="relative">
                      <div className="aspect-[16/10] bg-black rounded-lg overflow-hidden">
                        <CliperPlayer cliper={cliper} />
                      </div>
                      {cliper.duration > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {Math.floor(cliper.duration / 60)}:{(cliper.duration % 60).toString().padStart(2, "0")}
                        </div>
                      )}
                    </div>

                    {/* Acciones del post */}
                    <div className="p-4 pt-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(cliper)}
                            className={`flex items-center gap-2 hover:bg-red-50 ${engagement[cliper.id]?.isLiked ? 'text-red-500' : 'text-gray-600'}`}
                          >
                            ❤️ {engagement[cliper.id]?.likes || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openComments(cliper)}
                            className="flex items-center gap-2 hover:bg-blue-50 text-gray-600"
                          >
                            💬 {engagement[cliper.id]?.comments || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(cliper)}
                            className="flex items-center gap-2 hover:bg-green-50 text-gray-600"
                          >
                            <Share2 className="h-4 w-4" />
                            Compartir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              {hasMore && (
                <div className="text-center py-8">
                  <Button variant="outline" onClick={handleLoadMore} disabled={isLoading} className="transition-transform hover:scale-105 active:scale-95">
                    {isLoading ? "Cargando..." : "Cargar más"}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Comments Dialog */}
          <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Comentarios</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {commentsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sé el primero en comentar.</p>
                ) : commentsList.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{c.user?.firstName?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{c.user ? `${c.user.firstName} ${c.user.lastName}` : "Usuario"}</p>
                      <p className="text-muted-foreground">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <input
                  className="flex-1 bg-muted rounded px-3 py-2 text-sm"
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={submitComment} disabled={!newComment.trim()}>Enviar</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Loading Skeleton */}
          {isLoading && clipers.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-muted rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                        <div className="h-2 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        <UploadCliperModal open={showUploadModal} onOpenChange={setShowUploadModal} />
      </div>
    </ProtectedRoute>
  )
}
