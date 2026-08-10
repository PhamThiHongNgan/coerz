import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-surface-50">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary-400/20 blur-[120px]"></div>

      <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white bg-white/80 shadow-2xl shadow-primary-900/5 backdrop-blur-xl p-8 sm:p-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-accent-500 text-2xl font-black text-white shadow-lg shadow-primary-500/30 transition hover:scale-105 mb-6">
            C
          </Link>
          <h2 className="text-2xl font-black text-surface-900">Khôi phục mật khẩu</h2>
          <p className="mt-2 text-sm text-surface-500">
            Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
          </p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-surface-700" htmlFor="email">
              Email đăng nhập
            </label>
            <input
              id="email"
              type="email"
              className="block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-surface-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
              placeholder="hello@company.com"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition hover:scale-[1.02]"
          >
            Gửi liên kết khôi phục
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-surface-600">
          Nhớ mật khẩu rồi?{" "}
          <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
