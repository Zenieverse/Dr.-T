import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Heart, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { StreetVendor, VendorCategory, CityKey } from './types';
import { streetVendorsTranslations } from './translations';

interface CommunityContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVendor: (vendor: StreetVendor) => void;
  lang: 'vi' | 'en';
}

export const CommunityContributeModal: React.FC<CommunityContributeModalProps> = ({
  isOpen,
  onClose,
  onAddVendor,
  lang,
}) => {
  const t = streetVendorsTranslations[lang];

  const [vendorName, setVendorName] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [age, setAge] = useState<string>('72');
  const [city, setCity] = useState<CityKey>('hcm');
  const [district, setDistrict] = useState<string>('Quận 1');
  const [address, setAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [category, setCategory] = useState<VendorCategory>('dessert_che');
  const [hours, setHours] = useState<string>('14:00 - 18:00');
  const [price, setPrice] = useState<string>('15.000đ - 25.000đ');
  const [phone, setPhone] = useState<string>('');
  const [story, setStory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !address) return;

    setIsSubmitting(true);

    const newVendor: StreetVendor = {
      id: `community-vendor-${Date.now()}`,
      nameVI: vendorName,
      nameEN: vendorName,
      ownerName: ownerName || vendorName,
      ownerAge: parseInt(age, 10) || 70,
      yearsTrading: 20,
      category,
      city,
      districtVI: district,
      districtEN: district,
      addressVI: address,
      addressEN: address,
      landmarkVI: landmark || 'Vỉa hè góc phố',
      landmarkEN: landmark || 'Sidewalk corner',
      // Approximated coordinate for district in Vietnam
      coordinates: { lat: 10.7769 + (Math.random() - 0.5) * 0.05, lng: 106.6953 + (Math.random() - 0.5) * 0.05 },
      operatingHoursVI: hours,
      operatingHoursEN: hours,
      isOpenNow: true,
      priceRangeVND: price,
      priceRangeUSD: '$0.60 - $1.00 USD',
      specialtiesVI: [category === 'dessert_che' ? 'Chè truyền thống' : 'Món ăn gia truyền'],
      specialtiesEN: ['Traditional street specialty'],
      menuItems: [
        {
          id: `m-comm-${Date.now()}-1`,
          nameVI: 'Phần ăn đặc biệt của gánh',
          nameEN: 'Special Cart Portion',
          priceVND: 20000,
          descriptionVI: 'Nấu gia truyền tươi ngon mỗi ngày',
          descriptionEN: 'Fresh daily traditional preparation',
        }
      ],
      storyVI: story || 'Gánh hàng rong mộc mạc của cô chú được cộng đồng chung tay đóng góp và giới thiệu để mọi người cùng ủng hộ sinh kế.',
      storyEN: story || 'A humble street vendor nominated by caring community members to support elder livelihoods.',
      phone: phone || undefined,
      photoUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      verified: true,
      verificationDate: new Date().toISOString().split('T')[0],
      verifiedByCount: 1,
      likesCount: 1,
      shippersSupported: ['grab', 'green_sm'],
      paymentNotesVI: 'Tiền mặt trả trực tiếp cho cụ hoặc nhờ bác tài shipper ứng trước.',
      paymentNotesEN: 'Cash advance directly to elder or through courier dispatch.'
    };

    setTimeout(() => {
      onAddVendor(newVendor);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nominate-modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-medium tracking-wide uppercase">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span>{t.tabSubtitle}</span>
            </div>
            <h2 id="nominate-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight mt-1 text-white">
              {t.contributeModalTitle}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-4 text-stone-800 text-sm">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-stone-700">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <p>{t.contributeModalDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.formVendorName} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
                placeholder="Gánh Chè Đậu Bà Bảy"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {lang === 'vi' ? 'Họ tên chủ gánh' : 'Owner Name'}
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                placeholder="Bà Bảy"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formAge}</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="75"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formCity}</label>
              <select
                value={city}
                onChange={e => setCity(e.target.value as CityKey)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="hanoi">Hà Nội</option>
                <option value="danang">Đà Nẵng</option>
                <option value="cantho">Cần Thơ</option>
                <option value="hue">Huế</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formDistrict}</label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                placeholder="Quận 1 / Quận 3 / Đống Đa..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.formAddress} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Đầu hẻm 45 Nguyễn Huệ, P. Bến Nghé, Quận 1"
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formCategory}</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as VendorCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="dessert_che">{t.catDessertChe}</option>
                <option value="noodles_soup">{t.catNoodlesSoup}</option>
                <option value="banhmi_snacks">{t.catBanhmiSnacks}</option>
                <option value="drinks_ginseng">{t.catDrinksGinseng}</option>
                <option value="fruits_produce">{t.catFruitsProduce}</option>
                <option value="crafts_repair">{t.catCraftsRepair}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formHours}</label>
              <input
                type="text"
                value={hours}
                onChange={e => setHours(e.target.value)}
                placeholder="14:00 - 18:00 chiều"
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t.formStory}</label>
            <textarea
              rows={3}
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder={lang === 'vi' ? 'Kể đôi dòng về cụ, hoàn cảnh hay món ăn làm bạn nhớ mãi...' : 'Share a few words about the elder and what makes their cart special...'}
              className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t.formSuccess}</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {t.closeModal}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              {isSubmitting ? (
                <span>{t.formSubmitting}</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.formSubmit}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
