"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, RefreshCw, Download } from "lucide-react"
import {
  HandDrawnWindow,
  HandDrawnHeader,
  HandDrawnInput,
  HandDrawnPreview,
  HandDrawnButton,
  FrameStack,
  HandDrawnStickyNote,
  ControlPanel,
  AnimatedDrawing,
  PencilFilters,
} from "./hand-drawn-elements"
import { createGifFromDataUrls } from "../lib/gif-creator-client"
import Gallery from "@/components/gallery"

interface Frame {
  frameNumber: number
  dataUrl: string
}

interface GenerationState {
  status: "idle" | "generating" | "creating-gif" | "success" | "error"
  frames?: Frame[]
  gifUrl?: string
  error?: string
  currentFrame?: number
  enhancedPrompt?: string
  generatedFrameCount?: number
}

export default function HandDrawnGifMaker() {
  const [prompt, setPrompt] = useState("")
  const [generationState, setGenerationState] = useState<GenerationState>({
    status: "idle",
    generatedFrameCount: 0,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationInterval, setAnimationInterval] = useState<NodeJS.Timeout | null>(null)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [inputFocused, setInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Blinking cursor - only when input is not focused
  useEffect(() => {
    if (inputFocused) {
      setCursorVisible(false)
      return
    }

    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [inputFocused])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setGenerationState({ status: "generating", generatedFrameCount: 0, frames: [] })

    try {
      const response = await fetch("/api/generate-simple-gif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!response.ok) {
        let errorMessage = "Something went wrong while creating your GIF"
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If we can't parse the error response, use status-based messages
          if (response.status >= 500) {
            errorMessage = "Our servers are a bit busy right now. Please try again in a moment! 🚀"
          } else if (response.status === 429) {
            errorMessage = "Too many requests! Please wait a moment before trying again. ⏰"
          } else if (response.status === 400) {
            errorMessage = "Please check your description and try again. ✨"
          } else if (response.status === 401) {
            errorMessage = "Authentication issue. Please refresh the page and try again. 🔐"
          } else if (response.status === 403) {
            errorMessage = "Access denied. Please check your request and try again. 🚫"
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setGenerationState({
        status: "success",
        frames: data.frames,
        currentFrame: 0,
        enhancedPrompt: data.enhancedPrompt,
      })

      startAnimation(data.frames)
    } catch (error) {
      console.error("Generation error:", error)
      setGenerationState({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        generatedFrameCount: 0,
      })
    }
  }

  const startAnimation = (frames: Frame[]) => {
    if (animationInterval) clearInterval(animationInterval)
    setIsPlaying(true)
    let currentIndex = 0
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % frames.length
      setGenerationState((prev) => ({ ...prev, currentFrame: currentIndex }))
    }, 250)
    setAnimationInterval(interval)
  }

  const stopAnimation = () => {
    if (animationInterval) {
      clearInterval(animationInterval)
      setAnimationInterval(null)
    }
    setIsPlaying(false)
  }

  const toggleAnimation = () => {
    if (generationState.frames) {
      if (isPlaying) stopAnimation()
      else startAnimation(generationState.frames)
    }
  }

  const resetGeneration = () => {
    stopAnimation()
    if (generationState.gifUrl) URL.revokeObjectURL(generationState.gifUrl)
    setGenerationState({ status: "idle", generatedFrameCount: 0 })
  }

  const handleDownload = async () => {
    if (!generationState.frames || generationState.frames.length === 0) return

    try {
      // Don't change the status, just show a loading state on the button
      const downloadButton = document.querySelector('[data-download-button]') as HTMLElement
      if (downloadButton) {
        downloadButton.innerHTML = '<div class="animate-spin">⏳</div>'
        downloadButton.setAttribute('disabled', 'true')
      }
      
      const blob = await createGifFromDataUrls(
        generationState.frames.map(frame => frame.dataUrl)
      )
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `magical-gif-${Date.now()}.gif`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      // Restore the button
      if (downloadButton) {
        downloadButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transform rotate-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
        downloadButton.removeAttribute('disabled')
      }
    } catch (error) {
      console.error("Download error:", error)
      // Restore the button on error
      const downloadButton = document.querySelector('[data-download-button]') as HTMLElement
      if (downloadButton) {
        downloadButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transform rotate-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>'
        downloadButton.removeAttribute('disabled')
      }
    }
  }

  const currentFrameImage =
    generationState.frames && generationState.currentFrame !== undefined
      ? generationState.frames[generationState.currentFrame]?.dataUrl
      : null

  return (
    <div className="p-4 md:p-8">
      <PencilFilters />
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-stretch">
        {/* Left: Input & Controls */}
        <div className="flex-1 md:w-2/5 flex flex-col gap-6">
          <AnimatedDrawing delay={300}>
            <HandDrawnWindow>
              <div className="p-6 md:p-8 md:h-[35rem]">
                {/* Title */}
                <AnimatedDrawing delay={600}>
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#1A1A1A] mb-6 transform -rotate-1 font-hand-script">
                      ✨ Create Your GIF ✨
                    </h1>
                    <div className="inline-flex items-center justify-center relative">
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <path
                          d="M30,8 Q45,12 52,30 Q48,48 30,52 Q12,48 8,30 Q12,12 30,8 Z"
                          fill="#fff3cd"
                          stroke="#1A1A1A"
                          strokeWidth="1.2"
                          className="draw-animation pencil-stroke"
                        />
                      </svg>
                      <div className="absolute text-2xl">😊</div>
                      <div className="absolute translate-x-6 -translate-y-6 text-[#1A1A1A] text-2xl transform rotate-12">
                        +
                      </div>
                    </div>
                  </div>
                </AnimatedDrawing>
                {/* Input Area */}
                <AnimatedDrawing delay={900}>
                  <div className="mb-6">
                    <HandDrawnInput className="min-h-[100px]">
                      <div className="text-[#1A1A1A] mb-4 font-hand transform rotate-1">
                        {"> describe your animation..."}
                      </div>
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                          onFocus={() => setInputFocused(true)}
                          onBlur={() => setInputFocused(false)}
                          className="w-full bg-transparent text-[#1A1A1A] text-lg outline-none font-hand"
                          placeholder="cartoon cat waving"
                        />
                      </div>
                    </HandDrawnInput>
                  </div>
                </AnimatedDrawing>

                {/* Control Panel */}
                <AnimatedDrawing delay={1200}>
                  <div className="mb-8">
                    <ControlPanel>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <HandDrawnButton
                          onClick={handleGenerate}
                          disabled={!prompt.trim() || generationState.status === "generating"}
                          variant="primary"
                          size="lg"
                        >
                          {generationState.status === "generating" ? (
                            <div className="text-xl animate-pulse">⏳</div>
                          ) : (
                            <div className="text-xl transform rotate-3">✨</div>
                          )}
                        </HandDrawnButton>

                        <div className="w-px h-8 bg-gray-300 transform rotate-12"></div>

                        <HandDrawnButton onClick={toggleAnimation} disabled={!generationState.frames} size="md">
                          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </HandDrawnButton>

                        <HandDrawnButton onClick={resetGeneration} disabled={generationState.status === "idle"} size="md">
                          <RotateCcw size={20} className="transform -rotate-6" />
                        </HandDrawnButton>

                        <HandDrawnButton
                          onClick={handleGenerate}
                          disabled={!prompt.trim() || generationState.status === "generating"}
                          size="md"
                        >
                          <RefreshCw size={20} className="transform rotate-12" />
                        </HandDrawnButton>
                      </div>

                      {/* Status text with proper spacing */}
                      <div className="text-center">
                        <span className="text-sm text-gray-600 font-hand">
                          {generationState.status === "idle" && "Ready to create magic ✨"}
                          {generationState.status === "generating" && "Sketching..."}
                          {generationState.status === "success" && "Frames ready!"}
                          {generationState.status === "creating-gif" && "Creating your GIF..."}
                          {generationState.status === "error" && (
                            <span className="text-red-600">
                              Oops! DancyPancy’s feet got tangled. 😅
                            </span>
                          )}
                        </span>
                      </div>
                    </ControlPanel>
                  </div>
                </AnimatedDrawing>
              </div>
            </HandDrawnWindow>
          </AnimatedDrawing>
        </div>
        {/* Right: Preview Area */}
        <div className="flex-1 md:w-3/5 flex flex-col gap-6">
          <AnimatedDrawing delay={1500}>
            <HandDrawnPreview contentClassName="flex h-full w-full items-center justify-center">
              {generationState.status === "success" && generationState.frames && (
                <div className="absolute top-12 right-6 z-20">
                  <HandDrawnButton onClick={handleDownload} size="md" data-download-button>
                    <Download size={20} className="transform rotate-3" />
                  </HandDrawnButton>
                </div>
              )}
              <div className="w-full">
                  {generationState.status === "generating" && (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="text-center">
                        <div className="mb-6">
                          <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
                            {/* Hand-drawn pencil */}
                            <g className="animate-pulse">
                              <rect x="20" y="100" width="50" height="8" fill="#8B4513" rx="4" className="hover-wobble2"/>
                              <rect x="65" y="95" width="4" height="18" fill="#2F4F4F"/>
                              <polygon points="69,95 69,110 75,102" fill="#2F4F4F"/>
                            </g>
                            
                            {/* Hand-drawn doodles being created */}
                            <circle cx="30" cy="40" r="6" fill="#FFB6C1" stroke="#1A1A1A" strokeWidth="1.5" className="animate-bounce" style={{animationDelay: '0s'}}/>
                            <rect x="50" y="35" width="12" height="12" fill="#87CEEB" stroke="#1A1A1A" strokeWidth="1.5" className="animate-bounce" style={{animationDelay: '0.3s'}}/>
                            <polygon points="80,35 85,45 75,45" fill="#98FB98" stroke="#1A1A1A" strokeWidth="1.5" className="animate-bounce" style={{animationDelay: '0.6s'}}/>
                            
                            {/* Hand-drawn squiggly line */}
                            <path d="M25,70 Q35,60 45,70 Q55,80 65,70" stroke="#1A1A1A" strokeWidth="2" fill="none" className="draw-animation"/>
                            
                            {/* Hand-drawn sparkles */}
                            <g className="animate-spin" style={{animationDuration: '2s'}}>
                              <path d="M15,25 L17,27 L15,29 L13,27 Z" fill="#FFD700"/>
                              <path d="M95,55 L97,57 L95,59 L93,57 Z" fill="#FFD700"/>
                            </g>
                          </svg>
                        </div>
                        <div className="text-gray-600 font-hand text-lg animate-pulse transform rotate-1">
                          ✨ Hold tight. DancyPancy’s spinning... ✨
                        </div>
                      </div>
                    </div>
                  )}
                  {generationState.status === "success" && currentFrameImage && (
                    <img
                      src={currentFrameImage}
                      alt="Generated Frame"
                      className="rounded shadow-lg max-h-[320px] mx-auto"
                      style={{ background: '#fff' }}
                    />
                  )}
                  {generationState.status === "success" && !currentFrameImage && (
                    <div className="text-gray-500 font-hand text-center">No frames available.</div>
                  )}
                  {generationState.status === "idle" && (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <div className="text-center">
                        <div className="mb-6">
                          <svg width="100" height="100" viewBox="0 0 100 100" className="mx-auto">
                            {/* Cartoon cat waving - hand-drawn style */}
                            {/* Cat body */}
                            <ellipse cx="50" cy="70" rx="22" ry="15" fill="#fff3cd" stroke="#1A1A1A" strokeWidth="2"/>
                            {/* Cat head */}
                            <ellipse cx="50" cy="45" rx="15" ry="13" fill="#fff3cd" stroke="#1A1A1A" strokeWidth="2"/>
                            {/* Cat ears */}
                            <polygon points="38,38 42,28 46,40" fill="#fff3cd" stroke="#1A1A1A" strokeWidth="2"/>
                            <polygon points="62,38 58,28 54,40" fill="#fff3cd" stroke="#1A1A1A" strokeWidth="2"/>
                            {/* Cat face */}
                            <ellipse cx="46" cy="45" rx="2" ry="2.5" fill="#1A1A1A"/>
                            <ellipse cx="54" cy="45" rx="2" ry="2.5" fill="#1A1A1A"/>
                            <path d="M48,52 Q50,54 52,52" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
                            {/* Cat waving arm */}
                            <path d="M35,60 Q25,50 38,45" stroke="#1A1A1A" strokeWidth="2.5" fill="none" className="cat-wave"/>
                            {/* Cat other arm */}
                            <path d="M65,60 Q75,65 62,50" stroke="#1A1A1A" strokeWidth="2.5" fill="none"/>
                            {/* Cat tail */}
                            <path d="M70,80 Q90,90 80,70" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
                            {/* Whiskers */}
                            <path d="M40,48 Q35,47 32,45" stroke="#1A1A1A" strokeWidth="1" fill="none"/>
                            <path d="M40,50 Q36,50 33,52" stroke="#1A1A1A" strokeWidth="1" fill="none"/>
                            <path d="M60,48 Q65,47 68,45" stroke="#1A1A1A" strokeWidth="1" fill="none"/>
                            <path d="M60,50 Q64,50 67,52" stroke="#1A1A1A" strokeWidth="1" fill="none"/>
                          </svg>
                        </div>
                        <div className="text-gray-400 font-hand text-lg">
                          Your animation will appear here
                        </div>
                      </div>
                    </div>
                  )}
                  {generationState.status === "error" && (
                    <div className="text-center max-w-sm mx-auto">
                      <div className="mb-4">
                        <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
                          {/* Confused doodle face */}
                          <circle cx="40" cy="40" r="25" fill="#fff3cd" stroke="#1A1A1A" strokeWidth="2"/>
                          <circle cx="32" cy="35" r="3" fill="#1A1A1A"/>
                          <circle cx="48" cy="35" r="3" fill="#1A1A1A"/>
                          <path d="M35,50 Q40,45 45,50" stroke="#1A1A1A" strokeWidth="2" fill="none"/>
                          <path d="M30,25 Q35,20 40,25" stroke="#1A1A1A" strokeWidth="1.5" fill="none"/>
                        </svg>
                      </div>
                      <div className="text-gray-600 font-hand text-lg mb-2">
                      Oops! DancyPancy’s feet got tangled. 😅
                      </div>
                      <div className="text-gray-500 font-hand text-sm">
                        Let's try that again with a different description!
                      </div>
                    </div>
                  )}
              </div>
            </HandDrawnPreview>
          </AnimatedDrawing>
          {/* Optionally: frames/history, tips, etc. */}
        </div>
      </div>
      {/* Floating Tips and Decorative Doodles (unchanged) */}
      <div className="fixed top-20 left-8">
        <AnimatedDrawing delay={2400}>
          <svg width="40" height="30" viewBox="0 0 40 30">
            <path
              d="M5,25 Q15,15 25,20 Q35,10 38,15"
              fill="none"
              stroke="#9f7aea"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="draw-animation"
            />
          </svg>
        </AnimatedDrawing>
      </div>
      <div className="fixed bottom-32 left-12">
        <AnimatedDrawing delay={2700}>
          <svg width="35" height="35" viewBox="0 0 35 35">
            <path
              d="M17,5 Q28,8 30,17 Q28,28 17,30 Q6,28 5,17 Q8,6 17,5 Z"
              fill="none"
              stroke="#38b2ac"
              strokeWidth="1.5"
              className="draw-animation"
            />
          </svg>
        </AnimatedDrawing>
      </div>
      <Gallery />
    </div>
   
  )
}
