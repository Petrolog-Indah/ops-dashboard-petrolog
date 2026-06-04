import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DETAILED_KPI_DATA } from '../../entities/kpi';
import { useCardVisibility } from '../../entities/store/useCardVisibility';

const CATEGORIES = [
  { key: 'SOP', label: 'SOP' },
  { key: 'QHSE', label: 'QHSE' },
  { key: 'Performance Effectiveness', label: 'Performance' },
  { key: 'Efficiency & Productivity', label: 'Efficiency' },
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export const VisibilitySidebar = ({ open, onClose }: Props) => {
  const { visibility, toggleCard, setAllVisible, setAllHidden } = useCardVisibility();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const total = DETAILED_KPI_DATA.length;
  const visibleCount = DETAILED_KPI_DATA.filter((k) => visibility[k.id] !== false).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Atur Kartu
                </h2>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {visibleCount} / {total} tampil
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Bulk actions */}
            <div className="flex gap-2 px-5 py-3 border-b border-slate-100">
              <button
                onClick={setAllVisible}
                className="flex-1 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors"
              >
                Tampilkan Semua
              </button>
              <button
                onClick={setAllHidden}
                className="flex-1 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors"
              >
                Sembunyikan Semua
              </button>
            </div>

            {/* Category list */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-4 space-y-5">
              {CATEGORIES.map((cat) => {
                const items = DETAILED_KPI_DATA.filter((k) => k.category === cat.key);
                if (items.length === 0) return null;

                return (
                  <div key={cat.key}>
                    <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">
                      {cat.label}
                    </h3>
                    <div className="space-y-0.5">
                      {items.map((kpi) => {
                        const visible = visibility[kpi.id] !== false;
                        return (
                          <button
                            key={kpi.id}
                            onClick={() => toggleCard(kpi.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                              visible
                                ? 'bg-emerald-50/50 hover:bg-emerald-50'
                                : 'bg-slate-50/30 hover:bg-slate-50 opacity-60'
                            }`}
                          >
                            <span
                              className={`text-xs font-semibold transition-colors ${
                                visible ? 'text-slate-800' : 'text-slate-400'
                              }`}
                            >
                              {kpi.label}
                            </span>
                            <div
                              className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
                                visible ? 'bg-emerald-500' : 'bg-slate-200'
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                                  visible ? 'translate-x-[18px]' : 'translate-x-[2px]'
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 text-[9px] text-slate-400 font-medium text-center">
              Konfigurasi tersimpan otomatis
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
