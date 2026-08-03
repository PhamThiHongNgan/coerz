"use client";

import Link from "next/link";
import { useState } from "react";

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState("url");
  const [crawlState, setCrawlState] = useState<'idle' | 'crawling' | 'success'>('idle');
  const [fileUploadState, setFileUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [textState, setTextState] = useState<'idle' | 'saving' | 'success'>('idle');
  const [textInput, setTextInput] = useState('');
  const chatbotId = "test_bot_123"; // Thay bằng ID thực tế của chatbot
  const handleCrawl = async () => {
    if (!urlInput) return;
    setCrawlState('crawling');
    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8001' : `http://${window.location.hostname}:8001`);
      const res = await fetch(`${apiBase}/api/v1/ingest/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbot_id: chatbotId, url: urlInput }),
      });
      if (res.ok) {
        setCrawlState('success');
      } else {
        alert("Có lỗi xảy ra khi crawl URL.");
        setCrawlState('idle');
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến AI Engine.");
      setCrawlState('idle');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFileUploadState('uploading');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatbot_id', chatbotId);

    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8001' : `http://${window.location.hostname}:8001`);
      const res = await fetch(`${apiBase}/api/v1/ingest/file`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setFileUploadState('success');
      } else {
        alert("Upload file thất bại.");
        setFileUploadState('error');
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến AI Engine.");
      setFileUploadState('error');
    }
  };

  const handleTextSave = async () => {
    if (!textInput) return;
    setTextState('saving');
    try {
      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8001' : `http://${window.location.hostname}:8001`);
      const res = await fetch(`${apiBase}/api/v1/ingest/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbot_id: chatbotId, text: textInput }),
      });
      if (res.ok) {
        setTextState('success');
      } else {
        alert("Có lỗi xảy ra khi lưu văn bản.");
        setTextState('idle');
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến AI Engine.");
      setTextState('idle');
    }
  };

  const copyToClipboard = () => {
    const scriptText = `<script src="https://coerz.ai/widget.js" data-bot-id="bot_${Math.random().toString(36).substring(7)}"></script>`;
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
      try { document.execCommand('copy'); } catch (err) { console.error('Copy failed', err); }
      textArea.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderEmbedScript = (onReset: () => void, resetText: string, title: string) => (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-500 text-white p-2 rounded-full">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
          <h4 className="font-bold text-green-900 text-lg">{title}</h4>
          <p className="text-sm text-green-700">Dữ liệu đã được học. Chatbot của bạn đã sẵn sàng để tích hợp.</p>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-xl border border-green-100 overflow-hidden">
        <div className="bg-surface-50 px-4 py-3 border-b border-surface-100 flex justify-between items-center">
          <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">Mã Tích Hợp (Embed Script)</span>
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-800 transition"
          >
            {copied ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Đã Copy</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> Copy Code</>
            )}
          </button>
        </div>
        <div className="p-4 bg-surface-900 overflow-x-auto">
          <code className="text-sm text-green-400 whitespace-pre">
            {`<script src="https://coerz.ai/widget.js" data-bot-id="bot_c8f2b1a"></script>`}
          </code>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <h5 className="font-bold text-black text-sm mb-1 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Hướng dẫn cài đặt
        </h5>
        <p className="text-sm text-black mb-2">
          Copy đoạn mã trên và dán vào <strong>thẻ <code>&lt;head&gt;</code></strong> hoặc <strong>trước thẻ đóng <code>&lt;/body&gt;</code></strong> trong file chính của trang web của bạn:
        </p>
        <ul className="list-disc list-inside mt-2 text-sm text-black space-y-1">
          <li><strong>HTML thuần:</strong> File <code>index.html</code></li>
          <li><strong>Next.js (App Router):</strong> File <code>app/layout.tsx</code></li>
          <li><strong>Next.js (Pages Router):</strong> File <code>pages/_document.tsx</code></li>
          <li><strong>React/Vite:</strong> File <code>index.html</code></li>
          <li><strong>Wordpress:</strong> Dán vào <code>header.php</code> hoặc dùng plugin <em>Insert Headers and Footers</em></li>
        </ul>
        <button 
          onClick={onReset}
          className="mt-6 px-5 py-2 bg-white text-surface-700 font-bold text-sm border border-surface-200 rounded-xl hover:bg-surface-50 transition shadow-sm"
        >
          {resetText}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary-50/30 pb-12">
      {/* Top Bar */}
      <div className="sticky top-[73px] z-40 border-b border-primary-100/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-surface-400 hover:text-primary-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-surface-900">Knowledge Base</h1>
              <p className="text-sm text-surface-500">Quản lý nguồn dữ liệu huấn luyện Bot</p>
            </div>
          </div>
          <button className="bg-surface-800 text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-surface-700 transition">
            Train lại Bot
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        
        {/* Status Card */}
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 p-6 text-white shadow-xl shadow-primary-500/20 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black">Trạng thái dữ liệu</h3>
            <p className="text-sm text-primary-100 mt-1">Bot đã được huấn luyện với tổng cộng 42,500 từ.</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">12</p>
            <p className="text-xs font-bold text-primary-200">Nguồn dữ liệu</p>
          </div>
        </div>

        {/* Main Interface */}
        <div className="rounded-[2rem] border border-white bg-white/60 shadow-xl shadow-primary-900/5 backdrop-blur-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-surface-200 bg-white/50 px-6 pt-4">
            <button 
              onClick={() => setActiveTab('url')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'url' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}
            >
              🌐 Thêm Website URL
            </button>
            <button 
              onClick={() => setActiveTab('file')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'file' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}
            >
              📄 Upload Tài liệu (PDF/DOC)
            </button>
            <button 
              onClick={() => setActiveTab('text')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'text' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}
            >
              ✍️ Nhập Văn bản
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'url' && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h4 className="font-bold text-surface-900 mb-2">Crawl toàn bộ Website</h4>
                <p className="text-sm text-surface-500 mb-6">Nhập URL của trang web bạn muốn AI đọc và ghi nhớ. Hệ thống sẽ quét toàn bộ các trang con.</p>
                
                {crawlState === 'idle' && (
                  <div className="flex gap-4">
                    <input 
                      type="url" 
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://www.example.com" 
                      className="flex-1 rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" 
                    />
                    <button 
                      onClick={handleCrawl}
                      disabled={!urlInput}
                      className="bg-primary-600 text-white font-bold px-6 rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Crawl Data
                    </button>
                  </div>
                )}

                {crawlState === 'crawling' && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-surface-600 font-medium animate-pulse">Đang thu thập dữ liệu từ {urlInput}...</p>
                  </div>
                )}

                {crawlState === 'success' && renderEmbedScript(
                  () => {
                    setCrawlState('idle');
                    setUrlInput('');
                  },
                  "Crawl trang web khác",
                  "Crawl thành công!"
                )}
              </div>
            )}
            {activeTab === 'file' && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h4 className="font-bold text-surface-900 mb-2">Upload Files</h4>
                <p className="text-sm text-surface-500 mb-6">Tải lên tài liệu PDF, DOCX, hoặc TXT để dạy AI về sản phẩm và công ty của bạn.</p>
                
                {fileUploadState !== 'success' && (
                  <label className="border-2 border-dashed border-primary-200 bg-primary-50/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-primary-50 transition-colors relative">
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} disabled={fileUploadState === 'uploading'} />
                    {fileUploadState === 'uploading' ? (
                       <div className="flex flex-col items-center">
                         <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-3"></div>
                         <p className="font-bold text-primary-600 text-sm">Đang xử lý tài liệu...</p>
                       </div>
                    ) : (
                      <>
                        <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl mb-4">📂</div>
                        <p className="font-bold text-surface-700">Kéo thả file vào đây hoặc nhấn để chọn file</p>
                        <p className="text-xs text-surface-500 mt-2">Hỗ trợ PDF, DOCX, TXT. Tối đa 10MB/file.</p>
                      </>
                    )}
                  </label>
                )}

                {fileUploadState === 'success' && renderEmbedScript(
                  () => {
                    setFileUploadState('idle');
                    setSelectedFile(null);
                  },
                  "Upload tài liệu khác",
                  "Upload tài liệu thành công!"
                )}
              </div>
            )}
            {activeTab === 'text' && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h4 className="font-bold text-surface-900 mb-2">Nhập Văn Bản Thô</h4>
                <p className="text-sm text-surface-500 mb-6">Dán văn bản thuần tuý (Ví dụ: quy định công ty, Q&A thường gặp).</p>
                
                {textState === 'idle' && (
                  <>
                    <textarea 
                      value={textInput} 
                      onChange={(e) => setTextInput(e.target.value)} 
                      rows={6} 
                      placeholder="Nhập hoặc dán nội dung vào đây..." 
                      className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all mb-4"
                    ></textarea>
                    <button 
                      onClick={handleTextSave} 
                      disabled={!textInput} 
                      className="bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Lưu Nội Dung
                    </button>
                  </>
                )}

                {textState === 'saving' && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-surface-600 font-medium animate-pulse">Đang xử lý văn bản...</p>
                  </div>
                )}

                {textState === 'success' && renderEmbedScript(
                  () => {
                    setTextState('idle');
                    setTextInput('');
                  },
                  "Nhập văn bản khác",
                  "Lưu văn bản thành công!"
                )}
              </div>
            )}
          </div>

          {/* List of existing sources */}
          <div className="border-t border-surface-100 bg-surface-50/50 p-8">
            <h4 className="font-bold text-surface-900 mb-4">Nguồn dữ liệu hiện tại</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-primary-500 bg-primary-50 p-2 rounded-lg">🌐</div>
                  <div>
                    <p className="text-sm font-bold text-surface-900">https://coerz.ai/features</p>
                    <p className="text-xs text-surface-500">Đã học • 1,240 ký tự</p>
                  </div>
                </div>
                <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
              
              <div className="flex items-center justify-between bg-white border border-surface-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-indigo-500 bg-indigo-50 p-2 rounded-lg">📄</div>
                  <div>
                    <p className="text-sm font-bold text-surface-900">Policy_2026.pdf</p>
                    <p className="text-xs text-surface-500">Đã học • 5.2 MB</p>
                  </div>
                </div>
                <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


