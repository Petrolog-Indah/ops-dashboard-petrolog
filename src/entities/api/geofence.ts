import type { Geofence } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchGeofence(): Promise<Geofence> {
    const response = await fetch(`${BASE_URL}/api/geofence/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch geofence stats');
    }
    return await response.json();
}
