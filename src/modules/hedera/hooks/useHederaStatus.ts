// ==========================================
// HEDERA COMMONS: useHederaStatus HOOK
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { HederaStatusResponse } from '../types/hedera';
import { HederaClientApi } from '../../../services/hederaClientApi';

export function useHederaStatus() {
  const [status, setStatus] = useState<HederaStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await HederaClientApi.getStatus();
      setStatus(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Hedera status');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    isLoading,
    error,
    refetch: fetchStatus
  };
}
