// ==========================================
// HEDERA COMMONS: HederaCommonsPage
// Main Page Entry Point
// ==========================================

import React from 'react';
import { HederaDashboard } from '../components/HederaDashboard';
import { NavTab } from '../../../types';

interface HederaCommonsPageProps {
  onNavigateToTab?: (tab: NavTab) => void;
}

export const HederaCommonsPage: React.FC<HederaCommonsPageProps> = ({ onNavigateToTab }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <HederaDashboard onNavigateToTab={onNavigateToTab} />
      </div>
    </div>
  );
};

// Aliases for compatibility
export const HederaCommonsHome = HederaCommonsPage;
export default HederaCommonsPage;
