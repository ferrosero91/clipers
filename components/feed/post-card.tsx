"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RemoteAvatar } from "@/components/ui/remote-avatar"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "./comment-section"
import { useFeedStore } from "@/store/feed-store"
import type { Post } from "@/lib/types"
import { Heart, MessageCircle, MoreHorizontal, Play, Trash2, Edit2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/store/auth-store"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [showComments, setShowComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [comments, setComments] = useState(post.comments || [])
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [showMenu, setShowMenu] = useState(false)
  const { likePost, loadComments, deletePost, updatePost } = useFeedStore()

  const handleLike = async () => {
    try {
      await likePost(post.id)
      setIsLiked(!isLiked)
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleProfileClick = () => {
    if (post.user?.id) {
      router.push(`/profile/${post.user.id}`)
    }
  }

  const handleToggleComments = async () => {
    if (!showComments) {
      // Load comments when opening
      const loadedComments = await loadComments(post.id)
      setComments(loadedComments)
    }
    setShowComments(!showComments)
  }

  const handleCommentAdded = async () => {
    // Reload comments after adding a new one
    const loadedComments = await loadComments(post.id)
    setComments(loadedComments)
  }

  const handleDeletePost = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta publicación?")) return

    try {
      await deletePost(post.id)
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleEditPost = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return

    try {
      await updatePost(post.id, editContent.trim())
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating post:", error)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(post.content)
    setIsEditing(false)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(false)
    if (showMenu) {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [showMenu])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "VIDEO":
        return "bg-primary/10 text-primary"
      case "CLIPER":
        return "bg-secondary/10 text-secondary"
      case "IMAGE":
        return "bg-success/10 text-success"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
      case "CLIPER":
        return <Play className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button onClick={handleProfileClick} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <RemoteAvatar
                className="h-10 w-10"
                src={post.user?.profileImage}
                alt={`${post.user?.firstName} ${post.user?.lastName}`}
                fallback={`${post.user?.firstName?.[0] || ""}${post.user?.lastName?.[0] || ""}`}
              />
              <div className="space-y-1 text-left">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-sm hover:underline">
                    {post.user?.firstName} {post.user?.lastName}
                  </p>
                  <Badge variant="secondary" className={`text-xs ${getTypeColor(post.type)}`}>
                    {getTypeIcon(post.type)}
                    <span className="ml-1">
                      {post.type === "CLIPER" ? "Cliper" : post.type === "VIDEO" ? "Video" : "Post"}
                    </span>
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {(() => {
                    try {
                      const date = new Date(post.createdAt)
                      if (isNaN(date.getTime())) {
                        return "Fecha inválida"
                      }
                      return formatDistanceToNow(date, {
                        addSuffix: true,
                        locale: es,
                      })
                    } catch (error) {
                      return "Fecha inválida"
                    }
                  })()}
                </p>
              </div>
            </button>
          </div>
          {user && (user.id === post.userId || user.id === post.user?.id) && (
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      handleEditPost()
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar publicación
                  </button>
                  <button
                    onClick={() => {
                      handleDeletePost()
                      setShowMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted flex items-center text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar publicación
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
                maxLength={500}
              />
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-foreground leading-relaxed">{post.content}</p>
          )}

          {/* Media Content */}
          {post.imageUrl && (
            <div className="rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center min-h-[200px]">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt="Post image"
                className="w-full h-auto object-contain max-h-[600px]"
              />
            </div>
          )}

          {post.videoUrl && (
            <div className="rounded-lg overflow-hidden bg-black">
              <video controls className="w-full h-auto max-h-96">
                <source src={post.videoUrl} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`space-x-2 ${isLiked ? "text-red-500" : "text-muted-foreground"}`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">{likeCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="space-x-2 text-muted-foreground"
              onClick={handleToggleComments}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{comments.length}</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            <CommentSection 
              postId={post.id} 
              comments={comments} 
              postOwnerId={post.userId}
              onCommentAdded={handleCommentAdded} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
