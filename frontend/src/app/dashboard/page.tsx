"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// --- Mock Data for Dashboard ---
const stats = [
  { label: "Tổng hội thoại", value: "12,847", change: "+12.5%", changeType: "up", icon: "💬" },
  { label: "Lead thu thập", value: "3,284", change: "+18.2%", changeType: "up", icon: "📈" },
  { label: "Tỷ lệ chuyển đổi", value: "24.8%", change: "+3.1%", changeType: "up", icon: "🎯" },
  { label: "Thời gian phản hồi TB", value: "1.2s", change: "-0.3s", changeType: "down", icon: "⚡" },
];

const recentConversations = [
  { customer: "Nguyễn Văn An", message: "Tôi muốn tìm hiểu gói Growth...", time: "2 phút trước", status: "active", channel: "Website" },
  { customer: "Trần Thị Mai", message: "Làm sao để tích hợp với Zalo?", time: "15 phút trước", status: "resolved", channel: "Facebook" },
  { customer: "Lê Hoàng Nam", message: "Gói Enterprise có hỗ trợ on-premise?", time: "1 giờ trước", status: "resolved", channel: "Website" },
];

const topQuestions = [
  { question: "Giá gói dịch vụ?", count: 342, pct: 85 },
  { question: "Cách tích hợp website?", count: 256, pct: 64 },
  { question: "Hỗ trợ đa ngôn ngữ?", count: 198, pct: 50 },
];

const channelData = [
  { name: "Website", value: 45, color: "bg-gray-800" },
  { name: "Facebook", value: 28, color: "bg-indigo-500" },
  { name: "Zalo", value: 18, color: "bg-gray-400" },
  { name: "WhatsApp", value: 9, color: "bg-green-500" },
];

const statusColor: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  resolved: "bg-gray-50 text-black border-gray-300",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const statusLabel: Record<string, string> = {
  active: "Đang chat",
  resolved: "Đã xong",
  pending: "Chờ xử lý",
};

