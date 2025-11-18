
"use server";

import { analyzeImageDeepfake } from "@/ai/flows/image-deepfake-analyzer";
import type { AnalyzeImageDeepfakeOutput } from "@/ai/flows/image-deepfake-analyzer";
import { textCredibilityAnalysis } from "@/ai/flows/text-credibility-analyzer";
import type { TextCredibilityAnalysisOutput } from "@/ai/flows/text-credibility-analyzer";
import { generateSpeech } from "@/ai/flows/tts";
import type { GenerateSpeechOutput } from "@/ai/flows/tts";
import { z } from "zod";

type ActionState<T> = {
  data: T | null;
  error: string | null;
  zodErrors?: { [key: string]: string[] } | null;
};

const textSchema = z.object({
  text: z.string().min(10, "Please enter at least 10 characters.").max(5000, "Text must be 5000 characters or less."),
});

export async function verifyTextAction(
  prevState: ActionState<TextCredibilityAnalysisOutput>,
  formData: FormData
): Promise<ActionState<TextCredibilityAnalysisOutput>> {
  const validatedFields = textSchema.safeParse({
    text: formData.get("text"),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: "Invalid input.",
      zodErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await textCredibilityAnalysis({ text: validatedFields.data.text });
    return { data: result, error: null, zodErrors: null };
  } catch (e) {
    return { data: null, error: "An unexpected error occurred during analysis.", zodErrors: null };
  }
}

export async function verifyImageAction(
  dataUri: string
): Promise<ActionState<AnalyzeImageDeepfakeOutput>> {
  if (!dataUri) {
    return { data: null, error: "Image data is required." };
  }
  try {
    const result = await analyzeImageDeepfake({ photoDataUri: dataUri });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: "An unexpected error occurred during analysis." };
  }
}

export async function getSpeechAction(
  text: string
): Promise<ActionState<GenerateSpeechOutput>> {
  if (!text) {
    return { data: null, error: "Text is required." };
  }
  try {
    const result = await generateSpeech(text);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: "An unexpected error occurred during speech generation." };
  }
}
