import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI, Modality } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt cannot be empty" }, { status: 400 })
    }

    console.log(`Starting GIF generation for prompt: "${prompt}"`)

    // Step 1: Expand the prompt using Gemini Flash (exactly like Google's demo)
    const expandPromptResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        temperature: 1,
        systemInstruction: `**Generate simple, animated doodle GIFs on white from user input, prioritizing key visual identifiers in an animated doodle style with ethical considerations.** **Core GIF:** Doodle/cartoonish (simple lines, stylized forms, no photorealism), subtle looping motion (primary subject(s) only: wiggle, shimmer, etc.), white background, lighthearted/positive tone (playful, avoids trivializing serious subjects), uses specified colors (unless monochrome/outline requested). **Input Analysis:** Identify subject (type, specificity), prioritize visual attributes (hair C/T, skin tone neutrally if discernible/needed, clothes C/P, accessories C, facial hair type, other distinct features neutrally for people; breed, fur C/P for animals; key parts, colors for objects), extract text (content, style hints described, display as requested: speech bubble [format: 'Speech bubble says "[Text]" is persistent.'], caption/title [format: 'with the [title/caption] "[Text]" [position]'], or text-as-subject [format: 'the word "[Text]" in [style/color description]']), note style modifiers (e.g., "pencil sketch," "monochrome"), and action (usually "subtle motion"). If the subject or description is too vague, add specific characteristics to make it more unique and detailed. **Prompt Template:** "[Style Descriptor(s)] [Subject Description with Specificity, Attributes, Colors, Skin Tone if applicable] [Text Component if applicable and NOT speech bubble]. [Speech Bubble Component if applicable]" **Template Notes:** '[Style Descriptor(s)]' includes "cartoonish" or "doodle style" (especially for people) plus any user-requested modifiers. '[Subject Description...]' combines all relevant subject and attribute details. '[Text Component...]' is for captions, titles, or text-as-subject only. '[Speech Bubble Component...]' is for speech bubbles only (mutually exclusive with Text Component). **Key Constraints:** No racial labels. Neutral skin tone descriptors when included. Cartoonish/doodle style always implied, especially for people. One text display method only.`,
      },
    })

    const enhancedPrompt = `A doodle animation on a white background of ${expandPromptResponse.text}. Subtle motion but nothing else moves.`
    const style = `Simple, vibrant, varied-colored doodle/hand-drawn sketch`

    console.log("Enhanced prompt:", enhancedPrompt)

    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: `Generate at least 5 square, white-background doodle animation frames with smooth, fluid, vibrantly colored motion depicting ${enhancedPrompt}. *Mandatory Requirements:** **Style:** ${style}. **Background:** Plain solid white (no background colors/elements). Absolutely no black background. **Content & Motion:** Clearly depict **${enhancedPrompt}** action with colored, moving subject (no static images). If there's an action specified, it should be the main difference between frames. **Frame Count:** At least 5 frames showing continuous progression and at most 8 frames. **Format:** Square image (1:1 aspect ratio). **Cropping:** Absolutely no black bars/letterboxing; colorful doodle fully visible against white. **Output:** Actual image files for a smooth, colorful doodle-style GIF on a white background. Make sure every frame is different enough from the previous one.`,
      config: {
        temperature: 1,
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    })

    const frameData: Array<{ frameNumber: number; dataUrl: string }> = []
    let frameCount = 0

    // Process streaming response (exactly like Google's demo)
    try {
      for await (const chunk of response) {
        if (chunk.candidates && chunk.candidates[0].content?.parts) {
          for (const part of chunk.candidates[0].content.parts) {
            if (part.inlineData) {
              frameCount++
              console.log(`Generated frame ${frameCount}`)

              const base64Data = part.inlineData.data
              const dataUrl = `data:image/png;base64,${base64Data}`

              frameData.push({
                frameNumber: frameCount,
                dataUrl: dataUrl,
              })

              // Limit frames to prevent excessive generation
              if (frameCount >= 8) {
                console.log("Reached maximum frame limit")
                break
              }
            }
          }
        }
      }
    } catch (streamError) {
      console.error("Stream processing error:", streamError)
      // Continue with frames we have
    }

    if (frameCount < 2) {
      return NextResponse.json(
        {
          error: `Only generated ${frameCount} frame(s). Need at least 2 for animation.`,
        },
        { status: 500 },
      )
    }

    console.log(`Successfully generated ${frameCount} frames`)

    return NextResponse.json({
      success: true,
      frameCount: frameCount,
      frames: frameData,
      enhancedPrompt: enhancedPrompt,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate frames",
      },
      { status: 500 },
    )
  }
}
