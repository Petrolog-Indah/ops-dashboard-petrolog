import React from 'react';
import type { KpiItem } from '../../entities/kpi';
import { motion } from 'framer-motion';
export type FilterType = KpiItem['category'] | 'ALL';

interface DashboardFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const DASHBOARD_FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All Data', value: 'ALL' },
  { label: 'SOP', value: 'SOP' },
  { label: 'QHSE', value: 'QHSE' },
  { label: 'Performance Effectiveness', value: 'Performance Effectiveness' },
  { label: 'Efficiency & Productivity', value: 'Efficiency & Productivity' },
];

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {

  return (
    <div className="px-6 mb-2">
      <div className="flex flex-wrap items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm w-fit w-full">
        {DASHBOARD_FILTERS.map((filter) => {
           const isActive = activeFilter === filter.value;
           return (
            <motion.button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                scale: isActive ? 1.05 : 1,
              }}
              transition={{
                duration: 0.25,
              }}
              className={`relative mx-auto cursor-pointer px-6 py-2.5 my-1 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap overflow-hidden ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterBackground"
                  className="absolute inset-0 bg-emerald-600 rounded-xl shadow-sm shadow-emerald-200"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}

              <span className="relative z-10">
                {filter.label}
              </span>
            </motion.button>
           )
        })}
      </div>
      
      <div className="mt-4 flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-slate-200" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Viewing: <span className="text-emerald-600">{activeFilter === 'ALL' ? 'Root Overview (All Charts)' : `Detailed ${activeFilter}`}</span>
        </span>
        <div className="h-[1px] flex-1 bg-slate-200" />
      </div>
    </div>
  );
};
