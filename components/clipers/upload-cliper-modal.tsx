"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCliperStore } from "@/store/cliper-store"
import { VideoRecorder } from "./video-recorder"
import { FiUpload, FiVideo, FiX, FiCheck, FiCamera } from "react-icons/fi"

interface UploadCliperModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadCliperModal({ open, onOpenChange }: UploadCliperModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadCliper, uploadProgress, clipers } = useCliperStore()
  const [duplicateWarning, setDuplicateWarning] = useState("")
  const [selectedSignature, setSelectedSignature] = useState<string>("")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith("video/")) {
        setError("Por favor selecciona un archivo de video válido")
        return
      }

      // Validate file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError("El archivo es demasiado grande. Máximo 100MB")
        return
      }

      // Prevent selecting multiple files during upload
      if (isUploading) return

      // Simple duplication guard by name+size signature
      const signature = `${selectedFile.name}::${selectedFile.size}`
      if (selectedSignature === signature) {
        setDuplicateWarning("Este archivo ya está seleccionado.")
        return
      }

      setSelectedSignature(signature)
      setFile(selectedFile)
      setError("")

      // Auto-generate title from filename
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "")
        setTitle(fileName)
        // Check for duplicate title in existing clipers
        if (clipers.some((c) => c.title === fileName)) {
          setDuplicateWarning("Ya existe un cliper con este título. Considera renombrarlo.")
        } else {
          setDuplicateWarning("")
        }
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      // Create a proper synthetic event
      const fakeEvent = {
        target: { files: [droppedFile] },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(fakeEvent)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleVideoRecorded = (blob: Blob) => {
    // Convert blob to file - force .mp4 extension for microservice compatibility
    const videoFile = new File([blob], `recorded-video-${Date.now()}.mp4`, { type: 'video/mp4' })
    setRecordedVideoBlob(blob)
    setFile(videoFile)

    // Auto-generate title
    if (!title) {
      setTitle(`Video grabado ${new Date().toLocaleDateString()}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title.trim()) {
      setError("Por favor completa todos los campos requeridos")
      return
    }

    // Client-side duplicate check by title
    if (clipers.some((c) => c.title === title.trim())) {
      setError("Ya existe un cliper con este título")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      await uploadCliper(file, title.trim(), description.trim())
      setUploadComplete(true)
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al subir el cliper")
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setRecordedVideoBlob(null)
    setTitle("")
    setDescription("")
    setIsUploading(false)
    setUploadComplete(false)
    setError("")
    setDuplicateWarning("")
    setSelectedSignature("")
    setActiveTab("upload")
    onOpenChange(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (uploadComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <FiCheck className="h-8 w-8 text-success" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">¡Cliper subido exitosamente!</h3>
              <p className="text-muted-foreground text-sm">
                Tu cliper está siendo procesado. Recibirás una notificación cuando esté listo.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear nuevo Cliper</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!error && duplicateWarning && (
            <Alert>
              <AlertDescription>{duplicateWarning}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FiUpload className="w-4 h-4" />
                Subir Archivo
              </TabsTrigger>
              <TabsTrigger value="record" className="flex items-center gap-2">
                <FiCamera className="w-4 h-4" />
                Grabar Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              {/* File Upload */}
              <div className="space-y-2">
                <Label>Video *</Label>
                {!file ? (
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUpload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Arrastra tu video aquí o haz clic para seleccionar</p>
                      <p className="text-xs text-muted-foreground">MP4, MOV, AVI hasta 100MB</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" disabled={isUploading} />
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FiVideo className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)} disabled={isUploading}>
                        <FiX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="record" className="space-y-4">
              {/* Video Recorder */}
              <div className="space-y-2">
                <Label>Grabar Video *</Label>
                <VideoRecorder onVideoRecorded={handleVideoRecorded} maxDuration={60} />
                {recordedVideoBlob && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FiVideo className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium text-sm">Video grabado</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(recordedVideoBlob.size)}</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => {
                        setRecordedVideoBlob(null)
                        setFile(null)
                      }} disabled={isUploading}>
                        <FiX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ej: Presentación como Desarrollador Frontend"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={isUploading}
              required
            />
            <p className="text-xs text-muted-foreground">{title.length}/100 caracteres</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe brevemente tu experiencia, habilidades y lo que buscas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              disabled={isUploading}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">{description.length}/500 caracteres</p>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subiendo cliper...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!file || !title.trim() || isUploading}>
              {isUploading ? "Creando..." : "Crear Cliper"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
