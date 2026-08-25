import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, Plus, Minus, Check, ArrowRight, ShieldCheck, 
  Sparkles, Star, Tag, Download, Share2, QrCode, CreditCard
} from 'lucide-react';
import { CartItem, RetailProduct } from './types';
import { RETAIL_PRODUCTS } from './data';

interface LookbookRetailCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onAddToCart: (product: RetailProduct, shade?: string) => void;
}

export const LookbookRetailCart: React.FC<LookbookRetailCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'makeup' | 'skincare' | 'eyewear' | 'jewelry' | 'fashion'>('all');
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<number>(0); // e.g. 0.15 for 15% off

  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * discountApplied;
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  const filteredProducts = selectedCategory === 'all' 
    ? RETAIL_PRODUCTS 
    : RETAIL_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleApplyPromo = () => {
    setPromoError(null);
    if (promoCode.trim().toUpperCase() === 'PERFECT15' || promoCode.trim().toUpperCase() === 'DRT2026') {
      setDiscountApplied(0.15);
    } else {
      setPromoError("Invalid code. Try 'PERFECT15' for 15% VIP discount!");
    }
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      onClearCart();
      setCheckoutSuccess(false);
    }, 4500);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Checkout Success Banner */}
      {checkoutSuccess && (
        <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black">Order Confirmed with Perfect Corp AR Guarantee!</h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                Your virtual-tryon shade and diagnostic data have been attached to your order for precision fulfillment.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-white text-emerald-900 px-3 py-1.5 rounded-xl shadow-xs shrink-0">
            ORDER #PC-{Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>
      )}

      {/* Main Grid: Cart (5 cols) & Catalog (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT (5 cols): Live Smart Cart & Summary */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <h4 className="text-base font-black text-stone-900">Your Smart Cart ({cart.reduce((a, c) => a + c.quantity, 0)})</h4>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-[10px] font-bold text-stone-400 hover:text-rose-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cart.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-stone-400 gap-2 border-2 border-dashed border-stone-100 rounded-2xl">
                <ShoppingBag className="w-8 h-8 text-stone-300" />
                <p className="text-xs font-bold text-stone-600">Your cart is currently empty</p>
                <p className="text-[11px] text-stone-400 max-w-xs">
                  Try on shades in the AR Mirror or run a Skin Diagnostic to add curated products.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-150 flex items-center justify-between gap-3">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-black text-stone-900 truncate">{item.product.name}</h5>
                      <p className="text-[10px] text-stone-500 font-medium">
                        {item.selectedShade ? `Shade: ${item.selectedShade}` : item.product.brand}
                      </p>
                      <span className="text-xs font-black text-stone-900">${item.product.price}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-stone-300 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Promo Code Input */}
            {cart.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      if (promoError) setPromoError(null);
                    }}
                    placeholder="Promo: PERFECT15"
                    className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-stone-400 font-mono uppercase"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-2 bg-stone-900 text-white rounded-xl text-xs font-black hover:bg-stone-800 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <span className="text-[10px] font-bold text-rose-600 animate-fadeIn">{promoError}</span>
                )}
                {discountApplied > 0 && (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3 h-3" /> 15% VIP Promo Applied!
                  </span>
                )}
              </div>
            )}

            {/* Price Calculations */}
            {cart.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                {discountApplied > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>AR VIP Discount (15%):</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Eco-Shipping:</span>
                  <span className="font-mono font-bold text-stone-900">{shipping === 0 ? 'FREE (Orders > $150)' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax:</span>
                  <span className="font-mono font-bold text-stone-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Investment:</span>
                  <span className="text-base font-mono text-rose-600">${total.toFixed(2)}</span>
                </div>

                {/* Checkout & QR Mobile Buttons */}
                <div className="flex flex-col gap-2 pt-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    id="btn-checkout"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Instant 1-Click Checkout (${total.toFixed(2)})</span>
                  </button>

                  <button
                    onClick={() => setShowQrModal(true)}
                    className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Pay or Continue on Mobile (QR Code)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Consumer & Retail Value Badge */}
          <div className="bg-gradient-to-r from-emerald-950 to-stone-900 text-emerald-100 p-4 rounded-3xl border border-emerald-800/50 shadow-md flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-black">
              <ShieldCheck className="w-4 h-4" />
              <span>Perfect Corp Precision Guarantee Active</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Every shade in your cart has been verified with 1:1 spectrophotometric calibration. 
              Eliminates product mismatch, saving an estimated <strong>$45+ in return shipping and carbon emissions</strong>.
            </p>
          </div>
        </div>

        {/* RIGHT (7 cols): Curated Retail Catalog with Shade Selectors */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="text-base font-black text-stone-900">Curated AR & AI Ready Product Catalog</h4>
                <p className="text-xs text-stone-500">Every item supports real-time virtual try-on and shade calibration.</p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl flex-wrap">
                {(['all', 'makeup', 'skincare', 'eyewear', 'jewelry', 'fashion'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black capitalize transition-all cursor-pointer ${
                      selectedCategory === cat ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="p-4 rounded-2xl border border-stone-200/80 hover:border-amber-400 transition-all flex flex-col justify-between gap-3 group bg-white hover:shadow-md"
                >
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-video w-full bg-stone-100 rounded-xl overflow-hidden">
                      <img 
                        src={prod.imageUrl} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-black bg-stone-900/80 text-white backdrop-blur-md">
                        {prod.perfectCorpApiTag}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-rose-600 font-bold uppercase">{prod.brand}</span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{prod.rating}</span>
                        </div>
                      </div>
                      <h5 className="text-xs font-black text-stone-900 mt-0.5">{prod.name}</h5>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{prod.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div>
                      <span className="text-xs font-black text-stone-900">${prod.price}</span>
                      {prod.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through ml-1.5">${prod.originalPrice}</span>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(prod, prod.shadeName)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QR Mobile Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full border border-stone-200 shadow-2xl flex flex-col items-center text-center gap-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-stone-900">Scan to Open Look on Mobile AR</h4>
            <p className="text-xs text-stone-500">
              Open your smartphone camera to continue this interactive try-on journey or complete checkout seamlessly.
            </p>

            <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200">
              <div className="w-44 h-44 bg-white p-2 rounded-xl flex items-center justify-center border border-stone-300 shadow-inner">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#FFF" />
                  <path d="M10 10 H40 V40 H10 Z M15 15 V35 H35 V15 Z M20 20 H30 V30 H20 Z" fill="#1A1A1A" />
                  <path d="M60 10 H90 V40 H60 Z M65 15 V35 H85 V15 Z M70 20 H80 V30 H70 Z" fill="#1A1A1A" />
                  <path d="M10 60 H40 V90 H10 Z M15 65 V85 H35 V65 Z M20 70 H30 V80 H20 Z" fill="#1A1A1A" />
                  <rect x="45" y="45" width="10" height="10" fill="#E11D48" />
                  <rect x="60" y="60" width="15" height="15" fill="#1A1A1A" />
                  <rect x="78" y="78" width="12" height="12" fill="#1A1A1A" />
                  <rect x="45" y="20" width="10" height="10" fill="#1A1A1A" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
