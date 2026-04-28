import type { fuelEfficiency } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchFuelEfficiency(): Promise<fuelEfficiency> {
    const response = await fetch(`${BASE_URL}/api/fuel-efficiency/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch fuel efficiency stats');
    }
    return await response.json();
}
