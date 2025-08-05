
import type { VercelRequest, VercelResponse } from '@vercel/node';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent";

const toGeminiRole = (role: 'user' | 'ai'): 'user' | 'model' => role === 'ai' ? 'model' : 'user';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
        console.error("Gemini API key not found in chat serverless function.");
        res.status(500).json({ error: "AI service is not configured on the server." });
        return;
    }

    try {
        const { history, message } = req.body;

        const systemInstruction = `You are a friendly and helpful customer service assistant for HyperNova Express, a premium courier and logistics company.
            Your goal is to assist users with their questions about the company's services, shipment tracking, and booking procedures.
            Keep your answers concise, clear, and professional.
            Our core services are: Express Delivery (fast domestic and international), International Freight (air and sea), and Warehousing.
            Users can track packages on the 'Track' page, book shipments on the 'Book Shipment' page (requires login), and get a quote on the homepage.
            If you don't know an answer or if the user needs specific help, politely say you can't help with that query and suggest they contact the support team.
            Our support details are:
            - Email: hypernovaexpress@outlook.com
            - Phone / WhatsApp: (201) 381-0806
            Do not make up information about specific shipment details; instead, guide them to the tracking page. Do not offer to perform actions like booking or tracking for them, but rather guide them on how to use the website to do it themselves.`;

        const contents = history.map((msg: { sender: 'user' | 'ai', text: string }) => ({
            role: toGeminiRole(msg.sender),
            parts: [{ text: msg.text }],
        }));
        contents.push({ role: 'user', parts: [{ text: message }] });

        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${API_KEY}&alt=sse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: systemInstruction }] }
            })
        });

        if (!geminiResponse.ok || !geminiResponse.body) {
            const errorText = await geminiResponse.text();
            console.error("Gemini API request failed:", errorText);
            throw new Error('Gemini API request failed');
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Manually pipe the stream from Gemini to the client response
        const reader = geminiResponse.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            res.write(value);
        }
        res.end();

    } catch (error) {
        console.error("Error in chat stream function:", error);
        // If headers are not sent, send an error response.
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to process chat message." });
        } else {
            res.end();
        }
    }
}