"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

// Re-export header components for backward compatibility
export { PencilFilters, HandDrawnHeader, HandDrawnNavLink, HandDrawnButton } from "./hand-drawn-header"

// Import for internal use
import { PencilFilters, HandDrawnButton } from "./hand-drawn-header"

// Animated drawing component
export const AnimatedDrawing = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return <div className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>{children}</div>
}

// Hand-drawn window frame with animated drawing and texture
export const HandDrawnWindow = ({ children }: { children: React.ReactNode }) => {
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
    <div className="relative max-w-4xl mx-auto">
      <PencilFilters />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 800 600"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M18,15 Q28,8 48,12 Q68,6 88,10 L720,22 Q750,18 765,25 Q785,15 778,38 Q782,58 775,78 L785,520 Q790,545 785,565 Q792,585 765,578 Q745,582 725,575 L58,582 Q38,585 18,578 Q8,585 12,565 Q5,545 8,525 L5,55 Q2,35 8,25 Q-1,15 18,15 Z"
          fill="#e5e5e5"
          stroke="#1A1A1A"
          strokeWidth="1.5"
          className="draw-animation pencil-stroke"
          filter="url(#paper-texture)"
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  )
}



// Hand-drawn footer
export const HandDrawnFooter = () => {
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

  // Use the same path and viewBox as HandDrawnInput
  const organicPath =
    "M15,18 Q22,12 38,15 Q58,8 78,12 L520,22 Q540,18 555,25 Q575,15 585,28 Q590,18 585,38 Q592,58 585,78 L592,88 Q598,108 578,105 Q558,108 538,102 L58,112 Q38,115 18,108 Q8,115 12,95 Q5,75 8,55 L5,35 Q2,15 15,18 Z"

  return (
    <footer className="relative w-full">
      <PencilFilters />
      <div className="relative max-w-7xl mx-auto px-6 py-8 overflow-hidden">
        {/* SVG organic paper background and animated border */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 600 120"
          preserveAspectRatio="none"
        >
          {/* Filled paper background */}
          <path
            d={organicPath}
            fill="#e5e5e5"
            filter="url(#paper-texture)"
          />
          {/* Animated border */}
          <path
            ref={pathRef}
            d={organicPath}
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="1.2"
            className="draw-animation pencil-stroke"
          />
        </svg>
        <div className="relative z-10 flex flex-col items-center md:flex-row md:items-center md:justify-between gap-6 p-6 text-center md:text-left">
          {/* Brand section */}
          <div className="flex items-center gap-3 justify-center md:justify-start w-full md:w-auto">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <path
                d="M16,6 Q24,9 28,16 Q24,24 16,27 Q8,24 5,16 Q8,8 16,6 Z"
                fill="#FF6B4A"
                stroke="#1A1A1A"
                strokeWidth="1"
                className="draw-animation pencil-stroke"
              />
            </svg>
            <h3 className="text-lg font-bold text-[#1A1A1A] font-hand-script">
              DancyPancy 
            </h3>
          </div>
          <p className="text-sm text-[#666] font-hand w-full md:w-auto">
            Transform your ideas into magical animated doodles with AI-powered creativity.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#666] font-hand justify-center md:justify-end w-full md:w-auto">
            <a href="/privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-[#1A1A1A] transition-colors">Terms</a>
            <a href="/contact" className="hover:text-[#1A1A1A] transition-colors">Contact</a>
          </div>
        </div>
        <div className="relative z-10 text-xs text-[#666] font-hand text-center pt-2">
          © 2024 DancyPancy . Made with ✨ and lots of doodles.
        </div>
      </div>
    </footer>
  )
}

// Hand-drawn input with organic clip-path
export const HandDrawnInput = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
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
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-[#f8f9fa] organic-clip-1"></div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M15,18 Q22,12 38,15 Q58,8 78,12 L520,22 Q540,18 555,25 Q575,15 585,28 Q590,18 585,38 Q592,58 585,78 L592,88 Q598,108 578,105 Q558,108 538,102 L58,112 Q38,115 18,108 Q8,115 12,95 Q5,75 8,55 L5,35 Q2,15 15,18 Z"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1.2"
          className="draw-animation pencil-stroke"
        />
      </svg>
      <div className="relative z-10 p-6">{children}</div>
    </div>
  )
}

