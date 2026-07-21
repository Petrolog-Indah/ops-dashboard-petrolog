import type { P2HToolboxCompliance } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function fetchP2HComplianceNew( start: string, end: string ): Promise<P2HToolboxCompliance> {
    const params = new URLSearchParams({
        start,
        end
    });
    
    const response = await fetch(`${BASE_URL}/api/daily-activity/stats?${params.toString()}`);
    console.log(response)
    if (!response.ok) {
        throw new Error('Failed to fetch P2H and TBM compliance');
    }
    return await response.json();
}
