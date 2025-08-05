
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the build environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateLogisticsInsights = async (): Promise<string> => {
  if (!API_KEY) {
    return "AI service is currently unavailable. Please configure the API Key.";
  }
  
  try {
    const prompt = `
      As a senior logistics analyst for HyperNova Express, provide a brief, optimistic market analysis summary for the courier and delivery industry for the current quarter.
      Focus on three key areas:
      1. Emerging market opportunities (e.g., e-commerce growth, specialized delivery).
      2. Technological advancements (e.g., drone delivery, AI route optimization).
      3. Sustainability trends (e.g., electric vehicles, eco-friendly packaging).
      Keep the tone professional, forward-looking, and concise. Format the output as a simple text report.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 1,
          topK: 1,
          maxOutputTokens: 500,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating logistics insights:", error);
    return "Failed to generate AI-powered insights. The service may be temporarily down.";
  }
};
