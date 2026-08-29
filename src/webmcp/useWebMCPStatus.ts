import { useState, useEffect } from 'react';
import { WebMCPStatus } from './types';
import { globalWebMCPRegistry } from './registry';

export function useWebMCPStatus(): WebMCPStatus {
  const [status, setStatus] = useState<WebMCPStatus>(() => globalWebMCPRegistry.getStatus());

  useEffect(() => {
    const updateStatus = () => {
      setStatus(globalWebMCPRegistry.getStatus());
    };

    const unsubscribe = globalWebMCPRegistry.subscribe(() => {
      updateStatus();
    });

    const interval = setInterval(updateStatus, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return status;
}
