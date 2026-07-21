import React, { useMemo, useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { DashboardHeader } from '../widgets/header/Header';
import { NewKpiGrid } from '../widgets/kpiGrid/NewKpiGrid';
import { DashboardFilters, type FilterType } from '../widgets/dashboardFilters/DashboardFilters';
import { VisibilitySidebar } from '../widgets/visibilitySidebar/VisibilitySidebar';
import { DETAILED_KPI_DATA } from '../entities/kpi';
import type { KpiItem } from '../entities/kpi';
import { getStatsMapping } from '../shared/data/stats';
import { useKpiStore } from '../entities/store/useKpiStore';
import { useCardVisibility } from '../entities/store/useCardVisibility';
import { POLLING_CONFIG } from '../shared/config/polling';
import { AnimatePresence, motion } from 'framer-motion';
import { DASHBOARD_FILTERS } from '../widgets/dashboardFilters/dashboardFilter.constants';

const NewDashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { visibleIds } = useCardVisibility();

  const { 
    stats, 
    selectedMonth, 
    activeFilter, 
    historicalData,
    setSelectedMonth,
    setActiveFilter,
    fetchAllStats 
  } = useKpiStore();

  useEffect(() => {
    fetchAllStats();

    const interval = setInterval(() => {
      fetchAllStats();
    }, POLLING_CONFIG.DEFAULT_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchAllStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      const filterValues: FilterType[] = DASHBOARD_FILTERS.map(f => f.value);
      const currentIndex = filterValues.indexOf(activeFilter);
      const nextIndex = currentIndex === filterValues.length - 1 ? 0 : currentIndex + 1;
      setActiveFilter(filterValues[nextIndex]);
    }, 15000);
    return () => clearInterval(interval);
  }, [activeFilter, setActiveFilter]);

  const filteredData = useMemo(() => {
    let result: KpiItem[] = [];

    if (activeFilter === 'ALL') {
      result = [...DETAILED_KPI_DATA];
    } else {
      result = DETAILED_KPI_DATA.filter(item => item.category === activeFilter);
    }

    const statsMapping = getStatsMapping(
      stats.cctv,
      stats.jetty,
      stats.validLicense,
      stats.fitRate,
      stats.geofence,
      stats.availability,
      selectedMonth,
      stats.fuelEfficiency,
      stats.sopCompliance,
      stats.speedCompliance,
      stats.dashcam,
      stats.p2hTbmCompliance
    );

    result = result.map(item => {
      const mapping = statsMapping.find(m => m.label === item.label && m.condition);
      if (mapping) {
        return {
          ...item,
          value: typeof mapping.value === 'function' ? mapping.value() : mapping.value,
          subLabel: typeof mapping.subLabel === 'function' ? mapping.subLabel() : mapping.subLabel,
          isRealTime: true
        };
      }
      return item;
    });

    if (historicalData.length > 0) {
      result = result.map(item => {
        const history = historicalData.find(h => {
          if (h.metricName === item.label) return true;
          if (item.label === 'Speed-Limit Compliance' && h.metricName === 'Speed Limit Compliance') return true;
          if (item.label === 'Safe Driving Index' && h.metricName === 'Unsafe Behavior Dashcam') return true;
          return false;
        });
        if (history) {
          return {
            ...item,
            value: typeof history.value === 'number' ? history.value : Number(history.value) || 0,
            subLabel: history.subLabel,
            isRealTime: false
          };
        }
        return item;
      });
    }

    if (isAuthenticated) {
      const ids = visibleIds();
      result = result.filter(item => ids.includes(item.id));
    }

    return result;
  }, [activeFilter, stats, selectedMonth, historicalData, isAuthenticated, visibleIds]);

  return (
    <div className="min-h-screen text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30">
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <main className="relative flex-1 flex flex-col lg:flex-row overflow-hidden pb-10">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-[2500px] mx-auto px-4 md:px-6">
            {isAuthenticated && (
              <div className="fixed right-2 bottom-2 z-50 flex items-center justify-end mb-2 px-2 sm:px-6">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Atur Kartu
                </button>
              </div>
            )}

            <DashboardFilters
              activeFilter={activeFilter}
              onFilterChange={(f) => setActiveFilter(f)}
            />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <NewKpiGrid
                  items={filteredData}
                  activeFilter={activeFilter}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <VisibilitySidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <footer className="h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-inner mt-auto" />
    </div>
  );
};

export default NewDashboardPage;
