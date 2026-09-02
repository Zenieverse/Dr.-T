import React from 'react';
import { Stethoscope, AlertTriangle, CheckCircle, Pill, Calendar, User, FileText, ExternalLink } from 'lucide-react';
import { MedicalDocumentData } from '../../../types/readit';

interface MedicalModeCardProps {
  medicalData?: MedicalDocumentData;
  onJumpToPage: (pageNumber: number) => void;
}

export const MedicalModeCard: React.FC<MedicalModeCardProps> = ({
  medicalData,
  onJumpToPage,
}) => {
  if (!medicalData || !medicalData.isMedical) return null;

  return (
    <div className="bg-gradient-to-br from-teal-50/90 to-cyan-50/70 border border-teal-200/80 rounded-3xl p-5 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
              <span>Dr. T Clinical Biomarker Intelligence</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-teal-200/70 text-teal-900">
                Medical Mode
              </span>
            </h4>
            <p className="text-xs text-teal-700">
              Extracted structured laboratory observations & clinical encounters
            </p>
          </div>
        </div>

        {/* Patient / Doctor Metadata */}
        <div className="hidden sm:flex items-center space-x-4 text-xs text-slate-600 bg-white/70 px-3 py-1.5 rounded-xl border border-teal-100">
          {medicalData.patientName && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-teal-600" />
              <strong>{medicalData.patientName}</strong>
            </span>
          )}
          {medicalData.orderingPhysician && (
            <span className="flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              {medicalData.orderingPhysician}
            </span>
          )}
        </div>
      </div>

      {/* Extracted Lab Table */}
      {medicalData.labResults && medicalData.labResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 bg-teal-900 text-white text-xs font-bold flex items-center justify-between">
            <span>Biomarker & Laboratory Parameters</span>
            <span className="text-[10px] font-normal text-teal-200">
              {medicalData.labResults.filter(r => r.status !== 'NORMAL').length} Flagged / {medicalData.labResults.length} Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2 px-3">Test Name</th>
                  <th className="py-2 px-3">Result</th>
                  <th className="py-2 px-3">Reference Range</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {medicalData.labResults.map((item, i) => (
                  <tr key={i} className={item.status !== 'NORMAL' ? 'bg-amber-50/40' : ''}>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {item.name}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900 font-mono">
                      {item.value} <span className="text-[11px] font-normal text-slate-500">{item.unit}</span>
                    </td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                      {item.referenceRange}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'NORMAL'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => onJumpToPage(item.pageNumber)}
                        className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-0.5 hover:underline"
                      >
                        P.{item.pageNumber}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Physician Orders / Recommendations */}
      {medicalData.physicianRecommendations && medicalData.physicianRecommendations.length > 0 && (
        <div className="bg-white/80 rounded-2xl p-3.5 border border-teal-100 text-xs space-y-1.5">
          <div className="font-bold text-teal-950 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Documented Physician Orders & Follow-up Actions</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            {medicalData.physicianRecommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety Disclaimer Banner */}
      <div className="p-3 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-900 text-[11px] leading-relaxed flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>{medicalData.safetyDisclaimer}</div>
      </div>

    </div>
  );
};
