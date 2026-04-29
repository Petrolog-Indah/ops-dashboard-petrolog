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
  Dashcam
} from '../model/types';
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
  };
  
  // UI State
  selectedMonth: string;
  activeFilter: string;
  historicalData: any[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedMonth: (month: string) => void;
  setActiveFilter: (filter: string) => void;
  fetchAllStats: () => Promise<void>;
  fetchHistoricalData: (month: string) => Promise<void>;
}

const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const currentMonthName = monthName[new Date().getMonth()];

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
  },
  selectedMonth: currentMonthName,
  activeFilter: 'ALL',
  historicalData: [],
  isLoading: false,
  error: null,

  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
    if (month !== 'April') { // Sesuaikan dengan bulan berjalan di project
      get().fetchHistoricalData(month);
    } else {
      set({ historicalData: [] });
    }
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  fetchAllStats: async () => {
    // Kita tidak set isLoading(true) di sini untuk menghindari flicker saat polling
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
        dashcam
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
        fetchDashcam()
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
          dashcam
        },
        error: null,
        isLoading: false
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      console.error('Error fetching KPI stats in store:', err);
    }
  },

  fetchHistoricalData: async (_month) => {
    set({ isLoading: true });
    try {
      const res = await Promise.all([
        fetchMetricHistory('CCTV Online'),
        fetchMetricHistory('Billed Jetty MTD'),
        fetchMetricHistory('Unit Valid Lincense'),
        fetchMetricHistory('Within Geofence')
      ]);
      set({ historicalData: res.flat(), isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  }
}));
