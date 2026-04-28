import { useState, useEffect, useCallback } from 'react';
import type { speedCompliance } from '../model/types';
import { fetchSpeedCompliance } from '../api/speedCompliance';
import { POLLING_CONFIG } from '../../shared/config/polling';

export function useSpeedCompliance(pollingInterval = POLLING_CONFIG.DEFAULT_INTERVAL) { // Default 5 minutes
  const [stats, setStats] = useState<speedCompliance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    try {
      // setIsLoading(true); // Don't set loading on every poll to avoid UI flickering
      const data = await fetchSpeedCompliance();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching Speed Compliance stats:', err);
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
