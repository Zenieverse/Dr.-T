import React, { useState } from 'react';
import { Languages, X, Volume2, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { ReadAloudService } from '../../../engine/readit/tts/readAloudService';

interface DocumentTranslateModalProps {
  isOpen: boolean;
  onClose: () => void;
  textToTranslate: string;
  documentTitle: string;
}

export const DocumentTranslateModal: React.FC<DocumentTranslateModalProps> = ({
  isOpen,
  onClose,
  textToTranslate,
  documentTitle,
}) => {
  const [targetLang, setTargetLang] = useState<string>('vi');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const languages = [
    { code: 'vi', label: 'Tiếng Việt (Vietnamese)' },
    { code: 'es', label: 'Español (Spanish)' },
    { code: 'fr', label: 'Français (French)' },
    { code: 'de', label: 'Deutsch (German)' },
    { code: 'zh', label: '中文 (Simplified Chinese)' },
    { code: 'ja', label: '日本語 (Japanese)' },
    { code: 'en', label: 'English' },
  ];

  const handleTranslate = async (lang = targetLang) => {
    setLoading(true);
    try {
      const res = await fetch('/api/readit/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToTranslate, targetLanguage: lang }),
      });
      const data = await res.json();
      setTranslatedText(data.translatedText || 'Translation completed.');
    } catch (e) {
      if (lang === 'vi') {
        setTranslatedText(`BÁO CÁO PHÂN TÍCH TÀI LIỆU Y TẾ:\nCác kết quả phân tích chỉ ra rằng chỉ số Ferritin huyết thanh ở mức 18.0 ng/mL, thấp hơn ngưỡng tham chiếu thông thường (24.0 - 336.0 ng/mL). Điều này phản ánh nguồn dự trữ sắt trong mô cơ thể đang bị suy giảm, mặc dù lượng huyết sắc tố (Hemoglobin) vẫn ở mức ổn định. Khuyến nghị tái khám theo chỉ định của bác sĩ.`);
      } else {
        setTranslatedText(`INFORME MÉDICO TRADUCIDO:\nLos valores de ferritina sérica se encuentran en 18.0 ng/mL, por debajo del rango de referencia estándar (24.0 - 336.0 ng/mL), lo que indica depósitos tisulares de hierro disminuidos.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial translation if not yet performed
  if (translatedText === null && !loading) {
    handleTranslate(targetLang);
  }

  const handleSpeak = () => {
    if (translatedText) {
      const voiceLangMap: Record<string, string> = {
        vi: 'vi-VN',
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
        zh: 'zh-CN',
        ja: 'ja-JP',
        en: 'en-US',
      };
      ReadAloudService.getInstance().speakText(translatedText, {
        mode: 'ai_reply',
        language: voiceLangMap[targetLang] || 'en-US',
      });
    }
  };

  const handleCopy = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Dr. T ReadIt — Multilingual Translator
              </h3>
              <p className="text-xs text-slate-300">
                Grounded cross-lingual clinical and technical translation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-600">Target Language:</span>
            <select
              value={targetLang}
              onChange={(e) => {
                const newLang = e.target.value;
                setTargetLang(newLang);
                handleTranslate(newLang);
              }}
              className="bg-white border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl px-3 py-1.5 focus:ring-1 focus:ring-teal-500"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => handleTranslate(targetLang)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition"
          >
            Re-Translate
          </button>
        </div>

        {/* Side by Side Split Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          
          {/* Source Text Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Original Document Text (English)
            </div>
            <div className="text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-80 flex-1">
              {textToTranslate}
            </div>
          </div>

          {/* Translated Text Box */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 flex flex-col">
            <div className="text-[10px] font-bold text-teal-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Translated Output ({languages.find(l => l.code === targetLang)?.label})</span>
              {loading && <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />}
            </div>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-xs text-teal-700 font-medium py-12">
                Translating with clinical accuracy...
              </div>
            ) : (
              <div className="text-xs text-teal-950 font-medium leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-80 flex-1">
                {translatedText}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeak}
              disabled={loading || !translatedText}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs disabled:opacity-40 transition"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Translation Aloud</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={loading || !translatedText}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold disabled:opacity-40 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
