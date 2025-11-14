"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/auth-store"
import { useFeedStore } from "@/store/feed-store"
import type { Comment } from "@/lib/types"
import { Send, Edit2, Trash2, X, Check } from "lucide-react"

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  postOwnerId?: string
  onCommentAdded?: () => void
}

export function CommentSection({ postId, comments, postOwnerId, onCommentAdded }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const { user } = useAuthStore()
  const { addComment, updateComment, deleteComment } = useFeedStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(postId, newComment.trim())
      setNewComment("")
      // Notify parent to reload comments
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditContent(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditContent("")
  }

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) return

    try {
      await updateComment(postId, commentId, editContent.trim())
      setEditingCommentId(null)
      setEditContent("")
      // Reload comments after editing
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este comentario?")) return

    try {
      await deleteComment(postId, commentId)
      // Reload comments after deleting
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  return (
    <div className="space-y-4">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user?.profileImage || "/placeholder.svg"} alt={comment.user?.firstName} />
                <AvatarFallback className="text-xs">
                  {comment.user?.firstName?.[0]}
                  {comment.user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                {editingCommentId === comment.id ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1"
                      maxLength={200}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(comment.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <p className="font-semibold text-sm">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </p>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-3 px-3">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </p>
                      {user?.id === comment.userId && (
                        <button
                          onClick={() => handleEdit(comment)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Editar
                        </button>
                      )}
                      {(user?.id === comment.userId || user?.id === postOwnerId) && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt={user?.firstName} />
          <AvatarFallback className="text-xs">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex items-center space-x-2">
          <Input
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
            maxLength={200}
          />
          <Button type="submit" size="sm" disabled={!newComment.trim() || isSubmitting}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
