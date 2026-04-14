/**
 * STRUKTUR DATA KPI
 * Di sini Anda bisa mengubah Nama, Nilai (0-100), dan Kategori chart.
 */
export interface KpiItem {
  id: string;
  label: string;
  value: number;
  subLabel?: string;
  isRealTime?: boolean;
  category: 'ALL' | 'SOP' | 'QHSE' | 'Performance Effectiveness' | 'Efficiency & Productivity';
}

/**
 * DATA DASAR UNTUK SEMUA CHART (OVERVIEW)
 */
export const DASHBOARD_KPI_DATA: KpiItem[] = [
  // --- KATEGORI: SOP ---
  { id: '1', label: 'SOP Availability', value: 80, category: 'SOP' },
  { id: '2', label: 'SOP Compliance', value: 0, category: 'SOP' },
  
  // --- KATEGORI: QHSE ---
  { id: '3', label: 'Staff Healthy Result', value: 94, category: 'QHSE' },
  { id: '4', label: 'Staff Negative Result', value: 98, category: 'QHSE' },
  // { id: '5', label: '0 Accident Rate', value: 0, category: 'QHSE' },
  { id: '6', label: 'LTSI (Hours)', value: 0, category: 'QHSE' },
  
  // --- KATEGORI: PERFORMANCE ---
  { id: '7', label: 'License Compliance', value: 90, category: 'Performance Effectiveness' },
  { id: '8', label: 'Unit Valid Lincense', value: 0, category: 'Performance Effectiveness' },
  { id: '9', label: 'Certification Rate', value: 96, category: 'Performance Effectiveness' },
  { id: '10', label: 'CCTV Online', value: 0, category: 'Performance Effectiveness' },
  { id: '11', label: 'Dashcam Installed', value: 0, category: 'Performance Effectiveness' },
  { id: '12', label: 'Dashcam Online/Active', value: 0, category: 'Performance Effectiveness' },
  { id: '13', label: 'Commercial Rate', value: 0, category: 'Performance Effectiveness' },
  { id: '14', label: 'Fit Rate', value: 0, category: 'Performance Effectiveness' },
  { id: '15', label: 'Utilisation Rate', value: 0, category: 'Performance Effectiveness' },
  { id: '16', label: 'Within Geofence', value: 0, category: 'Performance Effectiveness' },
  { id: '17', label: 'Billed Jetty MTD', value: 0, category: 'Performance Effectiveness' },
  
  // --- KATEGORI: EFFICIENCY ---
  { id: '18', label: 'Proper Gear Utilization', value: 0, category: 'Efficiency & Productivity' },
  { id: '19', label: 'Speed-limit Compliance', value: 0, category: 'Efficiency & Productivity' },
  { id: '20', label: 'Unsafe Behavior Dashcam', value: 0, category: 'Efficiency & Productivity' },
  { id: '21', label: 'Average Man Hours', value: 40, category: 'Efficiency & Productivity' },
  { id: '22', label: 'Fuel Efficiency Km/L', value: 34, subLabel: '0.34', category: 'Efficiency & Productivity' },
  { id: '23', label: 'Oil Efficiency Km/L', value: 10, subLabel: '0.10', category: 'Efficiency & Productivity' },
  // { id: '24', label: 'Budget Efficiency', value: 0, category: 'Efficiency & Productivity' },
];

/**
 * DATA DETAILED (Dummy untuk setiap filter)
 * Tambahkan atau ubah data rincian di sini.
 */
export const DETAILED_KPI_DATA: KpiItem[] = [
  // Dummy SOP
  { id: 'sop-d1', label: 'SOP Availability', value: 97, category: 'SOP' },
  { id: 'sop-d2', label: 'SOP Complience', value: 0, category: 'SOP' },
  
  // Dummy QHSE
  { id: 'qhse-d1', label: 'Staff Healthy Result', value: 100, category: 'QHSE' },
  { id: 'qhse-d2', label: 'Staff Negative Result', value: 85, category: 'QHSE' },
  // { id: 'qhse-d3', label: '0 Accident Rate', value: 85, category: 'QHSE' },
  { id: 'qhse-d4', label: 'LTSI (Hours)', value: 85, category: 'QHSE' },
  { id: 'qhse-d5', label: 'License Compliance', value: 85, category: 'QHSE' },
  { id: 'qhse-d6', label: 'Unit Valid Lincense', value: 0, category: 'QHSE' },
  { id: 'qhse-d7', label: 'Certification Rate', value: 85, category: 'QHSE' },
  { id: 'qhse-d8', label: 'CCTV Online', value: 0, category: 'QHSE' },
  { id: 'qhse-d9', label: 'Dashcam Installed', value: 85, category: 'QHSE' },
  { id: 'qhse-d10', label: 'Dashcam Online/Active', value: 85, category: 'QHSE' },
  
  // Dummy Performance
  { id: 'perf-d1', label: 'Commercial Rate', value: 0, category: 'Performance Effectiveness' },
  { id: 'perf-d2', label: 'Fit Rate', value: 91, category: 'Performance Effectiveness' },
  { id: 'perf-d3', label: 'Utilisation Rate', value: 0, category: 'Performance Effectiveness' },
  { id: 'perf-d4', label: 'Billed Jetty MTD', value: 91, category: 'Performance Effectiveness' },
  { id: 'perf-d5', label: 'Within Geofence', value: 91, category: 'Performance Effectiveness' },
  
  // Dummy Efficiency
  { id: 'eff-d1', label: 'Proper Gear Utilization', value: 30, category: 'Efficiency & Productivity' },
  { id: 'eff-d2', label: 'Speed-limit Compliance', value: 77, category: 'Efficiency & Productivity' },
  { id: 'eff-d3', label: 'Unsafe Behavior Dashcam', value: 77, category: 'Efficiency & Productivity' },
  { id: 'eff-d4', label: 'Average Man Hours', value: 77, category: 'Efficiency & Productivity' },
  { id: 'eff-d5', label: 'Fuel Efficiency Km/L', value: 77, category: 'Efficiency & Productivity' },
  { id: 'eff-d6', label: 'Oil Efficiency Km/L', value: 77, category: 'Efficiency & Productivity' },
  // { id: 'eff-d7', label: 'Budget Efficiency', value: 77, category: 'Efficiency & Productivity' },
];
