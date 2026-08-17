"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-sans selection:bg-gray-100 selection:text-black">

      <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:flex">
        
        {/* Left side info (hidden on mobile) */}
        <div className="hidden w-2/5 bg-black p-10 text-white sm:flex flex-col relative overflow-hidden">
          
          <div className="relative z-10 flex-1">
            <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black text-xl font-bold shadow-sm">
              C
            </Link>
            
            <h3 className="mt-12 text-2xl font-bold leading-snug">
              Bắt đầu hành trình tăng trưởng
            </h3>
            <p className="mt-4 text-sm text-gray-200 leading-relaxed font-light">
              Tạo tài khoản ngay hôm nay để trải nghiệm trợ lý AI mạnh mẽ nhất cho doanh nghiệp của bạn.
            </p>
            
            <div className="mt-12 space-y-6 text-sm font-medium text-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 text-white">✓</div>
                <span>Tự động hóa chăm sóc khách hàng 24/7</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 text-white">✓</div>
                <span>Thu thập dữ liệu Lead thông minh</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-800 text-white">✓</div>
                <span>Học hỏi kiến thức từ mọi định dạng</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 text-xs text-gray-300 mt-12 font-light">
            © 2026 CoerZ. All rights reserved.
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full sm:w-3/5 p-8 sm:p-12">
          <div className="text-center sm:text-left mb-8">
            <h2 className="text-2xl font-bold text-black">Tạo tài khoản mới</h2>
            <p className="mt-2 text-sm text-gray-500 font-light">
              Dùng thử miễn phí 14 ngày. Không cần thẻ tín dụng.
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-black" htmlFor="firstName">
                  Họ
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all shadow-sm"
                  placeholder="Nguyễn"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-black" htmlFor="lastName">
                  Tên
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all shadow-sm"
                  placeholder="Văn A"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black" htmlFor="email">
                Email công ty
              </label>
              <input
                id="email"
                type="email"
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all shadow-sm"
                placeholder="hello@company.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-black" htmlFor="password">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-black px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-gray-800"
            >
              Tạo tài khoản
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Hoặc</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 font-light">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-black hover:text-gray-800">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


