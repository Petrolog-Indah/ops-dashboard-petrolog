import type { CCTVStats } from '../model/types';

const BASE_URL = 'https://dash.petrolog.my.id'; // Matches the integration guide example

export async function fetchCCTVStats(): Promise<CCTVStats> {
    const response = await fetch(`${BASE_URL}/api/cctv/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch CCTV stats');
    }
    return await response.json();
}
