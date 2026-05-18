import React from 'react';
import { TrendChart } from '../shared/ui/TrendChart';
import { useKpiStore } from '../entities/store/useKpiStore';

interface TrendChartPageProps {
  onBack: () => void;
}

const TrendChartPage: React.FC<TrendChartPageProps> = ({ onBack }) => {
  const { stats } = useKpiStore();

  // Ambil data trend dari stats yang tersedia (saat ini Fuel Efficiency)
  const fuelTrend = stats.fuelEfficiency?.trend || [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Trend <span className="text-emerald-600">Analytics</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Visualisasi data historikal dan tren operasional</p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Main Trend Chart Container */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Efficiency Metric</span>
                <h2 className="text-2xl font-black text-slate-900">Fuel Consumption Trend</h2>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest block mb-1">Update Status</span>
                <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   LIVE SYNC ACTIVE
                </span>
              </div>
            </div>

            <div className="h-[400px] w-full">
               {fuelTrend.length > 0 ? (
                 <TrendChart 
                   label="Detailed Fuel Consumption Analysis" 
                   subLabel="Average consumption rate per hour based on active units"
                   trend={fuelTrend}
                 />
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="font-bold">No historical trend data available yet</p>
                    <p className="text-xs mt-1">Data will appear once system captures enough samples</p>
                 </div>
               )}
            </div>
          </section>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Average Flow</p>
                <p className="text-3xl font-black text-slate-900">
                  {fuelTrend.length > 0 
                    ? (fuelTrend.reduce((acc, t) => acc + t.efficiency, 0) / fuelTrend.length).toFixed(2) 
                    : "0.00"} <span className="text-sm text-slate-400">L/h</span>
                </p>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Peak Demand</p>
                <p className="text-3xl font-black text-emerald-600">
                  {fuelTrend.length > 0 
                    ? Math.max(...fuelTrend.map(t => t.efficiency)).toFixed(2) 
                    : "0.00"} <span className="text-sm text-slate-400">L/h</span>
                </p>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Data Points</p>
                <p className="text-3xl font-black text-blue-600">
                  {fuelTrend.length} <span className="text-sm text-slate-400">Samples</span>
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChartPage;
