import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardHeader } from '../widgets/header/Header';
import { NewKpiGrid } from '../widgets/kpiGrid/NewKpiGrid';
import { DETAILED_KPI_DATA } from '../entities/kpi';
import type { KpiItem } from '../entities/kpi';
import { useKpiStore } from '../entities/store/useKpiStore';

const CATEGORY_MAP: Record<string, KpiItem['category']> = {
  'sop': 'SOP',
  'qhse': 'QHSE',
  'performance-effectiveness': 'Performance Effectiveness',
  'efficiency-productivity': 'Efficiency & Productivity',
};

const CATEGORY_LABELS: Record<string, string> = {
  'sop': 'SOP',
  'qhse': 'QHSE',
  'performance-effectiveness': 'Performance Effectiveness',
  'efficiency-productivity': 'Efficiency & Productivity',
};

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const selectedMonth = useKpiStore((s) => s.selectedMonth);
  const setSelectedMonth = useKpiStore((s) => s.setSelectedMonth);

  const category = slug ? CATEGORY_MAP[slug] : undefined;

  if (!slug || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-700">Category not found</h2>
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

  const items: KpiItem[] = DETAILED_KPI_DATA
    .filter((item) => item.category === category)
    .map((item) => {
      const statsMapping: Record<string, { value: number; subLabel?: string }> = {
        'P2H Compliance': { value: 45, subLabel: '9 / 20 Checked' },
        'TBM Compliance': { value: 56, subLabel: '103 / 183 Checked' },
        'Unit Valid License': { value: 95, subLabel: '95%' },
        'CCTV Online': { value: 88, subLabel: '88%' },
        'Dashcam Installed': { value: 78, subLabel: '78%' },
        'Dashcam Online': { value: 72, subLabel: '72%' },
        'Commercial Rate': { value: 81, subLabel: '81%' },
        'Fit Rate': { value: 74, subLabel: '74%' },
        'Utilisation Rate': { value: 69, subLabel: '69%' },
        'Billed Jetty MTD': { value: 85, subLabel: '85%' },
        'Within Geofence': { value: 93, subLabel: '93%' },
        'Speed-Limit Compliance': { value: 91, subLabel: '91%' },
        'Safe Driving Index': { value: 84, subLabel: '84%' },
        'Fuel Efficiency': { value: 62, subLabel: '6.2 km/L' },
      };

      const mapped = statsMapping[item.label];
      if (mapped) {
        return { ...item, value: mapped.value, subLabel: mapped.subLabel, isRealTime: true };
      }
      return item;
    });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <main className="flex-1 max-w-[2000px] mx-auto w-full px-4 md:px-6 py-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-4"
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
            <h1 className="text-lg font-bold text-slate-800">{CATEGORY_LABELS[slug]}</h1>
            <p className="text-[10px] text-slate-400 font-medium">Detailed KPI view</p>
          </div>
        </motion.div>

        <motion.div
          key={slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <NewKpiGrid items={items} activeFilter={category} />
        </motion.div>
      </main>
    </div>
  );
}
