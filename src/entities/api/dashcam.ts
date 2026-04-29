import type { Dashcam } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchDashcam(): Promise<Dashcam> {
    const response = await fetch(`${BASE_URL}/api/dashcam/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch dashcam stats');
    }
    const json = await response.json();
    return json.data;
}
