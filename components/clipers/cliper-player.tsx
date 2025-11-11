"use client"

import { useRef, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Fullscreen, Pause, Play, Volume2, VolumeX } from "lucide-react"
import type { Cliper } from "@/lib/types"

type Props = {
  cliper: Cliper
}

export function CliperPlayer({ cliper }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.9)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = volume
    v.muted = muted
  }, [volume, muted])

  useEffect(() => {
    const onFsChange = () => {
      const doc: any = document
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement))
    }
    document.addEventListener("fullscreenchange", onFsChange)
    document.addEventListener("webkitfullscreenchange", onFsChange as any)
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange)
      document.removeEventListener("webkitfullscreenchange", onFsChange as any)
    }
  }, [])

  const togglePlay = async () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      try {
        await v.play()
        setPlaying(true)
      } catch {}
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    setMuted((m) => !m)
  }

  const handleVolume = (val: number[]) => {
    setVolume(val[0])
    if (val[0] === 0 && !muted) setMuted(true)
    if (val[0] > 0 && muted) setMuted(false)
  }

  const toggleFullscreen = () => {
    const v = videoRef.current
    if (!v) return
    const container = v.parentElement
    if (!container) return
    if (!document.fullscreenElement) {
      container.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full aspect-video bg-black">
          {cliper.videoUrl ? (
            <video
              ref={videoRef}
              src={cliper.videoUrl}
              poster={cliper.thumbnailUrl || undefined}
              preload="metadata"
              className="h-full w-full"
              onClick={togglePlay}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              controls={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              {cliper.status === "PROCESSING" ? "Procesando video…" : "Video no disponible"}
            </div>
          )}

          {/* Controles */}
          <div className="absolute inset-x-0 bottom-0 z-10 m-0 p-3">
            <div className="flex items-center gap-2 rounded-md bg-black/40 p-2 backdrop-blur-sm">
              <Button variant="ghost" size="icon" onClick={togglePlay} aria-label={playing ? "Pausar" : "Reproducir"}>
                {playing ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={muted ? "Activar sonido" : "Silenciar"}>
                {muted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
              </Button>
              <div className="w-24">
                <Slider value={[volume]} max={1} step={0.05} onValueChange={handleVolume} />
              </div>
              <div className="ml-auto">
                <Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label="Pantalla completa">
                  <Fullscreen className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}