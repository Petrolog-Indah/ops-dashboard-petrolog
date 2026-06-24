import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GaugeChart } from '../shared/ui/GaugeChart';
import { TrendChart } from '../shared/ui/TrendChart';

const KPI_DETAIL_MAP: Record<string, {
  label: string;
  value: number;
  subLabel: string;
  description: string;
  unit: string;
  trend: { time: string; efficiency: number; idle_ratio: number; distance_km: number; }[];
}> = {
  'availability': {
    label: 'Availability',
    value: 78,
    subLabel: '78%',
    description: 'Persentase unit yang siap operasi dari total armada',
    unit: '%',
    trend: [
      { time: '06:00', efficiency: 72, idle_ratio: 28, distance_km: 0 },
      { time: '08:00', efficiency: 75, idle_ratio: 25, distance_km: 0 },
      { time: '10:00', efficiency: 78, idle_ratio: 22, distance_km: 0 },
      { time: '12:00', efficiency: 76, idle_ratio: 24, distance_km: 0 },
      { time: '14:00', efficiency: 80, idle_ratio: 20, distance_km: 0 },
      { time: '16:00', efficiency: 77, idle_ratio: 23, distance_km: 0 },
    ]
  },
  'unit-active': {
    label: 'Unit Active',
    value: 76,
    subLabel: '42/55',
    description: 'Jumlah unit yang sedang aktif beroperasi',
    unit: '%',
    trend: [
      { time: '06:00', efficiency: 65, idle_ratio: 35, distance_km: 0 },
      { time: '08:00', efficiency: 70, idle_ratio: 30, distance_km: 0 },
      { time: '10:00', efficiency: 76, idle_ratio: 24, distance_km: 0 },
      { time: '12:00', efficiency: 74, idle_ratio: 26, distance_km: 0 },
      { time: '14:00', efficiency: 78, idle_ratio: 22, distance_km: 0 },
      { time: '16:00', efficiency: 75, idle_ratio: 25, distance_km: 0 },
    ]
  },
  'utilization': {
    label: 'Utilization',
    value: 74,
    subLabel: '74%',
    description: 'Rasio penggunaan unit terhadap waktu tersedia',
    unit: '%',
    trend: [
      { time: '06:00', efficiency: 68, idle_ratio: 32, distance_km: 0 },
      { time: '08:00', efficiency: 72, idle_ratio: 28, distance_km: 0 },
      { time: '10:00', efficiency: 74, idle_ratio: 26, distance_km: 0 },
      { time: '12:00', efficiency: 71, idle_ratio: 29, distance_km: 0 },
      { time: '14:00', efficiency: 76, idle_ratio: 24, distance_km: 0 },
      { time: '16:00', efficiency: 73, idle_ratio: 27, distance_km: 0 },
    ]
  },
  'fuel-efficiency': {
    label: 'Fuel Efficiency',
    value: 62,
    subLabel: '6.2 km/L',
    description: 'Rata-rata efisiensi bahan bakar seluruh unit aktif',
    unit: 'km/L',
    trend: [
      { time: '06:00', efficiency: 5.8, idle_ratio: 30, distance_km: 120 },
      { time: '08:00', efficiency: 6.0, idle_ratio: 25, distance_km: 180 },
      { time: '10:00', efficiency: 6.2, idle_ratio: 22, distance_km: 250 },
      { time: '12:00', efficiency: 5.9, idle_ratio: 28, distance_km: 310 },
      { time: '14:00', efficiency: 6.3, idle_ratio: 20, distance_km: 380 },
      { time: '16:00', efficiency: 6.1, idle_ratio: 24, distance_km: 420 },
    ]
  },
  'safety-score': {
    label: 'Safety Score',
    value: 92,
    subLabel: '92/100',
    description: 'Indeks keselamatan berdasarkan insiden dan perilaku',
    unit: '/100',
    trend: [
      { time: 'Mon', efficiency: 88, idle_ratio: 12, distance_km: 0 },
      { time: 'Tue', efficiency: 90, idle_ratio: 10, distance_km: 0 },
      { time: 'Wed', efficiency: 91, idle_ratio: 9, distance_km: 0 },
      { time: 'Thu', efficiency: 92, idle_ratio: 8, distance_km: 0 },
      { time: 'Fri', efficiency: 91, idle_ratio: 9, distance_km: 0 },
      { time: 'Sat', efficiency: 93, idle_ratio: 7, distance_km: 0 },
    ]
  },
  'fit-rate': {
    label: 'Fit Rate',
    value: 88,
    subLabel: '88%',
    description: 'Persentase unit yang laik operasi',
    unit: '%',
    trend: [
      { time: '06:00', efficiency: 85, idle_ratio: 15, distance_km: 0 },
      { time: '08:00', efficiency: 86, idle_ratio: 14, distance_km: 0 },
      { time: '10:00', efficiency: 88, idle_ratio: 12, distance_km: 0 },
      { time: '12:00', efficiency: 87, idle_ratio: 13, distance_km: 0 },
      { time: '14:00', efficiency: 88, idle_ratio: 12, distance_km: 0 },
      { time: '16:00', efficiency: 87, idle_ratio: 13, distance_km: 0 },
    ]
  },
  'cctv-online': {
    label: 'CCTV Online',
    value: 95,
    subLabel: '95%',
    description: 'Persentase CCTV yang online dari total terpasang',
    unit: '%',
    trend: [
      { time: '06:00', efficiency: 93, idle_ratio: 7, distance_km: 0 },
      { time: '08:00', efficiency: 94, idle_ratio: 6, distance_km: 0 },
      { time: '10:00', efficiency: 95, idle_ratio: 5, distance_km: 0 },
      { time: '12:00', efficiency: 94, idle_ratio: 6, distance_km: 0 },
      { time: '14:00', efficiency: 95, idle_ratio: 5, distance_km: 0 },
      { time: '16:00', efficiency: 94, idle_ratio: 6, distance_km: 0 },
    ]
  },
};

export default function KpiDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const detail = id ? KPI_DETAIL_MAP[id] : undefined;

  if (!id || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-700">KPI not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            &larr; Back to Command Center
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 md:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-slate-400 hover:text-emerald-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{detail.label}</h1>
            <p className="text-xs text-slate-400 font-medium">{detail.description}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GaugeChart
              value={detail.value}
              label={detail.label}
              subLabel={detail.subLabel}
              isRealTime
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
          >
            <h3 className="text-sm font-bold text-slate-700 mb-3">Trend Hari Ini</h3>
            <TrendChart
              label={detail.label}
              subLabel={detail.subLabel}
              trend={detail.trend}
            />
          </motion.div>
        </div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
        >
          {[
            { label: 'Current Value', value: detail.value, suffix: detail.unit },
            { label: 'Min Today', value: Math.max(0, detail.value - 8), suffix: detail.unit },
            { label: 'Max Today', value: Math.min(100, detail.value + 5), suffix: detail.unit },
            { label: 'Target', value: 85, suffix: '%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800 mt-1">
                {stat.value}
                <span className="text-sm font-semibold text-slate-400 ml-0.5">{stat.suffix}</span>
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
