
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Chatbot will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

let chat: Chat | null = null;

const getChat = (): Chat => {
    if (!chat) {
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
    }
    return chat;
}

export const sendMessageStream = async (message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
    if (!API_KEY) {
        async function* errorStream() {
            yield { text: "AI Chat is currently unavailable. API key is not configured." } as GenerateContentResponse;
        }
        return errorStream();
    }

    const chatInstance = getChat();
    const result = await chatInstance.sendMessageStream({ message });
    return result;
};
