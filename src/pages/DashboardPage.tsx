import React, { useState, useMemo } from 'react';
import { DashboardHeader } from '../widgets/header/Header';
import { KpiGrid } from '../widgets/kpiGrid/KpiGrid';
// import { DapurDataSidebar } from '../widgets/dataSidebar/DataSidebar';
import { DashboardFilters } from '../widgets/dashboardFilters/DashboardFilters';
import { DASHBOARD_KPI_DATA, DETAILED_KPI_DATA } from '../entities/kpi';
import type { KpiItem } from '../entities/kpi';

type FilterType = KpiItem['category'] | 'ALL';

const DashboardPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  /**
   * LOGIKA FILTERING
   * Jika ALL: Tampilkan 24 kriteria utama.
   * Jika Kategori Tertentu (SOP, dll): Tampilkan data rincian (dummy).
   */
  const filteredData = useMemo(() => {
    if (activeFilter === 'ALL') {
      return DASHBOARD_KPI_DATA;
    }
    
    // Filter dari data DETAILED berdasarkan kategori yang dipilih
    return DETAILED_KPI_DATA.filter(item => item.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/30">
      <DashboardHeader />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            
            {/* Navigasi Filter */}
            <DashboardFilters 
                activeFilter={activeFilter} 
                onFilterChange={(f) => setActiveFilter(f)} 
            />

            {/* Grid Chart */}
            <KpiGrid items={filteredData} />
            
            {/* Footer Control Bar */}
            {/* <div className="p-6 pt-0">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Rows to display</span>
                  <input
                    type="number"
                    defaultValue={1000}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button className="text-emerald-700 hover:text-emerald-800 text-xs font-black uppercase transition-colors tracking-tight font-sans">
                    + Tambahkan baris lainnya
                  </button>
                </div>
                <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="text-emerald-600">Quick Links:</span>
                  <span className="cursor-pointer hover:text-emerald-600 transition-colors">Documentation</span>
                  <span className="cursor-pointer hover:text-emerald-600 transition-colors">Export PDF</span>
                  <span className="cursor-pointer hover:text-emerald-600 transition-colors">Settings</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* <DapurDataSidebar /> */}
      </main>

      <footer className="h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-inner" />
    </div>
  );
};

export default DashboardPage;
