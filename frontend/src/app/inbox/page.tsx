"use client";

import Link from "next/link";
import { useState } from "react";

const conversations = [
  { id: 1, name: "Nguyễn Văn An", status: "Chờ phản hồi", lastMessage: "Tôi muốn tìm hiểu gói Growth...", time: "2m", active: true },
  { id: 2, name: "Trần Thị Mai", status: "Đang chat", lastMessage: "Làm sao để tích hợp với Zalo?", time: "15m", active: false },
  { id: 3, name: "Lê Hoàng Nam", status: "Đã xử lý", lastMessage: "Cảm ơn bạn nhiều nhé.", time: "1h", active: false },
  { id: 4, name: "Phạm Minh Tuấn", status: "Đang chat", lastMessage: "Gửi cho tôi báo giá chi tiết.", time: "2h", active: false },
];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex h-screen bg-primary-50/30 flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="border-b border-primary-100/60 bg-white/80 backdrop-blur-xl shrink-0">
        <div className="mx-auto flex w-full items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-surface-400 hover:text-primary-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-surface-900">Live Inbox</h1>
              <p className="text-sm text-surface-500">Quản lý các cuộc hội thoại trực tiếp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inbox Area */}
      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full border-x border-primary-100/60 bg-white/60 shadow-xl shadow-primary-900/5">
        
        {/* Sidebar */}
        <div className="w-80 border-r border-primary-100/60 bg-white flex flex-col shrink-0">
          <div className="p-4 border-b border-surface-100 flex gap-2">
            <button className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${activeTab === 'all' ? 'bg-primary-100 text-primary-700' : 'text-surface-500 hover:bg-surface-50'}`} onClick={() => setActiveTab('all')}>Tất cả</button>
            <button className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${activeTab === 'unread' ? 'bg-primary-100 text-primary-700' : 'text-surface-500 hover:bg-surface-50'}`} onClick={() => setActiveTab('unread')}>Cần xử lý</button>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {conversations.map(c => (
              <div key={c.id} className={`p-4 border-b border-surface-50 cursor-pointer transition-colors ${c.active ? 'bg-primary-50/50 border-l-4 border-l-primary-500' : 'hover:bg-surface-50 border-l-4 border-l-transparent'}`}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-surface-900">{c.name}</h4>
                  <span className="text-[10px] text-surface-400 font-medium">{c.time}</span>
                </div>
                <p className="text-xs text-surface-500 truncate mb-2">{c.lastMessage}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${c.status === 'Chờ phản hồi' ? 'bg-yellow-100 text-yellow-700' : c.status === 'Đã xử lý' ? 'bg-surface-100 text-surface-600' : 'bg-primary-100 text-primary-700'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-surface-50/50">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-surface-100 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold">N</div>
              <div>
                <h3 className="font-bold text-surface-900">Nguyễn Văn An</h3>
                <p className="text-xs text-green-600 font-medium flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-green-500"></div> Đang trực tuyến</p>
              </div>
            </div>
            <button className="text-xs font-bold text-white bg-surface-800 px-4 py-2 rounded-xl shadow-sm hover:bg-surface-700 transition">Đánh dấu đã xong</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex justify-center mb-6">
              <span className="text-[10px] font-bold text-surface-400 bg-white px-3 py-1 rounded-full border border-surface-200">Bot đang xử lý tự động</span>
            </div>
            
            <div className="flex justify-end">
              <div className="max-w-md rounded-2xl rounded-br-sm bg-primary-600 px-4 py-3 text-sm text-white shadow-sm">
                Tôi muốn tìm hiểu gói Growth, hiện tại bên tôi có 5 nhân viên sale.
              </div>
            </div>
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex flex-shrink-0 items-center justify-center font-bold text-xs">AI</div>
                <div className="max-w-md rounded-2xl rounded-tl-sm bg-white border border-surface-200 px-4 py-3 text-sm text-surface-700 shadow-sm">
                  Dạ chào anh An! Gói Growth của CoerVora AI hoàn toàn phù hợp với team 5 người. Gói này hỗ trợ tạo đến 3 Chatbot và lưu trữ 10,000 hội thoại mỗi tháng. Anh có muốn em gửi bảng báo giá chi tiết qua email không ạ?
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-md rounded-2xl rounded-br-sm bg-primary-600 px-4 py-3 text-sm text-white shadow-sm">
                Có, gửi giúp tôi. Mà tôi muốn nhân viên trực tiếp chat lại với khách thì có được không?
              </div>
            </div>
            <div className="flex justify-center mt-6 mb-2">
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Khách hàng yêu cầu hỗ trợ phức tạp (Cần Human Takeover)
              </span>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-surface-100 shrink-0">
            <div className="flex items-center gap-3">
              <button className="text-surface-400 hover:text-surface-600 p-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              </button>
              <input type="text" placeholder="Gõ câu trả lời để thay thế Bot..." className="flex-1 border border-surface-200 bg-surface-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all" />
              <button className="bg-gradient-to-r from-primary-600 to-accent-500 text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-primary-500/30 hover:scale-105 transition-transform">
                Gửi
              </button>
            </div>
            <p className="text-[10px] text-surface-400 text-center mt-2 font-medium">Khi bạn gửi tin nhắn, hệ thống sẽ tự động tạm dừng Bot cho hội thoại này.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
