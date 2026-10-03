// ==========================================
// HEDERA COMMONS: TransactionStatus COMPONENT
// ==========================================

import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { TransactionState } from '../types/provenance';

interface TransactionStatusProps {
  state: TransactionState;
  errorMessage?: string | null;
  className?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  state,
  errorMessage,
  className = ''
}) => {
  const normState = state.toLowerCase();

  const states = [
    { key: 'preparing', label: 'Preparing Payload' },
    { key: 'submitting', label: 'Submitting to HCS' },
    { key: 'pending', label: 'Waiting for Consensus' },
    { key: 'confirmed', label: 'Confirmed on Ledger' }
  ];

  const getStepIndex = () => {
    if (normState === 'preparing') return 0;
    if (normState === 'submitting') return 1;
    if (normState === 'pending') return 2;
    if (normState === 'confirmed') return 3;
    return -1;
  };

  const currentIndex = getStepIndex();

  return (
    <div className={`p-4 rounded-2xl bg-white border border-slate-200 space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center space-x-2">
          {normState === 'confirmed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : normState === 'failed' ? (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          ) : (
            <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
          )}
          <span className="capitalize">
            {normState === 'idle' && 'Ready for Submission'}
            {normState === 'preparing' && 'Preparing HCS Message...'}
            {normState === 'submitting' && 'Submitting to Hedera Consensus Service...'}
            {normState === 'pending' && 'Awaiting Consensus Finality...'}
            {normState === 'confirmed' && 'Transaction Confirmed by Consensus!'}
            {normState === 'failed' && 'Transaction Failed'}
          </span>
        </span>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {states.map((st, idx) => {
          const isDone = currentIndex > idx || normState === 'confirmed';
          const isCurrent = currentIndex === idx;
          return (
            <div key={st.key} className="space-y-1">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500'
                    : isCurrent
                    ? 'bg-purple-600 animate-pulse'
                    : 'bg-slate-200'
                }`}
              />
              <span className={`text-[10px] block truncate ${
                isCurrent ? 'font-bold text-purple-700' : isDone ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {normState === 'failed' && errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
