
import React, { useState, useEffect, useRef } from 'react';
import { getChatStream } from '../services/chatService';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hello! How can I help you with your HyperNova Express shipping needs today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if(isOpen) {
        scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage || isLoading) return;

    // Capture history before this new message
    const history = messages;

    // Add user message and AI placeholder to state immediately for snappy UI
    setMessages([...history, { sender: 'user', text: userMessage }, { sender: 'ai', text: '' }]);
    setInputValue('');
    setIsLoading(true);

    try {
        await getChatStream(
            history, 
            userMessage, 
            (chunkText) => { // onChunk callback
                setMessages(prev => {
                    const updatedMessages = [...prev];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
                    if (lastMessage) {
                      lastMessage.text += chunkText;
                    }
                    return updatedMessages;
                });
            },
            (errorText) => { // onError callback
                setMessages(prev => {
                    const updatedMessages = [...prev];
                    const lastMessage = updatedMessages[updatedMessages.length - 1];
                     if (lastMessage) {
                      lastMessage.text = `Sorry, an error occurred: ${errorText}`;
                    }
                    return updatedMessages;
                });
            }
        );
    } catch (error) {
        // This catch is for network errors before the stream starts
        console.error("Chatbot sendMessage error:", error);
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = 'Sorry, I couldn\'t connect to the chat service. Please try again.';
            return newMessages;
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div 
        className={`fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-96 h-[70vh] max-h-[70vh] bg-nova-dark-200 rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-nova-dark p-4 rounded-t-xl flex justify-between items-center border-b border-nova-gray/20">
          <h3 className="text-lg font-bold text-nova-light">HyperNova Assistant</h3>
          <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-nova-gray hover:text-nova-light text-2xl">&times;</button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg p-3 max-w-[80%] whitespace-pre-wrap break-words ${msg.sender === 'user' ? 'bg-nova-red text-white rounded-br-none' : 'bg-nova-dark text-nova-light rounded-bl-none'}`}>
                {msg.text}
                {/* Typing indicator for empty, loading AI message */}
                {isLoading && index === messages.length - 1 && msg.text === '' && (
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-nova-gray rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-nova-gray rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-nova-gray rounded-full animate-pulse"></span>
                   </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex-shrink-0 p-3 border-t border-nova-gray/20 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow bg-nova-dark border border-nova-gray/30 rounded-lg p-2 text-nova-light focus:ring-2 focus:ring-nova-red outline-none"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button type="submit" disabled={isLoading} aria-label="Send message" className="bg-nova-red text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label="Toggle chat"
        className="fixed bottom-6 right-4 sm:right-8 z-50 w-16 h-16 bg-nova-red rounded-full text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>
    </>
  );
};

export default Chatbot;