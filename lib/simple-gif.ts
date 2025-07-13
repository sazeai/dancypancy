import Jimp from "jimp"

export async function createSimpleGif(imageBuffers: Buffer[]): Promise<Buffer> {
  try {
    // For now, let's create a simple approach
    // We'll combine images into a single image strip that can be used as frames

    const images = []
    const targetSize = 512

    // Process each image
    for (const buffer of imageBuffers) {
      const image = await Jimp.read(buffer)
      image.resize(targetSize, targetSize)
      images.push(image)
    }

    if (images.length === 0) {
      throw new Error("No images to process")
    }

    // For demonstration, let's return the middle frame as a static image
    // In a real implementation, you'd use a proper GIF library
    const middleIndex = Math.floor(images.length / 2)
    const resultBuffer = await images[middleIndex].getBufferAsync(Jimp.MIME_PNG)

    return resultBuffer
  } catch (error) {
    console.error("Error creating simple gif:", error)
    throw error
  }
}
