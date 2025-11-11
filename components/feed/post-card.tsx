"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "./comment-section"
import { useFeedStore } from "@/store/feed-store"
import type { Post } from "@/lib/types"
import { Share, MoreHorizontal, Play } from "lucide-react"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const { likePost } = useFeedStore()

  const handleLike = async () => {
    try {
      await likePost(post.id)
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

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
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user?.profileImage || "/placeholder.svg"} alt={post.user?.firstName} />
              <AvatarFallback>
                {post.user?.firstName?.[0]}
                {post.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-sm">
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
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">{post.content}</p>

          {/* Media Content */}
          {post.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt="Post image"
                className="w-full h-auto object-cover max-h-96"
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
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="sm" className="space-x-2 text-muted-foreground">
              <Share className="h-4 w-4" />
              <span>Compartir</span>
            </Button>
          </div>
        </div>


      </CardContent>
    </Card>
  )
}
