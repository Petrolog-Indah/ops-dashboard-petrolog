import type { FitRate } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchFitRate(): Promise<FitRate> {
    const response = await fetch(`${BASE_URL}/api/fit-rate/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch Fit Rate stats');
    }
    return await response.json();
}
