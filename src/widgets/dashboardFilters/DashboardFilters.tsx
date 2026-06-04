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
    <div className="px-2 sm:px-6 mt-5">
      {/* Centered on desktop, scrollable on mobile */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1.5 lg:gap-2 px-3 py-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto scrollbar-hide lg:flex-wrap lg:overflow-visible lg:w-fit">
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
              className={`relative cursor-pointer px-3 sm:px-6 py-2 sm:py-2.5 my-1 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest whitespace-nowrap overflow-hidden flex-shrink-0 ${
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
      </div>
      
      <div className="mt-4 flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-slate-200" />
        <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap">
            Viewing: <span className="text-emerald-600">{activeFilter === 'ALL' ? 'Root Overview (All Charts)' : `Detailed ${activeFilter}`}</span>
        </span>
        <div className="h-[1px] flex-1 bg-slate-200" />
      </div>
    </div>
  );
};
