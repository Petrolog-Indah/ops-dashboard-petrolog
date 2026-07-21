import { create } from 'zustand';
import type { 
  CCTVStats, 
  JettyStats, 
  validLicense, 
  Availability, 
  Geofence, 
  FitRate, 
  fuelEfficiency, 
  SopCompliance, 
  speedCompliance,
  Dashcam,
  P2HToolboxCompliance
} from '../model/types';
import type { FilterType } from '../../widgets/dashboardFilters/DashboardFilters';
import type { DailySnapshot } from '../../shared/api/historicalApi';
import { fetchCCTVStats } from '../api/cctv';
import { fetchJettyStats } from '../api/jetty';
import { fetchValidLicense } from '../api/validLicense';
import { fetchAvailability } from '../api/availability';
import { fetchGeofence } from '../api/geofence';
import { fetchFitRate } from '../api/fitRate';
import { fetchFuelEfficiency } from '../api/fuelEfficiency';
import { fetchSopCompliance } from '../api/sopCompliance';
import { fetchSpeedCompliance } from '../api/speedCompliance';
import { fetchDashcam } from '../api/dashcam';
import { fetchMetricHistory } from '../../shared/api/historicalApi';
// import { fetchP2HCompliance } from '../api/p2hTbm';
import { fetchP2HComplianceNew } from '../api/p2hTbmNew';

interface KpiState {
  // Data Stats
  stats: {
    cctv: CCTVStats | null;
    jetty: JettyStats | null;
    validLicense: validLicense | null;
    availability: Availability | null;
    geofence: Geofence | null;
    fitRate: FitRate | null;
    fuelEfficiency: fuelEfficiency | null;
    sopCompliance: SopCompliance | null;
    speedCompliance: speedCompliance | null;
    dashcam: Dashcam | null;
    p2hTbmCompliance: P2HToolboxCompliance | null;
  };
  
  // UI State
  selectedMonth: string;
  activeFilter: FilterType;
  historicalData: DailySnapshot[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedMonth: (month: string) => void;
  setActiveFilter: (filter: FilterType) => void;
  fetchAllStats: () => Promise<void>;
  fetchHistoricalData: (month: string) => Promise<void>;
}

const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const currentMonthName = monthName[new Date().getMonth()];

const now = new Date();

// Daily range for P2H/TBM compliance
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const useKpiStore = create<KpiState>((set, get) => ({
  stats: {
    cctv: null,
    jetty: null,
    validLicense: null,
    availability: null,
    geofence: null,
    fitRate: null,
    fuelEfficiency: null,
    sopCompliance: null,
    speedCompliance: null,
    dashcam: null,
    p2hTbmCompliance: null,
  },
  selectedMonth: currentMonthName,
  activeFilter: 'ALL',
  historicalData: [],
  isLoading: false,
  error: null,

  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
    if (month !== currentMonthName) { 
      get().fetchHistoricalData(month);
    } else {
      set({ historicalData: [] });
    }
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  fetchAllStats: async () => {
    try {
      const [
        cctv, 
        jetty, 
        validLicense, 
        availability, 
        geofence, 
        fitRate, 
        fuel, 
        sop, 
        speed,
        dashcam,
        p2hTbm
      ] = await Promise.all([
        fetchCCTVStats(),
        fetchJettyStats(),
        fetchValidLicense(),
        fetchAvailability(),
        fetchGeofence(),
        fetchFitRate(),
        fetchFuelEfficiency(),
        fetchSopCompliance(),
        fetchSpeedCompliance(),
        fetchDashcam(),
        // fetchP2HCompliance(new Date().getMonth() + 1, new Date().getFullYear()),
        fetchP2HComplianceNew(formatDate(today), formatDate(tomorrow))
      ]);

      set({
        stats: {
          cctv,
          jetty,
          validLicense,
          availability,
          geofence,
          fitRate,
          fuelEfficiency: fuel,
          sopCompliance: sop,
          speedCompliance: speed,
          dashcam,
          p2hTbmCompliance: p2hTbm,
        },
        error: null,
        isLoading: false
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      console.error('Error fetching KPI stats in store:', err);
    }
  },

  fetchHistoricalData: async (monthStr) => {
    set({ isLoading: true });
    try {
      const monthIndex = monthName.indexOf(monthStr);
      if (monthIndex === -1) {
          set({ historicalData: [], isLoading: false });
          return;
      }
      
      const year = new Date().getFullYear();
      // start of month
      const start = new Date(year, monthIndex, 1);
      // end of month
      const end = new Date(year, monthIndex + 1, 0);

      const startDateStr = formatDate(start);
      const endDateStr = formatDate(end);

      const metrics = [
        'CCTV Online',
        'Billed Jetty MTD',
        'Unit Valid License',
        'Fit Rate',
        'Within Geofence',
        'Commercial Rate',
        'Utilisation Rate',
        'Fuel Efficiency',
        'SOP Compliance',
        'Speed-Limit Compliance',
        'Speed Limit Compliance', // Fallback utk DB yg typo
        'Dashcam Installed',
        'Dashcam Online',
        'Safe Driving Index',
        'Unsafe Behavior Dashcam', // Fallback utk DB yg typo
        'P2H Compliance',
        'TBM Compliance'
      ];

      const res = await Promise.all(
        metrics.map(metric => fetchMetricHistory(metric, startDateStr, endDateStr))
      );
      
      set({ historicalData: res.flat(), isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  }
}));
