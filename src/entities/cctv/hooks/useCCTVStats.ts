import { useState, useEffect, useCallback } from 'react';
import type { CCTVStats } from '../model/types';
import { fetchCCTVStats } from '../api/cctvApi';

export function useCCTVStats(pollingInterval = 300000) { // Default 5 minutes
  const [stats, setStats] = useState<CCTVStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    try {
      // setIsLoading(true); // Don't set loading on every poll to avoid UI flickering
      const data = await fetchCCTVStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching CCTV stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();

    if (pollingInterval > 0) {
      const interval = setInterval(loadStats, pollingInterval);
      return () => clearInterval(interval);
    }
  }, [loadStats, pollingInterval]);

  return { stats, isLoading, error, refetch: loadStats };
}
