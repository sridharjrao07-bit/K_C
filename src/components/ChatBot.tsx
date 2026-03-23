'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  '💰 How to price my crafts?',
  '🛒 Marketplace tips',
  '✅ Verification help',
  '📦 Shipping guidance',
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                assistantContent += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: assistantContent,
                  };
                  return updated;
                });
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I couldn\'t process your request right now. Please try again later. 🙏',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        id="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full shadow-lg
          bg-gradient-to-br from-[#b87d4b] to-[#d4776f] text-white
          hover:shadow-xl hover:scale-110 active:scale-95
          transition-all duration-300 ease-out
          flex items-center justify-center group"
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
      >
        <span
          className="text-2xl transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          {isOpen ? '✕' : '💬'}
        </span>
        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#d4776f] animate-ping opacity-20" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          id="chatbot-panel"
          className="fixed bottom-24 right-6 z-[60] w-[360px] max-w-[calc(100vw-2rem)]
            h-[520px] max-h-[calc(100vh-8rem)]
            flex flex-col
            rounded-2xl overflow-hidden
            shadow-2xl border border-[#e8dcc9]
            bg-[#faf7f2]"
          style={{
            animation: 'chatSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#b87d4b] to-[#d4776f] px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">
              🪔
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight">
                Kaarigar AI
              </h3>
              <p className="text-white/70 text-xs">
                Your artisan assistant
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/60 text-[10px]">Online</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[#e8dcc9]/50 text-sm text-[#3e2723] leading-relaxed">
                  Namaste! 🙏 I&apos;m <strong>Kaarigar AI</strong>, your
                  assistant for all things artisan. Ask me about selling,
                  pricing, verification, or anything about the platform!
                </div>
                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full
                        bg-white border border-[#e8dcc9] text-[#6f5c46]
                        hover:bg-[#b87d4b] hover:text-white hover:border-[#b87d4b]
                        transition-all duration-200 shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
                    ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-[#b87d4b] to-[#d4776f] text-white rounded-2xl rounded-br-sm shadow-md'
                        : 'bg-white text-[#3e2723] rounded-2xl rounded-tl-sm shadow-sm border border-[#e8dcc9]/50'
                    }`}
                  style={{
                    animation: 'chatFadeIn 0.25s ease-out',
                  }}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#b87d4b] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#b87d4b] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-[#b87d4b] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="px-4 py-3 border-t border-[#e8dcc9] bg-white/80 backdrop-blur-sm shrink-0"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                id="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-full text-sm
                  bg-[#faf7f2] border border-[#e8dcc9]
                  text-[#3e2723] placeholder-[#a68a64]
                  focus:outline-none focus:ring-2 focus:ring-[#d4776f]/40 focus:border-[#d4776f]
                  disabled:opacity-50 transition-all duration-200"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full flex items-center justify-center
                  bg-gradient-to-br from-[#b87d4b] to-[#d4776f] text-white
                  hover:shadow-lg hover:scale-105 active:scale-95
                  disabled:opacity-40 disabled:hover:scale-100
                  transition-all duration-200 shrink-0"
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

    </>
  );
}
