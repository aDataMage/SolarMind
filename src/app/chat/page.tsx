'use client';

import { useChat } from "@ai-sdk/react";

export default function ChatInterface() {
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat',
        initialMessages: [{ id: '1', role: 'assistant', content: 'Welcome! How can I help?' }],
    });

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto p-4">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map(m => (
                    <div key={m.id} className={`p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-100 text-gray-800 self-start'}`}>
                        <span className="font-bold block text-xs mb-1">{m.role === 'user' ? 'You' : 'AI'}</span>
                        {m.content}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded"
                />
                <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send</button>
            </form>
        </div>
    );
}
