import React, { useMemo, useEffect } from 'react';
import { DashboardHeader } from '../widgets/header/Header';
import { NewKpiGrid } from '../widgets/kpiGrid/NewKpiGrid';
import { DashboardFilters } from '../widgets/dashboardFilters/DashboardFilters';
import { DASHBOARD_KPI_DATA, DETAILED_KPI_DATA } from '../entities/kpi';
import type { KpiItem } from '../entities/kpi';
import { getStatsMapping } from '../shared/data/stats';
import { useKpiStore } from '../entities/store/useKpiStore';
import { POLLING_CONFIG } from '../shared/config/polling';
import { AnimatePresence, motion } from 'framer-motion';

const NewDashboardPage: React.FC = () => {
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

  // Menonaktifkan automatic filter change untuk mempermudah observasi UI baru
  // Jika ingin dinyalakan lagi, bisa di-uncomment
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      const filterValues: FilterType[] = DASHBOARD_FILTERS.map(f => f.value);
      const currentIndex = filterValues.indexOf(activeFilter);
      const nextIndex = currentIndex === filterValues.length - 1 ? 0 : currentIndex + 1;
      setActiveFilter(filterValues[nextIndex]);
    }, 15000);
    return () => clearInterval(interval);
  }, [activeFilter, setActiveFilter]);
  */

  const filteredData = useMemo(() => {
    let result: KpiItem[] = [];

    if (activeFilter === 'ALL') {
      // Gunakan DETAILED_KPI_DATA agar semua kategori (termasuk QHSE) tampil
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
        const history = historicalData.find(h => h.metric_name === item.label);
        if (history) {
          return {
            ...item,
            value: history.value,
            subLabel: history.sub_label,
            isRealTime: false
          };
        }
        return item;
      });
    }

    return result;
  }, [activeFilter, stats, selectedMonth, historicalData]);

  return (
    <div className="min-h-screen text-slate-200 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Menggunakan header yang sama, namun parent ini background-nya gelap */}
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        lastUpdate={stats.jetty?.lastUpdate}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden pb-10">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-[2500px] mx-auto px-4 md:px-6 mt-4">
            <DashboardFilters
              activeFilter={activeFilter as any}
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

      <footer className="h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-inner mt-auto" />
    </div>
  );
};

export default NewDashboardPage;
