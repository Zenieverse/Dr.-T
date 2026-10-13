import { FC, useState } from 'react';
import { ModerationReport } from '../types/microbizTypes';
import { INITIAL_MODERATION_REPORTS } from '../data/initialMicroBizData';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  FileCheck, 
  ExternalLink, 
  Lock,
  HeartHandshake,
  Eye,
  Check
} from 'lucide-react';

interface TrustAdminViewProps {
  currentLanguage?: string;
}

export const TrustAdminView: FC<TrustAdminViewProps> = ({
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const [reports, setReports] = useState<ModerationReport[]>(INITIAL_MODERATION_REPORTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [actionNotices, setActionNotices] = useState<Record<string, string>>({});

  const handleResolveReport = (reportId: string, status: 'reviewed_approved' | 'reviewed_removed') => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
    setActionNotices(prev => ({
      ...prev,
      [reportId]: status === 'reviewed_approved' 
        ? (isVi ? 'Đã duyệt: Nội dung tuân thủ quy chuẩn.' : 'Approved: Content adheres to community standards.')
        : (isVi ? 'Đã gỡ bỏ: Đã ẩn nội dung vi phạm.' : 'Removed: Violation confirmed and content hidden.')
    }));
  };

  const filteredReports = reports.filter(r => {
    if (activeFilter === 'pending') return r.status === 'pending';
    if (activeFilter === 'resolved') return r.status !== 'pending';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
            {isVi ? 'An Toàn, Minh Bạch & Đạo Đức' : 'Trust, Safety & Governance'}
          </span>
          <span className="text-xs text-slate-500 font-mono">Zero-Deception Standard</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
          {isVi ? 'Ban Điều Hành & Chuẩn Mực Cộng Đồng' : 'Community Trust & Moderation Desk'}
        </h2>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          {isVi 
            ? 'Bảo vệ người học và người tiêu dùng khỏi quảng cáo gian lận, thần thánh hóa dược liệu, spam đa cấp và đạo nhái sản phẩm truyền thống.' 
            : 'Protecting learners and patrons from misleading claims, false medical promises, financial spam, and uncredited cultural appropriation.'}
        </p>
      </div>

      {/* 4 Pillars of MicroBiz Community Safety Charter */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h4 className="text-xs font-bold text-slate-900 font-serif">
            {isVi ? 'Không Khẳng Định Chữa Bệnh' : 'No Medical Cure Claims'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isVi 
              ? 'Xà phòng và thảo mộc chỉ dùng chăm sóc ngoài da, cấm tuyệt đối tuyên bố "chữa khỏi bệnh nan y" hoặc thay thế chẩn đoán bác sĩ.' 
              : 'Soaps and teas are for wellness, never cure claims. Aligned directly with Dr. T clinical safety guardrails.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h4 className="text-xs font-bold text-slate-900 font-serif">
            {isVi ? 'Minh Bạch Giá & Xuất Xứ' : 'Pricing & Origin Honesty'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isVi 
              ? 'Công khai rõ ràng vật liệu đầu vào, không độn phụ gia độc hại hay tính phí ẩn sau khi đã đồng ý đơn hàng.' 
              : 'Full transparency on raw ingredients. Zero hidden fees after customer quotation approval.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h4 className="text-xs font-bold text-slate-900 font-serif">
            {isVi ? 'Tôn Trọng Bản Quyền Làng Nghề' : 'Craft & Heritage Attribution'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isVi 
              ? 'Ghi nhận công sức của người thợ bản địa, cấm sao chép nguyên mẫu để tự nhận là của riêng.' 
              : 'Credit indigenous artisans and ancestral craft techniques. Anti-plagiarism enforcement.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
            4
          </div>
          <h4 className="text-xs font-bold text-slate-900 font-serif">
            {isVi ? 'Chứng Nhận Thực Chất' : 'Credential Transparency'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {isVi 
              ? 'Chứng nhận MicroBiz công nhận nỗ lực thực hành cộng đồng, không mạo danh bằng cấp trường đại học.' 
              : 'MicroBiz certificates acknowledge peer effort and are transparently non-state-accredited.'}
          </p>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              {isVi ? 'Hàng Đợi Xử Lý Báo Cáo Vi Phạm' : 'Community Moderation Queue'}
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {reports.filter(r => r.status === 'pending').length} pending reports
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['all', 'pending', 'resolved'] as const).map(filter => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer capitalize ${
                  activeFilter === filter ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter === 'all' ? (isVi ? 'Tất cả' : 'All') : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredReports.map(report => (
            <div 
              key={report.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    report.status === 'pending'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : report.status === 'reviewed_removed'
                      ? 'bg-rose-100 text-rose-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {report.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Target: {report.targetType.toUpperCase()} #{report.targetId}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  Reported {report.createdAt}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 font-serif">
                  {report.targetTitle}
                </h4>
                <div className="text-xs text-slate-600 mt-1">
                  <strong>Reason:</strong> <span className="font-mono text-rose-700">{report.reason}</span>
                </div>
                <p className="text-xs text-slate-700 mt-1 italic bg-white p-2.5 rounded-xl border border-slate-200/60">
                  "{report.notes}"
                </p>
              </div>

              {actionNotices[report.id] && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200">
                  ✓ {actionNotices[report.id]}
                </div>
              )}

              {report.status === 'pending' && (
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => handleResolveReport(report.id, 'reviewed_approved')}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition cursor-pointer"
                  >
                    {isVi ? 'Hợp Lệ • Giữ Lại' : 'Keep & Dismiss'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResolveReport(report.id, 'reviewed_removed')}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    {isVi ? 'Gỡ Bỏ Nội Dung' : 'Remove Content'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
