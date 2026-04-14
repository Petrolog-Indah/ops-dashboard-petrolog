import React, { useState, useMemo } from 'react';
import { DashboardHeader } from '../widgets/header/Header';
import { KpiGrid } from '../widgets/kpiGrid/KpiGrid';
// import { DapurDataSidebar } from '../widgets/dataSidebar/DataSidebar';
import { DashboardFilters } from '../widgets/dashboardFilters/DashboardFilters';
import { DASHBOARD_KPI_DATA, DETAILED_KPI_DATA } from '../entities/kpi';
import type { KpiItem } from '../entities/kpi';
import { useCCTVStats } from '../entities/cctv/hooks/useCCTVStats';
import { useJettyStats } from '../entities/cctv/hooks/useJettyStats';
import { useValidLicense } from '../entities/cctv/hooks/useValidLicense';
import { useAvailability } from '../entities/cctv/hooks/useAvailability';
import { useGeofence } from '../entities/cctv/hooks/useGeofence';
import { fetchMetricHistory } from '../shared/api/historicalApi';

type FilterType = KpiItem['category'] | 'ALL';

const monthName = [ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ];

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

    // Inject live CCTV stats if available
    if (cctvStats) {
      result = result.map(item => {
        if (item.label === 'CCTV Online') {
          return {
            ...item,
            value: Math.round(cctvStats.percentage),
            subLabel: `${cctvStats.online} / ${cctvStats.total} Online`,
            isRealTime: true
          };
        }
        return item;
      });
    }

    // Inject Jetty stats based on selected month
    if (jettyStats && jettyStats.data) {
      const monthData = jettyStats.data.find(d => d.bulan === selectedMonth);
      if (monthData) {
        result = result.map(item => {
          if (item.label === 'Billed Jetty MTD') {
            return {
              ...item,
              value: monthData.billing_percentage,
              subLabel: `${monthData.tertagih} / ${monthData.bl} Billed`,
              isRealTime: true
            };
          }
          return item;
        });
      }
    }

    // Inject Valid Lincense stats based on selected month
    if (validLicenseStats) {
      result = result.map(item => {
        if (item.label === 'Unit Valid Lincense') {
          return {
            ...item,
            value: Math.round(validLicenseStats.percentage_valid),
            subLabel: `${validLicenseStats.valid_armada} / ${validLicenseStats.total_armada} Valid Lincense`,
            isRealTime: true
          };
        }
        return item;
      });
    }
    // Inject Geofence stats based on selected month
    if (geofenceStats) {
      result = result.map(item => {
        if (item.label === 'Within Geofence') {
          return {
            ...item,
            value: Math.round(geofenceStats.percentage),
            subLabel: `${geofenceStats.units_in_zone} / ${geofenceStats.total_units} Units In Zone`,
            isRealTime: true
          };
        }
        return item;
      });
    }

    // Inject Availability stats based on selected month
    if (availabilityStats) {
      result = result.map(item => {
        if (item.label === 'Commercial Rate') {
          return {
            ...item,
            value: Math.round(availabilityStats.commercial_rate),
            subLabel: `${availabilityStats.on_job + availabilityStats.standby} / ${availabilityStats.total} Unit Report`,
            isRealTime: true
          };
        }
        if (item.label === 'Utilisation Rate') {
          return {
            ...item,
            value: Math.round(availabilityStats.utilisation_rate),
            subLabel: `${availabilityStats.on_job} / ${availabilityStats.total} Unit Report`,
            isRealTime: true
          };
        }
        return item;
      });
    }

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
