import React from 'react';
import logo from '../../assets/logo_petrolog.png';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="flex bg-white flex-col md:flex-row items-center justify-between p-6 bg-white border-b border-slate-200 shadow-sm gap-4 mb-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
             <img src={logo} alt="" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Ops Dashboard <span className="text-emerald-600">2026</span>
          </h1>
        </div>
        <p className="text-slate-500 text-sm font-medium ml-13 mt-1">24 Kriteria Dashboard • Operational Excellence</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="bg-slate-100 border border-slate-200 rounded-full px-4 py-2 flex items-center gap-3">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pilih Bulan</span>
          <select defaultValue="Februari" className="bg-transparent text-emerald-700 font-bold focus:outline-none cursor-pointer text-sm">
            <option value="Januari">Januari</option>
            <option value="Februari">Februari</option>
            <option value="Maret">Maret</option>
          </select>
        </div>
        
        <div className="text-right">
          <div className="text-slate-900 font-bold text-lg">Friday, 10 April 2026</div>
          <div className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Real-time Synchronization</div>
        </div>
      </div>
    </header>
  );
};

