"use client";

import Link from "next/link";
import { useState } from "react";

import { useTheme } from "@/providers/ThemeProvider";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const { accent, setAccent } = useTheme();

  const tabs = [
    { id: "account", name: "Tài khoản & Hồ sơ", icon: "👤" },
    { id: "security", name: "Bảo mật", icon: "🔒" },
    { id: "appearance", name: "Giao diện", icon: "🎨" },
    { id: "notifications", name: "Thông báo", icon: "🔔" },
    { id: "billing", name: "Gói & Thanh toán", icon: "💳" },
    { id: "api", name: "Tích hợp & API", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen pb-12 bg-primary-50/30 text-surface-900 transition-colors duration-300">
      {/* Top Bar */}
      <div className="sticky top-[73px] z-40 border-b backdrop-blur-xl border-primary-100/60 bg-white/80 transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar Menu */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                ? 'bg-white text-primary-600 shadow-md border border-primary-100'
                : 'text-surface-600 hover:bg-surface-50'
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="rounded-[2rem] border p-6 sm:p-10 shadow-xl backdrop-blur-md transition-all duration-300 border-white bg-white/60 shadow-primary-900/5">

            {/* TAB: TÀI KHOẢN */}
            {activeTab === "account" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-xl font-bold mb-8">Thông tin hồ sơ</h3>

                <div className="flex items-center gap-6 mb-10">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center text-3xl font-black shadow-lg">
                    AD
                  </div>
                  <div>
                    <button className="rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition hover:scale-105 bg-white border border-surface-200 text-surface-700 hover:bg-surface-50">Tải ảnh mới</button>
                    <button className="ml-4 text-sm text-red-500 font-bold hover:text-red-600">Xóa ảnh</button>
                    <p className="mt-2 text-xs text-surface-500">JPG, GIF hoặc PNG. Tối đa 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-surface-700">Họ và tên</label>
                    <input type="text" defaultValue="Admin User" className="block w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all bg-white border-surface-200 text-surface-900 focus:border-primary-500 border" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-surface-700">Email đăng nhập</label>
                    <input type="email" disabled defaultValue="admin@company.com" className="block w-full rounded-xl px-4 py-3 text-sm cursor-not-allowed bg-surface-100 border-surface-200 text-surface-500 border" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-surface-700">Tên doanh nghiệp / Tổ chức</label>
                    <input type="text" defaultValue="Tech Solutions JSC" className="block w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all bg-white border-surface-200 text-surface-900 focus:border-primary-500 border" />
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-red-100/20">
                  <h4 className="text-red-500 font-bold mb-2">Vùng nguy hiểm (Danger Zone)</h4>
                  <p className="text-sm mb-4 text-surface-500">Khi xóa tài khoản, toàn bộ dữ liệu Chatbot, lịch sử hội thoại và kiến thức đã học sẽ bị xóa vĩnh viễn.</p>
                  <button className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 font-bold px-6 py-2.5 hover:bg-red-500 hover:text-white transition-colors">Xóa tài khoản</button>
                </div>
              </div>
            )}

            {/* TAB: BẢO MẬT */}
            {activeTab === "security" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-xl font-bold mb-8">Bảo mật tài khoản</h3>

                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-surface-700">Mật khẩu hiện tại</label>
                    <input type="password" placeholder="••••••••" className="block w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all bg-white border-surface-200 text-surface-900 focus:border-primary-500 border" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-surface-700">Mật khẩu mới</label>
                    <input type="password" placeholder="Mật khẩu mới" className="block w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all bg-white border-surface-200 text-surface-900 focus:border-primary-500 border" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-surface-700">Xác nhận mật khẩu mới</label>
                    <input type="password" placeholder="Nhập lại mật khẩu mới" className="block w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all bg-white border-surface-200 text-surface-900 focus:border-primary-500 border" />
                  </div>
                  <button className="rounded-xl bg-surface-800 text-white font-bold px-6 py-3 hover:bg-surface-700 transition">Cập nhật mật khẩu</button>
                </div>

                <div className="mt-12 pt-8 border-t border-surface-200/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold mb-1">Xác thực 2 bước (2FA)</h4>
                      <p className="text-sm text-surface-500">Bảo vệ tài khoản bằng mã xác nhận qua ứng dụng Authenticator.</p>
                    </div>
                    <button className="rounded-full bg-green-100 text-green-700 px-4 py-2 text-sm font-bold shadow-sm">Bật 2FA</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GIAO DIỆN */}
            {activeTab === "appearance" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-xl font-bold mb-8">Tùy chỉnh giao diện hệ thống</h3>

                <div>
                  <h4 className="font-semibold mb-4">Màu sắc chủ đạo (Accent Color)</h4>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { id: 'blue', color: 'bg-[#3b82f6]' },
                      { id: 'purple', color: 'bg-[#a855f7]' },
                      { id: 'green', color: 'bg-[#22c55e]' },
                      { id: 'orange', color: 'bg-[#f97316]' },
                      { id: 'red', color: 'bg-[#ef4444]' },
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => setAccent(c.id as any)}
                        className={`h-12 w-12 rounded-full ${c.color} shadow-md flex items-center justify-center transition-transform hover:scale-110 ${accent === c.id ? 'ring-4 ring-offset-2 ring-surface-300 scale-110' : ''}`}
                      >
                        {accent === c.id && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-surface-500">Màu này sẽ được áp dụng cho các nút bấm và thành phần nổi bật trong Dashboard.</p>
                </div>
              </div>
            )}

            {/* TAB: THÔNG BÁO */}
            {activeTab === "notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-xl font-bold mb-8">Tùy chọn thông báo</h3>

                <div className="space-y-6">
                  {[
                    { title: "Thông báo có khách chat mới", desc: "Nhận thông báo khi có khách hàng cần gặp nhân viên hỗ trợ (Human Takeover)." },
                    { title: "Báo cáo hiệu suất hàng tuần", desc: "Gửi email tổng hợp số lượng hội thoại và tỷ lệ chuyển đổi vào mỗi sáng thứ Hai." },
                    { title: "Cảnh báo vượt giới hạn", desc: "Thông báo khi bạn sắp hết số lượng hội thoại trong tháng của gói dịch vụ." },
                    { title: "Cập nhật tính năng", desc: "Nhận tin tức về các tính năng AI mới nhất của CoerVora." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between border-b border-surface-200/20 pb-6">
                      <div className="pr-8">
                        <h4 className="font-bold mb-1">{item.title}</h4>
                        <p className="text-sm text-surface-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked={idx !== 3} />
                        <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: BILLING */}
            {activeTab === "billing" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h3 className="text-xl font-bold mb-8">Gói Dịch Vụ & Thanh Toán</h3>

                <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 p-8 text-white shadow-xl shadow-primary-500/30 mb-8 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                  </div>

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-bold mb-4 backdrop-blur-sm border border-white/30">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                        Gói Starter (Đang hoạt động)
                      </div>
                      <div className="text-sm text-primary-50 font-medium space-y-1">
                        <p>✓ 1 Chatbot AI</p>
                        <p>✓ 1,000 cuộc hội thoại/tháng</p>
                        <p>✓ Huấn luyện dữ liệu 50MB</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-primary-100 mb-1">Chu kỳ tiếp theo: 28/06/2026</p>
                      <button className="bg-white text-primary-600 font-black px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform">Nâng cấp gói (Growth)</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-4">Lịch sử giao dịch</h4>
                  <div className="rounded-xl border overflow-hidden border-surface-200 bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-surface-200 bg-surface-50">
                        <tr>
                          <th className="p-4 font-semibold">Ngày</th>
                          <th className="p-4 font-semibold">Mô tả</th>
                          <th className="p-4 font-semibold">Số tiền</th>
                          <th className="p-4 font-semibold">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-200/20">
                        <tr>
                          <td className="p-4">28/05/2026</td>
                          <td className="p-4 font-medium">Gia hạn gói Starter</td>
                          <td className="p-4">0đ (Dùng thử)</td>
                          <td className="p-4"><span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold">Thành công</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: API */}
            {activeTab === "api" && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Tích hợp & API Keys</h3>
                  <button className="bg-primary-100 text-primary-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-primary-200 transition">Tài liệu API</button>
                </div>

                <div className="mb-10">
                  <h4 className="font-bold mb-2">Secret API Key</h4>
                  <p className="text-sm mb-4 text-surface-500">Sử dụng key này để tích hợp CoerVora Chatbot vào hệ thống CRM nội bộ hoặc backend của bạn.</p>

                  <div className="flex items-center gap-3">
                    <input type="password" disabled defaultValue="sk-coervora-1234567890abcdef" className="flex-1 rounded-xl px-4 py-3 font-mono text-sm bg-surface-100 border border-surface-200 text-surface-700" />
                    <button className="bg-surface-800 text-white px-5 py-3 rounded-xl font-bold hover:bg-surface-700 transition shadow-sm">Copy</button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-4">Kết nối các nền tảng (Integrations)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border flex items-center justify-between border-surface-200 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">Z</div>
                        <div>
                          <p className="font-bold text-sm">Zalo OA</p>
                          <p className="text-xs text-green-500 font-semibold">Đã kết nối</p>
                        </div>
                      </div>
                      <button className="text-sm font-bold text-surface-400 hover:text-red-500 transition">Ngắt kết nối</button>
                    </div>
                    <div className="p-5 rounded-2xl border flex items-center justify-between border-surface-200 bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">f</div>
                        <div>
                          <p className="font-bold text-sm">Facebook Messenger</p>
                          <p className="text-xs text-surface-500">Chưa kết nối</p>
                        </div>
                      </div>
                      <button className="text-sm font-bold text-primary-600 hover:text-primary-700 transition">Kết nối</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
