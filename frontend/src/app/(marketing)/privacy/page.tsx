import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-primary-50/30 pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-surface-900 md:text-5xl">
            Chính sách bảo mật
          </h1>
          <p className="mt-4 text-lg text-surface-600">
            Cập nhật lần cuối: Tháng 5, 2026
          </p>
        </div>

        <div className="rounded-[2.5rem] border border-white bg-white/80 p-8 sm:p-12 shadow-2xl shadow-primary-900/5 backdrop-blur-xl prose prose-slate max-w-none">
          <h3>1. Thu thập thông tin</h3>
          <p>
            CoerVora AI cam kết bảo vệ thông tin cá nhân và dữ liệu doanh nghiệp của bạn. Chúng tôi chỉ thu thập các thông tin cần thiết để cung cấp dịch vụ Chatbot và AI Assistant, bao gồm:
          </p>
          <ul>
            <li>Thông tin tài khoản: Tên, email, số điện thoại, tên doanh nghiệp.</li>
            <li>Dữ liệu huấn luyện: Nội dung website, tài liệu PDF/DOC mà bạn tải lên để dạy Bot.</li>
            <li>Dữ liệu hội thoại: Lịch sử chat giữa người dùng của bạn và Bot để cải thiện chất lượng phản hồi.</li>
          </ul>

          <h3>2. Sử dụng thông tin</h3>
          <p>
            Thông tin thu thập được sử dụng duy nhất cho các mục đích:
          </p>
          <ul>
            <li>Cung cấp, duy trì và nâng cấp tính năng AI.</li>
            <li>Xử lý giao dịch và gửi thông báo hệ thống.</li>
            <li>Phân tích hiệu suất và báo cáo (dưới dạng ẩn danh).</li>
          </ul>

          <h3>3. Chia sẻ dữ liệu</h3>
          <p>
            Chúng tôi <strong>không bao giờ</strong> bán, cho thuê hoặc chia sẻ dữ liệu kinh doanh của bạn cho bên thứ ba vì mục đích quảng cáo. Dữ liệu hội thoại và kiến thức của mỗi doanh nghiệp được cô lập và mã hóa bảo mật.
          </p>

          <h3>4. Quyền của người dùng</h3>
          <p>
            Bạn có toàn quyền truy cập, chỉnh sửa hoặc yêu cầu xóa toàn bộ dữ liệu tài khoản (bao gồm cả lịch sử hội thoại) bất cứ lúc nào thông qua phần <strong>Cài đặt &gt; Tài khoản</strong> trong hệ thống.
          </p>

          <div className="mt-12 pt-8 border-t border-surface-200">
            <p className="text-sm text-surface-500">
              Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật, vui lòng <Link href="/contact" className="text-primary-600 font-semibold hover:underline">liên hệ với chúng tôi</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
