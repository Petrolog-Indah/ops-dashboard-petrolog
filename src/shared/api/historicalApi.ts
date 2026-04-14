export interface DailySnapshot {
    id: number;
    metricName: string;
    value: number | string;
    subLabel?: string;
    snapshotDate: string;
    createdAt: string;
}

export interface MonthlyAggregate {
    id: number;
    metricName: string;
    month: string;
    avgValue: number | string | null;
    minValue: number | string | null;
    maxValue: number | string | null;
    dataPoints: number;
    createdAt: string;
}

export interface MomComparison {
    currentSelectedMonth: MonthlyAggregate | null;
    previousAvailableMonth: MonthlyAggregate | null;
    momPercentageChange: number | null;
    trend: 'up' | 'down' | 'flat';
}

const BASE_URL = import.meta.env.VITE_HISTORICAL_API_URL || 'http://localhost:3000';

export async function fetchMetricHistory(metricName: string, startDate?: string, endDate?: string): Promise<DailySnapshot[]> {
    try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const url = `${BASE_URL}/api/metrics/${encodeURIComponent(metricName)}/history${queryString}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch history for ${metricName}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching metric history:', error);
        return [];
    }
}

export async function fetchMetricMoM(metricName: string, targetMonth?: string): Promise<MomComparison | null> {
    try {
        const queryParams = new URLSearchParams();
        if (targetMonth) queryParams.append('targetMonth', targetMonth);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const url = `${BASE_URL}/api/metrics/${encodeURIComponent(metricName)}/month-over-month${queryString}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch MoM calculation for ${metricName}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching metric MoM:', error);
        return null;
    }
}
