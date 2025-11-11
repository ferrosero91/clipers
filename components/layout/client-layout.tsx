"use client"

import { useEffect } from "react"
import { Navbar } from "./navbar"
import { useAuthStore } from "@/store/auth-store"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}