function ChatDemo() {
  const [bots, setBots] = useState<{id: string, name: string}[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>("test_bot_123");
  
  useEffect(() => {
    const savedBots = JSON.parse(localStorage.getItem('coerz_bots') || '[]');
    setBots(savedBots);
    if (savedBots.length > 0) {
      setSelectedBotId(savedBots[savedBots.length - 1].id);
    }
  }, []);

  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: 'Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'bot', content: 'Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?' }]);
  }, [selectedBotId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8001' : `http://${window.location.hostname}:8001`);
      
      const currentBotName = bots.find(b => b.id === selectedBotId)?.name || "doanh nghiệp";
      
      const res = await fetch(`${apiBase}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbot_id: selectedBotId,
          message: userMsg,
          history: messages.slice(1),
          bot_name: currentBotName
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: 'Lỗi: Không thể nhận phản hồi từ máy chủ.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Lỗi: Không thể kết nối tới máy chủ.' }]);
    } finally {
      setLoading(false);
    }
  };

  const currentBotName = bots.find(b => b.id === selectedBotId)?.name || "CoerZ Bot";

  return (
    <div className="mx-auto max-w-5xl mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar for Bot Selection */}
      <div className="md:col-span-1 bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
        <h4 className="font-semibold text-black mb-4 px-1">Danh sách Bot</h4>
        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
          {bots.length === 0 && (
            <p className="text-sm text-gray-500 px-1">
              Chưa có bot nào được thiết lập.
            </p>
          )}
          {bots.map(bot => (
            <button
              key={bot.id}
              onClick={() => setSelectedBotId(bot.id)}
              className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all ${selectedBotId === bot.id ? 'bg-gray-50 text-black border border-gray-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <div className="font-medium truncate">{bot.name}</div>
              <div className="text-xs text-gray-400 mt-1 truncate font-mono">{bot.id}</div>
            </button>
          ))}
          {bots.length === 0 && (
            <button
              onClick={() => setSelectedBotId("test_bot_123")}
              className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all ${selectedBotId === "test_bot_123" ? 'bg-gray-50 text-black border border-gray-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <div className="font-medium truncate">Mặc định</div>
              <div className="text-xs text-gray-400 mt-1 truncate font-mono">test_bot_123</div>
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="md:col-span-3 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-black font-bold">
            C
          </div>
          <div>
            <h3 className="font-semibold text-black">{currentBotName}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-gray-500 text-xs">Trực tuyến</p>
            </div>
          </div>
        </div>
        
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-black text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập nội dung tin nhắn..." 
              className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-14 flex items-center justify-center rounded-lg bg-black text-white hover:bg-gray-900 disabled:opacity-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WidgetConfig() {
  const [bots, setBots] = useState<{id: string, name: string}[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string>("test_bot_123");
  const [themeColor, setThemeColor] = useState('#2563eb'); 
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedBots = JSON.parse(localStorage.getItem('coerz_bots') || '[]');
    setBots(savedBots);
    if (savedBots.length > 0) {
      setSelectedBotId(savedBots[savedBots.length - 1].id);
    }
  }, []);

  const copyToClipboard = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://coerz.ai';
    const scriptText = `<script\n  src="${origin}/widget.js"\n  data-bot-id="${selectedBotId}"\n  data-color="${themeColor}"\n></script>`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(scriptText);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = scriptText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try { document.execCommand('copy'); } catch (err) {}
      textArea.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presetColors = [
    { name: 'Xanh CoerZ', value: '#2563eb' },
    { name: 'Đen nhám', value: '#111827' },
    { name: 'Xanh ngọc', value: '#0d9488' },
  ];

  return (
    <div className="mx-auto max-w-5xl mt-4 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar for Bot Selection */}
      <div className="md:col-span-1 bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
        <h4 className="font-semibold text-black mb-4 px-1">Danh sách Bot</h4>
        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
          {bots.length === 0 && (
            <p className="text-sm text-gray-500 px-1">
              Chưa có bot nào được thiết lập.
            </p>
          )}
          {bots.map(bot => (
            <button
              key={bot.id}
              onClick={() => setSelectedBotId(bot.id)}
              className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all ${selectedBotId === bot.id ? 'bg-gray-50 text-black border border-gray-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
            >
              <div className="font-medium truncate">{bot.name}</div>
              <div className="text-xs text-gray-400 mt-1 truncate font-mono">{bot.id}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-3 bg-white rounded-xl shadow-sm p-8 border border-gray-200 h-[calc(100vh-250px)] min-h-[500px] overflow-y-auto">
        <h2 className="text-xl font-bold text-black mb-1">Cấu hình Widget</h2>
        <p className="text-sm text-gray-500 mb-8">Tùy biến giao diện và lấy mã nhúng cho website.</p>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-black mb-3">1. Màu chủ đạo</label>
            <div className="flex gap-3 mb-2">
              {presetColors.map(c => (
                <button
                  key={c.value}
                  onClick={() => setThemeColor(c.value)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${themeColor === c.value ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-black mb-3">2. Mã nhúng</label>
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-mono">embed.html</span>
                <button 
                  onClick={copyToClipboard}
                  className="text-xs font-semibold text-black hover:text-black transition"
                >
                  {copied ? 'Đã sao chép' : 'Sao chép'}
                </button>
              </div>
              <div className="p-4 bg-gray-900 overflow-x-auto">
                <code className="text-sm text-gray-300 whitespace-pre font-mono">
                  {`<script\n  src="${typeof window !== 'undefined' ? window.location.origin : 'https://coerz.ai'}/widget.js"\n  data-bot-id="${selectedBotId}"\n  data-color="${themeColor}"\n></script>`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12 font-sans selection:bg-gray-100 selection:text-black">
      {/* Top Bar */}
      <div className="sticky top-[73px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-black">Bảng điều khiển</h1>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'overview' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >Tổng quan</button>
            <button 
              onClick={() => setActiveTab('demo')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'demo' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >Demo Chat</button>
            <button 
              onClick={() => setActiveTab('widget')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'widget' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >Widget</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {activeTab === 'overview' ? (
          <>
            {/* Stats */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl">{s.icon}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${s.changeType === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {s.change}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-black">{s.value}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                <h3 className="font-semibold text-black mb-6">Tương tác 7 ngày qua</h3>
                <div className="flex items-end gap-4 h-48 border-b border-gray-100 pb-2">
                  {[65, 78, 52, 89, 95, 72, 88].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-full bg-gray-100 rounded-t-md hover:bg-gray-200 transition-colors relative" style={{ height: `${val}%` }}>
                        <div className="absolute top-0 w-full bg-black rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: '4px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-400">
                  <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="font-semibold text-black mb-6">Nguồn lưu lượng</h3>
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  {channelData.map((ch) => (
                    <div key={ch.name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600">{ch.name}</span>
                        <span className="font-semibold text-black">{ch.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${ch.color}`} style={{ width: `${ch.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-black">Hội thoại gần nhất</h3>
                  <button className="text-sm text-black font-medium hover:underline">Xem tất cả</button>
                </div>
                <div className="space-y-4">
                  {recentConversations.map((conv) => (
                    <div key={conv.customer} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-100 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-600">
                        {conv.customer.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-black text-sm truncate">{conv.customer}</p>
                          <span className="text-xs text-gray-400">{conv.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{conv.message}</p>
                        <div className="mt-1 flex gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${statusColor[conv.status]}`}>{statusLabel[conv.status]}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="font-semibold text-black mb-6">Chủ đề thường gặp</h3>
                <div className="space-y-5 flex-1">
                  {topQuestions.map((tq, i) => (
                    <div key={tq.question}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{i + 1}. {tq.question}</span>
                        <span className="text-xs font-semibold text-black bg-gray-100 px-2 py-1 rounded">{tq.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black" style={{ width: `${tq.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'demo' ? (
          <ChatDemo />
        ) : (
          <WidgetConfig />
        )}
      </div>
    </div>
  );
}


