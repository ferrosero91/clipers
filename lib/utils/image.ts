/**
 * Construye la URL completa para una imagen del backend
 * @param imagePath - Ruta relativa de la imagen (ej: /uploads/avatars/avatar_123.png)
 * @returns URL completa de la imagen
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "/placeholder.svg"
  }

  // Si ya es una URL completa, retornarla tal cual
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  // Construir URL del backend
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080"
  return `${baseUrl}${imagePath}`
}
