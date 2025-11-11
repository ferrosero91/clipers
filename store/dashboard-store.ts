import { create } from "zustand"

interface DashboardStats {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalApplications: number
  profileViews: number
  clipersViews: number
  jobsPosted?: number
  candidatesReached?: number
}

interface DashboardStore {
  stats: DashboardStats | null
  recentActivity: any[]
  loading: boolean
  fetchDashboardStats: () => Promise<void>
  fetchRecentActivity: () => Promise<void>
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  stats: null,
  recentActivity: [],
  loading: false,

  fetchDashboardStats: async () => {
    set({ loading: true })
    try {
      // TODO: Replace with actual API call
      const mockStats: DashboardStats = {
        totalViews: 1250,
        totalLikes: 89,
        totalComments: 34,
        totalApplications: 12,
        profileViews: 456,
        clipersViews: 794,
        jobsPosted: 3,
        candidatesReached: 127,
      }

      set({ stats: mockStats })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      set({ loading: false })
    }
  },

  fetchRecentActivity: async () => {
    try {
      // TODO: Replace with actual API call
      const mockActivity = [
        {
          id: 1,
          type: "like",
          message: 'Tu cliper "Presentación Personal" recibió un like',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          user: "María González",
        },
        {
          id: 2,
          type: "application",
          message: 'Nueva aplicación para "Desarrollador Frontend"',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          user: "Carlos Ruiz",
        },
        {
          id: 3,
          type: "view",
          message: "Tu perfil fue visto por TechCorp",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          user: "TechCorp",
        },
      ]

      set({ recentActivity: mockActivity })
    } catch (error) {
      console.error("Error fetching recent activity:", error)
    }
  },
}))
