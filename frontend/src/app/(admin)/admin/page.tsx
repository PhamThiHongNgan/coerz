"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (username.trim() !== "admin") {
      setError("Tên đăng nhập không tồn tại.");
      return;
    }
    
    if (password !== "123") {
      setError("Mật khẩu không chính xác.");
      return;
    }

    sessionStorage.setItem("admin_auth", "true");
    router.push("/admin/leads");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 font-sans selection:bg-gray-100 selection:text-black">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-black text-2xl font-bold text-white shadow-sm">
            C
          </div>
          <h2 className="text-2xl font-bold text-black">Admin Panel</h2>
          <p className="mt-2 text-sm text-gray-500">
            Đăng nhập để vào hệ thống quản trị CRM
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
              placeholder="Nhập 'admin'"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-black">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black shadow-sm"
              placeholder="Nhập '123'"
              required
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-md border border-red-100">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 shadow-sm"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}


