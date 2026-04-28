import type { Availability } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchAvailability(): Promise<Availability> {
    const response = await fetch(`${BASE_URL}/api/availability/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch availability stats');
    }
    return await response.json();
}
