import Link from "next/link";

const plans = [
  {
    name: "Cơ bản",
    price: "Miễn phí",
    period: "",
    description: "Khởi đầu hoàn hảo cho cá nhân và startup nhỏ.",
    highlight: false,
    features: [
      { text: "1 Tài khoản quản trị", included: true },
      { text: "500 tương tác/tháng", included: true },
      { text: "1 Kênh tích hợp", included: true },
      { text: "Báo cáo tổng quan", included: true },
      { text: "Hỗ trợ qua email", included: true },
      { text: "Chấm điểm khách hàng", included: false },
      { text: "Truy cập API", included: false },
      { text: "Tùy biến thương hiệu", included: false },
    ],
    cta: "Bắt đầu miễn phí",
  },
  {
    name: "Chuyên nghiệp",
    price: "1,490,000₫",
    period: "/tháng",
    description: "Giải pháp toàn diện tối ưu hóa phễu bán hàng.",
    highlight: true,
    badge: "Khuyên dùng",
    features: [
      { text: "5 Tài khoản quản trị", included: true },
      { text: "10,000 tương tác/tháng", included: true },
      { text: "Đa kênh tích hợp", included: true },
      { text: "Báo cáo chuyên sâu", included: true },
      { text: "Chấm điểm khách hàng & CRM", included: true },
      { text: "Truy cập API", included: true },
      { text: "Tùy biến thương hiệu", included: true },
      { text: "Hỗ trợ ưu tiên 24/7", included: true },
    ],
    cta: "Đăng ký ngay",
  },
  {
    name: "Doanh nghiệp",
    price: "Liên hệ",
    period: "",
    description: "May đo riêng theo yêu cầu bảo mật và quy mô lớn.",
    highlight: false,
    features: [
      { text: "Không giới hạn tài khoản", included: true },
      { text: "Không giới hạn tương tác", included: true },
      { text: "Tất cả kênh kết nối", included: true },
      { text: "Đào tạo dữ liệu riêng", included: true },
      { text: "Chấm điểm khách hàng nâng cao", included: true },
      { text: "API & Webhook toàn diện", included: true },
      { text: "Triển khai Server nội bộ", included: true },
      { text: "Chuyên viên hỗ trợ riêng", included: true },
    ],
    cta: "Nhận báo giá",
  },
];

const faqs = [
  {
    q: "Tôi có thể dùng thử trước khi nâng cấp không?",
    a: "Hoàn toàn được. Gói Cơ bản cung cấp đủ tính năng thiết yếu để bạn trải nghiệm. Bạn có thể nâng cấp bất kỳ lúc nào khi nhu cầu mở rộng.",
  },
  {
    q: "Chi phí có phát sinh thêm không?",
    a: "Tất cả chi phí đều minh bạch như trên bảng giá. Hệ thống sẽ cảnh báo khi bạn dùng gần hết dung lượng và gợi ý nâng cấp, không tự động trừ phí.",
  },
  {
    q: "Hệ thống có an toàn cho dữ liệu khách hàng?",
    a: "Bảo mật là ưu tiên hàng đầu. Dữ liệu được mã hóa chuẩn quốc tế, và tuân thủ các quy định bảo vệ dữ liệu cá nhân hiện hành.",
  },
  {
    q: "Tôi có thể hủy gói dịch vụ không?",
    a: "Bạn có thể hủy đăng ký bất kỳ lúc nào. Dịch vụ sẽ tiếp tục cho đến hết chu kỳ thanh toán hiện tại của bạn.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-100 selection:text-black">
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>
        <div className="relative mx-auto max-w-4xl px-6 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">
            Bảng giá <span className="text-black">minh bạch</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600 font-light leading-relaxed">
            Chọn gói dịch vụ phù hợp với quy mô doanh nghiệp của bạn. Không phí ẩn, linh hoạt thay đổi bất cứ lúc nào.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid items-start gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all ${
                  plan.highlight
                    ? "bg-white border-2 border-black shadow-xl scale-105 z-10"
                    : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-8 border-b border-gray-100 pb-8 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm h-10">{plan.description}</p>
                  
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-black">{plan.price}</span>
                    {plan.period && (
                      <span className="ml-1 text-gray-500 font-medium">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${f.included ? "bg-gray-100 text-black" : "bg-gray-100 text-gray-400"}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={f.included ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                        </svg>
                      </div>
                      <span className={`text-sm ${f.included ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block w-full rounded-lg py-3.5 text-center text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "bg-black text-white hover:bg-gray-900 shadow-sm"
                      : "bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black tracking-tight">So sánh tính năng chi tiết</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-500 w-1/3">Tính năng</th>
                  <th className="py-4 px-6 font-bold text-black text-center">Cơ bản</th>
                  <th className="py-4 px-6 font-bold text-black text-center">Chuyên nghiệp</th>
                  <th className="py-4 px-6 font-bold text-black text-center">Doanh nghiệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {[
                  ["Tài khoản quản trị", "1", "5", "Không giới hạn"],
                  ["Tương tác / tháng", "500", "10,000", "Không giới hạn"],
                  ["Kênh kết nối", "1", "Đa kênh", "Tất cả"],
                  ["Chấm điểm khách hàng", "—", "✓", "Nâng cao"],
                  ["Phân tích & Báo cáo", "Cơ bản", "Chi tiết", "Tùy chỉnh"],
                  ["Truy cập API", "—", "✓", "Toàn diện"],
                  ["Thương hiệu riêng (White-label)", "—", "—", "✓"],
                  ["Cam kết SLA", "—", "99.5%", "99.9%"],
                ].map(([feature, starter, growth, enterprise]) => (
                  <tr key={feature} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-700">{feature}</td>
                    <td className="py-4 px-6 text-center text-gray-500">{starter}</td>
                    <td className="py-4 px-6 text-center font-semibold text-black">{growth}</td>
                    <td className="py-4 px-6 text-center text-gray-500">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black tracking-tight">Câu hỏi thường gặp</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Nâng tầm doanh nghiệp ngay hôm nay
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-light mb-10">
            Trải nghiệm nền tảng quản lý mạnh mẽ giúp bạn bứt phá doanh thu.
          </p>
          <div className="flex justify-center">
            <Link
              href="/register"
              className="rounded-lg bg-white text-black px-8 py-4 text-base font-medium transition-all hover:bg-gray-100 shadow-lg"
            >
              Tạo tài khoản miễn phí
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}


