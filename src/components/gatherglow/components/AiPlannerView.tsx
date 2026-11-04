import React, { useState } from 'react';
import { GatherEvent, AIEventPlan, ThreeHatRoleType } from '../types';
import { 
  Sparkles, 
  Palette, 
  DollarSign, 
  Calendar, 
  CheckSquare, 
  Clock, 
  ShieldAlert, 
  Utensils, 
  Flower2, 
  RefreshCw, 
  Download,
  Info,
  CheckCircle2,
  Send,
  MessageSquare,
  Edit2,
  Check,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GATHER_GLOW_TRANSLATIONS, GatherGlowLanguage } from '../translations';

interface AiPlannerViewProps {
  event: GatherEvent;
  aiPlan: AIEventPlan | null;
  isLoading: boolean;
  language: GatherGlowLanguage;
  onRegeneratePlan: () => void;
  onRefinePlan: (prompt: string) => Promise<void>;
  onExportMarkdown: () => void;
  onSavePlanOverride?: (updatedPlan: AIEventPlan) => void;
}

export const AiPlannerView: React.FC<AiPlannerViewProps> = ({
  event,
  aiPlan,
  isLoading,
  language = 'en',
  onRegeneratePlan,
  onRefinePlan,
  onExportMarkdown,
  onSavePlanOverride
}) => {
  const t = GATHER_GLOW_TRANSLATIONS[language] || GATHER_GLOW_TRANSLATIONS.en;
  const isVi = language === 'vi';

  const [activeSubTab, setActiveSubTab] = useState<'concept' | 'schedule' | 'checklist' | 'contingencies' | 'compare'>('concept');
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);

  // Quick refinement presets
  const quickPresets = isVi ? [
    'Tông màu ngọc lục bảo & vàng champagne',
    'Thêm nghi thức Lễ Vu Quy / Trà Đạo truyền thống lúc 14:00',
    'Ưu tiên bàn tiệc thuần chay & không hạt',
    'Bổ sung khu vực nghỉ ngơi yên tĩnh có trà thảo mộc cho người lớn tuổi'
  ] : [
    'Emerald green & champagne gold palette',
    'Add traditional tea ceremony at 14:00',
    'Focus on family-style sharing platters & vegan options',
    'Add quiet herbal tea sanctuary for grandparents'
  ];

  const handleSendRefinement = async (promptToSend?: string) => {
    const text = promptToSend || refinementPrompt;
    if (!text.trim() || isRefining) return;
    setIsRefining(true);
    try {
      await onRefinePlan(text.trim());
      setRefinementPrompt('');
    } finally {
      setIsRefining(false);
    }
  };

  const getHatBadge = (hat: ThreeHatRoleType) => {
    switch (hat) {
      case 'professional':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">🎩 {t.professionalHat}</span>;
      case 'personal':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">💖 {t.personalHat}</span>;
      case 'social':
        return <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">🤝 {t.socialHat}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 rounded-3xl border border-rose-200/60 shadow-sm">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-rose-600 rounded-2xl text-white shadow-md shadow-rose-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
              <span>Dr. T {t.brandSubtitle}</span>
              <span>•</span>
              <span className="text-slate-500 font-normal">Gemini 3.8 Flash & Grounded Heuristics</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {isVi ? 'Kiến Trúc Kế Hoạch Sự Kiện Toàn Diện' : 'Personalized Master Event Architecture'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              {isVi 
                ? `Ý tưởng chủ đề, bảng màu ngũ sắc, phân bổ ngân sách và kịch bản từng giờ dành riêng cho ${event.title}.`
                : `Curated concept design, category budget allocations, hour-by-hour run sheets, and emergency contingency protocols tailored to ${event.title}.`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onRegeneratePlan}
            disabled={isLoading || isRefining}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 font-semibold text-xs text-slate-700 shadow-xs active:scale-98 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
            <span>{isLoading ? (isVi ? 'Đang Lập Kế Hoạch...' : 'Architecting Plan...') : t.regeneratePlan}</span>
          </button>

          <button
            onClick={onExportMarkdown}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs active:scale-98 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportMarkdown}</span>
          </button>
        </div>
      </div>

      {/* Disclaimers & Invariant Notice */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">{isVi ? 'Nguyên Tắc Minh Bạch:' : 'Guiding Principle: Transparent Event Intelligence.'}</span>
          <p className="text-amber-800 leading-relaxed">
            {t.truthfulDisclosureNotice}
          </p>
        </div>
      </div>

      {/* Interactive AI Refinement Chat Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <MessageSquare className="w-4 h-4 text-rose-500" />
          <span>{isVi ? 'Trò Chuyện & Hiệu Chỉnh Kế Hoạch Với AI (Conversational Refinement)' : 'Refine Event Details Conversationally With AI'}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={refinementPrompt}
            onChange={e => setRefinementPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendRefinement()}
            placeholder={t.refinePromptPlaceholder}
            disabled={isRefining || isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 disabled:opacity-50"
          />
          <button
            onClick={() => handleSendRefinement()}
            disabled={!refinementPrompt.trim() || isRefining || isLoading}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-50 shrink-0"
          >
            {isRefining ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isRefining ? (isVi ? 'Đang Hiệu Chỉnh...' : 'Refining...') : t.sendRefinement}</span>
          </button>
        </div>

        {/* Quick Refinement Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 font-medium">{isVi ? 'Gợi ý nhanh:' : 'Quick tweaks:'}</span>
          {quickPresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendRefinement(preset)}
              disabled={isRefining || isLoading}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 transition-colors border border-slate-200 disabled:opacity-50"
            >
              + {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto space-x-6 text-sm font-medium">
        <button
          onClick={() => setActiveSubTab('concept')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'concept'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>{isVi ? 'Chủ Đề & Bảng Màu' : 'Theme, Palette & Decor'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('schedule')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'schedule'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{t.dayOfRunningOrder}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'checklist'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>{isVi ? 'Mốc Tiến Độ & Bí Quyết Nhà Cung Cấp' : 'Milestones & Vendor Tips'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contingencies')}
          className={`pb-3 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'contingencies'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isVi ? 'Phương Án Dự Phòng (Contingency)' : 'Contingency Protocols'}</span>
        </button>
      </div>

      {/* Tab 1: Theme, Palette & Decor */}
      {activeSubTab === 'concept' && aiPlan && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Concept Moodboard & Palette */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-600">
                  {isVi ? 'Ý Tưởng Thiết Kế' : 'Signature Concept'}
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-1">
                  {aiPlan.themeConcept.title}
                </h4>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {aiPlan.themeConcept.moodboardSummary}
                </p>
              </div>

              {/* Color Palette Swatches */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  {isVi ? 'Bảng Màu Ngũ Sắc Đồng Điệu' : 'Harmonic Color Palette (5 Hex Swatches)'}
                </span>
                <div className="grid grid-cols-5 gap-3">
                  {aiPlan.themeConcept.palette.map((color, idx) => (
                    <div key={idx} className="space-y-1.5 text-center">
                      <div
                        className="w-full h-14 sm:h-16 rounded-2xl shadow-sm border border-black/10 flex items-center justify-center text-xs font-mono font-bold"
                        style={{ backgroundColor: color, color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                      >
                        {color}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atmosphere Keynotes */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700 block">
                  {isVi ? 'Điểm Nhấn Trải Nghiệm Khách Mời' : 'Atmosphere Keynotes & Hospitality Rituals'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {aiPlan.themeConcept.atmosphereKeynotes.map((note, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Culinary & Decor Styling */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
                  <Flower2 className="w-4 h-4" />
                  <span>{isVi ? 'Phong Cách Hoa & Trang Trí' : 'Decor & Floral Highlights'}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {aiPlan.decorAndCateringIdeas.decorHighlights.map((d, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-rose-500">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-amber-600 font-bold text-sm">
                  <Utensils className="w-4 h-4" />
                  <span>{isVi ? 'Thực Đơn & Đồ Uống Điểm Nhấn' : 'Signature Menu & Pairings'}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {aiPlan.decorAndCateringIdeas.signatureMenuConcepts.map((m, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-500">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Day-Of Running Order */}
      {activeSubTab === 'schedule' && aiPlan && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900">{t.dayOfRunningOrder}</h4>
              <p className="text-xs text-slate-500">
                {isVi ? 'Phân công khung giờ cụ thể và chiếc mũ trách nhiệm tương ứng' : 'Minute-by-minute execution timeline mapping activities to Three Hats roles'}
              </p>
            </div>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-rose-200">
            {aiPlan.eventDayRunningOrder.map((slot, idx) => (
              <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="absolute -left-[27px] top-5 w-4 h-4 rounded-full bg-rose-600 border-4 border-white shadow-xs" />

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      {slot.time}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">{slot.activity}</h5>
                  </div>
                  {slot.notes && (
                    <p className="text-xs text-slate-500 italic pl-1">{slot.notes}</p>
                  )}
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-start sm:self-center">
                  <span className="text-xs font-medium text-slate-700">{slot.leadPerson}</span>
                  {getHatBadge(slot.responsibleHat)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Milestones & Vendor Tips */}
      {activeSubTab === 'checklist' && aiPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{isVi ? 'Mốc Thời Gian Chuẩn Bị' : 'Chronological Planning Milestones'}</span>
            </h4>
            <div className="space-y-4">
              {aiPlan.milestones.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black uppercase text-blue-700 tracking-wider block">
                    {m.timeframe}
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {m.actionItems.map((act, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-purple-600" />
              <span>{isVi ? 'Bí Quyết Chọn Nhà Cung Cấp' : 'Vendor Selection Checklist & Interview Guide'}</span>
            </h4>
            <div className="space-y-4">
              {aiPlan.vendorChecklist.map((vc, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                  <span className="text-xs font-black uppercase text-purple-800 tracking-wider block">
                    {vc.category.toUpperCase()}
                  </span>
                  <div className="space-y-1 text-xs text-purple-950">
                    <strong>Key Questions:</strong>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {vc.keyQuestionsToAsk.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Contingencies */}
      {activeSubTab === 'contingencies' && aiPlan && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>{isVi ? 'Kế Hoạch & Giao Thức Xử Lý Tình Huống Dự Phòng' : 'Actionable Contingency Protocols'}</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {isVi ? 'Biện pháp ứng phó ngay lập tức với thời tiết, mất điện, sự cố kỹ thuật hoặc phát sinh dị ứng' : 'Emergency protocols to execute calmly if weather changes, power trips, or dietary surprises occur'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {aiPlan.contingencyChecklist.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{c.risk}</span>
                </div>
                <div className="text-xs space-y-1 text-slate-700">
                  <div><strong>Trigger:</strong> {c.trigger}</div>
                  <div className="text-emerald-800 font-medium bg-emerald-50 p-2 rounded-xl border border-emerald-200 mt-1">
                    <strong>Action:</strong> {c.contingencyAction}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
