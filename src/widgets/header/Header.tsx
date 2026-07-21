import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import Swal from 'sweetalert2';
import logo from '../../assets/logo_petrolog.png';

interface DashboardHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  lastUpdate?: string;
}

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  selectedMonth, 
  onMonthChange,
}) => {
  const { token, user, logout } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

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

  const BASE_URL = import.meta.env.VITE_HISTORICAL_API_URL || 'http://localhost:3000';

  const handleTriggerSnapshot = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`${BASE_URL}/api/snapshots/trigger`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal mensinkronkan data.', confirmButtonColor: '#059669' });
      } else {
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data berhasil disinkronkan.', timer: 2000, showConfirmButton: false });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Koneksi Error', text: 'Terjadi kesalahan koneksi ke server backend.', confirmButtonColor: '#059669' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = useCallback(() => {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      text: 'Anda akan kembali ke halaman login.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  }, [logout]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-[2500px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16 gap-3">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <img src={logo} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight uppercase italic truncate">
                Ops Dashboard <span className="text-emerald-600">2026</span>
              </h1>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-medium leading-tight truncate hidden sm:block">PT. Petrolog Indah</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
            {/* Sync Now - only when authenticated */}
            {token && (
              <button
                onClick={handleTriggerSnapshot}
                disabled={isSyncing}
                className={`flex items-center gap-1.5 px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold tracking-wider uppercase transition-all ${
                  isSyncing 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 active:scale-95 border border-emerald-200'
                }`}
                title="Sinkronisasi Data Hari Ini Secara Manual"
              >
                <svg className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isSyncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>
            )}

            {/* Month Selector */}
            <div className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 md:px-3 py-1.5 md:py-2 flex items-center gap-1.5 md:gap-2">
              <svg className="w-3 h-3 text-slate-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <select 
                value={selectedMonth} 
                onChange={(e) => onMonthChange(e.target.value)}
                className="bg-transparent text-emerald-700 font-semibold focus:outline-none cursor-pointer text-xs md:text-sm"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            {/* Clock */}
            <div className="hidden w-full md:block text-right">
              <div className="text-xs font-semibold text-slate-900 leading-tight">{formattedDate}</div>
              <div className="text-[9px] text-emerald-600 font-bold tracking-wider">{formattedTime} Real Time Syncronization</div>
            </div>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-1.5 md:gap-2 border-l border-slate-200 pl-2 md:pl-3">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">{user.role || 'User'}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  title="Keluar"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

