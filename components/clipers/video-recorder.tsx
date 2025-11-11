import React, { useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, VideoOff, Play, Square, RotateCcw } from 'lucide-react';

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob) => void;
  maxDuration?: number; // in seconds
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onVideoRecorded,
  maxDuration = 60
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [mimeType, setMimeType] = useState('video/webm');

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasPermission(false);
    setIsPlaying(false);
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];

    // Try different mime types for better compatibility
    let selectedMimeType = 'video/webm';
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      selectedMimeType = 'video/webm;codecs=vp9,opus';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      selectedMimeType = 'video/webm;codecs=vp8,opus';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      selectedMimeType = 'video/mp4';
    }

    setMimeType(selectedMimeType);

    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: selectedMimeType
    });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);
      setRecordedVideo(videoUrl);
      onVideoRecorded(blob);
    };

    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    // Timer for recording duration
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= maxDuration) {
          stopRecording();
          clearInterval(timer);
          return maxDuration;
        }
        return newTime;
      });
    }, 1000);

    // Auto-stop after max duration
    setTimeout(() => {
      if (isRecording) {
        stopRecording();
        clearInterval(timer);
      }
    }, maxDuration * 1000);

  }, [maxDuration, onVideoRecorded, isRecording]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setRecordedVideo(null);
    setRecordingTime(0);
    setIsRecording(false);
    chunksRef.current = [];
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4 space-y-3">
        {/* Video Preview */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-40 object-cover"
            style={{ display: hasPermission ? 'block' : 'none' }}
          />

          {recordedVideo && (
            <video
              src={recordedVideo}
              controls
              className="w-full h-40 object-cover"
              style={{ display: recordedVideo ? 'block' : 'none' }}
            />
          )}

          {!hasPermission && !recordedVideo && (
            <div className="w-full h-40 flex items-center justify-center text-white">
              <div className="text-center">
                <VideoOff className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <p className="text-sm">Cámara no activada</p>
              </div>
            </div>
          )}
        </div>

        {/* Recording Timer */}
        {isRecording && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-mono">{formatTime(recordingTime)}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-2">
          {!hasPermission && !recordedVideo && (
            <Button onClick={startCamera} variant="outline" size="sm" className="w-full">
              <Video className="w-4 h-4 mr-2" />
              Activar Cámara
            </Button>
          )}

          {hasPermission && !isRecording && !recordedVideo && (
            <div className="flex gap-2">
              <Button onClick={startRecording} variant="default" size="sm" className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Grabar
              </Button>
              <Button onClick={stopCamera} variant="outline" size="sm">
                <VideoOff className="w-4 h-4" />
              </Button>
            </div>
          )}

          {isRecording && (
            <Button onClick={stopRecording} variant="destructive" size="sm" className="w-full">
              <Square className="w-4 h-4 mr-2" />
              Detener Grabación
            </Button>
          )}

          {recordedVideo && (
            <div className="space-y-2">
              <Button
                onClick={() => onVideoRecorded(new Blob(chunksRef.current, { type: mimeType }))}
                variant="default"
                size="sm"
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Usar este video
              </Button>
              <div className="flex gap-2">
                <Button onClick={resetRecording} variant="outline" size="sm" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Nuevo
                </Button>
                <Button onClick={startCamera} variant="outline" size="sm" className="flex-1">
                  <Video className="w-4 h-4 mr-2" />
                  Regrabar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Simple Instructions */}
        <div className="text-xs text-muted-foreground text-center">
          {!hasPermission && !recordedVideo && "Activa la cámara para comenzar"}
          {hasPermission && !isRecording && !recordedVideo && `Graba hasta ${maxDuration} segundos`}
          {isRecording && "Grabando..."}
          {recordedVideo && "Video listo para usar"}
        </div>
      </CardContent>
    </Card>
  );
};