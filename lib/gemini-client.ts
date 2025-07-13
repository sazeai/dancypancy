import { GoogleGenAI, Modality } from "@google/genai"

export class GeminiClient {
  private ai: GoogleGenAI

  constructor() {
    this.ai = new GoogleGenAI({})
  }

  async generateFrameWithImage(prompt: string, frameNumber: number, totalFrames: number) {
    // Create more specific prompts for each frame to show progression
    const framePrompts = this.createFramePrompts(prompt, frameNumber, totalFrames)

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: framePrompts,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      })

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data
          const buffer = Buffer.from(imageData, "base64")
          return {
            buffer,
            description: `Frame ${frameNumber}`,
          }
        }
      }

      throw new Error(`No image generated for frame ${frameNumber}`)
    } catch (error) {
      console.error(`Error generating frame ${frameNumber}:`, error)
      throw error
    }
  }

  private createFramePrompts(basePrompt: string, frameNumber: number, totalFrames: number): string {
    const progress = (frameNumber - 1) / (totalFrames - 1)

    // Create different variations based on the frame position
    if (frameNumber === 1) {
      return `${basePrompt} - starting position, beginning of animation`
    } else if (frameNumber === totalFrames) {
      return `${basePrompt} - ending position, completion of animation`
    } else if (progress < 0.5) {
      return `${basePrompt} - early animation phase, ${Math.round(progress * 100)}% through motion`
    } else {
      return `${basePrompt} - late animation phase, ${Math.round(progress * 100)}% through motion`
    }
  }
}
