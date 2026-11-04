import React, { useState } from 'react';
import { X, BookOpen, Sparkles, DollarSign, Clock, Users, Compass, ShieldCheck, HelpCircle } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'vi';
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const isVi = language === 'vi';
  const [activeTab, setActiveTab] = useState<'guide' | 'faq'>('guide');

  const faqs = isVi ? [
    {
      q: 'Gather & Glow có tự động đặt chỗ hay thanh toán tiền cho nhà cung cấp không?',
      a: 'Không bao giờ. Gather & Glow tuân thủ nghiêm ngặt nguyên tắc minh bạch: mọi báo giá và chi phí do người dùng tự nhập và xác nhận. AI chỉ hỗ trợ ước tính phân bổ ngân sách và gợi ý câu hỏi đàm phán, không bao giờ tự ý tạo báo giá giả hay thực hiện thanh toán.'
    },
    {
      q: 'Làm thế nào để kết nối ngân sách sự kiện với sổ sách kế toán MicroBiz?',
      a: 'Trong tab Ngân Sách, mỗi mục chi phí đều có nút "Chuyển Vào MicroBiz". Khi bấm vào, một phiếu chứng từ (Voucher) chuẩn sẽ được tạo tự động với mã giao dịch và mã sự kiện để lưu vào sổ thu chi của Dr. T MicroBiz.'
    },
    {
      q: 'Mô hình Ba Chiếc Mũ (Three Hats) áp dụng vào sự kiện như thế nào?',
      a: 'Ba Chiếc Mũ phân chia rõ ràng: Mũ Chuyên Nghiệp (điều phối kỹ thuật, âm thanh, tiến độ), Mũ Cá Nhân (chăm sóc sức khỏe, thời gian nghỉ ngơi của chủ tiệc), và Mũ Xã Hội (đón tiếp khách mời, nâng ly chúc mừng, kể chuyện gia đình). Nhờ đó, người tổ chức không bị kiệt sức.'
    },
    {
      q: 'Dữ liệu khách mời có được bảo mật không?',
      a: 'Có. Toàn bộ danh sách khách mời và ghi chú dị ứng được cách ly bảo mật theo tài khoản người dùng trên Firebase Firestore hoặc lưu cục bộ trong trình duyệt ở chế độ khách.'
    }
  ] : [
    {
      q: 'Does Gather & Glow ever automatically book vendors or charge payment cards?',
      a: 'Never. Gather & Glow strictly adheres to zero-fabrication principles: all vendor quotations and contracts are user-recorded and confirmed by you. AI offers intelligent budget distribution and interview questions, but never claims unconfirmed availability or makes bookings.'
    },
    {
      q: 'How does the MicroBiz Operations Ledger Bridge work?',
      a: 'In the Budget tab, click "Export to MicroBiz" on any budget item. Gather & Glow will format an official expense/payment voucher with parent event IDs, category tags, and receipt numbers, instantly logging it into the Dr. T MicroBiz accounting ledger.'
    },
    {
      q: 'How does the Three Hats framework protect event hosts from burnout?',
      a: 'Responsibilities are divided into three distinct hats: Professional (coordinators and vendors handling staging and audio), Personal (protecting honoree hydration, deep breathing, and emotional calm), and Social (hospitality greeters and emcees spreading joy).'
    },
    {
      q: 'How is guest privacy and dietary data handled?',
      a: 'Guest records and allergy notes are isolated to your authenticated account in Firebase Firestore, or sandboxed locally in private browser storage when in guest mode.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 border-b border-rose-100 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isVi ? 'Tài Liệu Hướng Dẫn & Giải Đáp' : 'Product Guide & Architecture FAQ'}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {isVi ? 'Cẩm Nang Tổ Chức Cùng Gather & Glow' : 'Gather & Glow Planning Playbook'}
            </h3>
            <p className="text-xs text-slate-600">
              {isVi 
                ? 'Hướng dẫn từng bước để biến ý tưởng thành lễ hội trang trọng, ý nghĩa và kiểm soát tài chính hoàn hảo.'
                : 'Turn your celebration vision into an organized, memorable, and financially disciplined gathering.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 sm:px-8 border-b border-slate-200 flex space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {isVi ? '1. Hướng Dẫn Các Bước' : '1. Step-by-Step Playbook'}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'faq'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {isVi ? '2. Câu Hỏi Thường Gặp (FAQ)' : '2. Frequently Asked Questions'}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === 'guide' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{isVi ? 'Bước 1: Thiết Lập Sự Kiện & AI Planner' : 'Step 1: Event Brief & AI Planner'}</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  {isVi 
                    ? 'Nhập ngày giờ, ngân sách trần, số lượng khách và các yêu cầu văn hóa, ăn kiêng. AI sẽ tự động phân bổ tỷ lệ ngân sách và lập kịch bản ngày trọng đại.'
                    : 'Set your target date, budget ceiling, expected guests, and traditions. AI suggests balanced budget allocations and hour-by-hour run sheets.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>{isVi ? 'Bước 2: Quản Lý Ngân Sách & Sổ Sách' : 'Step 2: Smart Budget & MicroBiz'}</span>
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  {isVi 
                    ? 'Theo dõi chi phí ước tính so với báo giá thực tế của nhà cung cấp. Kiểm soát tiền cọc, hạn thanh toán và xuất chứng từ sang MicroBiz.'
                    : 'Monitor estimated costs against actual vendor quotes and paid deposits. Export official vouchers into MicroBiz with one click.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-blue-800 font-bold text-sm">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{isVi ? 'Bước 3: Tiến Độ & Ba Chiếc Mũ' : 'Step 3: Timeline & Three Hats'}</span>
                </div>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                  {isVi 
                    ? 'Lên lịch công việc từ 6 tháng trước đến tuần lễ sự kiện. Gắn nhãn Mũ Chuyên Nghiệp, Cá Nhân hoặc Xã Hội để phân bổ trách nhiệm rõ ràng.'
                    : 'Organize tasks across milestones (6+ months, 1 month, event week). Tag tasks with Three Hats roles to balance logistics and personal peace.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                <div className="flex items-center space-x-2 text-purple-800 font-bold text-sm">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>{isVi ? 'Bước 4: Khách Mời & Ngày Trọng Đại' : 'Step 4: Guests & Day-Of Control'}</span>
                </div>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  {isVi 
                    ? 'Theo dõi xác nhận tham dự (RSVP), tổng hợp khẩu phần ăn chay/dị ứng cho bếp tiệc. Sử dụng bảng điều khiển Event Day với danh bạ khẩn cấp trên điện thoại.'
                    : 'Track RSVPs and tally dietary restrictions for catering. Launch the Event Day live command center with emergency speed dials on mobile.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{f.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Dr. T Platform • Gather & Glow Planning Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            {isVi ? 'Đã Hiểu' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
