"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState('url');
  const [url, setUrl] = useState("https://www.coerz.ai");
  const [file, setFile] = useState<File | null>(null);
  const [botName, setBotName] = useState("CoerZ Bot");
  const [showWidget, setShowWidget] = useState(false);
  const [copied, setCopied] = useState(false);

  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    if (step === 2) {
      setProgress(0);
      
      // Kích hoạt học thực tế ở AI Engine
      // Tạo một ID bot ngẫu nhiên để lưu lại cho dashboard
      const chatbotId = "bot_" + Math.random().toString(36).substring(7);
      
      // Save to localStorage for dashboard
      const existingBots = JSON.parse(localStorage.getItem('coerz_bots') || '[]');
      existingBots.push({
        id: chatbotId,
        name: botName || "CoerZ Bot",
        created_at: new Date().toISOString()
      });
      localStorage.setItem('coerz_bots', JSON.stringify(existingBots));

      const apiBase = process.env.NEXT_PUBLIC_AI_ENGINE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8001' : `http://${window.location.hostname}:8001`);
      
      if (inputType === 'url' && url) {
        fetch(`${apiBase}/api/v1/ingest/url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatbot_id: chatbotId, url: url }),
        }).catch(err => console.warn('Fetch API error:', err));
      } else if (inputType === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('chatbot_id', chatbotId);
        fetch(`${apiBase}/api/v1/ingest/file`, {
          method: "POST",
          body: formData,
        }).catch(err => console.warn('Fetch API error:', err));
      }

      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(3), 500);
            return 100;
          }
          return p + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }

    if (step === 3) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(4), 500);
            return 100;
          }
          return p + 1.5;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-primary-50/50 pt-12 pb-24 text-surface-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Glows */}
      <div className="absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-400/20 blur-[120px]"></div>

      {/* Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-xl font-black text-white shadow-lg shadow-primary-500/30">
            C
          </div>
          <h1 className="text-3xl font-black tracking-tight text-surface-900">CoerZ AI</h1>
        </div>
        <h2 className="text-3xl font-black text-surface-900 md:text-4xl">Tạo chatbot cho website của bạn</h2>
        <p className="mt-3 text-surface-500">Chỉ mất vài phút để sở hữu một trợ lý AI thông minh xuất chúng.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 w-full px-4">
        {[1, 2, 3, 4].map(s => (
          <div className="flex items-center gap-2 sm:gap-4" key={s}>
            <div className={`h-10 w-10 flex items-center justify-center rounded-full font-bold transition-all duration-500 ${step >= s ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'bg-white border border-surface-200 text-surface-400'}`}>
              {step > s ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : s}
            </div>
            {s < 4 && <div className={`h-1 w-8 sm:w-16 rounded-full transition-all duration-500 ${step > s ? 'bg-gradient-to-r from-primary-600 to-accent-500' : 'bg-surface-200'}`}></div>}
          </div>
        ))}
      </div>

      {/* Wizard Card */}
      <div className="w-full max-w-2xl px-4">
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 sm:p-10 shadow-2xl shadow-primary-900/5 backdrop-blur-xl transition-all duration-500">

          {/* Step 1 */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">🗂️</div>
                <h3 className="text-xl font-bold text-surface-900">Cung cấp dữ liệu cho Bot</h3>
              </div>
              <p className="text-sm text-surface-500 mb-6 ml-11">AI sẽ tự động học nội dung từ website hoặc tài liệu của bạn.</p>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <button 
                      onClick={() => setInputType('url')}
                      className={`text-sm font-bold pb-2 border-b-2 transition-colors ${inputType === 'url' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500'}`}
                    >
                      🌐 Nhập Website URL
                    </button>
                    <button 
                      onClick={() => setInputType('file')}
                      className={`text-sm font-bold pb-2 border-b-2 transition-colors ${inputType === 'file' ? 'border-primary-600 text-primary-600' : 'border-transparent text-surface-500'}`}
                    >
                      📄 Tải file (PDF, Word)
                    </button>
                  </div>

                  {inputType === 'url' ? (
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="block w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                      placeholder="https://www.yourwebsite.com"
                    />
                  ) : (
                    <label className="block w-full rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 px-4 py-8 text-center cursor-pointer hover:bg-surface-100 transition-colors">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      {file ? (
                        <div className="flex items-center justify-center gap-2 text-primary-600 font-bold">
                          📄 {file.name}
                        </div>
                      ) : (
                        <div>
                          <div className="text-2xl mb-2 text-center flex justify-center">📂</div>
                          <span className="text-surface-600 font-medium">Nhấn để chọn file (PDF, Word, TXT)</span>
                        </div>
                      )}
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="col-span-1">
                    <label className="mb-2 block text-sm font-semibold text-surface-700">Avatar (tuỳ chọn)</label>
                    <div className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50 hover:bg-surface-100 transition-colors">
                      <svg className="w-6 h-6 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="mt-2 text-[10px] text-surface-400">Tối đa 2MB</p>
                  </div>
                  <div className="col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-surface-700">Tên chatbot</label>
                    <input
                      type="text"
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      className="block w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-surface-900 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                      placeholder="VD: Sales Assistant"
                    />
                    <p className="mt-2 text-[10px] text-surface-400">Tên này sẽ hiển thị trong widget chat.</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-100">
                  <Link href="/" className="rounded-xl border border-surface-200 bg-white px-6 py-2.5 text-sm font-semibold text-surface-600 hover:bg-surface-50 transition-colors">
                    Về Trang chủ
                  </Link>
                  <button
                    onClick={() => setStep(2)}
                    disabled={(inputType === 'url' ? !url : !file) || !botName}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Tiếp tục
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-100 text-accent-600">✨</div>
                  <h3 className="text-xl font-bold text-surface-900">Đang khám phá cấu trúc website</h3>
                </div>
                <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1 text-xs font-semibold animate-pulse">Discovering</span>
              </div>
              <p className="text-sm text-surface-500 mb-8 ml-11">Đang xử lý dữ liệu từ {inputType === 'url' ? url : file?.name}</p>

              <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-5 h-5 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-medium text-surface-700">Đang thu thập dữ liệu và xử lý. Vui lòng đợi...</span>
                </div>

                <div className="h-2 w-full rounded-full bg-primary-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-600 to-accent-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">🧠</div>
                  <h3 className="text-xl font-bold text-surface-900">Đang học dữ liệu</h3>
                </div>
                <span className="rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-semibold animate-pulse">Indexing</span>
              </div>
              <p className="text-sm text-surface-500 mb-8 ml-11">Đang xử lý nội dung, chunking và tạo embeddings.</p>

              <div className="rounded-xl border border-surface-100 bg-surface-50 p-6">
                <div className="flex items-center justify-between mb-2 text-sm font-medium text-surface-700">
                  <span>Tiến độ xử lý dữ liệu</span>
                  <span className="text-primary-600">{Math.floor(progress)}%</span>
                </div>

                <div className="h-3 w-full rounded-full bg-surface-200 overflow-hidden mb-4">
                  <div className="h-full bg-surface-800 transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Hệ thống đang trích xuất tri thức
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-500 mb-6 shadow-lg shadow-green-500/20">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-surface-900 mb-2">Chatbot đã sẵn sàng!</h3>
              <p className="text-surface-500 mb-8">Bot đã học xong {inputType === 'url' ? 'dữ liệu từ website' : 'tài liệu'} của bạn và sẵn sàng phục vụ.</p>

              <div className="mx-auto max-w-sm rounded-xl border border-surface-200 bg-white p-4 mb-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center font-bold">
                    {botName.charAt(0)}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-surface-900">{botName}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-[10px] text-surface-500 font-medium">Đang hoạt động</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">Hoạt động</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto rounded-xl border border-surface-200 bg-white px-8 py-3.5 font-semibold text-surface-700 hover:bg-surface-50 transition-colors shadow-sm"
                >
                  Đến Dashboard
                </button>
                <button
                  onClick={() => setShowWidget(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-8 py-3.5 font-bold text-white shadow-lg shadow-primary-500/30 hover:scale-[1.02] transition-all"
                >
                  Cài đặt Widget
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {showWidget && (
                <div className="mt-8 text-left bg-white rounded-xl border border-surface-200 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4">
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
                      {`<script src="https://coerz.ai/widget.js" data-bot-id="test_bot_123"></script>`}
                    </code>
                  </div>
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-black">
                      Copy đoạn mã trên và dán vào <strong>thẻ <code>&lt;head&gt;</code></strong> hoặc <strong>trước thẻ đóng <code>&lt;/body&gt;</code></strong> trong file chính của trang web của bạn.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


