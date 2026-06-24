import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MapView from '../widgets/commandCenter/MapView';
import KpiStrip from '../widgets/commandCenter/KpiStrip';
import AlertFeed from '../widgets/commandCenter/AlertFeed';
import FleetStatusTable from '../widgets/commandCenter/FleetStatusTable';
import { useCommandCenterStore } from '../entities/store/useCommandCenterStore';
import logo from '../assets/logo_petrolog.png';

export default function CommandCenterOverview() {
  const selectedSite = useCommandCenterStore((s) => s.selectedSite);
  const selectedShift = useCommandCenterStore((s) => s.selectedShift);
  const setSiteFilter = useCommandCenterStore((s) => s.setSiteFilter);
  const setShift = useCommandCenterStore((s) => s.setShift);
  const lastUpdate = useCommandCenterStore((s) => s.lastUpdate);
  const updateLastUpdate = useCommandCenterStore((s) => s.updateLastUpdate);

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateLastUpdate();
    }, 30000);
    return () => clearInterval(timer);
  }, [updateLastUpdate]);

  const formattedTime = dateTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = dateTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-[2000px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-14 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                <img src={logo} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase italic leading-tight">
                  Command Center
                </h1>
                <p className="text-[9px] text-slate-400 font-medium">PT. Petrolog Indah</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Site filter */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                {['ALL', 'Pit A', 'Pit B', 'Pit C'].map((site) => (
                  <button
                    key={site}
                    onClick={() => setSiteFilter(site)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${
                      selectedSite === site
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {site}
                  </button>
                ))}
              </div>

              {/* Shift toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setShift('DAY')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${
                    selectedShift === 'DAY'
                      ? 'bg-amber-400 text-amber-900 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  DAY
                </button>
                <button
                  onClick={() => setShift('NIGHT')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${
                    selectedShift === 'NIGHT'
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  NIGHT
                </button>
              </div>

              {/* Clock */}
              <div className="hidden md:block text-right border-l border-slate-200 pl-3">
                <div className="text-[10px] font-semibold text-slate-500 leading-tight">{formattedDate}</div>
                <div className="text-[10px] text-emerald-600 font-bold">{formattedTime}</div>
              </div>

              {/* Link to Dashboard */}
              <Link
                to="/kpi"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-wider transition-all"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                KPI
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[2000px] mx-auto w-full px-4 md:px-6 py-4 space-y-4">
        {/* Top section: Map + KPI Strip + Alert */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Map - left 60% */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-[60%]"
          >
            <div className="h-[400px] lg:h-[480px]">
              <MapView />
            </div>
          </motion.div>

          {/* Right panel - 40% */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full lg:w-[40%] flex flex-col gap-4"
          >
            {/* KPI Strip */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
              <KpiStrip />
            </div>

            {/* Alert Feed */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 flex-1">
              <AlertFeed />
            </div>
          </motion.div>
        </div>

        {/* Bottom section: Fleet Status Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4"
        >
          <FleetStatusTable />
        </motion.div>
      </main>

      {/* Last update bar */}
      <div className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-[2000px] mx-auto px-4 md:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Last Update: {lastUpdate}
          </div>
          <div className="text-[10px] text-slate-400">
            Data dummy &middot; Mockup Command Center
          </div>
        </div>
      </div>
    </div>
  );
}
