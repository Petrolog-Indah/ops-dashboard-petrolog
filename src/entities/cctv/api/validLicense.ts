import type { validLicense } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchValidLicense(): Promise<validLicense> {
    const response = await fetch(`${BASE_URL}/api/valid-lincense/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch valid license stats');
    }
    return await response.json();
}
