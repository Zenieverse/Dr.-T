// ==========================================
// HEDERA COMMONS: useProvenance HOOK
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { ProvenanceRecord, RegisterProvenanceRequest } from '../types/provenance';
import { HederaClientApi } from '../../../services/hederaClientApi';

export interface ProvenanceFilter {
  artifactType?: string;
  privacy?: string;
  query?: string;
  verifiedOnly?: boolean;
}

export function useProvenance(initialFilter?: ProvenanceFilter) {
  const [records, setRecords] = useState<ProvenanceRecord[]>([]);
  const [stats, setStats] = useState<any>({
    totalRecords: 0,
    verifiedRecords: 0,
    researchArtifacts: 0,
    knowledgeRecords: 0,
    aiArtifacts: 0,
    ecologicalRecords: 0,
    lastVerificationTimestamp: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async (filter?: ProvenanceFilter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await HederaClientApi.getRecords((filter || initialFilter) as any);
      setRecords((data.records || []) as any);
      if (data.stats) setStats(data.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch provenance records');
    } finally {
      setIsLoading(false);
    }
  }, [initialFilter]);

  const registerArtifact = async (req: RegisterProvenanceRequest): Promise<ProvenanceRecord> => {
    const res = await HederaClientApi.registerProvenance(req as any);
    await fetchRecords();
    return res.record as any;
  };

  useEffect(() => {
    fetchRecords(initialFilter);
  }, [fetchRecords, initialFilter]);

  return {
    records,
    stats,
    isLoading,
    error,
    refreshRecords: fetchRecords,
    registerArtifact,
    setRecords
  };
}