// Enhanced frame stacking with real-time animation
export const FrameStack = ({
  frames,
  currentFrame,
  generatingCount = 0,
}: {
  frames?: any[]
  currentFrame?: number
  generatingCount?: number
}) => {
  const [stackFrames, setStackFrames] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (frames && frames.length > 0) {
      setStackFrames(frames)
      setIsGenerating(generatingCount > 0 && generatingCount < frames.length)
    }
  }, [frames, generatingCount])

  const displayFrames = stackFrames.slice(0, Math.min(8, generatingCount || stackFrames.length))

  return (
    <div className="relative w-full max-w-sm mx-auto h-80">
      {/* Background papers for visual depth with enhanced stacking */}
      {displayFrames.map((frame, index) => {
        const reverseIndex = displayFrames.length - 1 - index
        const offset = (reverseIndex + 1) * 4
        const opacity = Math.max(0.1, 1 - reverseIndex * 0.12)
        const scale = Math.max(0.8, 1 - reverseIndex * 0.04)
        const isNewest = index === displayFrames.length - 1 && isGenerating

        return (
          <div
            key={`bg-${frame?.frameNumber || index}`}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              isNewest ? 'animate-pulse' : ''
            }`}
            style={{
              transform: `translate(${offset}px, ${offset}px) scale(${scale})`,
              opacity: opacity,
              zIndex: index,
            }}
          >
            <div className="w-full h-full bg-[#f8f9fa] organic-clip-2 border border-gray-300 shadow-sm"></div>
          </div>
        )
      })}

      {/* Main frame container with enhanced animation */}
      <div
        className={`relative w-full h-full bg-[#f8f9fa] organic-clip-1 paper-texture border-2 border-gray-800 shadow-lg overflow-hidden transition-all duration-500 ${
          isGenerating ? 'animate-pulse' : ''
        }`}
        style={{ zIndex: 10 }}
      >
        {frames && frames.length > 0 && currentFrame !== undefined ? (
          <img
            src={frames[currentFrame]?.dataUrl || "/placeholder.svg"}
            alt={`Frame ${currentFrame + 1}`}
            className="w-full h-full object-contain p-2 transition-opacity duration-300"
            style={{
              imageRendering: "pixelated",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-3 transform -rotate-3">📝</div>
              <div className="font-hand transform rotate-1">frames appear here</div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced frame counter overlay */}
      {generatingCount > 0 && (
        <div
          className="absolute top-2 right-2 bg-yellow-200 px-3 py-2 rounded organic-clip-1 text-xs font-hand animate-pulse"
          style={{ zIndex: 15 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span>Frame {generatingCount}</span>
          </div>
        </div>
      )}

      {/* Generation progress indicator */}
      {isGenerating && (
        <div className="absolute bottom-2 left-2 bg-blue-100 px-3 py-1 rounded organic-clip-1 text-xs font-hand">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
            <span>Generating...</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Hand-drawn preview area with texture
export const HandDrawnPreview = ({ children, className = "", contentClassName = "" }: { children: React.ReactNode; className?: string; contentClassName?: string }) => {
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

  // Use a hand-drawn path and paper texture filter similar to HandDrawnWindow
  const previewPath =
    "M22,25 Q32,18 48,22 Q68,15 88,19 L520,32 Q540,28 555,35 Q575,25 585,38 Q590,28 585,48 Q592,68 585,88 L588,320 Q595,340 585,355 Q592,375 568,372 Q548,378 528,372 L68,385 Q48,388 28,382 Q18,388 22,368 Q15,348 18,328 L8,68 Q5,48 12,38 Q2,25 22,25 Z"

  return (
    <div className={`relative h-[35rem] ${className}`}>
      <PencilFilters />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 600 400"
        preserveAspectRatio="none"
      >
        {/* Filled paper background with texture */}
        <path
          d={previewPath}
          fill="#e5e5e5"
          filter="url(#paper-texture)"
        />
        {/* Hand-drawn border */}
        <path
          ref={pathRef}
          d={previewPath}
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1.2"
          className="draw-animation pencil-stroke"
        />
      </svg>
      <div className={`relative z-10 p-6 ${contentClassName}`}>{children}</div>
    </div>
  )
}



// Control panel with texture and organic shape
export const ControlPanel = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => {
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
    <div className={`relative  ${className}`}>
      <div className="absolute inset-0 bg-[#f8f9fa] organic-clip-1 paper-texture"></div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M15,12 Q22,8 38,11 Q58,5 78,9 L322,15 Q342,12 358,18 Q378,8 385,22 Q390,12 385,32 Q392,42 385,52 L390,58 Q395,72 375,69 Q355,72 335,66 L65,75 Q45,78 25,72 Q8,78 12,62 Q5,52 8,42 L5,32 Q2,12 15,12 Z"
          fill="none"
          stroke="#1A1A1A"
          strokeWidth="1"
          className="draw-animation pencil-stroke"
        />
      </svg>
      <div className="relative z-10  p-5">{children}</div>
    </div>
  )
}

// Hand-drawn sticky note
export const HandDrawnStickyNote = ({ children }: { children: React.ReactNode }) => {
  const pathRef = useRef<SVGPathElement | null>(null)
  const foldRef = useRef<SVGPathElement | null>(null)

  useEffect(() => {
    const path = pathRef.current
    const fold = foldRef.current
    if (!path || !fold) return
    
    const handleAnimationEnd = () => {
      path.classList.remove("draw-animation")
      path.classList.add("fading-in")
      setTimeout(() => {
        path.classList.remove("fading-in")
      }, 300)
    }
    
    const handleFoldAnimationEnd = () => {
      fold.classList.remove("draw-animation")
      fold.classList.add("fading-in")
      setTimeout(() => {
        fold.classList.remove("fading-in")
      }, 300)
    }
    
    path.addEventListener("animationend", handleAnimationEnd)
    fold.addEventListener("animationend", handleFoldAnimationEnd)
    
    return () => {
      path.removeEventListener("animationend", handleAnimationEnd)
      fold.removeEventListener("animationend", handleFoldAnimationEnd)
    }
  }, [])

  return (
    <div className="relative hover-wobble">
      <div className="absolute inset-0 bg-[#fff3cd] organic-clip-2 paper-texture"></div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 140 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M8,12 Q12,8 25,10 L115,15 Q132,12 128,25 L135,75 Q138,88 125,85 L15,88 Q5,90 8,78 L3,18 Q1,8 8,12 Z"
          fill="none"
          stroke="#856404"
          strokeWidth="1"
          className="draw-animation pencil-stroke"
        />
        <path
          ref={foldRef}
          d="M115,15 L128,25 L115,25 Z"
          fill="#f0e68c"
          stroke="#856404"
          strokeWidth="1"
          className="draw-animation"
        />
      </svg>
      <div className="relative z-10 p-3">{children}</div>
    </div>
  )
}
