import "./globals.css";
import Link from "next/link";
import Header from "@/components/Header";
import ChatWidget from "@/components/ChatWidget";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="text-surface-900 transition-colors duration-500" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <AuthProvider>
        <ThemeProvider>
          {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <main className="pt-[73px]">{children}</main>

        {/* FOOTER */}
        <footer className="border-t border-primary-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="grid gap-10 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-base font-black text-white">
                    C
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-surface-900">
                      CoerZ
                    </h3>
                    <p className="text-xs text-surface-500">
                      Nền tảng hỗ trợ doanh nghiệp
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-surface-500">
                  Nền tảng AI giúp doanh nghiệp tự động hóa chăm sóc khách
                  hàng và tối ưu chuyển đổi.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="mb-4 text-sm font-bold text-surface-900">
                  Sản phẩm
                </h4>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/features"
                    className="text-sm text-surface-500 hover:text-primary-600"
                  >
                    Tính năng
                  </Link>
                  <Link
                    href="/solutions"
                    className="text-sm text-surface-500 hover:text-primary-600"
                  >
                    Giải pháp
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm text-surface-500 hover:text-primary-600"
                  >
                    Bảng giá
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-sm text-surface-500 hover:text-primary-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm text-surface-500 hover:text-primary-600"
                  >
                    Giới thiệu
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-bold text-surface-900">
                  Hỗ trợ
                </h4>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/contact"
                    className="text-sm text-surface-500 hover:text-primary-600"
                  >
                    Liên hệ
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-sm text-surface-500 hover:text-primary-600"
                  >
                    Chính sách bảo mật
                  </Link>
                  <Link
                    href="/terms"
                    className="text-sm text-surface-500 hover:text-primary-600"
                  >
                    Điều khoản sử dụng
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-bold text-surface-900">
                  Liên hệ
                </h4>
                <div className="flex flex-col gap-3 text-sm text-surface-500">
                  <p>📧 hello@coerz.ai</p>
                  <p>📞 +84 28 1234 5678</p>
                  <p>📍 TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </div>
            </div>

          </div>
        </footer>
        
        {/* GLOBAL CHAT WIDGET */}
        <ChatWidget />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}