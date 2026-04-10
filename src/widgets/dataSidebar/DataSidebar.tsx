import React from 'react';
import { DASHBOARD_KPI_DATA } from '../../entities/kpi';

export const DapurDataSidebar: React.FC = () => {
  return (
    <aside className="w-full lg:w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-6 bg-emerald-600 rounded-full" />
        <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wider">Dapur Data</h2>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2 border-b border-slate-100 pb-2">
          <span>Kategori</span>
          <span className="text-right">Nilai</span>
        </div>

        {DASHBOARD_KPI_DATA.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-2 py-2 border-b border-slate-50 hover:bg-slate-50 transition-colors group px-2 rounded-lg"
          >
            <span className="text-[11px] text-slate-600 font-medium group-hover:text-slate-900 transition-colors leading-tight pr-2">
              {item.label}
            </span>
            <span className={`text-[11px] text-right font-bold tabular-nums ${item.value > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-[10px] text-slate-500 italic leading-relaxed font-medium">
          * Data disinkronisasi otomatis dari warehouse operasional setiap 15 menit untuk akurasi pelaporan Managerial.
        </p>
      </div>
    </aside>
  );
};
