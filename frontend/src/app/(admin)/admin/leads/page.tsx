"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LeadStatus = "hot" | "warm" | "cold";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  score: number;
  interest: string;
  assignedTo: string;
  createdAt: string;
  lastMessage: string;
}

const MOCK_LEADS: Lead[] = [
  { id: "L001", name: "Nguyễn Văn An", email: "an.nv@gmail.com", phone: "0901234567", source: "Du Học Bình Dương", status: "hot", score: 85, interest: "Du học Úc - Lớp 10", assignedTo: "Trần Hoàng Duy", createdAt: "2026-07-28 09:15", lastMessage: "Em muốn biết thêm về học phí" },
  { id: "L002", name: "Trần Thị Mai", email: "mai.tt@yahoo.com", phone: "0912345678", source: "Việt Mỹ English", status: "warm", score: 55, interest: "IELTS 6.5", assignedTo: "Trần Tấn Phúc", createdAt: "2026-07-28 08:30", lastMessage: "Lịch học như thế nào?" },
  { id: "L003", name: "Lê Hoàng Nam", email: "nam.lh@outlook.com", phone: "0923456789", source: "Du Học Bình Dương", status: "hot", score: 92, interest: "Du học Canada - Đại học", assignedTo: "Phạm Đăng Hoàng Hiếu", createdAt: "2026-07-27 16:45", lastMessage: "Cho em xin lịch hẹn tư vấn" },
  { id: "L004", name: "Phạm Minh Tuấn", email: "tuan.pm@gmail.com", phone: "0934567890", source: "Shop ABC", status: "cold", score: 20, interest: "Laptop gaming", assignedTo: "Phạm Thị Hồng Ngân", createdAt: "2026-07-27 14:20", lastMessage: "Xem thử thôi" },
  { id: "L005", name: "Võ Thị Hồng", email: "hong.vt@gmail.com", phone: "0945678901", source: "Du Học Bình Dương", status: "warm", score: 60, interest: "Du học Nhật - Ngôn ngữ", assignedTo: "Trần Hoàng Duy", createdAt: "2026-07-27 11:00", lastMessage: "Chi phí khoảng bao nhiêu?" },
  { id: "L006", name: "Đặng Quốc Bảo", email: "bao.dq@gmail.com", phone: "0956789012", source: "Việt Mỹ English", status: "hot", score: 78, interest: "TOEIC 700+", assignedTo: "Trần Tấn Phúc", createdAt: "2026-07-26 19:30", lastMessage: "Đăng ký lớp khai giảng gần nhất" },
  { id: "L007", name: "Huỳnh Thanh Tâm", email: "tam.ht@gmail.com", phone: "0967890123", source: "Shop ABC", status: "warm", score: 45, interest: "Điện thoại Samsung", assignedTo: "Chưa gán", createdAt: "2026-07-26 10:15", lastMessage: "Có trả góp không?" },
  { id: "L008", name: "Ngô Bích Ngọc", email: "ngoc.nb@gmail.com", phone: "0978901234", source: "Du Học Bình Dương", status: "cold", score: 15, interest: "Tìm hiểu chung", assignedTo: "Chưa gán", createdAt: "2026-07-25 08:00", lastMessage: "Cho mình hỏi chút" },
];

