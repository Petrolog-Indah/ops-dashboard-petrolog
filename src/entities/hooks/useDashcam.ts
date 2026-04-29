import { useState, useEffect, useCallback } from 'react';
import type { Dashcam } from '../model/types';
import { fetchDashcam } from '../api/dashcam';
import { POLLING_CONFIG } from '../../shared/config/polling';

export function useDashcam(pollingInterval = POLLING_CONFIG.DEFAULT_INTERVAL) { // Default 5 minutes
  const [stats, setStats] = useState<Dashcam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchDashcam();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching dashcam stats:', err);
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
