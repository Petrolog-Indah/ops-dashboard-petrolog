import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCommandCenterStore } from '../../entities/store/useCommandCenterStore';
import type { DummyUnit } from '../../entities/model/commandCenterTypes';

const STATUS_ICON: Record<string, string> = {
  active: '\u25CF',
  idle: '\u25CB',
  maintenance: '\u25B3',
  offline: '\u2716',
};

const STATUS_COLOR: Record<string, string> = {
  active: 'text-emerald-500',
  idle: 'text-amber-500',
  maintenance: 'text-red-500',
  offline: 'text-slate-300',
};

const BEHAVIOUR_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  normal: { icon: '\u2705', color: 'text-emerald-600', label: 'Normal' },
  smoking: { icon: '\u{1F6AC}', color: 'text-orange-500', label: 'Smoking' },
  fatigue: { icon: '\u{1F634}', color: 'text-purple-500', label: 'Fatigue' },
  speeding: { icon: '\u{1F4A8}', color: 'text-red-500', label: 'Speeding' },
  none: { icon: '-', color: 'text-slate-300', label: '-' },
};

function getFuelColor(pct: number): string {
  if (pct > 50) return 'bg-emerald-500';
  if (pct > 20) return 'bg-amber-500';
  return 'bg-red-500';
}

function getRowStyle(status: string): string {
  switch (status) {
    case 'active': return 'hover:bg-emerald-50/50';
    case 'idle': return 'hover:bg-amber-50/50';
    case 'maintenance': return 'hover:bg-red-50/50';
    case 'offline': return 'hover:bg-slate-50/50 opacity-60';
    default: return 'hover:bg-slate-50/50';
  }
}

function getCategoryForUnit(unit: DummyUnit): string {
  const site = unit.site.toLowerCase();
  if (site.includes('pit a')) return 'performance-effectiveness';
  if (site.includes('pit b')) return 'efficiency-productivity';
  if (site.includes('pit c')) return 'sop';
  return 'performance-effectiveness';
}

export default function FleetStatusTable() {
  const units = useCommandCenterStore((s) => s.units);
  const selectUnit = useCommandCenterStore((s) => s.selectUnit);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filtered = units.filter((u) =>
    u.unitId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.driver?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          Fleet Status
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {units.length} units
          </span>
        </h3>
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 pr-2.5 py-1.5 text-[11px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 text-slate-700 placeholder:text-slate-400 w-40"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Unit ID</th>
              <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
              <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Site</th>
              <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Fuel %</th>
              <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Speed</th>
              <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Driver</th>
              <th className="text-left px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider text-[10px]">Behaviour</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filtered.map((unit, i) => {
                const beh = BEHAVIOUR_CONFIG[unit.behaviour] || BEHAVIOUR_CONFIG.none;
                return (
                  <motion.tr
                    key={unit.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    onClick={() => {
                      selectUnit(unit.id);
                      navigate(`/category/${getCategoryForUnit(unit)}`);
                    }}
                    className={`border-b border-slate-100 cursor-pointer transition-colors ${getRowStyle(unit.status)}`}
                  >
                    <td className="px-3 py-2.5 font-bold text-slate-800">{unit.unitId}</td>
                    <td className="px-3 py-2.5">
                      <span className={`${STATUS_COLOR[unit.status]} font-semibold flex items-center gap-1`}>
                        {STATUS_ICON[unit.status]}
                        <span className="text-slate-600 capitalize">{unit.status}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{unit.site}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${getFuelColor(unit.fuelPercent)}`}
                            style={{ width: `${unit.fuelPercent}%` }}
                          />
                        </div>
                        <span className="text-slate-600 font-medium text-[10px]">{unit.fuelPercent}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-semibold text-slate-700">{unit.speed}</span>
                      <span className="text-slate-400 text-[9px]"> km/h</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 font-medium">{unit.driver || '-'}</td>
                    <td className="px-3 py-2.5">
                      <span className={beh.color} title={beh.label}>
                        {beh.icon}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No units match your search.
          </div>
        )}
      </div>
    </div>
  );
}
