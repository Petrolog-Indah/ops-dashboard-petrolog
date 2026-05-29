import { useState, useEffect, useCallback } from 'react';
import type { P2HToolboxCompliance } from '../model/types';
import { fetchP2HComplianceNew } from '../api/p2hTbmNew';
import { POLLING_CONFIG } from '../../shared/config/polling';

export function useAvailability(pollingInterval = POLLING_CONFIG.DEFAULT_INTERVAL) { // Default 5 minutes
  const [stats, setStats] = useState<P2HToolboxCompliance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    try {
      const data = await fetchP2HComplianceNew(formatDate(startOfMonth), formatDate(endOfMonth));
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching valid license stats:', err);
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
