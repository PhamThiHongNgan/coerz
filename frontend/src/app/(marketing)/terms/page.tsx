import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-primary-50/30 pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-surface-900 md:text-5xl">
            Điều khoản sử dụng
          </h1>
          <p className="mt-4 text-lg text-surface-600">
            Cập nhật lần cuối: Tháng 5, 2026
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-white bg-white/80 p-8 sm:p-12 shadow-2xl shadow-primary-900/5 backdrop-blur-xl prose prose-slate max-w-none">
          <h3>1. Chấp nhận điều khoản</h3>
          <p>
            Bằng việc đăng ký tài khoản và sử dụng nền tảng CoerZ AI, bạn đồng ý tuân thủ toàn bộ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ.
          </p>

          <h3>2. Quyền sử dụng dịch vụ</h3>
          <p>
            CoerZ AI cấp cho bạn quyền không độc quyền, không thể chuyển nhượng để truy cập và sử dụng nền tảng tạo Chatbot AI phục vụ cho mục đích kinh doanh hợp pháp của bạn. Bạn không được phép sao chép, bán lại hoặc khai thác thương mại mã nguồn và công nghệ cốt lõi của chúng tôi.
          </p>

          <h3>3. Trách nhiệm của người dùng</h3>
          <ul>
            <li>Bạn chịu trách nhiệm hoàn toàn về tính hợp pháp của các tài liệu, website (Knowledge Base) mà bạn cung cấp cho AI học.</li>
            <li>Không sử dụng Bot để lừa đảo, phát tán mã độc, hoặc thực hiện các hành vi vi phạm pháp luật.</li>
            <li>Bạn phải bảo mật thông tin đăng nhập và API Key của mình.</li>
          </ul>

          <h3>4. Giới hạn trách nhiệm</h3>
          <p>
            Mặc dù AI của chúng tôi được tối ưu hóa để trả lời chính xác, nhưng bản chất của AI tạo sinh (Generative AI) là có thể sinh ra thông tin sai lệch (hallucination). CoerZ AI không chịu trách nhiệm pháp lý đối với bất kỳ thiệt hại nào phát sinh do thông tin sai lệch từ Chatbot. Bạn có trách nhiệm theo dõi và thiết lập giới hạn cho Bot.
          </p>

          <h3>5. Hủy dịch vụ và Hoàn tiền</h3>
          <p>
            Bạn có thể hủy gói dịch vụ trả phí bất cứ lúc nào trong mục Cài đặt. Chu kỳ thanh toán hiện tại sẽ tiếp tục đến hết tháng và sẽ không được tự động gia hạn. Chúng tôi không áp dụng chính sách hoàn tiền cho khoảng thời gian chưa sử dụng.
          </p>

          <div className="mt-12 pt-8 border-t border-surface-200">
            <p className="text-sm text-surface-500">
              Vui lòng tham khảo thêm <Link href="/privacy" className="text-primary-600 font-semibold hover:underline">Chính sách bảo mật</Link> của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
