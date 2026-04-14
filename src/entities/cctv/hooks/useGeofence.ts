import { useState, useEffect, useCallback } from 'react';
import type { Geofence } from '../model/types';
import { fetchGeofence } from '../api/geofence';
import { POLLING_CONFIG } from '../../../shared/config/polling';

export function useGeofence(pollingInterval = POLLING_CONFIG.DEFAULT_INTERVAL) { // Default 5 minutes
  const [stats, setStats] = useState<Geofence | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchGeofence();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching geofence stats:', err);
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
