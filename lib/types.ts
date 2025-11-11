export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "CANDIDATE" | "COMPANY" | "ADMIN"
  profileImage?: string
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: string
  name: string
  description: string
  industry: string
  size: string
  website?: string
  logo?: string
  location: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Cliper {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  duration: number
  status: "UPLOADED" | "PROCESSING" | "DONE" | "FAILED"
  transcription?: string
  skills: string[]
  userId: string
  user?: User
  createdAt: string
  updatedAt: string
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  skills: string[]
  location: string
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"
  salaryMin?: number
  salaryMax?: number
  companyId: string
  company?: Company
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  content: string
  imageUrl?: string
  videoUrl?: string
  type: "TEXT" | "IMAGE" | "VIDEO" | "CLIPER"
  userId: string
  user?: User
  likes: number
  comments: Comment[]
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  userId: string
  user?: User
  postId: string
  createdAt: string
  updatedAt: string
}

export interface ATSProfile {
  id: string
  summary: string
  education: Education[]
  experience: Experience[]
  skills: Skill[]
  languages: Language[]
  userId: string
  cliperId?: string
  createdAt: string
  updatedAt: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  description?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description: string
  skills: string[]
}

export interface Skill {
  id: string
  name: string
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
  category: "TECHNICAL" | "SOFT" | "LANGUAGE"
}

export interface Language {
  id: string
  name: string
  level: "BASIC" | "INTERMEDIATE" | "ADVANCED" | "NATIVE"
}

export interface JobMatch {
  id: string
  jobId: string
  job?: Job
  userId: string
  user?: User
  score: number
  explanation: string
  matchedSkills: string[]
  createdAt: string
}

export interface JobApplication {
  id: string
  jobId: string
  job?: Job
  candidateId: string
  candidate?: User
  status: "APPLIED" | "CONFIRMED" | "REJECTED"
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}
