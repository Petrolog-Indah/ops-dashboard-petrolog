import type { P2HToolboxCompliance } from '../model/types';

const BASE_URL = import.meta.env.VITE_P2H_URL;
const API_KEY  = import.meta.env.VITE_P2H_API_KEY;

interface P2HRawRecord {
    p2h_checked: boolean;
    toolbox_checked: boolean;
    staff_uid: string;
}

interface P2HRawResponse {
    count: number;
    period: P2HToolboxCompliance['period'];
    data: P2HRawRecord[];
}

export async function fetchP2HCompliance(month: number, year: number): Promise<P2HToolboxCompliance> {
    const params = new URLSearchParams({
        month:    String(month),
        year:     String(year),
        activity: 'both',
        format:   'json',
    });

    const response = await fetch(`${BASE_URL}?${params}`, {
        headers: { 'x-api-key': API_KEY },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch P2H/TBM compliance: HTTP ${response.status}`);
    }

    const raw: P2HRawResponse = await response.json();

    const totalRecords = raw.count ?? 0;
    const p2hChecked   = raw.data.filter(d => d.p2h_checked === true).length;
    const tbmChecked   = raw.data.filter(d => d.toolbox_checked === true).length;

    const uniqueStaff = new Set(raw.data.map(d => d.staff_uid)).size;
    const totalBase   = uniqueStaff > 0 ? uniqueStaff : totalRecords;

    return {
        period:         raw.period,
        count:          totalRecords,
        p2h_percentage: totalRecords > 0 ? Math.round((p2hChecked / totalRecords) * 100) : 0,
        tbm_percentage: totalRecords > 0 ? Math.round((tbmChecked / totalRecords) * 100) : 0,
        p2h_checked:    p2hChecked,
        tbm_checked:    tbmChecked,
        total_staff:    totalBase,
    };
}
