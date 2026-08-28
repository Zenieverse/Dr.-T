import React, { useState } from 'react';
import { ClinicalWorkflowItem, NavTab } from '../../types';
import { 
  Bot, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  X, 
  Edit3, 
  Check, 
  ChevronRight,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ClinicalAutomationProps {
  workflows: ClinicalWorkflowItem[];
  setActiveTab: (tab: NavTab) => void;
}

export const ClinicalAutomation: React.FC<ClinicalAutomationProps> = ({
  workflows: initialWorkflows,
  setActiveTab,
}) => {
  const [workflows, setWorkflows] = useState<ClinicalWorkflowItem[]>(initialWorkflows);
  const [selectedItem, setSelectedItem] = useState<ClinicalWorkflowItem | null>(
    initialWorkflows.find(w => w.status === 'WAITING FOR HUMAN') || initialWorkflows[0]
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setWorkflows(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: action === 'APPROVE' ? 'COMPLETED' : 'FAILED',
        };
      }
      return item;
    }));

    setToastMessage(`Action successfully ${action === 'APPROVE' ? 'Approved & Dispatched to EHR' : 'Rejected'}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pendingCount = workflows.filter(w => w.status === 'WAITING FOR HUMAN').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Clinical Workflow & RPA Control Center
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Human-in-the-loop robotic process automation for patient intake, chart synchronization, and lab routing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>{pendingCount} Pending Human Reviews</span>
          </span>
        </div>
      </div>

      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Pending Action Center & Pipeline Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Workflow Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Active Workflow Pipelines</h3>

            <div className="space-y-3">
              {workflows.map((wf) => {
                const isSelected = selectedItem?.id === wf.id;
                return (
                  <div
                    key={wf.id}
                    onClick={() => setSelectedItem(wf)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-50 border-teal-500 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-slate-100 text-slate-700">
                          {wf.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{wf.id}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        wf.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        wf.status === 'WAITING FOR HUMAN' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {wf.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-2">{wf.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{wf.proposedAction}</p>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <span>Started: {wf.startedAt}</span>
                      <span className={`font-semibold ${
                        wf.riskRating === 'High' ? 'text-rose-600' : 'text-slate-600'
                      }`}>
                        Risk Rating: {wf.riskRating}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Human-in-the-Loop Inspection & Decision Center (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          {selectedItem ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Human Decision Console</h3>
                  <p className="text-[11px] text-slate-500">{selectedItem.id} • {selectedItem.type}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                  {selectedItem.riskRating} Risk
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">Proposed Autonomous Action:</span>
                  <p className="text-slate-700 leading-relaxed">{selectedItem.proposedAction}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] space-y-1 overflow-x-auto">
                  <span className="text-slate-400 font-sans font-bold block">Raw Event Payload:</span>
                  <pre>{JSON.stringify(selectedItem.payload, null, 2)}</pre>
                </div>
              </div>

              {/* Action Buttons if waiting for human */}
              {selectedItem.status === 'WAITING FOR HUMAN' ? (
                <div className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(selectedItem.id, 'APPROVE')}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Dispatch</span>
                    </button>

                    <button
                      onClick={() => handleAction(selectedItem.id, 'REJECT')}
                      className="py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600">
                  This action has been executed and logged with an immutable audit hash.
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-xs text-slate-400">
              Select an item from the workflow queue to inspect.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
