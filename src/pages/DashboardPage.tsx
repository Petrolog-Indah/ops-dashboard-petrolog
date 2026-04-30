import React, { useMemo, useEffect } from 'react';
import { DashboardHeader } from '../widgets/header/Header';
import { KpiGrid } from '../widgets/kpiGrid/KpiGrid';
import { DashboardFilters } from '../widgets/dashboardFilters/DashboardFilters';
import { DASHBOARD_KPI_DATA, DETAILED_KPI_DATA } from '../entities/kpi';
import type { KpiItem } from '../entities/kpi';
import { getStatsMapping } from '../shared/data/stats';
import { useKpiStore } from '../entities/store/useKpiStore';
import { POLLING_CONFIG } from '../shared/config/polling';

const DashboardPage: React.FC = () => {
  // Ambil state dan actions dari Zustand store
  const { 
    stats, 
    selectedMonth, 
    activeFilter, 
    historicalData,
    setSelectedMonth,
    setActiveFilter,
    fetchAllStats 
  } = useKpiStore();

  // Polling data secara terpusat
  useEffect(() => {
    fetchAllStats(); // Initial fetch

    const interval = setInterval(() => {
      fetchAllStats();
    }, POLLING_CONFIG.DEFAULT_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchAllStats]);

  /**
   * LOGIKA FILTERING & MAPPING
   */
  const filteredData = useMemo(() => {
    let result: KpiItem[] = [];

    if (activeFilter === 'ALL') {
      result = [...DASHBOARD_KPI_DATA];
    } else {
      result = DETAILED_KPI_DATA.filter(item => item.category === activeFilter);
    }

    // Mapping API stats to KPI labels from external file
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

    // Apply mappings to result array
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

    // Inject historical data if month is not current
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/30">
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        lastUpdate={stats.jetty?.lastUpdate}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            <DashboardFilters
              activeFilter={activeFilter as any}
              onFilterChange={(f) => setActiveFilter(f)}
            />
            <KpiGrid items={filteredData} activeFilter={activeFilter as any} />
          </div>
        </div>
      </main>

      <footer className="h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-inner" />
    </div>
  );
};

export default DashboardPage;
