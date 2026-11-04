import React from 'react';
import { X, Check, Sparkles, Building, Heart, Users, ShieldAlert, Award } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'vi';
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const isVi = language === 'vi';

  const tiers = [
    {
      id: 'free',
      name: isVi ? 'Khởi Đầu Miễn Phí' : 'Free Starter',
      price: '$0',
      period: isVi ? 'Mãi mãi' : 'Forever',
      badge: isVi ? 'Cá Nhân & Nhỏ' : 'Individual & Family',
      description: isVi 
        ? 'Dành cho tiệc sinh nhật gia đình, bữa cơm thân mật hoặc lễ kỷ niệm nhỏ.'
        : 'Essential planning tools for birthdays, anniversaries, and intimate family dinners.',
      features: isVi ? [
        '1 sự kiện hoạt động',
        'Lên kế hoạch AI cơ bản (Theme & Palette)',
        'Quản lý ngân sách & 10 nhà cung cấp',
        'Tối đa 50 khách mời',
        'Xuất dữ liệu JSON & Markdown'
      ] : [
        '1 active event workspace',
        'Core AI Plan Architecture',
        'Budget tracking & 10 vendors',
        'Up to 50 guests & RSVP tracker',
        'JSON & Markdown dossier export'
      ],
      popular: false,
      buttonText: isVi ? 'Gói Hiện Tại' : 'Current Plan'
    },
    {
      id: 'individual',
      name: isVi ? 'Tiệc Trọng Đại' : 'Signature Celebration',
      price: '$19',
      period: isVi ? 'Theo sự kiện' : 'Per event',
      badge: isVi ? 'Phổ Biến Nhất' : 'Most Popular',
      description: isVi
        ? 'Hoàn hảo cho đám cưới, lễ đính hôn và tiệc mừng thọ quy mô lớn.'
        : 'Full power for weddings, engagements, milestone birthdays, and family reunions.',
      features: isVi ? [
        'Không giới hạn khách mời & bàn tiệc',
        'Hiệu chỉnh AI đàm thoại không giới hạn',
        'So sánh báo giá nhà cung cấp',
        'Kết nối sổ sách MicroBiz',
        'Kịch bản ngày trọng đại & danh bạ khẩn cấp',
        'Phân công Ba Chiếc Mũ (Three Hats)'
      ] : [
        'Unlimited guests & seating charts',
        'Unlimited Conversational AI Refinement',
        'Side-by-side vendor quote comparison',
        'Direct MicroBiz Ledger integration',
        'Event Day command center & printout',
        'Three Hats responsibility matrix'
      ],
      popular: true,
      buttonText: isVi ? 'Đăng Ký Gói Tiệc' : 'Select Celebration'
    },
    {
      id: 'pro',
      name: isVi ? 'Chuyên Nghiệp' : 'Professional Planner',
      price: '$49',
      period: isVi ? 'Mỗi tháng' : 'Per month',
      badge: isVi ? 'Dành Cho Studio' : 'Agencies & Planners',
      description: isVi
        ? 'Dành cho chuyên viên tổ chức sự kiện, wedding planner và studio độc lập.'
        : 'Multi-event management, client collaboration workspaces, and custom branding.',
      features: isVi ? [
        'Quản lý đồng thời không giới hạn sự kiện',
        'Phân quyền cộng tác viên (Owner, Contributor, Read-Only)',
        'Mẫu sự kiện tùy chỉnh & nhân bản nhanh',
        'Hỗ trợ đa tiền tệ (USD, VND, EUR, GBP, SGD)',
        'Hỗ trợ kỹ thuật ưu tiên'
      ] : [
        'Unlimited concurrent event workspaces',
        'Collaborator RBAC (Owner, Contributor, Read-only)',
        'Custom event blueprints & rapid duplication',
        'Multi-currency support (USD, VND, EUR, GBP, SGD)',
        'Priority architectural support'
      ],
      popular: false,
      buttonText: isVi ? 'Dùng Thử Chuyên Nghiệp' : 'Explore Pro'
    },
    {
      id: 'community',
      name: isVi ? 'Cộng Đồng & Thiện Nguyện' : 'Community & Nonprofit',
      price: '$0',
      period: isVi ? 'Hỗ trợ 100%' : 'Sponsored',
      badge: isVi ? 'Phi Lợi Nhuận' : 'Community Care',
      description: isVi
        ? 'Dành cho hội trường học, lễ hội truyền thống, câu lạc bộ văn hóa và thiện nguyện.'
        : '100% sponsored for registered nonprofits, student associations, and cultural festivals.',
      features: isVi ? [
        'Đầy đủ tính năng Signature Celebration',
        'Hỗ trợ ban tình nguyện viên',
        'Phù hợp sự kiện văn hóa & quyên góp',
        'Bảo mật thông tin khách mời cộng đồng'
      ] : [
        'All Signature Celebration features included',
        'Volunteer team management tools',
        'Optimized for cultural festivals & fundraisers',
        'Privacy protection for vulnerable attendees'
      ],
      popular: false,
      buttonText: isVi ? 'Đăng Ký Miễn Phí' : 'Apply Community'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-r from-amber-50 via-rose-50 to-purple-50 border-b border-rose-100 flex items-start justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isVi ? 'Định Giá & Mô Hình Thương Mại' : 'Commercial Presentation & Pricing Plans'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isVi ? 'Chọn Kế Hoạch Phù Hợp Với Lễ Hội Của Bạn' : 'Choose the Perfect Plan for Your Celebration'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {isVi 
                ? 'Minh bạch hoàn toàn. Tự do tổ chức sự kiện cá nhân miễn phí hoặc nâng cấp cho lễ cưới lớn và studio chuyên nghiệp.'
                : 'Fully transparent. Start planning personal celebrations for free or unlock collaborative capabilities for large weddings and professional planners.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commercial Disclaimer Notice */}
        <div className="mx-6 sm:mx-8 my-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>{isVi ? 'Lưu ý thương mại: ' : 'Commercial Notice: '}</strong>
            {isVi 
              ? 'Các mức giá trên đây là cơ cấu sản phẩm SaaS đề xuất cho giai đoạn phát hành thị trường. Tất cả các tính năng cốt lõi trong Dr. T hiện đang hoạt động trực tiếp miễn phí cho người dùng thử nghiệm.'
              : 'The tiers shown below represent our proposed commercial product structure for market launch. All core features within the Dr. T platform are currently active and testable with no simulated charges.'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all ${
                tier.popular
                  ? 'bg-gradient-to-b from-rose-50/50 to-white border-2 border-rose-500 shadow-xl shadow-rose-500/10'
                  : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                  {tier.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  {!tier.popular && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {tier.badge}
                    </span>
                  )}
                  <h4 className="text-lg font-bold text-slate-900 mt-2">{tier.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{tier.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-3xl font-black text-slate-900">{tier.price}</span>
                  <span className="text-xs text-slate-500 ml-1">/ {tier.period}</span>
                </div>

                <ul className="space-y-2 pt-2 text-xs text-slate-700">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={onClose}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    tier.popular
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-98'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Dr. T — Gather & Glow • Commercial Architecture & SaaS Release 2026</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            {isVi ? 'Đóng Cửa Sổ' : 'Close Window'}
          </button>
        </div>
      </div>
    </div>
  );
};
