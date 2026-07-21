import type { KpiItem } from "../../entities/kpi";

export type FilterType = KpiItem['category'] | 'ALL';

export const DASHBOARD_FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All Data', value: 'ALL' },
  { label: 'SOP', value: 'SOP' },
  { label: 'QHSE', value: 'QHSE' },
  { label: 'Performance Effectiveness', value: 'Performance Effectiveness' },
  { label: 'Efficiency & Productivity', value: 'Efficiency & Productivity' },
];