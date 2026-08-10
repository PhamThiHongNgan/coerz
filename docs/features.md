# DANH SÁCH TÍNH NĂNG CHI TIẾT - NỀN TẢNG COERZ (AI AGENT & CRM)

Dưới đây là bản phác thảo toàn bộ các chức năng cần thiết để xây dựng hoàn chỉnh nền tảng CoerZ, được chia theo các phân hệ từ cơ bản (core) đến nâng cao (advanced), phục vụ cho mô hình kinh doanh B2B SaaS.

---

## 1. PHÂN HỆ NGƯỜI DÙNG & HỆ THỐNG (CORE SaaS)
Đây là khung xương sống của ứng dụng, cho phép doanh nghiệp đăng ký và sử dụng dưới dạng phần mềm dịch vụ.

### Cơ bản
*   **Xác thực & Bảo mật (Auth):**
    *   Đăng ký / Đăng nhập (Email/Password, Google, Microsoft).
    *   Quên mật khẩu / Khôi phục mật khẩu.
    *   Bảo mật 2 lớp (2FA).
*   **Quản lý Tài khoản & Tổ chức (Multi-tenant):**
    *   Tạo và quản lý thông tin Doanh nghiệp (Tên, Logo, Ngành nghề).
    *   Mời thành viên vào không gian làm việc (Workspace).
    *   Phân quyền cơ bản: Owner (Chủ sở hữu), Admin (Quản trị viên), Agent (Nhân viên tư vấn).
*   **Quản lý Gói cước (Billing):**
    *   Xem danh sách các gói dịch vụ (Pricing Plans).
    *   Thanh toán qua cổng (Stripe/VNPay).
    *   Quản lý hạn mức sử dụng (Số lượng tin nhắn AI, số lượng Lead).

### Nâng cao
*   **Tùy biến Giao diện (White-label/Appearance):** Cho phép doanh nghiệp đổi màu sắc hệ thống, thay logo riêng.
*   **SSO (Single Sign-On):** Dành cho khách hàng doanh nghiệp lớn (Enterprise).
*   **Audit Log (Nhật ký hoạt động):** Theo dõi mọi thao tác của nhân viên trên hệ thống để kiểm toán.

---

## 2. PHÂN HỆ AI AGENT & KNOWLEDGE BASE
Nơi cấu hình "Bộ não" của hệ thống để AI tự động chat với khách.

### Cơ bản
*   **Cấu hình Chatbot Widget:**
    *   Tùy chỉnh giao diện Widget (Màu sắc chủ đạo, Tên Bot, Lời chào, Avatar).
    *   Tạo mã nhúng (Embed Script) để gắn vào Website khách hàng.
*   **Kho Tri thức (Knowledge Base):**
    *   Nhập liệu thủ công (Q&A - Câu hỏi thường gặp).
    *   Tải lên tài liệu (.PDF, .DOCX, .TXT) để AI tự đọc và học.
    *   Cung cấp URL Website để hệ thống tự động cào dữ liệu (Crawl) làm kiến thức.
*   **Lịch sử & Hộp thư AI:**
    *   Xem lại toàn bộ lịch sử các đoạn chat giữa Bot và Khách hàng.

### Nâng cao
*   **Cấu hình Nhân cách AI (Persona & Prompt):** Định hình cách Bot nói chuyện (Chuyên nghiệp, thân thiện, xưng hô Anh/Chị...).
*   **Ngắt tự động & Can thiệp (Human Handoff):** Khi AI không trả lời được hoặc khách yêu cầu gặp người thật, hệ thống tự động dừng AI và chuyển thông báo cho nhân viên vào chat tiếp.
*   **Tự động cập nhật dữ liệu (Auto-sync):** Định kỳ quét lại URL trang web để cập nhật kiến thức mới cho AI.

---

## 3. PHÂN HỆ QUẢN LÝ KHÁCH HÀNG (CRM & LEAD)
Nơi tiếp nhận và xử lý dữ liệu sau khi AI khai thác được từ khách hàng.

### Cơ bản
*   **Hồ sơ Khách hàng (Contact Management):**
    *   Danh sách Khách hàng tiềm năng (Leads) được thu thập từ chat.
    *   Thông tin chi tiết: Tên, SĐT, Email, Nhu cầu.
