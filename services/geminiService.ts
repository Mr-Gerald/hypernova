
import { GoogleGenAI } from "@google/genai";

// This function lazily initializes and returns the AI client, only if an API key is available.
const getAiClient = () => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  if (!API_KEY) {
    return null;
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateLogisticsInsights = async (): Promise<string> => {
  const ai = getAiClient();
  
  if (!ai) {
    console.warn("Gemini API key not found. AI features will be disabled.");
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