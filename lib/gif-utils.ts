import Jimp from "jimp"

export interface GifOptions {
  width?: number
  height?: number
  delay?: number
}

export async function createGifFromBuffers(imageBuffers: Buffer[], options: GifOptions = {}): Promise<Buffer> {
  const { width = 512, height = 512, delay = 300 } = options

  try {
    // Process all images first
    const processedImages = []

    for (const buffer of imageBuffers) {
      const image = await Jimp.read(buffer)
      image.resize(width, height)
      processedImages.push(image)
    }

    // Create animated GIF using Jimp's built-in GIF support
    if (processedImages.length === 0) {
      throw new Error("No images to process")
    }

    // For now, let's return the first frame as a static image
    // We'll need to use a different approach for actual GIF creation
    const firstImage = processedImages[0]
    const gifBuffer = await firstImage.getBufferAsync(Jimp.MIME_PNG)

    return gifBuffer
  } catch (error) {
    console.error("Error creating GIF:", error)
    throw error
  }
}

export function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: "Prompt cannot be empty" }
  }

  if (prompt.length > 500) {
    return { isValid: false, error: "Prompt must be less than 500 characters" }
  }

  return { isValid: true }
}
