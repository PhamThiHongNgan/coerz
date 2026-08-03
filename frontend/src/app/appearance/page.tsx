"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";

export default function AppearancePage() {
  const { accent, setAccent } = useTheme();
  const [botName, setBotName] = useState("CoerVora Assistant");
  const [welcomeMessage, setWelcomeMessage] = useState("Chào bạn! 👋 Mình là trợ lý AI. Mình có thể giúp gì cho bạn hôm nay?");

  return (
    <div className="min-h-screen bg-primary-50/30 pb-12">
      {/* Top Bar */}
      <div className="sticky top-[73px] z-40 border-b border-primary-100/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-surface-400 hover:text-primary-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-surface-900">Giao diện Chatbot</h1>
              <p className="text-sm text-surface-500">Tùy chỉnh màu sắc và nội dung hiển thị</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-primary-600 to-accent-500 text-white text-sm font-bold px-6 py-2 rounded-xl shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform">
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* Controls */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white bg-white/60 p-8 shadow-xl shadow-primary-900/5 backdrop-blur-md">
              <h3 className="text-lg font-bold text-surface-900 mb-6">Màu sắc chủ đạo</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'blue', bg: 'bg-[#3b82f6]' },
                  { id: 'purple', bg: 'bg-[#a855f7]' },
                  { id: 'green', bg: 'bg-[#22c55e]' },
                  { id: 'orange', bg: 'bg-[#f97316]' },
                  { id: 'red', bg: 'bg-[#ef4444]' },
                ].map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setAccent(c.id as any)}
                    className={`h-12 w-12 rounded-full ${c.bg} shadow-md transition-transform flex items-center justify-center ${accent === c.id ? 'scale-110 ring-4 ring-offset-2 ring-primary-500/30' : 'hover:scale-110'}`}
                  >
                    {accent === c.id && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-surface-500">
                Thay đổi này sẽ áp dụng ngay lập tức cho Widget Chat trên website của bạn và toàn bộ trang quản trị CoerVora.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white bg-white/60 p-8 shadow-xl shadow-primary-900/5 backdrop-blur-md space-y-6">
              <h3 className="text-lg font-bold text-surface-900">Thông tin cơ bản</h3>
              
              <div>
                <label className="mb-2 block text-sm font-semibold text-surface-700">Tên Chatbot</label>
                <input 
                  type="text" 
                  value={botName}
                  onChange={e => setBotName(e.target.value)}
                  className="block w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" 
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-surface-700">Lời chào mở đầu</label>
                <textarea 
                  rows={3} 
                  value={welcomeMessage}
                  onChange={e => setWelcomeMessage(e.target.value)}
                  className="block w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" 
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-surface-700">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-white text-xl font-bold`}>
                    {botName.charAt(0)}
                  </div>
                  <button className="border border-surface-200 bg-white px-4 py-2 text-sm font-semibold text-surface-700 rounded-lg hover:bg-surface-50 transition-colors">Tải ảnh lên</button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-[2rem] border border-white bg-surface-100 p-8 shadow-inner flex items-center justify-center min-h-[600px] relative overflow-hidden">
            {/* Dots pattern */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgb(var(--color-surface-300)) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative w-80 rounded-2xl border border-surface-200 bg-white shadow-2xl overflow-hidden flex flex-col h-[500px]">
              {/* Header */}
              <div className={`bg-gradient-to-r from-primary-600 to-accent-500 p-4 text-white flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 font-bold">{botName.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-sm truncate max-w-[150px]">{botName}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-white/80">
                      <div className="h-2 w-2 rounded-full bg-green-400"></div>
                      Luôn sẵn sàng hỗ trợ
                    </div>
                  </div>
                </div>
                <button className="text-white/80 hover:text-white p-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-surface-50 space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-surface-100 px-4 py-3 text-sm text-surface-700 shadow-sm whitespace-pre-wrap">
                    {welcomeMessage}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button className="text-xs font-medium text-surface-600 bg-white border border-surface-200 rounded-full px-3 py-1.5 shadow-sm">Tìm hiểu bảng giá</button>
                  <button className="text-xs font-medium text-surface-600 bg-white border border-surface-200 rounded-full px-3 py-1.5 shadow-sm">Đăng ký dùng thử</button>
                </div>
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-surface-100 flex items-center gap-2">
                <input disabled type="text" placeholder="Nhập tin nhắn..." className="flex-1 rounded-full border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm" />
                <button disabled className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-white`}>
                  <svg className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>

            {/* Float bubble preview */}
            <div className={`absolute bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-xl shadow-primary-900/20`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
