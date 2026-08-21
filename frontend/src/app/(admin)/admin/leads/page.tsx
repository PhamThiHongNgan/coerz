"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LeadStatus = "hot" | "warm" | "cold";
type AdminTab = "users" | "leads" | "knowledge";

interface UserAccount {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  accounts: { provider: string }[];
}

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

const statusConfig: Record<LeadStatus, { label: string; bg: string; dot: string }> = {
  hot: { label: "Hot", bg: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  warm: { label: "Warm", bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  cold: { label: "Cold", bg: "bg-gray-50 text-black border-gray-300", dot: "bg-gray-800" },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");

  useEffect(() => {
    if (!sessionStorage.getItem("admin_auth")) {
      router.push("/admin");
    }
  }, [router]);

  // Tab 1: Users State
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");

  // Tab 2: Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | LeadStatus>("all");
  const [filterSource, setFilterSource] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sortField, setSortField] = useState<"score" | "createdAt">("createdAt");

  // Tab 3: Knowledge Base Upload State
  const [kbTab, setKbTab] = useState<"file" | "url" | "text">("file");
  const [uploadFileState, setUploadFileState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [crawlState, setCrawlState] = useState<"idle" | "crawling" | "success">("idle");
  const [textInput, setTextInput] = useState("");
  const [textState, setTextState] = useState<"idle" | "saving" | "success">("idle");
  const chatbotId = "default_bot";

  // Fetch Users from CSDL
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Lỗi tải người dùng:", err);
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  // Fetch Leads
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
        setLoadingLeads(false);
      }
    }
    loadLeads();
  }, []);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  });

  // Filtered Leads
  const sources = [...new Set(leads.map((l) => l.source))];
  const filteredLeads = leads
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

  // Upload File Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadFileState("uploading");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatbot_id", chatbotId);

    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://localhost:8001";
      const res = await fetch(`${apiBase}/api/v1/ingest/file`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploadFileState("success");
      } else {
        alert("Upload file thất bại.");
        setUploadFileState("error");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến AI Engine server.");
      setUploadFileState("error");
    }
  };

  // Crawl URL Handler
  const handleCrawl = async () => {
    if (!urlInput) return;
    setCrawlState("crawling");
    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://localhost:8001";
      const res = await fetch(`${apiBase}/api/v1/ingest/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbot_id: chatbotId, url: urlInput }),
      });
      if (res.ok) {
        setCrawlState("success");
      } else {
        alert("Có lỗi xảy ra khi crawl URL.");
        setCrawlState("idle");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến AI Engine server.");
      setCrawlState("idle");
    }
  };

  // Manual Text Handler
  const handleTextSave = async () => {
    if (!textInput) return;
    setTextState("saving");
    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://localhost:8001";
      const res = await fetch(`${apiBase}/api/v1/ingest/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbot_id: chatbotId, text: textInput }),
      });
      if (res.ok) {
        setTextState("success");
      } else {
        alert("Có lỗi xảy ra khi lưu văn bản.");
        setTextState("idle");
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến AI Engine server.");
      setTextState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-gray-100 selection:text-black pb-12">
      {/* Top Header */}
      <div className="sticky top-[73px] z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-lg font-black text-white">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">Hệ thống Quản trị Admin</h1>
              <p className="text-xs text-gray-500">CoerZ — Nền tảng hỗ trợ doanh nghiệp</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Về trang chủ
            </Link>
            <button 
              onClick={() => { sessionStorage.removeItem("admin_auth"); router.push("/admin"); }}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-all"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* 3 Main Navigation Tabs */}
        <div className="mx-auto flex max-w-[1400px] px-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "users"
                ? "border-black text-black bg-gray-50/50"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>👤</span>
            <span>Tab 1: Quản lý tài khoản</span>
            <span className="ml-1 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 font-semibold">{users.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "leads"
                ? "border-black text-black bg-gray-50/50"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>📊</span>
            <span>Tab 2: Quản lý Lead</span>
            <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 font-semibold">{leads.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("knowledge")}
            className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition-all ${
              activeTab === "knowledge"
                ? "border-black text-black bg-gray-50/50"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>🧠</span>
            <span>Tab 3: Cập nhật Kho tri thức</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* ========================================================================= */}
        {/* TAB 1: QUẢN LÝ TÀI KHOẢN (ACCOUNTS FROM CSDL) */}
        {/* ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-black">Danh sách Tài khoản người dùng (CSDL)</h2>
                <p className="text-xs text-gray-500 mt-1">Dữ liệu tài khoản đăng ký trực tiếp lấy từ bảng User trong Database</p>
              </div>
              <div className="w-72 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm tài khoản..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-black focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Tài khoản</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500">Email</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Phương thức ĐN</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-center">Xác thực Email</th>
                      <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Mã ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                            <span>Đang tải tài khoản từ CSDL...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.image ? (
                                <img src={user.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-black">{user.name || "Chưa cập nhật tên"}</p>
                                <p className="text-xs text-gray-400">User System Account</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-800">{user.email || "Chưa có email"}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {user.accounts && user.accounts.length > 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                                Google OAuth
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 border border-gray-300">
                                Email / Password
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {user.emailVerified ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
                                ✓ Đã xác thực
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                                Chưa xác thực
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <code className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {user.id.substring(0, 12)}...
                            </code>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500 text-sm">
                          Không tìm thấy tài khoản nào phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: QUẢN LÝ LEADS */}
        {/* ========================================================================= */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {([
                { key: "all" as const, label: "Tất cả Lead", color: "text-gray-900" },
                { key: "hot" as const, label: "Hot Lead", color: "text-red-600" },
                { key: "warm" as const, label: "Warm Lead", color: "text-amber-600" },
                { key: "cold" as const, label: "Cold Lead", color: "text-black" },
              ]).map((c) => (
                <button
                  key={c.key}
                  onClick={() => setFilterStatus(c.key)}
                  className={`text-left p-5 rounded-xl transition-all border ${
                    filterStatus === c.key ? "bg-white border-black shadow-md" : "bg-white border-gray-200 shadow-sm hover:border-gray-300"
                  }`}
                >
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{c.label}</p>
                  <span className={`text-3xl font-bold ${c.color}`}>{counts[c.key]}</span>
                </button>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex-1 min-w-[200px] relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, SĐT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all shadow-sm"
                />
              </div>
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
              >
                <option value="all">Tất cả nguồn</option>
                {sources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as "score" | "createdAt")}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
              >
                <option value="createdAt">Mới nhất</option>
                <option value="score">Điểm cao nhất</option>
              </select>
            </div>

            {/* Main Content Layout */}
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
                      {loadingLeads ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center text-gray-500 text-sm">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                              <span>Đang tải dữ liệu Leads từ Supabase...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <>
                          {filteredLeads.map((lead) => {
                            const sc = statusConfig[lead.status];
                            return (
                              <tr
                                key={lead.id}
                                onClick={() => setSelectedLead(lead)}
                                className={`cursor-pointer transition-colors ${selectedLead?.id === lead.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
                              >
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-gray-100 text-black flex items-center justify-center text-sm font-bold flex-shrink-0">
                                      {lead.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-black truncate">{lead.name}</p>
                                      <p className="text-xs text-gray-500 truncate">{lead.phone}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{lead.source}</span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                  <span className={`text-sm font-bold ${lead.score >= 70 ? "text-red-600" : lead.score >= 40 ? "text-amber-600" : "text-black"}`}>
                                    {lead.score}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                  <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${sc.bg}`}>
                                    {sc.label}
                                  </span>
                                </td>
                                <td className="px-5 py-4">
                                  <span className="text-xs text-gray-700 font-medium">{lead.assignedTo}</span>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredLeads.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-5 py-12 text-center text-gray-500 text-sm">Không tìm thấy Lead nào phù hợp.</td>
                            </tr>
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
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-black text-xl font-bold">
                        {selectedLead.name.charAt(0)}
                      </div>
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

                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-700">Điểm tiềm năng (Lead Score)</span>
                        <span className={`text-lg font-bold ${selectedLead.score >= 70 ? "text-red-600" : selectedLead.score >= 40 ? "text-amber-600" : "text-black"}`}>
                          {selectedLead.score}/100
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${selectedLead.score >= 70 ? "bg-red-500" : selectedLead.score >= 40 ? "bg-amber-500" : "bg-gray-800"}`}
                          style={{ width: `${selectedLead.score}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                        Tin nhắn cuối
                      </p>
                      <p className="text-sm text-gray-800 font-medium">"{selectedLead.lastMessage}"</p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Cập nhật trạng thái</p>
                      <div className="flex gap-2">
                        {(["hot", "warm", "cold"] as LeadStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(selectedLead.id, s)}
                            className={`flex-1 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                              selectedLead.status === s ? `${statusConfig[s].bg} border-current shadow-sm ring-1 ring-current` : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {statusConfig[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center sticky top-[100px] flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-black text-lg">Chi tiết Khách hàng</h4>
                    <p className="text-sm text-gray-500 mt-2 max-w-[220px]">Chọn một khách hàng từ danh sách bên trái để xem thông tin chi tiết.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CẬP NHẬT KHO TRI THỨC (KNOWLEDGE BASE UPLOAD PDF, WORD, EXCEL) */}
        {/* ========================================================================= */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-black">Cập nhật Kho Tri Thức Huấn Luyện Chatbot Agent</h2>
              <p className="text-xs text-gray-500 mt-1">Tải lên các tài liệu định dạng PDF, Word (.doc, .docx), Excel (.xlsx, .xls, .csv) hoặc dán đường dẫn Website để Bot học dữ liệu mới.</p>
            </div>

            {/* Inner Tabs for Knowledge Base Ingestion */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50 px-6 pt-3">
                <button
                  onClick={() => setKbTab("file")}
                  className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${
                    kbTab === "file" ? "border-black text-black bg-white" : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  📁 Upload File (PDF, Word, Excel)
                </button>
                <button
                  onClick={() => setKbTab("url")}
                  className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${
                    kbTab === "url" ? "border-black text-black bg-white" : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  🌐 Crawl Website URL
                </button>
                <button
                  onClick={() => setKbTab("text")}
                  className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors ${
                    kbTab === "text" ? "border-black text-black bg-white" : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  ✍️ Nhập Văn bản Thô
                </button>
              </div>

              <div className="p-8">
                {/* File Upload Option */}
                {kbTab === "file" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-black text-base">Tải lên tài liệu huấn luyện</h3>
                    <p className="text-xs text-gray-500">Hỗ trợ các định dạng PDF, DOC, DOCX, XLSX, XLS, CSV, TXT (Dung lượng tối đa 15MB/file).</p>

                    <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xlsx,.xls,.csv,.txt"
                        onChange={handleFileUpload}
                        disabled={uploadFileState === "uploading"}
                      />
                      {uploadFileState === "uploading" ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                          <span className="font-bold text-sm text-black">Đang đọc tài liệu và phân tích Vector...</span>
                        </div>
                      ) : uploadFileState === "success" ? (
                        <div className="flex flex-col items-center gap-2 text-green-600">
                          <div className="text-4xl">✓</div>
                          <span className="font-bold text-base">Upload thành công! Chatbot đã học tài liệu {selectedFile?.name}.</span>
                          <span className="text-xs text-gray-500">Nhấn vào đây để tải lên thêm tài liệu khác.</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="text-4xl text-gray-400">📄</div>
                          <span className="font-bold text-sm text-black">Kéo thả file vào đây hoặc nhấn để chọn file</span>
                          <span className="text-xs text-gray-400">PDF, Word (.docx), Excel (.xlsx), Text (.txt)</span>
                        </div>
                      )}
                    </label>
                  </div>
                )}

                {/* URL Crawl Option */}
                {kbTab === "url" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-black text-base">Crawl toàn bộ nội dung Website</h3>
                    <p className="text-xs text-gray-500">Nhập đường dẫn trang web để AI Engine thu thập tri thức tự động.</p>

                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://doanhnghiep.com/san-pham"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:outline-none"
                      />
                      <button
                        onClick={handleCrawl}
                        disabled={!urlInput || crawlState === "crawling"}
                        className="bg-black text-white font-bold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        {crawlState === "crawling" ? "Đang Crawl..." : "Bắt đầu Crawl"}
                      </button>
                    </div>

                    {crawlState === "success" && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-bold">
                        ✓ Đã hoàn tất Crawl dữ liệu từ URL! Chatbot đã ghi nhận tri thức mới.
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Text Option */}
                {kbTab === "text" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-black text-base">Nhập Văn bản Thô / Q&A</h3>
                    <p className="text-xs text-gray-500">Dán câu hỏi - trả lời thường gặp hoặc quy định dịch vụ.</p>

                    <textarea
                      rows={6}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Nhập nội dung quy định, báo giá hoặc thông tin dịch vụ..."
                      className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-black focus:outline-none"
                    ></textarea>

                    <button
                      onClick={handleTextSave}
                      disabled={!textInput || textState === "saving"}
                      className="bg-black text-white font-bold px-6 py-2.5 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                    >
                      {textState === "saving" ? "Đang lưu..." : "Lưu vào Kho tri thức"}
                    </button>

                    {textState === "success" && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-bold">
                        ✓ Đã lưu văn bản vào kho tri thức thành công!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
