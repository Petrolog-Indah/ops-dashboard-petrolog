import type { SopCompliance } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchSopCompliance(): Promise<SopCompliance> {
    const response = await fetch(`${BASE_URL}/api/sop-compliance/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch SOP Compliance stats');
    }
    return await response.json();
}
