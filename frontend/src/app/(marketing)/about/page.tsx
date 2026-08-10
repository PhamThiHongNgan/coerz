"use client";

import { useState } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "modules">("overview");
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  const targetBusinesses = [
    { name: "Du Học & Giáo Dục", icon: "🎓", desc: "Tư vấn lộ trình, visa du học, thủ tục nhập học và quản lý học viên." },
    { name: "Trung tâm đào tạo", icon: "🏫", desc: "Tuyển sinh lớp chuyên đề, kỹ năng, ngoại ngữ và cấp chứng chỉ." },
    { name: "Bất động sản", icon: "🏢", desc: "Giới thiệu dự án, lọc nhu cầu tài chính, vị trí và đặt lịch xem nhà." },
    { name: "Dịch vụ y tế & Làm đẹp", icon: "🩺", desc: "Hỗ trợ đặt lịch khám, spa, thẩm mỹ viện và báo giá liệu trình." },
    { name: "Bán lẻ & E-commerce", icon: "🛍️", desc: "Gợi ý sản phẩm, hỗ trợ chốt đơn, cứu giỏ hàng và CSKH 24/7." },
    { name: "Đa ngành nghề khác", icon: "🧩", desc: "Khả năng tùy biến cao, thích ứng với mọi quy trình kinh doanh." },
  ];

  const modules = [
    {
      id: 1,
      name: "1. AI Chat Agent",
      icon: "🤖",
      desc: "Trung tâm giao tiếp của hệ thống bằng ngôn ngữ tự nhiên.",
      details: {
        function: "AI giao tiếp trực tiếp với khách hàng bằng ngôn ngữ tự nhiên linh hoạt. Không trả lời rập khuôn theo kịch bản cố định mà kết hợp mô hình ngôn ngữ lớn (LLM) với Kho tri thức doanh nghiệp để đưa ra phản hồi chính xác nhất.",
        tasks: [
          "Tự động phản hồi khách hàng 24/7",
          "Gợi ý sản phẩm thông minh dựa trên ngữ cảnh",
          "Chủ động đặt câu hỏi dẫn dắt hội thoại",
        ]
      }
    },
    {
      id: 2,
      name: "2. Kho tri thức (Knowledge Base)",
      icon: "📚",
      desc: "Quản lý toàn bộ tri thức của doanh nghiệp cung cấp cho AI học.",
      details: {
        function: "Đây là 'bộ não' cung cấp thông tin cho AI. AI sẽ tìm kiếm thông tin tại đây trước khi trả lời khách hàng để đảm bảo câu trả lời luôn chính xác và nhất quán với chính sách doanh nghiệp.",
        tasks: [
          "Lưu trữ hồ sơ giới thiệu công ty",
          "Quản lý danh mục dịch vụ, bảng giá, khóa học",
          "Bộ câu hỏi thường gặp (FAQ) và chính sách",
        ]
      }
    },
    {
      id: 3,
      name: "3. Thu thập Lead (Lead Collection)",
      icon: "🎯",
      desc: "Tự động khai thác và thu thập thông tin khách hàng qua hội thoại.",
      details: {
        function: "Trong quá trình hội thoại, AI sẽ tự động phân tích và trích xuất thông tin của người dùng. Nếu phát hiện thiếu thông tin, AI sẽ đặt câu hỏi lồng ghép tự nhiên để hoàn thiện hồ sơ.",
        tasks: [
          "Thu thập Họ tên, Email, Số điện thoại",
          "Khai thác nhu cầu cụ thể của khách hàng",
          "Xác định ngân sách và thời gian mong muốn",
        ]
      }
    },
    {
      id: 4,
      name: "4. Tích hợp CRM",
      icon: "🔌",
      desc: "Đồng bộ hóa dữ liệu khách hàng tiềm năng trực tiếp vào CRM.",
      details: {
        function: "Ngay khi AI thu thập đủ các thông tin cốt lõi, hệ thống sẽ tự động tạo một Lead mới trên CRM để đội ngũ kinh doanh tiếp quản xử lý ngay lập tức.",
        tasks: [
          "Tự động sinh Mã khách hàng duy nhất",
          "Tự động phân bổ nhân sự phụ trách",
          "Đính kèm toàn bộ lịch sử trò chuyện",
        ]
      }
    },
    {
      id: 5,
      name: "5. Chấm điểm Lead (Lead Scoring)",
      icon: "⭐",
      desc: "Hệ thống AI tự động chấm điểm và phân loại khách hàng tiềm năng.",
      details: {
        function: "Sử dụng thuật toán AI để phân tích chất lượng của Lead dựa trên các dữ liệu thu thập được. Giúp đội ngũ ưu tiên chăm sóc khách hàng có khả năng chốt cao.",
        tasks: [
          "Chấm điểm theo tiêu chí: SĐT, Email, Ngân sách...",
          "Phân loại Hot, Warm, Cold tự động",
          "Cảnh báo Lead ưu tiên cho quản lý",
        ]
      }
    },
    {
      id: 6,
      name: "6. Tự động hóa Email",
      icon: "✉️",
      desc: "Gửi Email chăm sóc cá nhân hóa sau khi kết thúc trò chuyện.",
      details: {
        function: "Hệ thống tự động kích hoạt chiến dịch gửi email dựa trên nội dung khách hàng vừa trao đổi. Giúp giữ chân khách hàng và cung cấp tài liệu hữu ích.",
        tasks: [
          "Gửi thư cảm ơn khách hàng đã quan tâm",
          "Đính kèm tài liệu cá nhân hóa (Báo giá, Brochure)",
          "Gửi link đăng ký lịch hẹn tư vấn",
        ]
      }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 font-sans selection:bg-gray-100 selection:text-black">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-white border-b border-gray-200 px-6 pt-32 pb-24 text-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>

        <div className="relative mx-auto max-w-5xl z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-black">
            Nền tảng AI Agent Hỗ trợ Quản lý & Chăm sóc khách hàng <span className="text-black">CoerZ</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 leading-relaxed font-light">
            Một giải pháp tối ưu kết hợp Trí tuệ nhân tạo (AI Agent) và Hệ quản trị quan hệ khách hàng (CRM) dưới dạng nền tảng SaaS linh hoạt, giúp tự động hóa quy trình chăm sóc và gia tăng tỷ lệ chuyển đổi.
          </p>

          {/* Action Tabs */}
          <div className="mt-12 flex justify-center p-1 bg-gray-100 rounded-lg max-w-lg mx-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
                activeTab === "overview" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
                activeTab === "architecture" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Kiến trúc
            </button>
            <button
              onClick={() => setActiveTab("modules")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${
                activeTab === "modules" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Modules
            </button>
          </div>
        </div>
      </section>

      {/* Tab content area */}
      <div className="mx-auto max-w-7xl px-6 mt-16">
        
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === "overview" && (
          <div className="space-y-16 animate-in fade-in duration-500">
            {/* System Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
              <div className="grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-8">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Giới thiệu hệ thống</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-black mt-3 mb-6">
                    Hệ thống AI Agent tích hợp CRM thế hệ mới
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg font-light">
                    Hệ thống AI Agent được xây dựng nhằm tự động hóa hoạt động tư vấn, chăm sóc khách hàng và quản lý dữ liệu. Khác với chatbot kịch bản truyền thống, CoerZ có khả năng hiểu ngữ cảnh, phân tích nhu cầu và chủ động lưu thông tin khách hàng, chuyển giao mượt mà cho nhân viên.
                  </p>
                </div>
                <div className="md:col-span-4 bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
                  <div className="text-4xl mb-4">☁️</div>
                  <h4 className="font-bold text-black text-lg">Mô hình SaaS Platform</h4>
                  <p className="text-sm text-gray-500 mt-3 font-light leading-relaxed">
                    Cấu trúc đa khách hàng (Multi-tenant) cho phép nhiều doanh nghiệp sử dụng chung hệ thống lõi nhưng vẫn đảm bảo tách biệt dữ liệu hoàn toàn.
                  </p>
                </div>
              </div>
            </div>

            {/* Target Businesses */}
            <div>
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-black">Các Doanh Nghiệp Phù Hợp</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {targetBusinesses.map((biz, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-4">{biz.icon}</div>
                    <h4 className="font-bold text-black text-lg mb-2">{biz.name}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-light">{biz.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ===================== TAB 2: ARCHITECTURE ===================== */}
        {activeTab === "architecture" && (
          <div className="space-y-16 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
              <h3 className="text-2xl font-bold text-black text-center mb-12">Luồng Hoạt Động Của Hệ Thống</h3>
              
              <div className="relative max-w-3xl mx-auto space-y-8">
                {/* Connecting Line */}
                <div className="absolute left-8 top-8 bottom-8 w-px bg-gray-200 md:left-1/2"></div>
                
                {[
                  { title: "Khách hàng truy cập", desc: "Tương tác ban đầu trên Website hoặc Landing Page thông qua Chat Widget." },
                  { title: "AI Phân tích & Phản hồi", desc: "Truy xuất cơ sở tri thức (Knowledge Base) để giải đáp thắc mắc theo thời gian thực." },
                  { title: "Thu thập dữ liệu", desc: "Khai thác tự nhiên các thông tin cá nhân (Tên, SĐT, Email) và nhu cầu cụ thể." },
                  { title: "Tạo Lead & CRM", desc: "Hệ thống ghi nhận Lead, chấm điểm tiềm năng và phân bổ cho nhân sự phù hợp." },
                  { title: "Nuôi dưỡng tự động", desc: "Gửi Email chăm sóc cá nhân hóa ngay sau khi kết thúc cuộc hội thoại." },
                ].map((step, idx) => (
                  <div key={idx} className={`relative flex items-center gap-6 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`hidden md:block w-1/2 ${idx % 2 === 0 ? 'text-right pr-12' : 'pl-12'}`}>
                       <h4 className="font-bold text-black text-lg">{step.title}</h4>
                       <p className="text-gray-500 mt-1 font-light text-sm">{step.desc}</p>
                    </div>
                    
                    <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-black rounded-full border-4 border-white transform -translate-x-1/2 shadow-sm"></div>
                    
                    <div className={`md:hidden pl-16`}>
                       <h4 className="font-bold text-black text-lg">{step.title}</h4>
                       <p className="text-gray-500 mt-1 font-light text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: MODULES ===================== */}
        {activeTab === "modules" && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-black">Cấu Trúc Các Module</h3>
              <p className="text-gray-500 mt-2 font-light">Hệ sinh thái công cụ hỗ trợ toàn diện vòng đời khách hàng</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(selectedModule === mod.id ? null : mod.id)}
                  className={`bg-white rounded-xl border p-6 cursor-pointer transition-all ${
                    selectedModule === mod.id
                      ? "border-black shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl border border-gray-100">
                      {mod.icon}
                    </div>
                    <h4 className="font-bold text-black">{mod.name}</h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed font-light">
                    {mod.desc}
                  </p>

                  {/* Expandable Content */}
                  {selectedModule === mod.id && (
                    <div className="mt-6 pt-6 border-t border-gray-100 text-sm">
                      <p className="text-gray-700 leading-relaxed font-light mb-4">{mod.details.function}</p>
                      <ul className="space-y-2">
                        {mod.details.tasks.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2 text-gray-600 font-light">
                            <span className="text-gray-800 mt-0.5">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


