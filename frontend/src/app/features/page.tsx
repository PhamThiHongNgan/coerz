
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-cyan-50 text-surface-900">
      {/* Header mini */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <div className="inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700">
          ✨ Tính năng CoerZ AI
        </div>

        <h1 className="mt-6 text-5xl font-black tracking-tight md:text-6xl">
          Mọi công cụ bạn cần để{" "}
          <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
            tăng trưởng doanh nghiệp
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-600">
          CoerZ AI giúp bạn tự động hóa chăm sóc khách hàng, thu lead
          và tăng doanh thu bằng trí tuệ nhân tạo.
        </p>

        <div className="mt-10">
          <Link
            href="/register"
            className="rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:scale-[1.03]"
          >
            Dùng thử miễn phí
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {/* 1 */}
          <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-2xl">
              🤖
            </div>

            <h3 className="text-2xl font-bold">AI Chatbot thông minh</h3>

            <p className="mt-4 text-surface-600">
              Huấn luyện AI từ website, tài liệu, PDF để trả lời khách
              hàng tự động 24/7 với độ chính xác cao.
            </p>
          </div>

          {/* 2 */}
          <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-2xl">
              📈
            </div>

            <h3 className="text-2xl font-bold">Thu lead tự động</h3>

            <p className="mt-4 text-surface-600">
              AI tự động phân loại khách hàng tiềm năng, thu thập thông
              tin và gửi về CRM của bạn.
            </p>
          </div>

          {/* 3 */}
          <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
              ⚡
            </div>

            <h3 className="text-2xl font-bold">Phản hồi siêu nhanh</h3>

            <p className="mt-4 text-surface-600">
              AI phản hồi tức thì, giúp tăng trải nghiệm khách hàng và
              giảm thời gian chờ đợi.
            </p>
          </div>

          {/* 4 */}
          <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              🧠
            </div>

            <h3 className="text-2xl font-bold">AI học doanh nghiệp</h3>

            <p className="mt-4 text-surface-600">
              Hệ thống tự học từ dữ liệu doanh nghiệp để trả lời chính xác
              theo từng ngành nghề.
            </p>
          </div>

          {/* 5 */}
          <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-2xl">
              💬
            </div>

            <h3 className="text-2xl font-bold">Chat đa kênh</h3>

            <p className="mt-4 text-surface-600">
              Tích hợp website, Facebook, Zalo, WhatsApp trong cùng một
              hệ thống AI.
            </p>
          </div>

          {/* 6 */}
          <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
              📊
            </div>

            <h3 className="text-2xl font-bold">Analytics chi tiết</h3>

            <p className="mt-4 text-surface-600">
              Theo dõi hành vi khách hàng, tỷ lệ chuyển đổi và hiệu suất
              chatbot theo thời gian thực.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl rounded-[40px] bg-gradient-to-r from-primary-600 to-accent-500 px-10 py-20 text-center text-white shadow-2xl shadow-primary-500/30">
          <h2 className="text-4xl font-black">
            Sẵn sàng trải nghiệm AI?
          </h2>

          <p className="mt-6 text-lg text-primary-100">
            Bắt đầu sử dụng CoerZ AI để tăng trưởng doanh nghiệp ngay
            hôm nay.
          </p>

          <div className="mt-10">
            <Link
              href="/register"
              className="rounded-2xl bg-white px-8 py-4 text-base font-bold text-primary-600 transition hover:scale-[1.03]"
            >
              Dùng thử miễn phí
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}