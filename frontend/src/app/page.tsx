import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-100 selection:text-black">

      {/* Hero Section */}
      <main className="relative pt-8 pb-24 lg:pt-12 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-50 z-0 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left">


            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-black mb-6 leading-tight">
              Quản lý doanh nghiệp <br />
              <span className="text-black">chuyên nghiệp hơn</span>
            </h1>

            <p className="text-base lg:text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl font-light">
              Nền tảng nghiệp vụ và chăm sóc khách hàng toàn diện. Tối ưu hóa quy trình, tăng tỷ lệ chuyển đổi và quản lý hiệu quả cho mọi quy mô doanh nghiệp.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/solutions"
                className="rounded-lg border border-gray-200 bg-white px-8 py-4 text-base font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>

          {/* Right side - Abstract interface representation */}
          <div className="flex-1 w-full relative">
            <div className="relative rounded-2xl bg-white border border-gray-200 shadow-2xl p-2 z-10 mx-auto max-w-lg hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 h-80 flex flex-col gap-4 overflow-hidden relative">
                
                {/* Mockup blocks - Detailed Dashboard UI */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">C</span>
                    </div>
                    <div>
                      <div className="h-3 w-24 bg-gray-800 rounded-full mb-1"></div>
                      <div className="h-2 w-16 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-semibold text-black">Báo cáo</div>
                </div>

                <div className="flex gap-4">
                  <div className="h-20 w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col justify-between">
                    <div className="h-2 w-10 bg-gray-300 rounded"></div>
                    <div className="h-6 w-16 bg-black rounded"></div>
                    <div className="h-1 w-full bg-gray-100 rounded overflow-hidden"><div className="h-full bg-black w-3/4"></div></div>
                  </div>
                  <div className="h-20 w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col justify-between">
                    <div className="h-2 w-10 bg-gray-300 rounded"></div>
                    <div className="h-6 w-16 bg-black rounded"></div>
                    <div className="h-1 w-full bg-gray-100 rounded overflow-hidden"><div className="h-full bg-gray-400 w-1/2"></div></div>
                  </div>
                  <div className="h-20 w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col justify-between">
                    <div className="h-2 w-10 bg-gray-300 rounded"></div>
                    <div className="flex items-end gap-1 h-6">
                      <div className="w-1/4 bg-gray-200 h-2 rounded-t"></div>
                      <div className="w-1/4 bg-gray-300 h-4 rounded-t"></div>
                      <div className="w-1/4 bg-gray-400 h-6 rounded-t"></div>
                      <div className="w-1/4 bg-black h-5 rounded-t"></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full bg-white border border-gray-200 rounded-lg shadow-sm mt-2 p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-gray-800 rounded"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                          <div className="space-y-1">
                            <div className="h-2 w-20 bg-gray-700 rounded"></div>
                            <div className="h-1.5 w-12 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="h-4 w-12 bg-gray-200 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-50 z-0"></div>
          </div>
        </div>
      </main>

      {/* Value Proposition / Features */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-black tracking-tight">
                  Xây dựng cho sự tăng trưởng
                </h2>
                <p className="text-gray-600 text-base">Hệ thống công cụ mạnh mẽ giúp bạn tập trung vào điều quan trọng nhất: Khách hàng của bạn.</p>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
              <div className="h-12 w-12 rounded-lg bg-gray-50 text-black flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Vận hành liên tục</h3>
              <p className="text-gray-600 leading-relaxed">Hệ thống xử lý yêu cầu và chăm sóc khách hàng tự động 24/7, đảm bảo không bỏ lỡ bất kỳ cơ hội nào.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
              <div className="h-12 w-12 rounded-lg bg-gray-50 text-black flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Tăng tỷ lệ chuyển đổi</h3>
              <p className="text-gray-600 leading-relaxed">Phân tích dữ liệu theo thời gian thực giúp tối ưu hóa phễu bán hàng và tăng trưởng doanh thu đáng kể.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md group">
              <div className="h-12 w-12 rounded-lg bg-gray-50 text-black flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Hệ sinh thái mở rộng</h3>
              <p className="text-gray-600 leading-relaxed">Tích hợp sẵn hơn 12 module nghiệp vụ chuyên sâu, phù hợp với mọi phòng ban trong công ty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold text-black mb-4 tracking-tight">
            Sẵn sàng thay đổi cách bạn làm việc?
          </h2>
          <p className="text-gray-600 mb-8 text-base md:text-lg font-light">
            Bắt đầu trải nghiệm nền tảng quản lý CoerZ ngay hôm nay và nhận thấy sự khác biệt.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/demo"
              className="rounded-lg bg-black px-8 py-4 text-base font-medium text-white transition-all hover:bg-gray-900 shadow-sm"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-gray-200 bg-white px-8 py-4 text-base font-medium text-black transition-all hover:bg-gray-50"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

