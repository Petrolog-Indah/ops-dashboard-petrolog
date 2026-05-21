import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo_petrolog.png';

interface DashboardHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  lastUpdate?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  selectedMonth, 
  onMonthChange,
}) => {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = currentDateTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleTriggerSnapshot = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('http://localhost:3000/api/snapshots/trigger');
      if (!response.ok) {
        alert('Gagal mensinkronkan data.');
      }
    } catch (error) {
      console.error('Error saat sinkronisasi:', error);
      alert('Terjadi kesalahan koneksi ke server backend.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="flex bg-white flex-col md:flex-row items-center justify-between px-4 py-3 md:p-6 border-b border-slate-200 shadow-sm gap-3 md:gap-4 mb-6">
      {/* Logo + Title */}
      <div className="flex flex-col items-center md:items-start w-full md:w-auto">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
             <img src={logo} alt="" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Ops Dashboard <span className="text-emerald-600">2026</span>
          </h1>
        </div>
        <p className="text-slate-500 text-xs md:text-sm font-medium md:ml-13 mt-0.5 md:mt-1">PT. Petrolog Indah • All Operational Dashboard</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4 w-full md:w-auto">
        <button
          onClick={handleTriggerSnapshot}
          disabled={isSyncing}
          className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all shadow-sm ${
            isSyncing 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:shadow active:scale-95'
          }`}
          title="Sinkronisasi Data Hari Ini Secara Manual"
        >
          <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isSyncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>

        <div className="bg-slate-100 border border-slate-200 rounded-full px-3 md:px-4 py-1.5 md:py-2 flex items-center gap-2 md:gap-3">
          <span className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Pilih Bulan</span>
          <select 
            value={selectedMonth} 
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-transparent text-emerald-700 font-bold focus:outline-none cursor-pointer text-xs md:text-sm"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-slate-900 font-bold text-sm md:text-lg">{formattedDate}</div>
          <div className="text-emerald-600 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{formattedTime} • Real-time Synchronization</div>
        </div>
      </div>
    </header>
  );
};

