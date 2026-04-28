import type { speedCompliance } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchSpeedCompliance(): Promise<speedCompliance> {
    const response = await fetch(`${BASE_URL}/api/speed-compliance/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch speed compliance stats');
    }
    return await response.json();
}
