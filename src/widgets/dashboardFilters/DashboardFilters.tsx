import React from 'react';
import type { KpiItem } from '../../entities/kpi';

type FilterType = KpiItem['category'] | 'ALL';

interface DashboardFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ 
  activeFilter, 
  onFilterChange 
}) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All Data', value: 'ALL' },
    { label: 'SOP', value: 'SOP' },
    { label: 'QHSE', value: 'QHSE' },
    { label: 'Performance Effectiveness', value: 'Performance Effectiveness' },
    { label: 'Efficiency & Productivity', value: 'Efficiency & Productivity' },
  ];

  return (
    <div className="px-6 mb-2">
      <div className="flex flex-wrap items-center gap-2 p-1 bg-white border border-slate-200 rounded-2xl shadow-sm w-fit w-full">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`mx-auto px-6 py-2.5 my-1 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
              activeFilter === filter.value
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 scale-105'
                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
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
