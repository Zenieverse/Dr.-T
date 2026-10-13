import { FC, useState } from 'react';
import { MicroBizCourse, SkillLevel, CourseLesson, CourseModule } from '../types/microbizTypes';
import { MicroBizService } from '../services/microbizService';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Star, 
  Award, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  HelpCircle, 
  Check, 
  X, 
  Filter,
  PlusCircle,
  Share2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoursePlatformViewProps {
  courses: MicroBizCourse[];
  setCourses: (courses: MicroBizCourse[]) => void;
  searchQuery: string;
  currentLanguage?: string;
  currentUser?: any;
  isAuthenticated?: boolean;
  onOpenAiCourseCreator?: () => void;
}

export const CoursePlatformView: FC<CoursePlatformViewProps> = ({
  courses,
  setCourses,
  searchQuery,
  currentLanguage = 'en',
  currentUser,
  isAuthenticated = false,
  onOpenAiCourseCreator
}) => {
  const isVi = currentLanguage === 'vi';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  
  // Active course study view
  const [activeCourse, setActiveCourse] = useState<MicroBizCourse | null>(null);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  const [activeModuleNumber, setActiveModuleNumber] = useState<number>(1);
  
  // Enrollment and quiz state
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set(['les_1_1']));
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  
  // Certificate Modal
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: isVi ? 'Tất Cả Lĩnh Vực' : 'All Categories' },
    { id: 'Operations & Finance', label: isVi ? 'Tài Chính & Vận Hành' : 'Operations & Finance' },
    { id: 'Eco-Crafts & Sustainable Making', label: isVi ? 'Thủ Công & Bền Vững' : 'Eco-Crafts' },
    { id: 'Community Repair', label: isVi ? 'Sửa Chữa & Tái Sinh' : 'Repair & Hardware' },
    { id: 'Herbal Wellness & Natural Care', label: isVi ? 'Thảo Mộc & Sức Khỏe' : 'Herbal Wellness' },
  ];

  const levels: Array<{ id: string; label: string }> = [
    { id: 'all', label: isVi ? 'Mọi Cấp Độ' : 'All Levels' },
    { id: 'Beginner', label: isVi ? 'Người Mới Bắt Đầu' : 'Beginner' },
    { id: 'Intermediate', label: isVi ? 'Trung Cấp' : 'Intermediate' },
    { id: 'All Levels', label: isVi ? 'Cộng Đồng Chung' : 'All Levels' },
  ];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || c.skillLevel === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleSelectCourse = (course: MicroBizCourse) => {
    setActiveCourse(course);
    const firstLesson = course.modules[0]?.lessons[0] || null;
    setActiveLesson(firstLesson);
    setActiveModuleNumber(course.modules[0]?.moduleNumber || 1);
  };

  const handleCompleteLesson = async (lessonId: string) => {
    if (!activeCourse) return;
    const nextCompleted = new Set(completedLessonIds);
    nextCompleted.add(lessonId);
    setCompletedLessonIds(nextCompleted);

    const totalLessons = activeCourse.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    await MicroBizService.updateEnrollmentProgress(activeCourse.id, lessonId, totalLessons);

    // If all lessons in active course are completed, celebrate
    const allCourseLessonIds = activeCourse.modules.flatMap(m => m.lessons.map(l => l.id));
    const isFinished = allCourseLessonIds.every(id => nextCompleted.has(id));
    if (isFinished) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }
      setShowCertificateModal(true);
    }
  };

  const handleSelectQuizAnswer = (questionId: string, optionIndex: number) => {
    setSelectedQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = (questionId: string) => {
    setQuizSubmitted(prev => ({ ...prev, [questionId]: true }));
  };

  // If in Course Study Reader Mode
  if (activeCourse && activeLesson) {
    const allLessons = activeCourse.modules.flatMap(m => m.lessons);
    const completedInThisCourse = allLessons.filter(l => completedLessonIds.has(l.id)).length;
    const courseProgressPercent = Math.round((completedInThisCourse / Math.max(1, allLessons.length)) * 100);

    return (
      <div className="space-y-6">
        {/* Navigation & Progress Header */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setActiveCourse(null)}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
                <span>{activeCourse.category}</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold">{activeCourse.skillLevel}</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 font-serif line-clamp-1">
                {activeCourse.title}
              </h2>
            </div>
          </div>

          {/* Progress Bar & Certificate Launcher */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
            <div className="w-48">
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1">
                <span>{isVi ? 'Tiến độ học tập' : 'Course Progress'}</span>
                <span className="font-bold text-emerald-700">{courseProgressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${courseProgressPercent}%` }}
                />
              </div>
            </div>

            {courseProgressPercent === 100 && (
              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-xs transition cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isVi ? 'Chứng Nhận' : 'Certificate'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Study Layout: Sidebar Lessons + Main Lesson Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Syllabus Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                {isVi ? 'Mục Lục Khóa Học' : 'Course Curriculum'}
              </h3>

              <div className="space-y-4">
                {activeCourse.modules.map(module => (
                  <div key={module.id} className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                      <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-mono">
                        {module.moduleNumber}
                      </span>
                      <span>{module.title}</span>
                    </div>

                    <div className="space-y-1 pl-3 border-l-2 border-slate-100">
                      {module.lessons.map(lesson => {
                        const isDone = completedLessonIds.has(lesson.id);
                        const isCurrent = activeLesson.id === lesson.id;

                        return (
                          <button
                            key={lesson.id}
                            type="button"
                            onClick={() => {
                              setActiveLesson(lesson);
                              setActiveModuleNumber(module.moduleNumber);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                                : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center space-x-2 min-w-0 pr-2">
                              {isDone ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {lesson.estimatedMinutes}m
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator Bio Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 shadow-xs space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                {isVi ? 'Người Hướng Dẫn' : 'Course Creator'}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center font-black text-slate-950 font-serif">
                  {activeCourse.creatorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{activeCourse.creatorName}</h4>
                  <p className="text-[11px] text-slate-400">{activeCourse.creatorBio || 'Community Mentor'}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isVi 
                  ? 'Khóa học được đóng góp miễn phí theo tinh thần "Made for All, By All" để hỗ trợ sinh kế cộng đồng.' 
                  : 'Contributed freely in the spirit of "Made for All, By All" to nurture sustainable local livelihoods.'}
              </p>
            </div>
          </div>

          {/* Main Lesson Study View */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              {/* Lesson Top Meta */}
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-emerald-700">
                  <span>Module {activeModuleNumber}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {activeLesson.estimatedMinutes} {isVi ? 'phút thực hành' : 'mins reading & practice'}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 font-serif">
                  {activeLesson.title}
                </h1>
              </div>

              {/* Lesson Body Text */}
              <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line font-sans">
                {activeLesson.bodyText}
              </div>

              {/* Practical Hands-on Exercise Card */}
              {activeLesson.practicalTask && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{isVi ? 'Bài Tập Thực Hành Hôm Nay' : 'Hands-On Action Task'}</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    {activeLesson.practicalTask}
                  </p>
                </div>
              )}

              {/* Key Takeaways */}
              {activeLesson.keyTakeaways && activeLesson.keyTakeaways.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-600">
                    {isVi ? 'Điểm Cốt Lõi Cần Nhớ' : 'Key Takeaways'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeLesson.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive Lesson Quiz */}
              {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>{isVi ? 'Kiểm Tra Hiểu Biết Nhanh' : 'Quick Understanding Check'}</span>
                  </div>

                  {activeLesson.quiz.map(q => {
                    const answered = selectedQuizAnswers[q.id] !== undefined;
                    const submitted = quizSubmitted[q.id];
                    const selectedIdx = selectedQuizAnswers[q.id];
                    const isCorrect = selectedIdx === q.correctOptionIndex;

                    return (
                      <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          {q.prompt}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            let optionStyles = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400';
                            if (selectedIdx === oIdx) {
                              optionStyles = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                            }
                            if (submitted) {
                              if (oIdx === q.correctOptionIndex) {
                                optionStyles = 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold';
                              } else if (selectedIdx === oIdx && !isCorrect) {
                                optionStyles = 'bg-rose-100 border-rose-400 text-rose-950';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={submitted}
                                onClick={() => handleSelectQuizAnswer(q.id, oIdx)}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer ${optionStyles}`}
                              >
                                <span>{opt}</span>
                                {submitted && oIdx === q.correctOptionIndex && (
                                  <Check className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />
                                )}
                                {submitted && selectedIdx === oIdx && !isCorrect && (
                                  <X className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {!submitted ? (
                          <button
                            type="button"
                            disabled={!answered}
                            onClick={() => handleSubmitQuiz(q.id)}
                            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer"
                          >
                            {isVi ? 'Xác Nhận Đáp Án' : 'Check Answer'}
                          </button>
                        ) : (
                          <div className={`p-3 rounded-xl text-xs leading-relaxed ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                            <strong>{isCorrect ? '✓ ' + (isVi ? 'Chính xác!' : 'Correct!') : '✕ ' + (isVi ? 'Chưa chính xác.' : 'Not quite.')}</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Complete & Next Button Bar */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleCompleteLesson(activeLesson.id)}
                  className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs ${
                    completedLessonIds.has(activeLesson.id)
                      ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {completedLessonIds.has(activeLesson.id)
                      ? (isVi ? 'Đã Hoàn Thành Bài Này' : 'Lesson Completed')
                      : (isVi ? 'Đánh Dấu Đã Hoàn Thành' : 'Mark as Completed')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
                    if (currentIndex < allLessons.length - 1) {
                      setActiveLesson(allLessons[currentIndex + 1]);
                    } else {
                      setShowCertificateModal(true);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>{isVi ? 'Bài Tiếp Theo' : 'Next Lesson'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Modal */}
        {showCertificateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center space-y-2 border-b border-slate-100 pb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Award className="w-8 h-8 text-slate-950" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                  MICROBIZ COMMUNITY CREDENTIAL
                </span>
                <h3 className="text-xl font-black text-slate-900 font-serif">
                  {isVi ? 'Chứng Nhận Hoàn Thành Khóa Học' : 'Certificate of Completion'}
                </h3>
              </div>

              {/* Certificate Inner Preview */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/40 border-2 border-dashed border-amber-300 text-center space-y-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">
                  {isVi ? 'Chứng nhận trao cho:' : 'Proudly presented to:'}
                </p>
                <h4 className="text-2xl font-black text-slate-900 font-serif">
                  {currentUser?.name || (isVi ? 'Học viên cộng đồng' : 'Community Learner')}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  {isVi 
                    ? `Đã hoàn thành toàn bộ nội dung lý thuyết và bài tập thực hành trong khóa học:`
                    : `For successfully demonstrating practical mastery and completing all modules in:`}
                </p>
                <div className="p-2.5 rounded-xl bg-white border border-amber-200 font-bold text-sm text-slate-900 font-serif shadow-xs">
                  {activeCourse.title}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono pt-3 border-t border-amber-200/60 gap-2">
                  <span>Instructor: {activeCourse.creatorName}</span>
                  <span>Hash: CERT-MB-{Date.now().toString(36).toUpperCase()}</span>
                </div>
              </div>

              {/* Mandatory Transparency Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-snug">
                <strong>{isVi ? 'Thông báo minh bạch:' : 'Transparency Notice:'}</strong> {isVi
                  ? 'Đây là chứng nhận kỹ năng cộng đồng do MicroBiz phát hành, ghi nhận sự nỗ lực học tập thực tế và không thay thế cho bằng cấp đại học hoặc chứng chỉ được nhà nước công nhận.'
                  : 'This is a peer-verified community credential issued by MicroBiz acknowledging hands-on self-directed learning. It is not an accredited university diploma or state license.'}
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                >
                  {isVi ? 'Đóng' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Course Catalog Grid View
  return (
    <div className="space-y-6">
      {/* Catalog Header & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                {isVi ? 'Học Tập Sinh Kế & Kỹ Năng' : 'Community Learning Hub'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {filteredCourses.length} {isVi ? 'khóa học' : 'practical courses'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              {isVi ? 'Khóa Học Thực Hành Cho Mọi Người' : 'Peer-to-Peer Practical Courses'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isVi 
                ? 'Học từ những người thợ, nghệ nhân và chủ hộ kinh doanh thực tế. Không cần học phí đắt đỏ hay thuật ngữ phức tạp.' 
                : 'Free, bite-sized courses designed by experienced local makers and small business owners.'}
            </p>
          </div>

          {onOpenAiCourseCreator && (
            <button
              type="button"
              onClick={onOpenAiCourseCreator}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-xs cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isVi ? 'Tạo Khóa Học Với AI' : 'Draft Course with AI'}</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>{isVi ? 'Lĩnh Vực:' : 'Filter:'}</span>
          </div>

          {categories.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map(course => {
          const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between group"
            >
              {/* Header Gradient Banner */}
              <div className={`p-5 bg-gradient-to-r ${course.coverGradient || 'from-emerald-800 to-teal-900'} text-white space-y-2`}>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-bold">
                    {course.category}
                  </span>
                  <span className="text-emerald-200">{course.skillLevel}</span>
                </div>
                <h3 className="text-lg font-black font-serif group-hover:text-emerald-200 transition">
                  {course.title}
                </h3>
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {course.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 text-[10px] font-mono border border-slate-200">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.estimatedHours}h • {totalLessons} {isVi ? 'bài' : 'lessons'}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {course.averageRating} ({course.enrolledStudentsCount})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] text-slate-600">
                      By <strong className="text-slate-900">{course.creatorName}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectCourse(course)}
                      className="px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{isVi ? 'Bắt Đầu Học' : 'Start Course'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
