import { useState, useEffect, useCallback } from 'react';
import type { fuelEfficiency } from '../model/types';
import { fetchFuelEfficiency } from '../api/fuel-efficiency';
import { POLLING_CONFIG } from '../../shared/config/polling';

export function useFuelEfficiency(pollingInterval = POLLING_CONFIG.DEFAULT_INTERVAL) { // Default 5 minutes
  const [stats, setStats] = useState<fuelEfficiency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStats = useCallback(async () => {
    try {
      // setIsLoading(true); // Don't set loading on every poll to avoid UI flickering
      const data = await fetchFuelEfficiency();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching Fuel Efficiency stats:', err);
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
