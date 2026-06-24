import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandCenterStore } from '../../entities/store/useCommandCenterStore';

const SEVERITY_CONFIG = {
  high: { border: '#ef4444', icon: '🔴', label: 'HIGH' },
  medium: { border: '#eab308', icon: '🟡', label: 'MED' },
  low: { border: '#22c55e', icon: '🟢', label: 'LOW' },
};

const MAX_VISIBLE = 5;

export default function AlertFeed() {
  const alerts = useCommandCenterStore((s) => s.alerts);
  const dismissedAlertIds = useCommandCenterStore((s) => s.dismissedAlertIds);
  const dismissAlert = useCommandCenterStore((s) => s.dismissAlert);
  const [showAll, setShowAll] = useState(false);

  const visibleAlerts = alerts
    .filter((a) => !dismissedAlertIds.has(a.id))
    .slice(0, showAll ? undefined : MAX_VISIBLE);

  const remainingCount = alerts.filter((a) => !dismissedAlertIds.has(a.id)).length - MAX_VISIBLE;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Alert Feed
        </h3>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {alerts.filter(a => !dismissedAlertIds.has(a.id)).length} new
        </span>
      </div>

      <div className="space-y-1.5 max-h-[260px] overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {visibleAlerts.map((alert) => {
            const sev = SEVERITY_CONFIG[alert.severity];
            return (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="relative bg-white rounded-lg border border-slate-200 p-2.5 pr-7 shadow-sm hover:shadow-md transition-shadow"
                style={{ borderLeft: `3px solid ${sev.border}` }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs leading-none mt-0.5">{sev.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: sev.border }}
                      >
                        [{sev.label}]
                      </span>
                      {alert.unitId && (
                        <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                          {alert.unitId}
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400 ml-auto">{alert.timeAgo}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 leading-tight mt-0.5">{alert.title}</p>
                    <p className="text-[9px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{alert.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="absolute top-1.5 right-1.5 text-slate-300 hover:text-red-400 transition-colors p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {!showAll && remainingCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-2 py-2 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
        >
          View All ({remainingCount} more)
        </button>
      )}

      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full mt-2 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-500 uppercase tracking-wider bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Show Less
        </button>
      )}
    </div>
  );
}
