// ==========================================
// HEDERA COMMONS: HashDisplay COMPONENT
// Full-fidelity accessible SHA-256 display
// ==========================================

import React, { useState } from 'react';
import { Copy, Check, Hash } from 'lucide-react';

interface HashDisplayProps {
  hash: string;
  label?: string;
  showIcon?: boolean;
  truncate?: boolean;
  className?: string;
}

export const HashDisplay: React.FC<HashDisplayProps> = ({
  hash,
  label = 'SHA-256 Digest',
  showIcon = true,
  truncate = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayHash = truncate && hash.length > 20
    ? `${hash.slice(0, 10)}...${hash.slice(-10)}`
    : hash;

  return (
    <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 font-mono text-xs ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1 text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center space-x-1">
            {showIcon && <Hash className="w-3 h-3 text-purple-600" />}
            <span>{label}</span>
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition flex items-center space-x-1"
            title="Copy full cryptographic hash"
            aria-label="Copy hash"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}
      <div 
        className="text-slate-900 break-all select-all font-bold text-[11px]" 
        title={hash}
      >
        {displayHash}
      </div>
    </div>
  );
};
