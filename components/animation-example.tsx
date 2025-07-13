"use client"

import { 
  HandDrawnWindow, 
  HandDrawnInput, 
  HandDrawnPreview, 
  ControlPanel, 
  HandDrawnStickyNote,
  HandDrawnFooter,
  AnimatedDrawing 
} from "./hand-drawn-elements"

// Example showing all components with enhanced animation completion
export const AnimationExample = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Main Window */}
        <AnimatedDrawing delay={0}>
          <HandDrawnWindow>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 font-hand-script">
                ✨ Enhanced Animation Completion
              </h2>
              <p className="text-gray-600 font-hand">
                All frame borders now complete their drawing animation and fade in smoothly, just like the header!
              </p>
            </div>
          </HandDrawnWindow>
        </AnimatedDrawing>

        {/* Input Component */}
        <AnimatedDrawing delay={500}>
          <HandDrawnInput>
            <div className="text-gray-800 font-hand">
              <div className="mb-2">📝 Input Frame</div>
              <div className="text-sm text-gray-600">
                This input border completes its animation and fades in
              </div>
            </div>
          </HandDrawnInput>
        </AnimatedDrawing>

        {/* Preview Component */}
        <AnimatedDrawing delay={1000}>
          <HandDrawnPreview>
            <div className="text-gray-800 font-hand">
              <div className="mb-2">🖼️ Preview Frame</div>
              <div className="text-sm text-gray-600">
                This preview border also completes its animation
              </div>
            </div>
          </HandDrawnPreview>
        </AnimatedDrawing>

        {/* Control Panel */}
        <AnimatedDrawing delay={1500}>
          <ControlPanel>
            <div className="text-gray-800 font-hand">
              <div className="mb-2">🎛️ Control Panel</div>
              <div className="text-sm text-gray-600">
                Control panel border completes its animation too
              </div>
            </div>
          </ControlPanel>
        </AnimatedDrawing>

        {/* Sticky Note */}
        <AnimatedDrawing delay={2000}>
          <div className="flex justify-center">
            <HandDrawnStickyNote>
              <div className="text-gray-800 font-hand text-sm">
                <div className="mb-1">📌 Sticky Note</div>
                <div className="text-xs text-gray-600">
                  Even sticky notes complete their animations!
                </div>
              </div>
            </HandDrawnStickyNote>
          </div>
        </AnimatedDrawing>

        {/* Footer */}
        <AnimatedDrawing delay={2500}>
          <HandDrawnFooter />
        </AnimatedDrawing>

      </div>
    </div>
  )
} 