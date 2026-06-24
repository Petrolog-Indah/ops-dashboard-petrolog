import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { KpiStripItem } from '../../entities/model/commandCenterTypes';

const STRIP_ITEMS: KpiStripItem[] = [
  { label: 'Availability', value: 78, suffix: '%', icon: '📊', numericValue: 78 },
  { label: 'Unit Active', value: '42/55', suffix: '', icon: '🚜', numericValue: 76 },
  { label: 'Utilization', value: 74, suffix: '%', icon: '⚡', numericValue: 74 },
  { label: 'Fuel Efficiency', value: 6.2, suffix: 'km/L', icon: '⛽', numericValue: 62 },
  { label: 'Safety Score', value: 92, suffix: '/100', icon: '🛡️', numericValue: 92 },
  { label: 'Fit Rate', value: 88, suffix: '%', icon: '✅', numericValue: 88 },
  { label: 'CCTV Online', value: 95, suffix: '%', icon: '📹', numericValue: 95 },
];

function getValueColor(numValue: number): string {
  if (numValue >= 80) return 'bg-emerald-50 border-emerald-200';
  if (numValue >= 60) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

function getBadgeColor(numValue: number): string {
  if (numValue >= 80) return 'bg-emerald-500';
  if (numValue >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function KpiStrip() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-2">
        {STRIP_ITEMS.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => navigate(`/kpi/${item.label.toLowerCase().replace(/\s+/g, '-')}`)}
            className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border cursor-pointer transition-all hover:shadow-md hover:scale-[1.03] active:scale-95 ${getValueColor(item.numericValue)}`}
          >
            <span className="text-lg leading-none mb-1">{item.icon}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide truncate w-full text-center">
              {item.label}
            </span>
            <span className="text-lg font-black text-slate-800 leading-none mt-0.5 flex items-baseline gap-0.5">
              {item.value}
              {item.suffix && (
                <span className="text-[10px] font-semibold text-slate-400">{item.suffix}</span>
              )}
            </span>
            <div className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${getBadgeColor(item.numericValue)}`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
