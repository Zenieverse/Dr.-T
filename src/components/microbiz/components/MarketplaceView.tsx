import { FC, useState } from 'react';
import { MicroBusiness, BusinessListing, CustomerInquiry, MicroBizProfile } from '../types/microbizTypes';
import { INITIAL_BUSINESSES } from '../data/initialMicroBizData';
import { MicroBizService } from '../services/microbizService';
import { 
  Store, 
  Tag, 
  Clock, 
  Send, 
  CheckCircle, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Plus, 
  X, 
  MessageSquare,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface MarketplaceViewProps {
  businesses?: MicroBusiness[];
  searchQuery: string;
  currentLanguage?: string;
  currentUser?: MicroBizProfile;
  isAuthenticated?: boolean;
  onOpenRegisterStore?: () => void;
}

export const MarketplaceView: FC<MarketplaceViewProps> = ({
  businesses = INITIAL_BUSINESSES,
  searchQuery,
  currentLanguage = 'en',
  currentUser,
  isAuthenticated = false,
  onOpenRegisterStore
}) => {
  const isVi = currentLanguage === 'vi';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inquiryListing, setInquiryListing] = useState<{ listing: BusinessListing; business: MicroBusiness } | null>(null);
  
  // Inquiry form fields
  const [customerName, setCustomerName] = useState(currentUser?.name || (isVi ? 'Khách mua cộng đồng' : 'Community Buyer'));
  const [customerContact, setCustomerContact] = useState(isAuthenticated && currentUser && !currentUser.id.startsWith('guest_') ? 'inquiry@microbiz.community' : '');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const categories = [
    { id: 'all', label: isVi ? 'Tất Cả Sản Phẩm & Dịch Vụ' : 'All Offerings' },
    { id: 'Eco-Crafts', label: isVi ? 'Thủ Công Tự Nhiên' : 'Eco-Crafts' },
    { id: 'Sustainable Foods & Ferments', label: isVi ? 'Thực Phẩm Lành' : 'Foods & Ferments' },
    { id: 'Community Repair', label: isVi ? 'Sửa Chữa Gia Dụng' : 'Repair Services' },
    { id: 'Natural Botanicals', label: isVi ? 'Thảo Mộc Chăm Sóc' : 'Botanicals' },
  ];

  // Flatten all listings with their parent business
  const allListings = businesses.flatMap(biz => 
    biz.listings.map(listing => ({ listing, business: biz }))
  );

  const filteredListings = allListings.filter(({ listing, business }) => {
    const matchesSearch = !searchQuery ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenInquiry = (item: { listing: BusinessListing; business: MicroBusiness }) => {
    setInquiryListing(item);
    setCustomerName(currentUser?.name || (isVi ? 'Khách mua cộng đồng' : 'Community Buyer'));
    setInquiryMessage(
      isVi 
        ? `Xin chào ${item.business.name}, tôi muốn đặt mua ${quantity} ${item.listing.title}. Xin vui lòng gửi báo giá và thời gian giao hàng.`
        : `Hello ${item.business.name}, I would like to inquire about ordering ${quantity} unit(s) of "${item.listing.title}". Please let me know lead time and payment terms.`
    );
    setQuantity(1);
    setInquirySuccess(false);
  };

  const handleSendInquiry = async () => {
    if (!inquiryListing || !inquiryMessage.trim()) return;
    setIsSubmittingInquiry(true);

    try {
      await MicroBizService.sendInquiry({
        listingId: inquiryListing.listing.id,
        listingTitle: inquiryListing.listing.title,
        businessId: inquiryListing.business.id,
        customerName: customerName.trim() || 'Community Buyer',
        customerContact: customerContact.trim() || 'In-app message',
        message: inquiryMessage.trim(),
        requestedQuantity: quantity
      });

      setInquirySuccess(true);
      setTimeout(() => {
        setInquiryListing(null);
        setInquirySuccess(false);
      }, 1500);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Payment Disclosure */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                {isVi ? 'Thương Mại Công Bằng' : 'Fair Trade & Direct Maker'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {allListings.length} {isVi ? 'sản phẩm / dịch vụ' : 'catalog items'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif mt-1">
              {isVi ? 'Chợ Thủ Công & Sinh Kế Bản Địa' : 'Artisan Market & Storefront Catalog'}
            </h2>
          </div>

          {onOpenRegisterStore && (
            <button
              type="button"
              onClick={onOpenRegisterStore}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>{isVi ? 'Mở Gian Hàng Mới' : 'Open Artisan Store'}</span>
            </button>
          )}
        </div>

        {/* Mandatory Payment Disclosure Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs flex items-start space-x-2.5 leading-relaxed font-sans">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Payment Disclosure:</strong> Automated credit card checkout and simulated online payments are strictly disabled. All orders are direct quote inquiries sent to the independent maker. Payment (cash on delivery, bank transfer QR, or local trade) is settled directly between maker and buyer with zero middleman commission.
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map(({ listing, business }) => (
          <div
            key={listing.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Parent Business Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {business.name[0]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[170px]">
                      {business.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      📍 {business.locationCity || 'Local Community'}
                    </span>
                  </div>
                </div>

                {business.isVerified && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified Maker
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold block">
                  {listing.category}
                </span>
                <h3 className="font-bold text-slate-900 font-serif text-base leading-snug group-hover:text-emerald-700 transition">
                  {listing.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {listing.tags.map((t, tIdx) => (
                  <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Price & Maker Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Price Guidance</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {listing.priceAmount.toLocaleString()} {listing.currency}
                </span>
                <span className="text-[10px] text-slate-400 font-mono ml-1">/{listing.unit}</span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenInquiry({ listing, business })}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isVi ? 'Hỏi Mua' : 'Direct Inquiry'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry & Quote Modal */}
      {inquiryListing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold block">
                  DIRECT MAKER INQUIRY
                </span>
                <h3 className="text-lg font-black text-slate-900 font-serif">
                  {inquiryListing.listing.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Storefront: {inquiryListing.business.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInquiryListing(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-950">
                  {isVi ? 'Đã Gửi Yêu Cầu Đến Gian Hàng!' : 'Inquiry Sent Successfully!'}
                </h4>
                <p className="text-xs text-emerald-800">
                  {isVi
                    ? 'Nghệ nhân sẽ nhận được yêu cầu và liên hệ trực tiếp với bạn để báo giá & thống nhất phương thức nhận hàng.'
                    : 'The maker will review your custom inquiry and contact you directly with lead time and payment details.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {/* Payment notice in modal */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  No automated credit card charge will be made. You will settle payment directly with the maker.
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-600 font-bold">
                      {isVi ? 'Tên Của Bạn' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-600 font-bold">
                      {isVi ? 'Số Lượng Yêu Cầu' : 'Quantity Needed'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-600 font-bold">
                    {isVi ? 'Email Hoặc Số Điện Thoại Để Nhận Báo Giá' : 'Contact (Email / Phone / Zalo)'}
                  </label>
                  <input
                    type="text"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    placeholder="e.g. yourname@gmail.com or 090xxxxxxx"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-600 font-bold">
                    {isVi ? 'Nội Dung Yêu Cầu Hoặc Tùy Biến' : 'Message or Customization Details'}
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none"
                  />
                </div>

                {/* Estimate Snapshot */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">{isVi ? 'Ước tính sơ bộ:' : 'Preliminary Total:'}</span>
                  <span className="font-bold text-emerald-800 text-sm">
                    {(inquiryListing.listing.priceAmount * quantity).toLocaleString()} {inquiryListing.listing.currency}
                  </span>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryListing(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                  >
                    {isVi ? 'Hủy' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmittingInquiry || !inquiryMessage.trim()}
                    onClick={handleSendInquiry}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingInquiry ? (isVi ? 'Đang gửi...' : 'Sending...') : (isVi ? 'Gửi Yêu Cầu' : 'Send Inquiry')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
