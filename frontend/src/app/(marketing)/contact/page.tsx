import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-primary-50/50 pt-24 pb-12">
      {/* Background glow effects */}
      <div className="absolute top-1/4 right-1/4 -z-10 h-96 w-96 rounded-full bg-accent-400/20 blur-[120px]"></div>
      <div className="absolute bottom-1/4 left-1/4 -z-10 h-80 w-80 rounded-full bg-primary-400/20 blur-[100px]"></div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700">
            Liên hệ với chúng tôi
          </div>
          <h1 className="text-4xl font-black text-surface-900 md:text-5xl">
            Chúng tôi luôn sẵn sàng hỗ trợ
          </h1>
          <p className="mt-4 text-lg text-surface-600">
            Hãy để lại thông tin, đội ngũ tư vấn của CoerVora sẽ liên hệ lại với bạn trong thời gian sớm nhất.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5 bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-primary-900/5 p-4 sm:p-8">
          
          {/* Left info */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary-600 to-accent-500 rounded-[2rem] p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <h3 className="text-2xl font-black relative z-10">Thông tin liên hệ</h3>
            <p className="mt-2 text-primary-100 relative z-10">
              Điền form bên cạnh hoặc liên hệ trực tiếp với chúng tôi qua các kênh dưới đây.
            </p>

            <div className="mt-12 space-y-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">📞</div>
                <div>
                  <p className="text-sm text-primary-100">Hotline tư vấn</p>
                  <p className="font-semibold mt-1">1900 1234</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">✉️</div>
                <div>
                  <p className="text-sm text-primary-100">Email hỗ trợ</p>
                  <p className="font-semibold mt-1">support@coervora.ai</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">🏢</div>
                <div>
                  <p className="text-sm text-primary-100">Trụ sở chính</p>
                  <p className="font-semibold mt-1 leading-relaxed">
                    Tòa nhà CoerVora, Quận 1<br/>
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3 p-4 sm:p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-surface-700">Họ và tên</label>
                  <input type="text" className="block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-surface-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-surface-700">Số điện thoại</label>
                  <input type="tel" className="block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-surface-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="090 123 4567" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-surface-700">Email doanh nghiệp</label>
                <input type="email" className="block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-surface-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="hello@company.com" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-surface-700">Bạn đang quan tâm đến gói dịch vụ nào?</label>
                <select className="block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-surface-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all">
                  <option>Gói Khởi động (Starter)</option>
                  <option>Gói Tăng trưởng (Growth)</option>
                  <option>Gói Doanh nghiệp (Enterprise)</option>
                  <option>Cần tư vấn thêm</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-surface-700">Nội dung cần tư vấn</label>
                <textarea rows={4} className="block w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-surface-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all" placeholder="Để lại câu hỏi hoặc yêu cầu cụ thể của bạn..."></textarea>
              </div>

              <button type="button" className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition hover:scale-[1.02]">
                Gửi yêu cầu tư vấn
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
