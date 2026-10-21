import { FC, useState } from 'react';
import { MicroBizCourse, MicroBizProfile } from '../types/microbizTypes';
import { MicroBizService } from '../services/microbizService';
import { 
  Bot, 
  Sparkles, 
  BookOpen, 
  Store, 
  FileText, 
  Check, 
  Copy, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle,
  Lightbulb,
  Zap,
  Globe,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface AiStudioViewProps {
  currentLanguage?: string;
  currentUser?: MicroBizProfile;
  isAuthenticated?: boolean;
  onSaveNewCourse?: (course: MicroBizCourse) => void;
}

interface AiMeta {
  isGenuineAi: boolean;
  isHeuristicFallback: boolean;
  provider: string;
  fallbackNotice?: string;
}

export const AiStudioView: FC<AiStudioViewProps> = ({
  currentLanguage = 'en',
  currentUser,
  isAuthenticated = false,
  onSaveNewCourse
}) => {
  const isVi = currentLanguage === 'vi';
  const [activeTool, setActiveTool] = useState<'course' | 'copy' | 'plan'>('course');

  // Tool 1: Course Generator State
  const [courseTopic, setCourseTopic] = useState('Cold-Process Herbal Soapmaking for Beginners');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [courseCategory, setCourseCategory] = useState('Sustainable Crafts & Eco-Making');
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [courseAiMeta, setCourseAiMeta] = useState<AiMeta | null>(null);
  const [courseSavedSuccess, setCourseSavedSuccess] = useState(false);

  // Tool 2: Copywriter State
  const [productName, setProductName] = useState('Hand-Carved Bamboo Tea Strainer');
  const [productCategory, setProductCategory] = useState('Eco-Crafts');
  const [productDetails, setProductDetails] = useState('Made from 4-year-old mature Bến Tre bamboo. Boiled in natural sea salt water for durability. Zero plastic, zero toxic varnish.');
  const [targetAudience, setTargetAudience] = useState('Conscious tea lovers and zero-waste gift seekers');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const [copyAiMeta, setCopyAiMeta] = useState<AiMeta | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Tool 3: Lean Business Plan State
  const [bizName, setBizName] = useState('Tre Việt Community Woodcrafts');
  const [bizIdea, setBizIdea] = useState('Crafting functional bamboo and reclaimed wood everyday tools (tea strainers, bath mats, soap dishes) by partnering with local youth apprentices.');
  const [bizLocation, setBizLocation] = useState('District 8 & Online Community');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [planAiMeta, setPlanAiMeta] = useState<AiMeta | null>(null);

  const [selectedProvider, setSelectedProvider] = useState<'gemma' | 'gemini'>('gemma');

  // 1. Generate Course
  const handleGenerateCourse = async () => {
    if (!courseTopic.trim()) return;
    setIsGeneratingCourse(true);
    setCourseSavedSuccess(false);

    try {
      const response = await fetch('/api/microbiz/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: courseTopic,
          skillLevel: courseLevel,
          category: courseCategory,
          language: currentLanguage,
          provider: selectedProvider
        })
      });

      const data = await response.json();
      if (data.course) {
        setGeneratedCourse(data.course);
        setCourseAiMeta({
          isGenuineAi: !!data.isGenuineAi,
          isHeuristicFallback: !!data.isHeuristicFallback,
          provider: data.provider || (data.isGenuineAi ? (selectedProvider === 'gemini' ? 'gemini-3.8-flash' : 'gemma-4-26b-a4b-it') : 'microbiz-heuristic-engine'),
          fallbackNotice: data.fallbackNotice
        });
      }
    } catch (err) {
      console.warn('AI course generator fallback:', err);
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  const handleSaveCourseToPlatform = async () => {
    if (!generatedCourse) return;

    const effectiveCreatorId = isAuthenticated && currentUser ? currentUser.id : MicroBizService.getCurrentUserId();
    const effectiveCreatorName = isAuthenticated && currentUser ? currentUser.name : (isVi ? 'Người dạy cộng đồng' : 'Community Maker');

    const fullCourse: MicroBizCourse = {
      id: `course_${Date.now()}`,
      title: generatedCourse.title,
      slug: generatedCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      creatorId: effectiveCreatorId,
      creatorName: effectiveCreatorName,
      description: generatedCourse.description,
      learningObjectives: generatedCourse.learningObjectives || ['Master core workflow', 'Learn practical community skills'],
      category: courseCategory,
      skillLevel: courseLevel as any,
      language: currentLanguage === 'vi' ? 'Tiếng Việt' : 'English',
      estimatedHours: generatedCourse.estimatedHours || 2.0,
      prerequisites: generatedCourse.prerequisites || ['Basic curiosity'],
      modules: (generatedCourse.modules || []).map((m: any, mIdx: number) => ({
        id: `mod_${mIdx + 1}`,
        moduleNumber: m.moduleNumber || mIdx + 1,
        title: m.title,
        description: m.description,
        lessons: (m.lessons || []).map((l: any, lIdx: number) => ({
          id: `les_${mIdx + 1}_${lIdx + 1}`,
          title: l.title,
          estimatedMinutes: l.estimatedMinutes || 20,
          contentType: 'text',
          bodyText: l.bodyText,
          practicalTask: l.practicalTask,
          keyTakeaways: l.keyTakeaways || [],
          quiz: l.quiz?.map((q: any, qIdx: number) => ({
            id: `q_${mIdx + 1}_${lIdx + 1}_${qIdx + 1}`,
            prompt: q.prompt,
            options: q.options || [],
            correctOptionIndex: q.correctOptionIndex || 0,
            explanation: q.explanation || ''
          }))
        }))
      })),
      coverGradient: 'from-emerald-800 to-teal-900',
      tags: ['CommunityMade', 'SkillShare', 'HandsOn'],
      isPublished: true,
      enrolledStudentsCount: 1,
      completionRatePercent: 0,
      reviews: [],
      averageRating: 5.0,
      isCommunitySponsored: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await MicroBizService.saveCourse(fullCourse);
    if (onSaveNewCourse) {
      onSaveNewCourse(fullCourse);
    }
    setCourseSavedSuccess(true);
  };

  // 2. Generate Copy
  const handleGenerateCopy = async () => {
    if (!productName.trim()) return;
    setIsGeneratingCopy(true);

    try {
      const response = await fetch('/api/microbiz/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          category: productCategory,
          details: productDetails,
          targetAudience,
          language: currentLanguage,
          provider: selectedProvider
        })
      });

      const data = await response.json();
      if (data.copy) {
        setGeneratedCopy(data.copy);
        setCopyAiMeta({
          isGenuineAi: !!data.isGenuineAi,
          isHeuristicFallback: !!data.isHeuristicFallback,
          provider: data.provider || (data.isGenuineAi ? (selectedProvider === 'gemini' ? 'gemini-3.8-flash' : 'gemma-4-26b-a4b-it') : 'microbiz-heuristic-engine'),
          fallbackNotice: data.fallbackNotice
        });
      }
    } catch (err) {
      console.warn('AI copy generator fallback:', err);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  // 3. Generate Plan
  const handleGeneratePlan = async () => {
    if (!bizName.trim() || !bizIdea.trim()) return;
    setIsGeneratingPlan(true);

    try {
      const response = await fetch('/api/microbiz/ai/generate-business-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: bizName,
          ideaSummary: bizIdea,
          location: bizLocation,
          language: currentLanguage,
          provider: selectedProvider
        })
      });

      const data = await response.json();
      if (data.plan) {
        setGeneratedPlan(data.plan);
        setPlanAiMeta({
          isGenuineAi: !!data.isGenuineAi,
          isHeuristicFallback: !!data.isHeuristicFallback,
          provider: data.provider || (data.isGenuineAi ? (selectedProvider === 'gemini' ? 'gemini-3.8-flash' : 'gemma-4-26b-a4b-it') : 'microbiz-heuristic-engine'),
          fallbackNotice: data.fallbackNotice
        });
      }
    } catch (err) {
      console.warn('AI business plan fallback:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>MICROBIZ CREATOR INTELLIGENCE</span>
          </div>

          {/* Model Provider Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-700/80">
            <span className="text-[10px] text-slate-300 font-mono px-2 uppercase tracking-wide">
              {isVi ? 'Mô hình:' : 'Model:'}
            </span>
            <button
              type="button"
              onClick={() => setSelectedProvider('gemma')}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono transition flex items-center space-x-1.5 cursor-pointer ${
                selectedProvider === 'gemma'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Gemma 4 (Open-Weight)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedProvider('gemini')}
              className={`px-3 py-1 rounded-xl text-[11px] font-mono transition flex items-center space-x-1.5 cursor-pointer ${
                selectedProvider === 'gemini'
                  ? 'bg-teal-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Gemini 3.5 Flash Lite</span>
            </button>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-serif">
          {isVi ? 'Trợ Lý AI Đồng Hành Sáng Tạo & Khởi Nghiệp' : 'AI Companion for Micro-Entrepreneurs'}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
          {isVi
            ? 'Bộ công cụ trợ lý AI được thiết kế đặc thù cho các hộ sản xuất nhỏ, nghệ nhân và người học cộng đồng. Không dùng thuật ngữ phức tạp—tập trung vào tính thực tế, trung thực và bền vững.'
            : 'Plain-language AI assistants tailored for neighborhood makers, artisan producers, and practical learners. Powered by open-weight Gemma with verifiable provenance.'}
        </p>

        {/* Identity & Persistence Notice */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] font-mono">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isVi ? `Đăng nhập: ${currentUser.name}` : `Author: ${currentUser.name}`}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/30">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isVi ? 'Chế độ Khách (Lưu cục bộ). Đăng nhập để đồng bộ Firestore' : 'Guest Sandbox (Local). Sign in to sync to Firestore'}</span>
            </div>
          )}
          <span className="text-slate-400">
            • Server-Side Gemma / Gemini Inference Proxy with Resilient Offline Fallback
          </span>
        </div>
      </div>

      {/* Tools Switcher */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTool('course')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTool === 'course' 
              ? 'bg-emerald-700 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{isVi ? 'Soạn Giáo Trình Khóa Học' : 'Course Curriculum Architect'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('copy')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTool === 'copy' 
              ? 'bg-emerald-700 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>{isVi ? 'Viết Mô Tả Sản Phẩm & Bài Đăng' : 'Artisan Product Storyteller'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('plan')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
            activeTool === 'plan' 
              ? 'bg-emerald-700 text-white shadow-xs' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isVi ? 'Kế Hoạch Khởi Nghiệp Tinh Gọn' : 'Lean Micro-Business Plan'}</span>
        </button>
      </div>

      {/* TOOL 1: COURSE CURRICULUM ARCHITECT */}
      {activeTool === 'course' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 font-serif text-sm">
              {isVi ? 'Thông Tin Khóa Học Dự Kiến' : 'Curriculum Blueprint Parameters'}
            </h3>

            <div className="space-y-1">
              <label className="font-mono text-slate-600 font-bold">{isVi ? 'Chủ Đề Hoặc Kỹ Năng' : 'Topic or Craft Skill'}</label>
              <input
                type="text"
                value={courseTopic}
                onChange={(e) => setCourseTopic(e.target.value)}
                placeholder="e.g. Làm nến thơm từ sáp đậu nành, Sửa chữa quạt máy gia đình..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-mono text-slate-600 font-bold">{isVi ? 'Cấp Độ' : 'Target Level'}</label>
                <select
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Beginner">Beginner (Người mới)</option>
                  <option value="Intermediate">Intermediate (Cơ bản)</option>
                  <option value="All Levels">All Levels (Đại chúng)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-600 font-bold">{isVi ? 'Lĩnh Vực' : 'Category'}</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Sustainable Crafts & Eco-Making">Sustainable Crafts</option>
                  <option value="Operations & Bookkeeping">Operations & Bookkeeping</option>
                  <option value="Community Repair">Community Repair</option>
                  <option value="Culinary & Fermentation">Culinary & Fermentation</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={isGeneratingCourse || !courseTopic.trim()}
              onClick={handleGenerateCourse}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isGeneratingCourse ? (isVi ? 'Đang tạo giáo trình...' : 'Generating Curriculum...') : (isVi ? 'Soạn Khóa Học Hoàn Chỉnh' : 'Generate Full Curriculum')}</span>
            </button>
          </div>

          {/* Result Preview */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                  GENERATED SYLLABUS
                </span>
                {courseAiMeta && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${
                    courseAiMeta.isGenuineAi 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {courseAiMeta.isGenuineAi ? `✨ Live AI (${courseAiMeta.provider})` : `⚡ Heuristic Engine (${courseAiMeta.provider})`}
                  </span>
                )}
              </div>

              {generatedCourse && (
                <button
                  type="button"
                  onClick={handleSaveCourseToPlatform}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  {courseSavedSuccess ? (isVi ? '✓ Đã Lưu Vào Khóa Học' : '✓ Saved to Catalog') : (isVi ? 'Lưu Vào Khóa Học' : 'Save to Catalog')}
                </button>
              )}
            </div>

            {courseAiMeta?.fallbackNotice && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                ℹ️ {courseAiMeta.fallbackNotice}
              </div>
            )}

            {generatedCourse ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-lg font-black text-slate-900 font-serif">
                    {generatedCourse.title}
                  </h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {generatedCourse.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {generatedCourse.modules?.map((m: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                      <div className="font-bold text-slate-900 flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono flex items-center justify-center">
                          {m.moduleNumber || idx + 1}
                        </span>
                        <span>{m.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{m.description}</p>
                      
                      <div className="space-y-1 pl-4 border-l-2 border-slate-200">
                        {m.lessons?.map((l: any, lIdx: number) => (
                          <div key={lIdx} className="text-[11px] text-slate-700">
                            • <strong>{l.title}</strong> ({l.estimatedMinutes}m): {l.practicalTask}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2 text-xs">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
                <p>{isVi ? 'Nhập chủ đề và bấm Soạn Khóa Học để AI thiết kế giáo trình.' : 'Enter a topic on the left and generate a complete structured curriculum.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 2: ARTISAN PRODUCT STORYTELLER */}
      {activeTool === 'copy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 font-serif text-sm">
              {isVi ? 'Thông Tin Sản Phẩm & Dịch Vụ' : 'Product & Story Details'}
            </h3>

            <div className="space-y-1">
              <label className="font-mono text-slate-600 font-bold">{isVi ? 'Tên Sản Phẩm' : 'Product or Offering Name'}</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-600 font-bold">{isVi ? 'Chi Tiết Vật Liệu & Quy Trình' : 'Materials & Craft Process'}</label>
              <textarea
                rows={3}
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-600 font-bold">{isVi ? 'Đối Tượng Hướng Đến' : 'Target Customer Persona'}</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="button"
              disabled={isGeneratingCopy || !productName.trim()}
              onClick={handleGenerateCopy}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isGeneratingCopy ? (isVi ? 'Đang viết lời giới thiệu...' : 'Crafting Copy...') : (isVi ? 'Tạo Bài Giới Thiệu Chân Thực' : 'Generate Story & Copy')}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                  AUTHENTIC COPY PREVIEW
                </span>
                {copyAiMeta && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${
                    copyAiMeta.isGenuineAi 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {copyAiMeta.isGenuineAi ? `✨ Live AI (${copyAiMeta.provider})` : `⚡ Heuristic Engine (${copyAiMeta.provider})`}
                  </span>
                )}
              </div>
            </div>

            {copyAiMeta?.fallbackNotice && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                ℹ️ {copyAiMeta.fallbackNotice}
              </div>
            )}

            {generatedCopy ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                  <span className="font-mono text-[10px] text-emerald-800 font-bold block uppercase">Catchy Hook</span>
                  <p className="font-serif font-black text-sm mt-0.5">"{generatedCopy.tagline}"</p>
                </div>

                <div className="space-y-1">
                  <strong className="font-mono text-[11px] text-slate-500 uppercase">Craft Story & Purpose:</strong>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                    {generatedCopy.storyDescription}
                  </p>
                </div>

                {generatedCopy.keyFeatures && (
                  <div className="space-y-1">
                    <strong className="font-mono text-[11px] text-slate-500 uppercase">Key Functional Highlights:</strong>
                    <ul className="space-y-1 pl-3 text-slate-700">
                      {generatedCopy.keyFeatures.map((feat: string, fIdx: number) => (
                        <li key={fIdx}>✓ {feat}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedCopy.socialPostSnippet && (
                  <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Ready to Share on Community Feed / Social</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCopy.socialPostSnippet);
                          setCopiedSnippet(true);
                          setTimeout(() => setCopiedSnippet(false), 2000);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSnippet ? 'Copied' : 'Copy Text'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                      {generatedCopy.socialPostSnippet}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2 text-xs">
                <Store className="w-10 h-10 mx-auto text-slate-300" />
                <p>{isVi ? 'Nhập thông tin sản phẩm và bấm Tạo Bài Giới Thiệu.' : 'Enter your product details and generate an honest, story-driven description.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 3: LEAN BUSINESS PLAN */}
      {activeTool === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 font-serif text-sm">
              {isVi ? 'Ý Tưởng Sinh Kế Tinh Gọn' : 'Lean Enterprise Seed'}
            </h3>

            <div className="space-y-1">
              <label className="font-mono text-slate-600 font-bold">{isVi ? 'Tên Dự Án / Hộ Kinh Doanh' : 'Enterprise Name'}</label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-600 font-bold">{isVi ? 'Tóm Tắt Ý Tưởng Cốt Lõi' : 'Idea Summary & What You Make'}</label>
              <textarea
                rows={3}
                value={bizIdea}
                onChange={(e) => setBizIdea(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-slate-600 font-bold">{isVi ? 'Địa Bàn & Kênh Phục Vụ' : 'Operating Territory'}</label>
              <input
                type="text"
                value={bizLocation}
                onChange={(e) => setBizLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="button"
              disabled={isGeneratingPlan || !bizName.trim()}
              onClick={handleGeneratePlan}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isGeneratingPlan ? (isVi ? 'Đang phác thảo kế hoạch...' : 'Drafting Canvas...') : (isVi ? 'Phác Thảo Kế Hoạch 1 Trang' : 'Generate 1-Page Lean Canvas')}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                  1-PAGE LEAN BUSINESS CANVAS
                </span>
                {planAiMeta && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${
                    planAiMeta.isGenuineAi 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {planAiMeta.isGenuineAi ? `✨ Live AI (${planAiMeta.provider})` : `⚡ Heuristic Engine (${planAiMeta.provider})`}
                  </span>
                )}
              </div>
            </div>

            {planAiMeta?.fallbackNotice && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                ℹ️ {planAiMeta.fallbackNotice}
              </div>
            )}

            {generatedPlan ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 sm:col-span-2">
                  <span className="font-mono text-[10px] text-emerald-800 font-bold block uppercase">Value Proposition</span>
                  <p className="text-slate-800 mt-1 font-serif text-sm font-bold">
                    {generatedPlan.valueProposition}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block uppercase">Target Neighbors & Buyers</span>
                  <ul className="space-y-1 pl-2 text-slate-700 text-[11px]">
                    {generatedPlan.customerSegments?.map((s: string, idx: number) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block uppercase">How to Reach Them</span>
                  <ul className="space-y-1 pl-2 text-slate-700 text-[11px]">
                    {generatedPlan.channelsToReachCustomers?.map((c: string, idx: number) => (
                      <li key={idx}>• {c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block uppercase">Key Cost Drivers</span>
                  <ul className="space-y-1 pl-2 text-slate-700 text-[11px]">
                    {generatedPlan.keyCostDrivers?.map((c: string, idx: number) => (
                      <li key={idx}>• {c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block uppercase">Action Milestones</span>
                  <ul className="space-y-1 pl-2 text-slate-700 text-[11px]">
                    {generatedPlan.dailyMilestones?.map((m: string, idx: number) => (
                      <li key={idx}>✓ {m}</li>
                    ))}
                  </ul>
                </div>

                {generatedPlan.communityGivebackIdea && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 sm:col-span-2 text-amber-950">
                    <span className="font-mono text-[10px] text-amber-800 font-bold block uppercase">Community Share & Giveback</span>
                    <p className="mt-1 text-xs">
                      {generatedPlan.communityGivebackIdea}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2 text-xs">
                <FileText className="w-10 h-10 mx-auto text-slate-300" />
                <p>{isVi ? 'Nhập ý tưởng và bấm Phác Thảo Kế Hoạch 1 Trang.' : 'Enter your enterprise seed idea to generate a structured 1-page canvas.'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
