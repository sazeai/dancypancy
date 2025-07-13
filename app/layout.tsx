import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { HandDrawnHeader, HandDrawnFooter } from "@/components/hand-drawn-elements"

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

export const metadata: Metadata = {
  title: "DancyPancy - Magical GIF Maker",
  description: "Transform your ideas into magical animated doodles with AI-powered creativity",
  generator: 'v0.dev'
}

// SVG Filters for paper texture




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
            <body className={`${ibmPlexMono.variable} font-mono antialiased`}>
        
        
        {/* Background texture layer that sits behind everything */}
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundColor: "rgb(166 161 161)",
            filter: "url(#paper-texture)"
          }}
        />
        
        <div className="min-h-screen flex flex-col relative z-10">
          <HandDrawnHeader />
          <main className="flex-1">
            {children}
          </main>
          <HandDrawnFooter />
        </div>
      </body>
    </html>
  )
}
