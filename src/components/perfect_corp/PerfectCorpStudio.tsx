import React, { useState } from 'react';
import { 
  Sparkles, Camera, Activity, Wand2, ShoppingBag, Code, Star, Heart, 
  Share2, ShieldCheck, Check, Layers, ChevronRight, Zap, Info
} from 'lucide-react';
import { PerfectStudioTab, CartItem, RetailProduct } from './types';
import { VirtualTryOnMirror } from './VirtualTryOnMirror';
import { SkinDiagnosticAnalyzer } from './SkinDiagnosticAnalyzer';
import { GenAIFashionStylist } from './GenAIFashionStylist';
import { LookbookRetailCart } from './LookbookRetailCart';
import { PerfectCorpApiPlayground } from './PerfectCorpApiPlayground';
import { RetailConsumerValueHub } from './RetailConsumerValueHub';
import { RETAIL_PRODUCTS } from './data';

export const PerfectCorpStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PerfectStudioTab>('virtual-tryon');
  const [cart, setCart] = useState<CartItem[]>([
    { product: RETAIL_PRODUCTS[0], quantity: 1, selectedShade: 'Velvet Rosewood' }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddToCart = (product: RetailProduct, shade?: string) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedShade === shade);
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1, selectedShade: shade }];
    });
    triggerToast(`Added "${product.name}" to your Smart Cart!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    triggerToast("Item removed from cart");
  };

  const handleClearCart = () => {
    setCart([]);
    triggerToast("Cart cleared");
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 animate-fadeIn" id="perfect-corp-studio-root">
      
      {/* Studio Header & Value Proposition Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-stone-100 p-6 md:p-8 rounded-3xl border border-rose-900/40 shadow-2xl relative overflow-hidden">
        {/* Background decorative ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                SMARIST • AI & AR CONSUMER ENGINE
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Powered by Perfect Corp YouCam 3D Vision AI
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
              SmArist: Next-Gen AI & AR Consumer Experience Studio
            </h2>

            <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-sans">
              Hyper-personalized beauty, fashion, and dermatological journeys. Live 60 FPS WebCam Virtual Try-On, 
              14-dimension clinical skin diagnostics, text-to-fashion generative styling, and 1-click shade-calibrated retail checkout.
            </p>
          </div>

          {/* Quick Metrics / Stats Pill */}
          <div className="flex items-center gap-3 bg-stone-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-stone-800 shrink-0 self-stretch md:self-auto justify-around">
            <div className="flex flex-col text-center px-2">
              <span className="text-base font-black text-rose-400 font-mono">14</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Skin Vectors</span>
            </div>
            <div className="w-px h-8 bg-stone-800" />
            <div className="flex flex-col text-center px-2">
              <span className="text-base font-black text-amber-400 font-mono">60 FPS</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">AR Tracking</span>
            </div>
            <div className="w-px h-8 bg-stone-800" />
            <div className="flex flex-col text-center px-2">
              <span className="text-base font-black text-emerald-400 font-mono">100%</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Zero-Waste</span>
            </div>
          </div>
        </div>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="absolute bottom-3 left-6 right-6 md:left-auto md:right-6 bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-fadeIn z-20">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 border border-stone-200 rounded-2xl overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('virtual-tryon')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'virtual-tryon' 
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black' 
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
          id="btn-tab-vto"
        >
          <Camera className="w-4 h-4" />
          <span>Live AR Virtual Try-On (VTO)</span>
        </button>

        <button
          onClick={() => setActiveTab('skin-diagnostic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'skin-diagnostic' 
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black' 
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
          id="btn-tab-skin"
        >
          <Activity className="w-4 h-4" />
          <span>14-Dimension Skin Diagnostic</span>
        </button>

        <button
          onClick={() => setActiveTab('genai-fashion')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'genai-fashion' 
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black' 
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
          id="btn-tab-fashion"
        >
          <Wand2 className="w-4 h-4" />
          <span>GenAI Fashion & Dressing Room</span>
        </button>

        <button
          onClick={() => setActiveTab('smart-retail')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
            activeTab === 'smart-retail' 
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black' 
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
          id="btn-tab-retail"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Smart Retail & Lookbook Cart</span>
          {totalCartCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-rose-600 text-[10px] font-mono font-black flex items-center justify-center shadow-xs">
              {totalCartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('value-hub')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'value-hub' 
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black' 
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
          id="btn-tab-value-hub"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Consumer & Retail Value Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('api-playground')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'api-playground' 
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black' 
              : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
          }`}
          id="btn-tab-api"
        >
          <Code className="w-4 h-4" />
          <span>Perfect Corp API Console</span>
        </button>
      </div>

      {/* Dynamic Content Views */}
      <div className="w-full">
        {activeTab === 'virtual-tryon' && (
          <VirtualTryOnMirror 
            onAddToCart={handleAddToCart} 
            onNavigateToDiagnostic={() => setActiveTab('skin-diagnostic')} 
          />
        )}

        {activeTab === 'skin-diagnostic' && (
          <SkinDiagnosticAnalyzer onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'genai-fashion' && (
          <GenAIFashionStylist onAddToCart={handleAddToCart} />
        )}

        {activeTab === 'smart-retail' && (
          <LookbookRetailCart 
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'value-hub' && (
          <RetailConsumerValueHub 
            onAddToCart={handleAddToCart}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'api-playground' && (
          <PerfectCorpApiPlayground />
        )}
      </div>

      {/* Footnote & Perfect Corp Partnership Guarantee */}
      <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Powered by <strong>Perfect Corp AI & AR Cloud Solutions</strong> • Real-World Consumer Engagement & Conversion Engine.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-stone-400">
          <span>YouCam SDK v3.8</span>
          <span>•</span>
          <span>Zero-Lag WebGL Shader Pipeline</span>
        </div>
      </div>
    </div>
  );
};
