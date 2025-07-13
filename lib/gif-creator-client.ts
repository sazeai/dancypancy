import { applyPalette, GIFEncoder, quantize } from "gifenc"

export async function createGifFromDataUrls(
  imageUrls: string[],
  targetWidth = 512,
  targetHeight = 512,
  fps = 4,
): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Failed to create canvas context")
  }

  const gif = GIFEncoder()
  const fpsInterval = 1 / fps
  const delay = fpsInterval * 1000

  for (const url of imageUrls) {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = url
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    canvas.width = targetWidth
    canvas.height = targetHeight
    ctx.fillStyle = "#ffffff"
    ctx.clearRect(0, 0, targetWidth, targetHeight)
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

    const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight)
    const data = imageData.data

    const format = "rgb444"
    const palette = quantize(data, 256, { format })
    const index = applyPalette(data, palette, format)

    gif.writeFrame(index, targetWidth, targetHeight, { palette, delay })
  }

  gif.finish()
  const buffer = gif.bytesView()
  return new Blob([buffer], { type: "image/gif" })
}
