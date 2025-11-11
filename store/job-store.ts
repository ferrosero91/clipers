import { create } from "zustand"
import type { Job, JobMatch, JobApplication } from "@/lib/types"
import { apiClient } from "@/lib/api"

interface JobState {
  jobs: Job[]
  matches: JobMatch[]
  applicants: JobApplication[]
  isLoading: boolean
  hasMore: boolean
  page: number
  filters: JobFilters
  searchJobs: (query?: string, filters?: JobFilters, refresh?: boolean) => Promise<void>
  getJobMatches: (jobId: string) => Promise<void>
  getApplicants: (jobId: string) => Promise<void>
  rankApplicants: (jobId: string) => Promise<void>
  applyToJob: (jobId: string) => Promise<void>
  createJob: (jobData: CreateJobData) => Promise<void>
  updateJob: (jobId: string, jobData: Partial<CreateJobData>) => Promise<void>
  deleteJob: (jobId: string) => Promise<void>
  setFilters: (filters: Partial<JobFilters>) => void
}

interface JobFilters {
  location?: string
  type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
  salaryMin?: number
  salaryMax?: number
  skills?: string[]
  industry?: string
}

interface CreateJobData {
  title: string
  description: string
  requirements: string[]
  skills: string[]
  location: string
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
  salaryMin?: number
  salaryMax?: number
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  matches: [],
  applicants: [],
  isLoading: false,
  hasMore: true,
  page: 0,
  filters: {},

  searchJobs: async (query = "", filters = {}, refresh = false) => {
    const { isLoading, hasMore, page } = get()

    if (isLoading || (!hasMore && !refresh)) return

    set({ isLoading: true })

    try {
      const params = new URLSearchParams({
        page: (refresh ? 0 : page).toString(),
        size: "10",
        ...(query && { search: query }),
        ...(filters.location && { location: filters.location }),
        ...(filters.type && { type: filters.type }),
        ...(filters.salaryMin && { salaryMin: filters.salaryMin.toString() }),
        ...(filters.salaryMax && { salaryMax: filters.salaryMax.toString() }),
        ...(filters.industry && { industry: filters.industry }),
      })

      if (filters.skills && filters.skills.length > 0) {
        filters.skills.forEach((skill) => params.append("skills", skill))
      }

      const response = await apiClient.get<{
        jobs: Job[]
        hasMore: boolean
        totalPages: number
      }>(`/jobs/public?${params}`)

      set((state) => ({
        jobs: refresh ? response.jobs : [...state.jobs, ...response.jobs],
        page: refresh ? 1 : page + 1,
        hasMore: response.hasMore,
        isLoading: false,
        filters: refresh ? filters : state.filters,
      }))
    } catch (error) {
      console.error("Error searching jobs:", error)
      set({ isLoading: false })
    }
  },

  getJobMatches: async (jobId: string) => {
    try {
      console.debug(`[JOB STORE] getJobMatches jobId=${jobId}`)
      const matches = await apiClient.get<JobMatch[]>(`/jobs/${jobId}/matches`)
      console.debug(`[JOB STORE] getJobMatches received ${matches.length} matches`)
      set({ matches })
    } catch (error) {
      console.error("Error getting job matches:", error)
      set({ matches: [] })
    }
  },

  getApplicants: async (jobId: string) => {
    try {
      console.debug(`[JOB STORE] getApplicants jobId=${jobId}`)
      const applicants = await apiClient.get<JobApplication[]>(`/jobs/${jobId}/applicants`)
      console.debug(`[JOB STORE] getApplicants received ${applicants.length} applicants`)
      set({ applicants })
    } catch (error) {
      console.error("Error getting applicants:", error)
      set({ applicants: [] })
    }
  },

  rankApplicants: async (jobId: string) => {
    try {
      console.debug(`[JOB STORE] rankApplicants jobId=${jobId}`)
      const ranked = await apiClient.get<JobMatch[]>(`/jobs/${jobId}/applicants/ranked`)
      console.debug(`[JOB STORE] rankApplicants received ${ranked.length} ranked matches`)
      set({ matches: ranked })
    } catch (error) {
      console.error("Error ranking applicants:", error)
      set({ matches: [] })
    }
  },

  applyToJob: async (jobId: string) => {
    try {
      console.debug(`[JOB STORE] applyToJob jobId=${jobId}`)
      await apiClient.post(`/jobs/${jobId}/apply`)
      console.debug(`[JOB STORE] applyToJob completed jobId=${jobId}`)
    } catch (error) {
      console.error("Error applying to job:", error)
      throw error
    }
  },

  createJob: async (jobData: CreateJobData) => {
    try {
      const newJob = await apiClient.post<Job>("/jobs", jobData)

      set((state) => ({
        jobs: [newJob, ...state.jobs],
      }))
    } catch (error) {
      console.error("Error creating job:", error)
      throw error
    }
  },

  updateJob: async (jobId: string, jobData: Partial<CreateJobData>) => {
    try {
      const updatedJob = await apiClient.put<Job>(`/jobs/${jobId}`, jobData)

      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === jobId ? updatedJob : job)),
      }))
    } catch (error) {
      console.error("Error updating job:", error)
      throw error
    }
  },

  deleteJob: async (jobId: string) => {
    try {
      await apiClient.delete(`/jobs/${jobId}`)

      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== jobId),
      }))
    } catch (error) {
      console.error("Error deleting job:", error)
      throw error
    }
  },

  setFilters: (filters: Partial<JobFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },
}))
