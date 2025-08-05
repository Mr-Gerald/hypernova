
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// The chat instance is cached at the module level to maintain conversation history.
let chat: Chat | null = null;

// Lazily initializes the chat session on the first call.
const getChat = (): Chat | null => {
    // Return the cached chat session if it already exists.
    if (chat) {
        return chat;
    }

    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    if (!API_KEY) {
        console.warn("Gemini API key not found. Chatbot will be disabled.");
        return null;
    }

    // Create the AI client and the chat session only when needed.
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a friendly and helpful customer service assistant for HyperNova Express, a premium courier and logistics company.
                Your goal is to assist users with their questions about the company's services, shipment tracking, and booking procedures.
                Keep your answers concise, clear, and professional.
                Our core services are: Express Delivery (fast domestic and international), International Freight (air and sea), and Warehousing.
                Users can track packages on the 'Track' page, book shipments on the 'Book Shipment' page (requires login), and get a quote on the homepage.
                If you don't know an answer, politely say you can't help with that specific query and suggest they contact support at support@hypernova.express.
                Do not make up information about specific shipment details; instead, guide them to the tracking page. Do not offer to perform actions like booking or tracking for them, but rather guide them on how to use the website to do it themselves.`
        },
    });
    
    return chat;
}

export const sendMessageStream = async (message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
    const chatInstance = getChat();

    if (!chatInstance) {
        async function* errorStream() {
            yield { text: "AI Chat is currently unavailable. API key is not configured." } as GenerateContentResponse;
        }
        return errorStream();
    }

    const result = await chatInstance.sendMessageStream({ message });
    return result;
};