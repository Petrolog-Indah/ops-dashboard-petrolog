import type { CCTVStats } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchCCTVStats(): Promise<CCTVStats> {
    const response = await fetch(`${BASE_URL}/api/cctv/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch CCTV stats');
    }
    return await response.json();
}
