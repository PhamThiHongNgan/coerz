"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
type Message = { role: string; content: string };
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('coervora_chat_history');
      if (saved) return JSON.parse(saved);
    }
    return [
      { role: "bot", content: "Chào bạn! 👋 Mình là trợ lý AI. Mình có thể giúp gì cho bạn hôm nay?" }
    ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('coervora_chat_history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://localhost:8001";
      const res = await fetch(`${apiBase}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chatbot_id: "test_bot_123", 
          message: userMessage,
          history: messages
        }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", content: data.response || "Lỗi phản hồi từ server." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", content: "Xin lỗi, không thể kết nối đến máy chủ AI. Bạn hãy chắc chắn đã bật Backend ở cổng 8001 nhé." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-0 right-20 w-80 sm:w-96 rounded-2xl border border-surface-200 bg-white shadow-2xl overflow-hidden flex flex-col h-[500px] max-h-[80vh] transition-all duration-300 animate-in slide-in-from-right-4 fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold">C</div>
              <div>
                <h4 className="font-bold">CoerZ</h4>
                <div className="flex items-center gap-1.5 text-xs text-primary-100">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  Luôn sẵn sàng hỗ trợ
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-surface-50 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'rounded-tr-sm bg-primary-600 text-white' 
                    : 'rounded-tl-sm bg-white border border-surface-100 text-surface-700 whitespace-pre-wrap'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-surface-100 px-4 py-3 text-sm text-surface-700 shadow-sm flex gap-1">
                   <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <button onClick={() => setInput("Tìm hiểu bảng giá")} className="text-xs font-medium text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-3 py-1.5 hover:bg-primary-100 transition-colors">Tìm hiểu bảng giá</button>
                <button onClick={() => setInput("Tư vấn giải pháp AI")} className="text-xs font-medium text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-3 py-1.5 hover:bg-primary-100 transition-colors">Tư vấn giải pháp AI</button>
              </div>
            )}
            
            {messages.length > 2 && (
              <div className="flex justify-center mt-4">
                 <button onClick={() => { localStorage.removeItem('coervora_chat_history'); setMessages([{ role: "bot", content: "Đã xóa lịch sử. Mình có thể giúp gì thêm cho bạn?" }]); }} className="text-xs text-surface-400 hover:text-surface-600">
                    Xóa lịch sử trò chuyện
                 </button>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-surface-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập tin nhắn..." 
              className="flex-1 rounded-full border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none"
            />
            <button onClick={handleSend} disabled={isLoading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50">
              <svg className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-lg shadow-primary-500/40 hover:scale-110 transition-transform duration-300"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
