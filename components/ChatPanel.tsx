
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, UserIcon, AgentIcon } from './Icons';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isStreaming: boolean;
  agentName: string;
}

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
          <AgentIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-xl rounded-xl px-4 py-3 text-white ${
          isUser ? 'bg-green-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
       {isUser && (
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isStreaming, agentName }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-2/3 h-full flex flex-col bg-gray-900">
      <header className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">{agentName} - Debugger</h2>
      </header>
      
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <div className="space-y-6">
          {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                  <p>Start a conversation with the agent.</p>
              </div>
          )}
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          {isStreaming && messages[messages.length-1]?.role === 'agent' && (
             <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <AgentIcon className="w-5 h-5 text-white" />
                </div>
                <div className="max-w-xl rounded-xl px-4 py-3 bg-gray-700 rounded-bl-none">
                    <div className="flex items-center">
                        <span className="typing-indicator"></span>
                    </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
        <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a202c; /* gray-900 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a5568; /* gray-600 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #718096; /* gray-500 */
        }
        .typing-indicator {
            display: inline-block;
            width: 24px;
            height: 6px;
            background-image: radial-gradient(circle, currentColor 1.5px, transparent 1.5px);
            background-size: 8px 8px;
            background-position: 0 50%;
            background-repeat: no-repeat;
            animation: typing-animation 1s infinite;
            color: white;
        }
        @keyframes typing-animation {
            0% { background-position: 0 50%; }
            33% { background-position: 8px 50%; }
            66% { background-position: 16px 50%; }
            100% { background-position: 0 50%; }
        }
      `}</style>
    </div>
  );
};