*   **Kanban Pipeline (Phễu bán hàng):**
    *   Quản lý trạng thái Lead dưới dạng bảng kéo thả (Mới, Đang tư vấn, Báo giá, Đã chốt, Đóng).
*   **Phân bổ công việc:**
    *   Gán Lead thủ công cho các nhân viên Sale phụ trách.

### Nâng cao
*   **AI Lead Scoring (Chấm điểm tự động):** Thuật toán AI tự động đánh giá khách hàng (Nóng/Ấm/Lạnh) dựa trên độ dài cuộc hội thoại, từ khóa nhu cầu và khả năng tài chính.
*   **Tự động phân bổ (Round-robin Routing):** Hệ thống tự động chia đều Lead mới cho các nhân viên đang online, hoặc chia theo chuyên môn (Ví dụ: khách hỏi mảng A chuyển cho nhân viên A).
*   **Lịch sử tương tác toàn diện (Activity Timeline):** Hiển thị timeline chi tiết từ lúc khách chat với AI, lịch sử nhận email, cho đến khi nhân viên note lại thông tin gọi điện.

---

## 4. PHÂN HỆ ĐA KÊNH & HỘP THƯ TẬP TRUNG (OMNICHANNEL INBOX)
Giúp nhân viên không phải mở nhiều tab để chat với khách ở các nền tảng khác nhau.

### Cơ bản
*   **Live Chat Website:** Khách hàng nhắn trên web sẽ đổ về Inbox chung.
*   **Tích hợp Fanpage Facebook (Messenger).**
*   **Giao diện chat tập trung:** Cửa sổ chat cho nhân viên giao tiếp trực tiếp với khách, hỗ trợ gửi ảnh, tài liệu.

### Nâng cao
*   **Tích hợp Zalo OA (Zalo Official Account).**
*   **Tính năng Trả lời nhanh (Quick Replies) & Template:** Lưu sẵn các câu trả lời thường dùng cho nhân viên.
*   **Gắn thẻ hội thoại (Tags):** Đánh dấu đoạn hội thoại (Ví dụ: "Hỗ trợ kỹ thuật", "Khiếu nại", "VIP").

---

## 5. PHÂN HỆ TỰ ĐỘNG HÓA & MARKETING (AUTOMATION)
Tối ưu hóa nguồn lực thông qua các kịch bản chạy ngầm.

### Cơ bản
*   **Tự động Email:** Gửi email xác nhận / Cảm ơn tự động ngay sau khi AI thu thập đủ thông tin Email của khách hàng.
*   **Cảnh báo (Notifications):** Thông báo đẩy (Push) hoặc Email cho nhân viên khi có Lead Hot mới.

### Nâng cao
*   **Email Drip Campaigns (Nuôi dưỡng Lead):** Thiết lập chuỗi kịch bản gửi email tự động (Ví dụ: Ngày 1 gửi báo giá, Ngày 3 gửi feedback khách cũ).
*   **Webhook / API:** Mở cổng kết nối để đẩy dữ liệu từ CoerZ sang các hệ thống khác của doanh nghiệp (như ERP, Kế toán, Mailchimp).

---

## 6. PHÂN HỆ BÁO CÁO & PHÂN TÍCH (ANALYTICS & REPORTS)
Đo lường hiệu quả hoạt động để tối ưu phễu kinh doanh.

### Cơ bản
*   **Dashboard Tổng quan:** Biểu đồ lượng chat theo ngày/tuần/tháng, Số lượng Lead thu thập được, Nguồn lưu lượng (Web, Zalo, Facebook).
*   **Hiệu suất AI:** Số câu trả lời được xử lý tự động hoàn toàn vs số lần phải chuyển cho người thật.

### Nâng cao
*   **Báo cáo hiệu suất Nhân viên (Agent Performance):** Thời gian phản hồi trung bình (Response Time), Số Lead chốt thành công của từng nhân sự.
*   **Báo cáo Phễu chuyển đổi (Funnel Analytics):** Trực quan hóa tỷ lệ rớt khách (Drop-off rate) ở từng giai đoạn (Từ Chat -> Để lại SĐT -> Báo giá -> Chốt đơn).
*   **Word Cloud / Phân tích chủ đề:** AI tổng hợp các câu hỏi hoặc khiếu nại phổ biến nhất của khách hàng trong tháng.
