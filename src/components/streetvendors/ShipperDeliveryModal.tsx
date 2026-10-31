import React, { useState } from 'react';
import { 
  X, 
  Bike, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink, 
  HeartHandshake, 
  Navigation, 
  Plus, 
  Minus,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { StreetVendor, MenuItem, ShipperService } from './types';
import { streetVendorsTranslations } from './translations';

interface ShipperDeliveryModalProps {
  vendor: StreetVendor;
  isOpen: boolean;
  onClose: () => void;
  lang: 'vi' | 'en';
}

export const ShipperDeliveryModal: React.FC<ShipperDeliveryModalProps> = ({
  vendor,
  isOpen,
  onClose,
  lang,
}) => {
  const t = streetVendorsTranslations[lang];

  const [selectedService, setSelectedService] = useState<ShipperService>('grab');
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    if (vendor.menuItems.length > 0) {
      init[vendor.menuItems[0].id] = 1;
    }
    return init;
  });

  const [buyerName, setBuyerName] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [buyerAddress, setBuyerAddress] = useState<string>('');
  const [specialNote, setSpecialNote] = useState<string>('');
  const [driverTip, setDriverTip] = useState<number>(15000);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  // Calculate totals
  const totalFoodPrice = vendor.menuItems.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + (item.priceVND * qty);
  }, 0);

  const totalEstimate = totalFoodPrice + driverTip;

  // Selected items summary text
  const selectedItemsSummary = vendor.menuItems
    .filter(item => (quantities[item.id] || 0) > 0)
    .map(item => `${quantities[item.id]}x ${lang === 'vi' ? item.nameVI : item.nameEN} (${(item.priceVND * (quantities[item.id] || 0)).toLocaleString('vi-VN')}đ)`)
    .join(', ');

  // Generate automated driver note
  const generateDriverNote = () => {
    const serviceName = selectedService === 'grab' ? 'GrabExpress' : 'Xanh SM Express (Xe điện GSM)';
    const vendorAddress = lang === 'vi' ? vendor.addressVI : vendor.addressEN;
    const vendorLandmark = lang === 'vi' ? vendor.landmarkVI : vendor.landmarkEN;
    const vendorName = lang === 'vi' ? vendor.nameVI : vendor.nameEN;

    return `[GÁNH MƯU SINH - ĐƠN MUA HỘ QUA ${serviceName.toUpperCase()}]
📍 ĐIỂM MUA HÀNG: ${vendorName}
• Địa chỉ: ${vendorAddress}
• Nhận diện: ${vendorLandmark}
• Số điện thoại gánh (nếu có): ${vendor.phone || 'Gặp trực tiếp tại vỉa hè'}

🍲 MÓN CẦN MUA:
${selectedItemsSummary || '1 phần đặc biệt của gánh'}
${specialNote ? `• Dặn thêm: ${specialNote}\n` : ''}
💰 CHI PHÍ & THANH TOÁN:
• Tiền món ước tính: ${totalFoodPrice.toLocaleString('vi-VN')} VNĐ
• Tiền bồi dưỡng (Tip) cho Bác tài: +${driverTip.toLocaleString('vi-VN')} VNĐ
• Giao về: ${buyerAddress || '[Địa chỉ của bạn]'}
• Người nhận: ${buyerName || '[Tên bạn]'} - SĐT: ${buyerPhone || '[Số ĐT bạn]'}

❤️ LỜI NHẮN BÁC TÀI:
Dạ em nhờ Bác tài ghé gánh ứng tiền mặt mua giúp em cho ${vendor.ownerName}. Em gửi lại đủ tiền hàng + tiền cước + tiền tip cho Bác tài khi nhận hàng ạ. Em cảm ơn Bác tài nhiều!`;
  };

  const driverNoteText = generateDriverNote();

  const handleCopyNote = async () => {
    try {
      await navigator.clipboard.writeText(driverNoteText);
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 3000);
    } catch {
      // fallback
    }
  };

  const handleCopyVendorAddress = async () => {
    try {
      const addr = lang === 'vi' ? vendor.addressVI : vendor.addressEN;
      await navigator.clipboard.writeText(`${addr} (${lang === 'vi' ? vendor.landmarkVI : vendor.landmarkEN})`);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 3000);
    } catch {
      // fallback
    }
  };

  const handleOpenGrab = () => {
    // Open Grab web or universal app link
    const grabUrl = `https://food.grab.com/vn/vi/`;
    window.open(grabUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGreenSm = () => {
    // Open Xanh SM web booking portal or app link
    const xanhSmUrl = `https://xanhsm.com/dich-vu/xanh-express/`;
    window.open(xanhSmUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendor.coordinates.lat},${vendor.coordinates.lng}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shipper-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-medium tracking-wide uppercase">
              <Bike className="w-4 h-4" />
              <span>{t.shipperModalTitle}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-100 font-normal">{lang === 'vi' ? vendor.nameVI : vendor.nameEN}</span>
            </div>
            <h2 id="shipper-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-white">
              {lang === 'vi' ? 'Đặt Shipper Grab & Xanh SM Giao Tận Nơi' : 'Order Door Delivery via Grab & Green SM'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label={t.closeModal}
            className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-stone-800 text-sm">
          {/* Informational intro banner */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              <p className="font-semibold text-amber-950 mb-1">
                {lang === 'vi' ? 'Hỗ trợ gánh hàng rong lớn tuổi qua ứng dụng giao hàng' : 'Empowering elders without smartphones via courier assistance'}
              </p>
              <p>
                {t.shipperModalSubtitle}
              </p>
            </div>
          </div>

          {/* Step 1: Select Shipper Service */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              {t.chooseService}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Grab */}
              <button
                type="button"
                onClick={() => setSelectedService('grab')}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedService === 'grab'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs tracking-tighter shadow-2xs">
                      GRAB
                    </span>
                    <span className="font-bold text-stone-900 text-sm">{t.serviceGrab}</span>
                  </div>
                  {selectedService === 'grab' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                  )}
                </div>
                <p className="text-xs text-stone-600 leading-normal">{t.grabDesc}</p>
              </button>

              {/* Green SM / Xanh SM */}
              <button
                type="button"
                onClick={() => setSelectedService('green_sm')}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedService === 'green_sm'
                    ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs tracking-tighter shadow-2xs">
                      GSM
                    </span>
                    <span className="font-bold text-stone-900 text-sm">{t.serviceGreenSm}</span>
                  </div>
                  {selectedService === 'green_sm' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600 ring-4 ring-teal-100" />
                  )}
                </div>
                <p className="text-xs text-stone-600 leading-normal">{t.greenSmDesc}</p>
              </button>
            </div>
          </div>

          {/* Vendor Location Quick Copy */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">
                  {lang === 'vi' ? vendor.nameVI : vendor.nameEN}
                </p>
                <p className="text-xs text-stone-600 truncate">
                  {lang === 'vi' ? vendor.addressVI : vendor.addressEN} ({lang === 'vi' ? vendor.landmarkVI : vendor.landmarkEN})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyVendorAddress}
                className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              >
                {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAddress ? (lang === 'vi' ? 'Đã sao chép' : 'Copied') : (lang === 'vi' ? 'Sao chép địa chỉ' : 'Copy Address')}</span>
              </button>
              <button
                type="button"
                onClick={handleOpenGoogleMaps}
                title={t.directions}
                className="p-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Step 2: Select Items */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              {t.selectItems}
            </label>
            <div className="space-y-2 border border-stone-200 rounded-xl p-3 bg-stone-50/50">
              {vendor.menuItems.map((item: MenuItem) => {
                const qty = quantities[item.id] || 0;
                return (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-stone-200/80">
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-stone-900 text-sm">
                        {lang === 'vi' ? item.nameVI : item.nameEN}
                      </p>
                      <p className="text-xs text-stone-500">
                        {item.priceVND.toLocaleString('vi-VN')} VNĐ
                        {item.descriptionVI && ` · ${lang === 'vi' ? item.descriptionVI : item.descriptionEN}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        disabled={qty <= 0}
                        aria-label="Decrease quantity"
                        className="w-7 h-7 rounded-md border border-stone-300 flex items-center justify-center text-stone-600 disabled:opacity-40 hover:bg-stone-100 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-stone-900">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        aria-label="Increase quantity"
                        className="w-7 h-7 rounded-md bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Recipient & Delivery Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              {t.buyerInfo}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">{t.yourName}</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  placeholder={lang === 'vi' ? 'Ví dụ: Mai Anh' : 'e.g. Sarah / David'}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">{t.yourPhone}</label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={e => setBuyerPhone(e.target.value)}
                  placeholder="09xx xxx xxx"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-stone-600 mb-1">{t.yourAddress}</label>
              <input
                type="text"
                value={buyerAddress}
                onChange={e => setBuyerAddress(e.target.value)}
                placeholder={lang === 'vi' ? 'Ví dụ: 25 Lê Duẩn, P. Bến Nghé, Quận 1, Tòa nhà mPlaza' : 'e.g. 25 Le Duan, Ben Nghe, District 1'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-stone-600 mb-1">{t.specialNotes}</label>
              <input
                type="text"
                value={specialNote}
                onChange={e => setSpecialNote(e.target.value)}
                placeholder={lang === 'vi' ? 'Ví dụ: Nhiều nước cốt dừa, không lấy ớt, gói riêng' : 'e.g. Less sugar, extra sauce, separate bag'}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Driver Tip Recommendation */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-stone-700">{t.driverTipTitle}</span>
                <span className="text-xs font-bold text-amber-700">+{driverTip.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex items-center gap-2">
                {[10000, 15000, 20000, 30000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDriverTip(amt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      driverTip === amt
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    +{(amt / 1000).toFixed(0)}k VNĐ
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-xl bg-stone-900 text-white flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400">{t.estimatedFoodPrice}</p>
              <p className="text-xl font-bold text-amber-400">
                {totalFoodPrice.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400">
                {lang === 'vi' ? 'Tổng dự kiến (gồm tip bác tài):' : 'Estimated Total (inc. tip):'}
              </p>
              <p className="text-lg font-bold text-white">
                ~{totalEstimate.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>

          {/* Automated Driver Note Box */}
          <div className="border border-stone-300 rounded-xl p-4 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                {t.generatedNoteTitle}
              </span>
              <button
                type="button"
                onClick={handleCopyNote}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {copiedNote ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNote ? t.copiedNoteToast : t.copyNoteButton}</span>
              </button>
            </div>
            <p className="text-xs text-stone-500">{t.generatedNoteHint}</p>
            <pre className="p-3 bg-white rounded-lg border border-stone-200 text-xs font-mono text-stone-800 whitespace-pre-wrap leading-relaxed select-all">
              {driverNoteText}
            </pre>
          </div>

          {/* Step 3: Instructions & App Launch Buttons */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {t.howItWorksTitle}
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-600">
              <li>{t.howItWorks1}</li>
              <li>{t.howItWorks2}</li>
              <li>{t.howItWorks3}</li>
            </ol>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenGrab}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Bike className="w-4 h-4" />
                <span>{t.openGrabApp}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              <button
                type="button"
                onClick={handleOpenGreenSm}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span>{t.openGreenSmApp}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <HeartHandshake className="w-4 h-4 text-rose-500" />
            <span>
              {lang === 'vi' 
                ? '100% tiền mua hàng gửi trực tiếp đến gánh mưu sinh'
                : '100% food payment goes directly to the elderly vendor'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium transition-colors"
          >
            {t.closeModal}
          </button>
        </div>
      </div>
    </div>
  );
};
