
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("Gemini API key not found in serverless function environment.");
        return res.status(500).json({ error: "AI service is not configured on the server." });
    }

    const prompt = `
      As a senior logistics analyst for HyperNova Express, provide a brief, optimistic market analysis summary for the courier and delivery industry for the current quarter.
      Focus on three key areas:
      1. Emerging market opportunities (e.g., e-commerce growth, specialized delivery).
      2. Technological advancements (e.g., drone delivery, AI route optimization).
      3. Sustainability trends (e.g., electric vehicles, eco-friendly packaging).
      Keep the tone professional, forward-looking, and concise. Format the output as a simple text report.
    `;

    try {
        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 1,
                    topK: 1,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!geminiResponse.ok) {
            const error = await geminiResponse.json();
            console.error("Gemini API Error from serverless function:", error);
            return res.status(500).json({ error: 'Failed to get response from AI model.' });
        }

        const data = await geminiResponse.json();
        const text = data.candidates[0].content.parts[0].text;
        
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(text);

    } catch (error) {
        console.error("Error in generate-insights serverless function:", error);
        return res.status(500).json({ error: "An internal error occurred while generating AI insights." });
    }
}