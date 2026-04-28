import React, { useState, useMemo } from 'react';
import { DashboardHeader } from '../widgets/header/Header';
import { KpiGrid } from '../widgets/kpiGrid/KpiGrid';
import { DashboardFilters } from '../widgets/dashboardFilters/DashboardFilters';
import { DASHBOARD_KPI_DATA, DETAILED_KPI_DATA } from '../entities/kpi';
import type { KpiItem } from '../entities/kpi';
import { useCCTVStats } from '../entities/hooks/useCCTV';
import { useJettyStats } from '../entities/hooks/useJetty';
import { useValidLicense } from '../entities/hooks/useValidLicense';
import { useAvailability } from '../entities/hooks/useAvailability';
import { useGeofence } from '../entities/hooks/useGeofence';
import { fetchMetricHistory } from '../shared/api/historicalApi';
import { useFitRate } from '../entities/hooks/useFitRate';
import { getStatsMapping } from '../shared/data/stats';
import { useFuelEfficiency } from '../entities/hooks/useFuelEfficiency';
import { useSopCompliance } from '../entities/hooks/useSopCompliance';
import { useSpeedCompliance } from '../entities/hooks/useSpeedCompliance';

type FilterType = KpiItem['category'] | 'ALL';

const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const DashboardPage: React.FC = () => {
  const month = new Date().getMonth();
  const currentMonth = monthName[month];
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const { stats: cctvStats } = useCCTVStats();
  const { stats: jettyStats } = useJettyStats();
  const { stats: validLicenseStats } = useValidLicense();
  const { stats: availabilityStats } = useAvailability();
  const { stats: geofenceStats } = useGeofence();
  const { stats: fitRateStats } = useFitRate();
  const { stats: fuelEfficiencyStats } = useFuelEfficiency();
  const { stats: sopComplianceStats } = useSopCompliance();
  const { stats: speedComplianceStats } = useSpeedCompliance();

  // State untuk menyimpan data historikal dari NestJS backend saat bulan sebelumnya dipilih
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  React.useEffect(() => {
    // Apabila bulan yang dipilih BUKAN bulan berjalan (April 2026), maka ambil dari Backend NestJS
    if (selectedMonth !== 'April') {
      // Mockup integration: ambil data historical secara paralel
      Promise.all([
        fetchMetricHistory('CCTV Online'),
        fetchMetricHistory('Billed Jetty MTD'),
        fetchMetricHistory('Unit Valid Lincense'),
        fetchMetricHistory('Within Geofence')
      ]).then(res => {
        setHistoricalData(res.flat());
      });
    } else {
      setHistoricalData([]);
    }
  }, [selectedMonth]);

  /**
   * LOGIKA FILTERING
   * Jika ALL: Tampilkan 24 kriteria utama.
   * Jika Kategori Tertentu (SOP, dll): Tampilkan data rincian (dummy).
   */
  const filteredData = useMemo(() => {
    let result: KpiItem[] = [];

    if (activeFilter === 'ALL') {
      result = [...DASHBOARD_KPI_DATA];
    } else {
      // Filter dari data DETAILED berdasarkan kategori yang dipilih
      result = DETAILED_KPI_DATA.filter(item => item.category === activeFilter);
    }

    // Mapping API stats to KPI labels from external file
    const statsMapping = getStatsMapping(
      cctvStats,
      jettyStats,
      validLicenseStats,
      fitRateStats,
      geofenceStats,
      availabilityStats,
      selectedMonth,
      fuelEfficiencyStats,
      sopComplianceStats,
      speedComplianceStats,
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
  }, [activeFilter, cctvStats, jettyStats, validLicenseStats, geofenceStats, availabilityStats, selectedMonth]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500/30">
      <DashboardHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        lastUpdate={jettyStats?.lastUpdate}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-[1600px] mx-auto">
            {/* Navigasi Filter */}
            <DashboardFilters
              activeFilter={activeFilter}
              onFilterChange={(f) => setActiveFilter(f)}
            />

            {/* Grid Chart */}
            <KpiGrid items={filteredData} activeFilter={activeFilter} />
          </div>
        </div>
      </main>

      <footer className="h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-inner" />
    </div>
  );
};

export default DashboardPage;
