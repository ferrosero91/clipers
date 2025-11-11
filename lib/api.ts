import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

class ApiClient {
  private static instance: ApiClient
  private axiosInstance: AxiosInstance

  private constructor() {
    // Normalize baseURL to always include /api
    const rawBase = process.env.NEXT_PUBLIC_API_URL || "https://backend.clipers.pro/api"
    const trimmedBase = rawBase.replace(/\/+$/, "")
    const normalizedBase = trimmedBase.endsWith("/api") ? trimmedBase : `${trimmedBase}/api`

    this.axiosInstance = axios.create({
      baseURL: normalizedBase,
      timeout: 30000, // Increased from 10s to 30s
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        // Debug: log outbound request (no sensitive bodies)
        const method = (config.method || 'GET').toUpperCase()
        const url = `${this.axiosInstance.defaults.baseURL}${config.url}`
        console.debug(`[API] ${method} ${url}`)
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor for token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Debug: log inbound response
        const req = response.config
        const method = (req.method || 'GET').toUpperCase()
        const url = `${this.axiosInstance.defaults.baseURL}${req.url}`
        console.debug(`[API] ${method} ${url} -> ${response.status}`)
        return response
      },
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem("refreshToken")
            if (refreshToken) {
              const response = await this.axiosInstance.post("/auth/refresh", {
                refreshToken,
              })

              const { accessToken } = response.data
              localStorage.setItem("accessToken", accessToken)

              return this.axiosInstance(originalRequest)
            }
          } catch (refreshError) {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            window.location.href = "/auth/login"
          }
        }

        // Debug: log error responses succinctly
        const status = error.response?.status
        const req = error.config
        const method = (req?.method || 'GET').toUpperCase()
        const url = req?.url ? `${this.axiosInstance.defaults.baseURL}${req.url}` : 'unknown-url'
        console.error(`[API] ERROR ${method} ${url} -> ${status || 'no-status'}`, error.response?.data || error.message)

        return Promise.reject(error)
      },
    )
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config)
    return response.data
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config)
    return response.data
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config)
    return response.data
  }

  public async upload<T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    return response.data
  }
}

export const apiClient = ApiClient.getInstance()
