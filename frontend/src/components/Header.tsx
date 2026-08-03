"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/solutions", label: "Giải pháp" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "Giới thiệu" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-lg font-bold text-white">
            C
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-surface-900">
              CoerZ
            </h1>
            <p className="text-xs text-surface-500">
              Nền tảng hỗ trợ doanh nghiệp
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        {!pathname.startsWith('/admin') && (
          <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-primary-50 font-semibold text-primary-600"
                    : "text-surface-600 hover:bg-surface-50 hover:text-primary-600"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        )}

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="hidden items-center justify-center h-10 w-10 rounded-xl border border-primary-100 bg-white text-surface-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 sm:flex"
              aria-label="Cài đặt"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="hidden rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 sm:inline-block"
            >
              Đăng nhập
            </Link>

          {/* Mobile toggle */}
          {/* Mobile toggle */}
          {!pathname.startsWith('/admin') && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ml-2 flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </>
              )}
            </svg>
          </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-primary-100/60 bg-primary-50/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                      ? "bg-primary-50 font-semibold text-primary-600"
                      : "text-surface-600 hover:bg-surface-50"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-xl border border-primary-100 bg-white px-4 py-3 text-center text-sm font-semibold text-surface-700"
            >
              Đăng nhập
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
