import type React from "react"
import type { Metadata } from "next"
// import { GeistSans } from "geist/font/sans"
// import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"
import { ClientLayout } from "../components/layout/client-layout"
export const metadata: Metadata = {
  title: "Clipers - Red Social de Empleos Académica",
  description: "Conecta con oportunidades laborales a través de videos cortos profesionales",
  generator: "Clipers App",
  keywords: ["empleos", "videos", "curriculum", "trabajo", "profesional", "académico"],
  authors: [{ name: "Clipers Team" }],
  openGraph: {
    title: "Clipers - Tu futuro profesional en video",
    description: "Presenta tu perfil profesional con videos cortos y conecta con las mejores oportunidades",
    type: "website",
  },
  icons: {
    icon: "/LogoClipers.png",
    shortcut: "/LogoClipers.png",
    apple: "/LogoClipers.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans`}>
        <ClientLayout>
          <Suspense fallback={null}>{children}</Suspense>
        </ClientLayout>
      </body>
    </html>
  )
}
