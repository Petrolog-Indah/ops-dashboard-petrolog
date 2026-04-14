import type { JettyStats } from '../model/types';

const BASE_URL = import.meta.env.VITE_API_URL; // Matches the integration guide example

export async function fetchJettyStats(): Promise<JettyStats> {
    const response = await fetch(`${BASE_URL}/api/jms/stats/2026`);
    if (!response.ok) {
        throw new Error('Failed to fetch Jetty stats');
    }
    return await response.json();
}
