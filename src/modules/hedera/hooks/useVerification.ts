// ==========================================
// HEDERA COMMONS: useVerification HOOK
// ==========================================

import { useState } from 'react';
import { VerificationResult, VerifyProvenanceRequest } from '../types/provenance';
import { HederaClientApi } from '../../../services/hederaClientApi';

export function useVerification() {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyArtifact = async (req: VerifyProvenanceRequest): Promise<VerificationResult | null> => {
    setIsVerifying(true);
    setError(null);
    try {
      const res = await HederaClientApi.verifyProvenance(req as any);
      setResult(res as any);
      return res as any;
    } catch (err: any) {
      setError(err.message || 'Verification execution failed');
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setResult(null);
    setError(null);
  };

  return {
    isVerifying,
    result,
    error,
    verifyArtifact,
    resetVerification
  };
}
