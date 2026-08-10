"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập gọi API tới Database (Supabase)
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Trong thực tế sẽ là: const res = await fetch("/api/v1/transactions"); 
        // Sau đó: const data = await res.json(); setTransactions(data);
        
        // Hiện tại cố tình set mảng rỗng để test giao diện "Chưa có dữ liệu"
        setTimeout(() => {
          setTransactions([]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
        setTransactions([]);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-12 selection:bg-gray-100 selection:text-black">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">Lịch sử giao dịch</h1>
        <p className="text-gray-500 mb-8 text-base">Xem lại các giao dịch thanh toán và lịch sử đăng ký dịch vụ của bạn.</p>

        {/* Khung hiển thị dữ liệu hoặc trạng thái Trống */}
        {loading ? (
          <div className="flex justify-center items-center py-20 border border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-4">Mã giao dịch</th>
                    <th className="px-6 py-4">Ngày</th>
                    <th className="px-6 py-4">Mô tả</th>
                    <th className="px-6 py-4">Số tiền</th>
                    <th className="px-6 py-4 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((trx, index) => (
                    <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{trx.id}</td>
                      <td className="px-6 py-4 text-gray-600">{trx.date}</td>
                      <td className="px-6 py-4 font-medium text-black">{trx.description}</td>
                      <td className="px-6 py-4 font-semibold">{trx.amount}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          trx.status === "Thành công" 
                            ? "bg-green-50 text-green-700 border border-green-200" 
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}>
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
              <span>Hiển thị {transactions.length} giao dịch</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition text-black font-medium disabled:opacity-50">Trước</button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition text-black font-medium disabled:opacity-50">Tiếp</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center mb-12">
            <div className="w-16 h-16 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Chưa có giao dịch nào</h3>
            <p className="text-gray-500 max-w-md mx-auto">Bạn chưa thực hiện bất kỳ giao dịch thanh toán hay đăng ký dịch vụ nào trên hệ thống CoerZ.</p>
          </div>
        )}

        {/* Khung thao túng tâm lý / Kêu gọi hành động (CTA) */}
        <div className="relative overflow-hidden rounded-2xl bg-black text-white p-8 md:p-12 shadow-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8 animate-float">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-500 opacity-10 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
              Cơ hội vàng cho doanh nghiệp của bạn
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Đừng để đối thủ cướp mất khách hàng của bạn!
            </h2>
            
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
              Hơn <strong className="text-white">85% doanh nghiệp</strong> đã tăng trưởng gấp 3 lần doanh thu ngay trong tháng đầu tiên sử dụng gói Growth. Bạn đang để tuột mất hàng trăm khách hàng tiềm năng mỗi ngày chỉ vì thiếu hệ thống tự động hóa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/pricing" className="px-6 py-3.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-100 transition-colors text-center shadow-lg hover:shadow-xl shadow-white/10 flex items-center justify-center gap-2">
                Nâng cấp ngay hôm nay
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link href="/solutions" className="px-6 py-3.5 rounded-lg bg-transparent border border-gray-700 text-gray-300 font-medium text-sm hover:bg-white/5 hover:text-white transition-colors text-center">
                Tìm hiểu thêm
              </Link>
            </div>
            <p className="mt-5 text-xs text-gray-500 italic">
              * Đặc quyền: Tặng kèm module AI chăm sóc khách hàng tự động khi đăng ký trong tuần này.
            </p>
          </div>

          <div className="relative z-10 hidden md:block shrink-0 mr-4">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-900 to-black border-4 border-gray-800 flex items-center justify-center shadow-2xl relative hover:scale-105 transition-transform duration-500">
              <div className="text-center">
                <div className="text-4xl font-black text-white drop-shadow-md">+300%</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Chuyển đổi</div>
              </div>
              
              {/* Decorative nodes */}
              <div className="absolute top-2 right-4 w-3 h-3 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
              <div className="absolute bottom-6 left-2 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
              <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
