import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { selfieDataUrl, haircutName, haircutDescription } = await request.json();

    if (!selfieDataUrl || !haircutName) {
      return NextResponse.json(
        { error: "Missing selfie or haircut info" },
        { status: 400 }
      );
    }

    const prompt = [
      `Edit this person's hairstyle to show a "${haircutName}" haircut.`,
      `The haircut is: ${haircutDescription}`,
      "Keep the person's face, skin tone, and features exactly the same.",
      "Only change the hair to match the described haircut style.",
      "The result should look like a realistic photo, not a drawing or illustration.",
      "Maintain the same lighting and background as the original photo.",
    ].join(" ");

    // Extract base64 data from data URL
    const base64Data = selfieDataUrl.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Create a File object for the API
    const imageFile = new File([imageBuffer], "selfie.png", {
      type: "image/png",
    });

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt,
      size: "1024x1024",
    });

    const outputBase64 = response.data?.[0]?.b64_json;

    if (!outputBase64) {
      return NextResponse.json(
        { error: "No image generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      previewUrl: `data:image/png;base64,${outputBase64}`,
    });
  } catch (error) {
    console.error("Preview generation error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to generate preview";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
