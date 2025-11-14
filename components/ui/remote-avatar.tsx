import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getImageUrl } from "@/lib/utils/image"

interface RemoteAvatarProps {
  src?: string | null
  alt: string
  fallback: string
  className?: string
}

export function RemoteAvatar({ src, alt, fallback, className }: RemoteAvatarProps) {
  const imageUrl = getImageUrl(src)
  
  return (
    <Avatar className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={imageUrl} 
        alt={alt}
        className="aspect-square h-full w-full object-cover rounded-full"
        onError={(e) => {
          // Si la imagen falla al cargar, ocultar el elemento
          e.currentTarget.style.display = 'none'
        }}
      />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}
