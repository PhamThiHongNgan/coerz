import Link from "next/link";

const solutions = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: "Thương mại điện tử & Bán lẻ",
    subtitle: "Web Bán Hàng",
    description: "Tự động hóa việc chốt sale, tư vấn sản phẩm và cứu vãn giỏ hàng (Exit-Intent). Xử lý hàng ngàn yêu cầu khách hàng 24/7 một cách chuyên nghiệp.",
    features: [
      "Tư vấn & chốt sale tự động",
      "Gợi ý sản phẩm thông minh",
      "Kịch bản cứu vãn giỏ hàng",
      "Giải đáp chính sách ngay lập tức",
    ],
    stat: "+300%",
    statLabel: "Tỷ lệ chuyển đổi",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
    title: "Giáo dục & Tuyển sinh",
    subtitle: "Du học & Đào tạo",
    description: "Quản lý dữ liệu tuyển sinh, tự động tư vấn lộ trình học từ tài liệu nội bộ. Phân loại và thu thập thông tin ứng viên tiềm năng một cách chính xác.",
    features: [
      "Tích hợp tài liệu chuyên ngành",
      "Tư vấn lộ trình học tập, thủ tục",
      "Tự động thu thập & phân loại Lead",
      "Đồng bộ trực tiếp với phòng ban",
    ],
    stat: "5x",
    statLabel: "Tăng trưởng Lead",
  },
];

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-100 selection:text-black">
      
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-dot-pattern opacity-30 z-0"></div>
        <div className="relative mx-auto max-w-5xl px-6 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">
            Giải pháp chuyên biệt cho <br className="hidden md:block" /> 
            <span className="text-black">từng ngành nghề</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600 font-light leading-relaxed">
            CoerZ được thiết kế để giải quyết các bài toán đặc thù của doanh nghiệp. Tối ưu hóa vận hành, tăng trưởng doanh thu và mang lại trải nghiệm khách hàng xuất sắc.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {solutions.map((sol) => (
              <div
                key={sol.title}
                className="bg-white rounded-2xl border border-gray-200 p-10 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-50 text-black">
                    {sol.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-black uppercase tracking-widest">{sol.subtitle}</span>
                    <h3 className="text-2xl font-bold text-black">{sol.title}</h3>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-8">
                  {sol.description}
                </p>

                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">Tính năng trọng tâm</h4>
                  <ul className="space-y-3">
                    {sol.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-gray-600">
                        <svg className="w-5 h-5 text-black shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 flex items-center justify-between">
                  <span className="text-3xl font-bold text-black">{sol.stat}</span>
                  <span className="text-sm text-gray-500 font-medium text-right max-w-[120px]">{sol.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">Quy trình triển khai tinh gọn</h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gray-200"></div>
            
            {[
              { step: "01", title: "Phân tích nhu cầu", desc: "Tìm hiểu chi tiết mô hình kinh doanh và khó khăn hiện tại." },
              { step: "02", title: "Thiết lập hệ thống", desc: "Đồng bộ dữ liệu và cấu hình quy trình làm việc chuyên biệt." },
              { step: "03", title: "Triển khai & Tối ưu", desc: "Áp dụng thực tế, theo dõi hiệu suất và tinh chỉnh liên tục." },
            ].map((item) => (
              <div key={item.step} className="relative text-center md:text-left z-10">
                <div className="mx-auto md:mx-0 flex h-20 w-20 items-center justify-center rounded-full bg-white border-4 border-gray-200 text-black text-xl font-bold shadow-sm mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Khám phá sức mạnh của CoerZ
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-light mb-10">
            Dù doanh nghiệp của bạn ở quy mô nào, chúng tôi đều có giải pháp phù hợp để thúc đẩy tăng trưởng.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-white text-black px-8 py-4 text-base font-medium transition-all hover:bg-gray-100 shadow-lg"
            >
              Liên hệ đội ngũ tư vấn
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}


