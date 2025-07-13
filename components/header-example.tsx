"use client"

import { HandDrawnHeader } from "./hand-drawn-header"

// Example of how to use the separated header component
export const HeaderExample = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <HandDrawnHeader />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to DancyPancy 
          </h2>
          <p className="text-gray-600">
            Your magical gif maker is ready to create amazing animations!
          </p>
        </div>
      </main>
    </div>
  )
} 