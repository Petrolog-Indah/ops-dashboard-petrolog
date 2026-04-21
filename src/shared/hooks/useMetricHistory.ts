import { useState, useEffect } from 'react';
import { fetchMetricHistory, fetchMetricMoM } from '../api/historicalApi';
import type { DailySnapshot, MomComparison } from '../api/historicalApi';

export function useMetricHistory(metricName: string, startDate?: string, endDate?: string) {
    const [data, setData] = useState<DailySnapshot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setIsLoading(true);
                const result = await fetchMetricHistory(metricName, startDate, endDate);
                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, [metricName, startDate, endDate]);

    return { data, isLoading, error };
}

export function useMetricMoM(metricName: string, targetMonth?: string) {
    const [data, setData] = useState<MomComparison | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                setIsLoading(true);
                const result = await fetchMetricMoM(metricName, targetMonth);
                if (isMounted) {
                    setData(result);
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        if (metricName) {
            loadData();
        }

        return () => {
            isMounted = false;
        };
    }, [metricName, targetMonth]);

    return { data, isLoading, error };
}
