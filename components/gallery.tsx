"use client"

import type React from "react"
import { useState } from "react"
import { Download, Share2 } from "lucide-react"
import { AnimatedDrawing, HandDrawnWindow, HandDrawnButton, PencilFilters } from "./hand-drawn-elements"

interface GalleryGif {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  gifUrl: string
  likes: number
  createdAt: string
  tags: string[]
}

// Dummy gallery data with 20 GIFs
const dummyGifs: GalleryGif[] = [
  {
    id: "1",
    title: "Dancing Cat",
    description: "A cute cartoon cat doing a happy dance",
    thumbnailUrl: "/running-cat.gif",
    gifUrl: "/running-cat.gif",
    likes: 42,
    createdAt: "2025-01-15",
    tags: ["cat", "dance", "cute"]
  },
  {
    id: "2",
    title: "Flying Unicorn",
    description: "Magical unicorn soaring through rainbow clouds",
    thumbnailUrl: "/flying-unicorn.gif",
    gifUrl: "/flying-unicorn.gif",
    likes: 89,
    createdAt: "2025-01-14",
    tags: ["unicorn", "magic", "rainbow"]
  },
  {
    id: "3",
    title: "Robot Wave",
    description: "Friendly robot waving hello with mechanical arms",
    thumbnailUrl: "/robot-wave.gif",
    gifUrl: "/robot-wave.gif",
    likes: 156,
    createdAt: "2025-01-13",
    tags: ["robot", "wave", "friendly"]
  },
  {
    id: "4",
    title: "Pizza Party",
    description: "Animated pizza slices having a fun party",
    thumbnailUrl: "/pizza-party.gif",
    gifUrl: "/pizza-party.gif",
    likes: 203,
    createdAt: "2025-01-12",
    tags: ["pizza", "party", "food"]
  },
  {
    id: "5",
    title: "Space Explorer",
    description: "Astronaut floating in space with stars",
    thumbnailUrl: "/astronaut.gif",
    gifUrl: "/astronaut.gif",
    likes: 78,
    createdAt: "2025-01-11",
    tags: ["space", "astronaut", "stars"]
  },
  {
    id: "6",
    title: "Ninja Training",
    description: "Cartoon ninja practicing martial arts moves",
    thumbnailUrl: "/ninja.gif",
    gifUrl: "/ninja.gif",
    likes: 134,
    createdAt: "2025-01-10",
    tags: ["ninja", "martial-arts", "training"]
  },
  {
    id: "7",
    title: "Ocean Friends",
    description: "Fish and sea creatures swimming together",
    thumbnailUrl: "/ocean.gif",
    gifUrl: "/ocean.gif",
    likes: 67,
    createdAt: "2025-01-09",
    tags: ["ocean", "fish", "sea"]
  },
  {
    id: "8",
    title: "Forest Adventure",
    description: "Little fox exploring a magical forest",
    thumbnailUrl: "/fox.gif",
    gifUrl: "/fox.gif",
    likes: 92,
    createdAt: "2025-01-08",
    tags: ["forest", "fox", "adventure"]
  },
  {
    id: "9",
    title: "Music Notes",
    description: "Musical notes dancing to a melody",
    thumbnailUrl: "/melody.gif",
    gifUrl: "/melody.gif",
    likes: 145,
    createdAt: "2025-01-07",
    tags: ["music", "notes", "melody"]
  },
  {
    id: "10",
    title: "Time Travel",
    description: "Clock with hands spinning through time",
    thumbnailUrl: "https://via.placeholder.com/300x200/805AD5/FFFFFF?text=Time+Travel",
    gifUrl: "https://via.placeholder.com/600x400/805AD5/FFFFFF?text=GIF+10",
    likes: 178,
    createdAt: "2025-01-06",
    tags: ["time", "clock", "travel"]
  },
  {
    id: "11",
    title: "Candy World",
    description: "Colorful candies bouncing around",
    thumbnailUrl: "https://via.placeholder.com/300x200/F6AD55/FFFFFF?text=Candy+World",
    gifUrl: "https://via.placeholder.com/600x400/F6AD55/FFFFFF?text=GIF+11",
    likes: 89,
    createdAt: "2025-01-05",
    tags: ["candy", "colorful", "bounce"]
  },
  {
    id: "12",
    title: "Dragon Flight",
    description: "Friendly dragon soaring through clouds",
    thumbnailUrl: "https://via.placeholder.com/300x200/FC8181/FFFFFF?text=Dragon+Flight",
    gifUrl: "https://via.placeholder.com/600x400/FC8181/FFFFFF?text=GIF+12",
    likes: 234,
    createdAt: "2025-01-04",
    tags: ["dragon", "flight", "clouds"]
  },
  {
    id: "13",
    title: "Garden Party",
    description: "Flowers blooming and dancing in the wind",
    thumbnailUrl: "https://via.placeholder.com/300x200/68D391/FFFFFF?text=Garden+Party",
    gifUrl: "https://via.placeholder.com/600x400/68D391/FFFFFF?text=GIF+13",
    likes: 156,
    createdAt: "2025-01-03",
    tags: ["garden", "flowers", "bloom"]
  },
  {
    id: "14",
    title: "Tech Support",
    description: "Computer with helpful robot assistant",
    thumbnailUrl: "https://via.placeholder.com/300x200/63B3ED/FFFFFF?text=Tech+Support",
    gifUrl: "https://via.placeholder.com/600x400/63B3ED/FFFFFF?text=GIF+14",
    likes: 112,
    createdAt: "2025-01-02",
    tags: ["tech", "robot", "computer"]
  },
  {
    id: "15",
    title: "Mountain Climb",
    description: "Hiker climbing a cartoon mountain",
    thumbnailUrl: "https://via.placeholder.com/300x200/4FD1C7/FFFFFF?text=Mountain+Climb",
    gifUrl: "https://via.placeholder.com/600x400/4FD1C7/FFFFFF?text=GIF+15",
    likes: 98,
    createdAt: "2025-01-01",
    tags: ["mountain", "hiking", "adventure"]
  },
  {
    id: "16",
    title: "Baking Magic",
    description: "Chef hat and ingredients mixing together",
    thumbnailUrl: "https://via.placeholder.com/300x200/F687B3/FFFFFF?text=Baking+Magic",
    gifUrl: "https://via.placeholder.com/600x400/F687B3/FFFFFF?text=GIF+16",
    likes: 167,
    createdAt: "2023-12-31",
    tags: ["baking", "chef", "cooking"]
  },
  {
    id: "17",
    title: "Night Sky",
    description: "Stars twinkling in a dark night sky",
    thumbnailUrl: "https://via.placeholder.com/300x200/9F7AEA/FFFFFF?text=Night+Sky",
    gifUrl: "https://via.placeholder.com/600x400/9F7AEA/FFFFFF?text=GIF+17",
    likes: 189,
    createdAt: "2023-12-30",
    tags: ["night", "stars", "sky"]
  },
  {
    id: "18",
    title: "Bookworm",
    description: "Cute bookworm reading animated books",
    thumbnailUrl: "https://via.placeholder.com/300x200/F6E05E/FFFFFF?text=Bookworm",
    gifUrl: "https://via.placeholder.com/600x400/F6E05E/FFFFFF?text=GIF+18",
    likes: 134,
    createdAt: "2023-12-29",
    tags: ["book", "reading", "worm"]
  },
  {
    id: "19",
    title: "Rainbow Bridge",
    description: "Colorful bridge spanning over a river",
    thumbnailUrl: "https://via.placeholder.com/300x200/81E6D9/FFFFFF?text=Rainbow+Bridge",
    gifUrl: "https://via.placeholder.com/600x400/81E6D9/FFFFFF?text=GIF+19",
    likes: 145,
    createdAt: "2023-12-28",
    tags: ["rainbow", "bridge", "river"]
  },
  {
    id: "20",
    title: "Circus Fun",
    description: "Circus tent with performing animals",
    thumbnailUrl: "https://via.placeholder.com/300x200/FEB2B2/FFFFFF?text=Circus+Fun",
    gifUrl: "https://via.placeholder.com/600x400/FEB2B2/FFFFFF?text=GIF+20",
    likes: 223,
    createdAt: "2023-12-27",
    tags: ["circus", "animals", "performance"]
  }
]

