import { create } from "zustand"
import type { Post, Comment } from "@/lib/types"
import { apiClient } from "@/lib/api"

interface FeedState {
  posts: Post[]
  isLoading: boolean
  hasMore: boolean
  page: number
  createPost: (content: string, type?: "TEXT" | "IMAGE" | "VIDEO", imageUrl?: string) => Promise<void>
  loadFeed: (refresh?: boolean) => Promise<void>
  likePost: (postId: string) => Promise<void>
  addComment: (postId: string, content: string) => Promise<void>
  loadComments: (postId: string) => Promise<Comment[]>
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  hasMore: true,
  page: 0,

  createPost: async (content: string, type: "TEXT" | "IMAGE" | "VIDEO" = "TEXT", imageUrl?: string) => {
    try {
      const newPost = await apiClient.post<Post>("/posts", {
        content,
        type: type.toLowerCase(),
        imageUrl,
      })

      set((state) => ({
        posts: [newPost, ...state.posts],
      }))
    } catch (error) {
      console.error("Error creating post:", error)
      throw error
    }
  },

  loadFeed: async (refresh = false) => {
    const { isLoading, hasMore, page } = get()

    if (isLoading || (!hasMore && !refresh)) return

    set({ isLoading: true })

    try {
      const response = await apiClient.get<{
        posts: Post[]
        hasMore: boolean
        totalPages: number
      }>(`/posts?page=${refresh ? 0 : page}&size=10`)

      set((state) => ({
        posts: refresh ? response.posts : [...state.posts, ...response.posts],
        page: refresh ? 1 : page + 1,
        hasMore: response.hasMore,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error loading feed:", error)
      set({ isLoading: false })
    }
  },

  likePost: async (postId: string) => {
    try {
      await apiClient.post(`/posts/${postId}/like`)

      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked,
              }
            : post,
        ),
      }))
    } catch (error) {
      console.error("Error liking post:", error)
      throw error
    }
  },

  addComment: async (postId: string, content: string) => {
    try {
      const comment = await apiClient.post<Comment>(`/posts/${postId}/comments`, {
        content,
      })

      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, comment],
              }
            : post,
        ),
      }))
    } catch (error) {
      console.error("Error adding comment:", error)
      throw error
    }
  },

  loadComments: async (postId: string) => {
    try {
      const comments = await apiClient.get<Comment[]>(`/posts/${postId}/comments`)
      return comments
    } catch (error) {
      console.error("Error loading comments:", error)
      return []
    }
  },
}))
