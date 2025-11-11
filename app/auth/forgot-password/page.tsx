"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api"
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email) {
      setError("Por favor ingresa tu correo electrónico")
      setIsLoading(false)
      return
    }

    try {
      await apiClient.post("/auth/forgot-password", { email })
      setIsSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al enviar el correo")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2">
              <Image src="/LogoClipers.png" alt="Clipers" width={48} height={48} className="h-12 w-12 rounded-xl" />
              <span className="text-2xl font-bold text-foreground">Clipers</span>
            </Link>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <FiCheck className="h-8 w-8 text-success" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl font-bold text-foreground">Correo enviado</h1>
                  <p className="text-muted-foreground text-sm">
                    Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <div className="space-y-4 pt-4">
                  <Button asChild className="w-full">
                    <Link href="/auth/login">
                      <FiArrowLeft className="mr-2 h-4 w-4" />
                      Volver al inicio de sesión
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    ¿No recibiste el correo? Revisa tu carpeta de spam o{" "}
                    <button
                      onClick={() => {
                        setIsSuccess(false)
                        setEmail("")
                      }}
                      className="text-primary hover:text-primary/80"
                    >
                      intenta de nuevo
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Image src="/LogoClipers.png" alt="Clipers" width={48} height={48} className="h-12 w-12 rounded-xl" />
            <span className="text-2xl font-bold text-foreground">Clipers</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">¿Olvidaste tu contraseña?</h1>
            <p className="text-muted-foreground">No te preocupes, te enviaremos instrucciones para restablecerla</p>
          </div>
        </div>

        {/* Forgot Password Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Restablecer contraseña</CardTitle>
            <CardDescription>Ingresa tu correo electrónico para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar instrucciones"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
