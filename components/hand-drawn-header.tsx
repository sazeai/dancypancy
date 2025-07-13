"use client"

import type React from "react"
import { useEffect, useRef } from "react"

// SVG Filters for pencil texture
export const PencilFilters = () => (
  <svg width="0" height="0" style={{ position: "absolute" }}>
    <defs>
      <filter id="pencil-filter" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise" seed="1" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
        <feGaussianBlur stdDeviation="0.5" result="blur" />
        <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0" />
      </filter>
      <filter id="paper-texture" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" seed="2" />
        <feColorMatrix in="noise" type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0.1 0.2 0.3 0.4 0.5" />
        </feComponentTransfer>
        <feComposite operator="multiply" in2="SourceGraphic" />
      </filter>
    </defs>
  </svg>
)

// Hand-drawn header with site branding (improved SVG background, four-sided border)
export const HandDrawnHeader = ({ children }: { children?: React.ReactNode }) => {
  const pathRef = useRef<SVGPathElement | null>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const handleAnimationEnd = () => {
      path.classList.remove("draw-animation")
      path.classList.add("fading-in")
      setTimeout(() => {
        path.classList.remove("fading-in")
      }, 300)
    }
    path.addEventListener("animationend", handleAnimationEnd)
    return () => path.removeEventListener("animationend", handleAnimationEnd)
  }, [])

  return (
    <header className="relative w-full overflow-hidden">
      <PencilFilters />
      <div className="relative max-w-7xl mx-auto px-6 py-4">
        {/* SVG organic paper background, fully responsive, four-sided border */}
        <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M15,18 Q22,12 38,15 Q58,8 78,12 L520,22 Q540,18 555,25 Q575,15 585,28 Q590,18 585,38 Q592,58 585,78 L592,88 Q598,108 578,105 Q558,108 538,102 L58,112 Q38,115 18,108 Q8,115 12,95 Q5,75 8,55 L5,35 Q2,15 15,18 Z"
          fill="#e5e5e5"
          stroke="#1A1A1A"
          strokeWidth="1.2"
          className="draw-animation pencil-stroke"
          filter="url(#paper-texture)"
        />
      </svg>
        <div className="relative z-10 flex items-center justify-between">
          {/* Logo and Site Name */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg width="48" height="48" viewBox="0 0 48 48">
                <path
                  d="M24,8 Q36,12 42,24 Q38,36 24,40 Q12,36 8,24 Q12,12 24,8 Z"
                  fill="#FF6B4A"
                  stroke="#1A1A1A"
                  strokeWidth="1.2"
                  className="draw-animation pencil-stroke"
                />
                <path
                  d="M16,20 Q20,18 24,20 Q28,22 32,20"
                  fill="none"
                  stroke="#1A1A1A"
                  strokeWidth="1"
                  className="draw-animation"
                />
                <circle cx="20" cy="16" r="1.5" fill="#1A1A1A" className="draw-animation" />
                <circle cx="28" cy="16" r="1.5" fill="#1A1A1A" className="draw-animation" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-[#1A1A1A] font-hand-script transform -rotate-1">
                DancyPancy 
              </h1>
              <p className="text-xs text-[#666] font-hand transform rotate-1">
                ✨ magical gif maker
              </p>
            </div>
          </div>
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <HandDrawnNavLink href="/">Home</HandDrawnNavLink>
            <HandDrawnNavLink href="/gallery">Gallery</HandDrawnNavLink>
            <HandDrawnNavLink href="/about">About</HandDrawnNavLink>
          </nav>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <HandDrawnButton size="sm" onClick={() => {}}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M3,6 L17,6 M3,10 L17,10 M3,14 L17,14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </HandDrawnButton>
          </div>
        </div>
      </div>
    </header>
  )
}

// Hand-drawn navigation link
export const HandDrawnNavLink = ({ 
  href, 
  children, 
  className = "" 
}: { 
  href: string
  children: React.ReactNode
  className?: string 
}) => {
  return (
    <a
      href={href}
      className={`relative group px-4 py-2 text-[#1A1A1A] font-hand hover-wobble ${className}`}
    >
      <div className="absolute inset-0 bg-[#f8f9fa] organic-clip-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <path
          d="M8,8 Q15,5 25,8 Q35,3 45,8 L85,12 Q95,10 92,18 Q95,25 85,22 Q75,25 65,22 L25,28 Q15,30 8,25 Q3,30 8,18 Q3,8 8,8 Z"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1"
          className="draw-animation pencil-stroke"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </a>
  )
}

// Hand-drawn button with hover wobble
export const HandDrawnButton = ({
  children,
  onClick,
  disabled = false,
  className = "",
  size = "md",
  variant = "default",
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary"
}) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const viewBoxes = {
    sm: "0 0 40 40",
    md: "0 0 48 48",
    lg: "0 0 64 64",
  }

  const fillColor = variant === "primary" ? "#FF6B4A" : "white"

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative group disabled:opacity-50 hover-wobble ${sizeClasses[size]} ${className}`}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={viewBoxes[size]}
        preserveAspectRatio="none"
      >
        <path
          d={
            size === "sm"
              ? "M8,6 Q12,3 20,7 Q28,2 32,8 Q38,6 36,15 Q38,22 35,28 Q40,35 32,33 Q24,38 16,33 Q8,38 12,28 Q5,22 8,15 Q3,6 8,6 Z"
              : size === "md"
                ? "M8,7 Q15,4 24,8 Q32,3 40,9 Q46,7 44,18 Q46,26 43,32 Q48,42 40,39 Q32,45 24,39 Q16,45 16,32 Q9,26 12,18 Q4,7 8,7 Z"
                : "M12,9 Q18,5 32,10 Q44,4 52,12 Q60,9 58,24 Q60,34 57,42 Q62,56 52,52 Q44,60 32,52 Q20,60 20,42 Q13,34 16,24 Q5,9 12,9 Z"
          }
          fill={fillColor}
          stroke="#1A1A1A"
          strokeWidth="1"
          className={`transition-colors group-disabled:fill-gray-100 draw-animation pencil-stroke ${
            variant === "primary" ? "group-hover:fill-orange-600" : "group-hover:fill-orange-100"
          }`}
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center h-full text-gray-800 font-hand">{children}</div>
    </button>
  )
} 