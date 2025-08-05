
type Message = {
  sender: 'user' | 'ai';
  text: string;
};

// This function handles the fetch call to our SSE endpoint and processes the stream.
export const getChatStream = async (
    history: Message[], 
    message: string, 
    onChunk: (text: string) => void,
    onError: (error: string) => void
) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, message }),
        });

        if (!response.ok || !response.body) {
            const errorText = await response.text();
            throw new Error(`Chat service connection failed: ${errorText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '));
            
            for (const line of lines) {
                const jsonStr = line.substring(6).trim();
                if (jsonStr) {
                    try {
                        const parsed = JSON.parse(jsonStr);
                        // Extract text according to Gemini REST API SSE format
                        const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            onChunk(text);
                        }
                    } catch(e) {
                        console.error("Failed to parse stream chunk:", jsonStr, e);
                    }
                }
            }
        }
    } catch (error: any) {
        console.error("Error in getChatStream:", error);
        onError(error.message || "An unknown error occurred with the chat service.");
    }
};