import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Phone, 
  Bike, 
  Navigation, 
  Share2, 
  Check, 
  Copy,
  Utensils,
  Sparkles,
  Info
} from 'lucide-react';
import { StreetVendor, MenuItem } from './types';
import { streetVendorsTranslations } from './translations';

interface VendorDetailModalProps {
  vendor: StreetVendor;
  isOpen: boolean;
  onClose: () => void;
  onOpenShipper: (vendor: StreetVendor) => void;
  lang: 'vi' | 'en';
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  vendor,
  isOpen,
  onClose,
  onOpenShipper,
  lang,
}) => {
  const t = streetVendorsTranslations[lang];
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(vendor.likesCount);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  const handleShare = async () => {
    const shareText = `${lang === 'vi' ? vendor.nameVI : vendor.nameEN} - ${lang === 'vi' ? vendor.addressVI : vendor.addressEN} (Gánh Mưu Sinh - StreetVendorsMap)`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: lang === 'vi' ? vendor.nameVI : vendor.nameEN,
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  const handleOpenGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendor.coordinates.lat},${vendor.coordinates.lng}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vendor-detail-title"
      >
        {/* Hero Photo & Cover */}
        <div className="relative h-56 sm:h-64 bg-stone-800 overflow-hidden shrink-0">
          <img 
            src={vendor.photoUrl} 
            alt={lang === 'vi' ? vendor.nameVI : vendor.nameEN}
            className="w-full h-full object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              aria-label={t.shareCart}
              className="p-2 rounded-xl bg-stone-900/70 text-white backdrop-blur-md hover:bg-stone-900 transition-colors"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              aria-label={t.closeModal}
              className="p-2 rounded-xl bg-stone-900/70 text-white backdrop-blur-md hover:bg-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Verification Badge */}
          {vendor.verified && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white backdrop-blur-md text-xs font-medium shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.verifiedBadge}</span>
              <span className="opacity-80">({vendor.verifiedByCount})</span>
            </div>
          )}

          {/* Title & Age Banner in Hero */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
              <span>{vendor.ownerName}</span>
              <span aria-hidden="true">·</span>
              <span>{vendor.ownerAge} {t.ageLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{vendor.yearsTrading} {t.yearsTrading}</span>
            </div>
            <h2 id="vendor-detail-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {lang === 'vi' ? vendor.nameVI : vendor.nameEN}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-stone-800 text-sm">
          {/* Location & Operating Hours Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-stone-900">
                  {lang === 'vi' ? vendor.districtVI : vendor.districtEN}
                </p>
                <p className="text-xs text-stone-600">
                  {lang === 'vi' ? vendor.addressVI : vendor.addressEN}
                </p>
                <p className="text-2xs text-amber-800 italic mt-0.5">
                  {lang === 'vi' ? `(${vendor.landmarkVI})` : `(${vendor.landmarkEN})`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-stone-900">
                  {t.operatingHours}
                </p>
                <p className="text-xs text-stone-600">
                  {lang === 'vi' ? vendor.operatingHoursVI : vendor.operatingHoursEN}
                </p>
                <p className="text-xs font-medium text-amber-700 mt-0.5">
                  {vendor.priceRangeVND} <span className="text-stone-400 font-normal">({vendor.priceRangeUSD})</span>
                </p>
              </div>
            </div>
          </div>

          {/* Moving Life Story */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.storyTitle}</span>
            </h3>
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 text-stone-800 text-sm leading-relaxed italic font-serif">
              "{lang === 'vi' ? vendor.storyVI : vendor.storyEN}"
            </div>
          </div>

          {/* Signature Menu & Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.menuTitle}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {vendor.menuItems.map((item: MenuItem) => (
                <div key={item.id} className="p-3 rounded-xl border border-stone-200 bg-white shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                        {lang === 'vi' ? item.nameVI : item.nameEN}
                      </span>
                      <span className="font-bold text-amber-700 text-xs whitespace-nowrap">
                        {item.priceVND.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    {item.descriptionVI && (
                      <p className="text-xs text-stone-500 line-clamp-2">
                        {lang === 'vi' ? item.descriptionVI : item.descriptionEN}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Courier Notes */}
          <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 space-y-1">
            <p className="font-semibold text-stone-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-stone-500" />
              <span>{lang === 'vi' ? 'Lưu ý khi mua hàng & thanh toán:' : 'Purchasing & Payment Notes:'}</span>
            </p>
            <p>{lang === 'vi' ? vendor.paymentNotesVI : vendor.paymentNotesEN}</p>
            {vendor.phone && (
              <p className="text-amber-800 font-medium pt-1">
                {t.contactSupport}: <span className="font-bold">{vendor.phone}</span>
              </p>
            )}
          </div>

          {/* Support Needs / Community Wishlist */}
          {vendor.supportNeedsVI && vendor.supportNeedsVI.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {t.wishlistTitle}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(lang === 'vi' ? vendor.supportNeedsVI : vendor.supportNeedsEN)?.map((need, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200/80 text-xs"
                  >
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>{need}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLike}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                liked 
                  ? 'bg-rose-50 border-rose-300 text-rose-700' 
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleOpenGoogleMaps}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
            >
              <Navigation className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">{t.directions}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenShipper(vendor);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <Bike className="w-4 h-4" />
              <span>{t.orderShipper}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