const statusConfig: Record<LeadStatus, { label: string; bg: string; dot: string }> = {
  hot: { label: "Hot", bg: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  warm: { label: "Warm", bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  cold: { label: "Cold", bg: "bg-gray-50 text-black border-gray-300", dot: "bg-gray-800" },
};

export default function AdminLeadsPage() {
  const router = useRouter();
  
  useEffect(() => {
    if (!sessionStorage.getItem("admin_auth")) {
      router.push("/admin");
    }
  }, [router]);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | LeadStatus>("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sortField, setSortField] = useState<"score" | "createdAt">("createdAt");

  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        }
      } catch (error) {
        console.error("Lỗi tải leads:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLeads();
  }, []);

  const sources = [...new Set(leads.map((l) => l.source))];

  const filtered = leads
    .filter((l) => filterStatus === "all" || l.status === filterStatus)
    .filter((l) => filterSource === "all" || l.source === filterSource)
    .filter((l) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.phone.includes(q);
    })
    .sort((a, b) => (sortField === "score" ? b.score - a.score : b.createdAt.localeCompare(a.createdAt)));

  const counts = { 
    all: leads.length, 
    hot: leads.filter((l) => l.status === "hot").length, 
    warm: leads.filter((l) => l.status === "warm").length, 
    cold: leads.filter((l) => l.status === "cold").length 
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    // Optimistic update
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status });

    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái lead:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-gray-100 selection:text-black pb-12">
      {/* Top Bar */}
      <div className="sticky top-[73px] z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-black">Quản lý Lead</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mr-2">Về trang chủ</Link>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {([
            { key: "all" as const, label: "Tất cả Lead", color: "text-gray-900" },
            { key: "hot" as const, label: "Hot Lead", color: "text-red-600" },
            { key: "warm" as const, label: "Warm Lead", color: "text-amber-600" },
            { key: "cold" as const, label: "Cold Lead", color: "text-black" },
          ]).map((c) => (
            <button key={c.key} onClick={() => setFilterStatus(c.key)} className={`text-left p-5 rounded-xl transition-all border ${filterStatus === c.key ? "bg-white border-black shadow-md" : "bg-white border-gray-200 shadow-sm hover:border-gray-300"}`}>
               <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{c.label}</p>
               <span className={`text-3xl font-bold ${c.color}`}>{counts[c.key]}</span>
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex-1 min-w-[200px] relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Tìm theo tên, email, SĐT..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm" />
          </div>
          <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-black shadow-sm">
            <option value="all">Tất cả nguồn</option>
            {sources.map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
          <select value={sortField} onChange={(e) => setSortField(e.target.value as "score" | "createdAt")} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-black shadow-sm">
            <option value="createdAt">Mới nhất</option>
            <option value="score">Điểm cao nhất</option>
          </select>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Khách hàng</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Nguồn</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">Điểm</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-center">Trạng thái</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Phụ trách</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-gray-500 text-sm">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                          <span>Đang tải dữ liệu từ Supabase...</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filtered.map((lead) => {
                        const sc = statusConfig[lead.status];
                        return (
                          <tr key={lead.id} onClick={() => setSelectedLead(lead)} className={`cursor-pointer transition-colors ${selectedLead?.id === lead.id ? "bg-gray-50" : "hover:bg-gray-50"}`}>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-gray-100 text-black flex items-center justify-center text-sm font-bold flex-shrink-0">{lead.name.charAt(0)}</div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-black truncate">{lead.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{lead.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4"><span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{lead.source}</span></td>
                            <td className="px-5 py-4 text-center"><span className={`text-sm font-bold ${lead.score >= 70 ? "text-red-600" : lead.score >= 40 ? "text-amber-600" : "text-black"}`}>{lead.score}</span></td>
                            <td className="px-5 py-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${sc.bg}`}>
                                {sc.label}
                              </span>
                            </td>
                            <td className="px-5 py-4"><span className="text-xs text-gray-700 font-medium">{lead.assignedTo}</span></td>
                          </tr>
                        );
                      })}
                      {filtered.length === 0 && (
                        <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-500 text-sm">Không tìm thấy Lead nào phù hợp.</td></tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Detail Panel */}
          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-[100px]">
                <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-black text-xl font-bold">{selectedLead.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-black truncate">{selectedLead.name}</h3>
                    <p className="text-xs text-gray-500">Mã: {selectedLead.id}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold uppercase ${statusConfig[selectedLead.status].bg}`}>
                    {statusConfig[selectedLead.status].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-8">
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Email</p><p className="text-sm font-medium text-gray-900 truncate">{selectedLead.email}</p></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Số điện thoại</p><p className="text-sm font-medium text-gray-900">{selectedLead.phone}</p></div>
                  <div className="col-span-2"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Quan tâm</p><p className="text-sm font-medium text-gray-900">{selectedLead.interest}</p></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Nguồn</p><p className="text-sm font-medium text-gray-900">{selectedLead.source}</p></div>
                  <div><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Phụ trách</p><p className="text-sm font-medium text-gray-900">{selectedLead.assignedTo}</p></div>
                  <div className="col-span-2"><p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Thời gian tạo</p><p className="text-sm font-medium text-gray-900">{selectedLead.createdAt}</p></div>
                </div>

                {/* Score Bar */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-700">Điểm tiềm năng (Lead Score)</span>
                    <span className={`text-lg font-bold ${selectedLead.score >= 70 ? "text-red-600" : selectedLead.score >= 40 ? "text-amber-600" : "text-black"}`}>{selectedLead.score}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${selectedLead.score >= 70 ? "bg-red-500" : selectedLead.score >= 40 ? "bg-amber-500" : "bg-gray-800"}`} style={{ width: `${selectedLead.score}%` }}></div>
                  </div>
                </div>

                {/* Last Message */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    Tin nhắn cuối
                  </p>
                  <p className="text-sm text-gray-800 font-medium">"{selectedLead.lastMessage}"</p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Cập nhật trạng thái</p>
                  <div className="flex gap-2">
                    {(["hot", "warm", "cold"] as LeadStatus[]).map((s) => (
                      <button key={s} onClick={() => updateStatus(selectedLead.id, s)} className={`flex-1 py-1.5 rounded-md text-xs font-semibold border transition-all ${selectedLead.status === s ? `${statusConfig[s].bg} border-current shadow-sm ring-1 ring-current` : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        {statusConfig[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center sticky top-[100px] flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h4 className="font-bold text-black text-lg">Chi tiết Khách hàng</h4>
                <p className="text-sm text-gray-500 mt-2 max-w-[220px]">Chọn một khách hàng từ danh sách bên trái để xem thông tin chi tiết.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