export default function Gallery() {
  const [visibleGifs, setVisibleGifs] = useState(9)

  const handleLoadMore = () => {
    setVisibleGifs(prev => Math.min(prev + 9, dummyGifs.length))
  }

  const handleDownload = (gif: GalleryGif) => {
    // Create a temporary link to download the GIF
    const link = document.createElement('a')
    link.href = gif.gifUrl
    link.download = `${gif.title.toLowerCase().replace(/\s+/g, '-')}.gif`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = (gif: GalleryGif) => {
    // Copy link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/gallery/${gif.id}`)
    // You could add a toast notification here
  }

  return (
    <div className="p-4 md:p-8">
      <PencilFilters />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <AnimatedDrawing delay={300}>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4 transform -rotate-1 font-hand-script">
              ✨ GIF Gallery ✨
            </h1>
            <p className="text-lg text-gray-600 font-hand transform rotate-1">
              Discover magical animations created by our community
            </p>
          </div>
        </AnimatedDrawing>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {dummyGifs.slice(0, visibleGifs).map((gif, index) => (
            <AnimatedDrawing key={gif.id} delay={400 + index * 100}>
                                              <div className="hover-wobble2">
                   <HandDrawnWindow>
                     <div className="p-4">
                       {/* GIF Thumbnail */}
                       <div className="relative  p-8 aspect-square">
                         <img
                           src={gif.thumbnailUrl}
                           alt={gif.title}
                           className="w-full  object-cover rounded-lg"
                         />
                         <div className="absolute top-2 right-2">
                           <HandDrawnButton size="sm" onClick={() => handleDownload(gif)}>
                             <Download size={16} className="text-blue-500" />
                           </HandDrawnButton>
                         </div>
                       </div>

                       {/* GIF Info */}
                       <div className="space-y-2">
                         <h3 className="font-bold text-[#1A1A1A] font-hand text-lg transform -rotate-1">
                           {gif.title}
                         </h3>
                         <p className="text-sm text-gray-600 font-hand">
                           {gif.description}
                         </p>
                         
                        

                         {/* Stats */}
                         <div className="flex absolute top-4 left-4 items-center justify-between text-xs text-gray-500 font-hand">
                           
                           <span>{new Date(gif.createdAt).toISOString().slice(0, 10)}</span>
                         </div>
                       </div>
                     </div>
                   </HandDrawnWindow>
                 </div>
            </AnimatedDrawing>
          ))}
        </div>

        {/* Load More Button */}
        {visibleGifs < dummyGifs.length && (
          <AnimatedDrawing delay={1000}>
            <div className="text-center mt-8">
              <HandDrawnButton
                onClick={handleLoadMore}
                variant="primary"
                size="lg"
                className="px-8 py-4"
              >
                <span className="text-lg font-hand">See More ✨</span>
              </HandDrawnButton>
            </div>
          </AnimatedDrawing>
        )}
      </div>


    </div>
  )
} 