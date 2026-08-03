import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f8fc] px-4 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-12 shadow-sm text-center">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#0ea5e9] text-white shadow-lg">
              <span className="text-2xl font-black">C</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl font-black tracking-tight text-slate-900 leading-none">oerVora</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">Powered by AI</span>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f7ff] text-[#2563eb] text-sm font-semibold mb-8">
          <span>✨</span> Xác thực bảo mật
        </div>

        {/* Content */}
        <h1 className="text-4xl font-black text-slate-900 mb-6">
          Xác thực tài khoản
        </h1>
        
        <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
          Chào mừng bạn đến với <span className="font-bold text-slate-800">CoerVora</span>. Chỉ còn một bước nữa để bắt đầu tạo Chatbot AI cho website của bạn trong vài phút.
        </p>

        {/* Button */}
        <button className="w-full max-w-sm mx-auto bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg shadow-black/10 mb-10 block">
          Xác nhận Email ngay
        </button>

        <div className="w-full h-px bg-slate-100 my-8"></div>

        {/* Alternate Link */}
        <Link href="#" className="text-[#3b82f6] font-medium hover:underline">
          Hoặc nhấn vào liên kết này
        </Link>
      </div>
    </div>
  );
}

