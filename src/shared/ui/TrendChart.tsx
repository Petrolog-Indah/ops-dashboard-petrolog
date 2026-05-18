import React from 'react';
import { motion } from 'framer-motion';

interface TrendChartProps {
  label: string;
  subLabel?: string;
  trend: {
    time: string;
    efficiency: number;
    idle_ratio?: number;
    distance_km?: number;
  }[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ label, subLabel, trend }) => {
  if (!trend || trend.length === 0) return null;

  const width = 300;
  const height = 150;
  const padding = 20;

  // Consumption data points
  const maxVal = Math.max(...trend.map(t => t.efficiency), 80); // Min scale 80 L/h
  const points = trend.map((t, i) => ({
    x: (i / (trend.length - 1)) * (width - padding * 2) + padding,
    y: height - padding - (t.efficiency / maxVal) * (height - padding * 2),
    value: t.efficiency,
    time: t.time
  }));

  // Path for the line
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Area path (closed polygon)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="flex flex-col p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group w-full h-full relative overflow-hidden min-h-[220px]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-tight text-slate-800 group-hover:text-emerald-700 transition-colors">
            {label}
          </h3>
          {subLabel && <p className="text-[9px] font-bold text-slate-400 mt-0.5">{subLabel}</p>}
        </div>
        <div className="bg-emerald-50 px-2 py-0.5 rounded-lg">
           <span className="text-[10px] font-black text-emerald-600">L/H TREND</span>
        </div>
      </div>

      <div className="flex-1 relative mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-sm overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />

          {/* Area under the line */}
          <motion.path
            d={areaPath}
            fill="url(#gradient-efficiency)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Main efficiency line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#ffffff"
              stroke="#10b981"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              whileHover={{ scale: 1.5 }}
            />
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="gradient-efficiency" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex justify-between mt-4 border-t border-slate-50 pt-3">
         <div className="text-center flex-1">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Avg Consumption</p>
            <p className="text-sm font-black text-slate-800">
               {(trend.reduce((acc, t) => acc + t.efficiency, 0) / trend.length).toFixed(1)} L/h
            </p>
         </div>
         <div className="w-px bg-slate-100 h-6 my-auto" />
         <div className="text-center flex-1">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Peak Consumption</p>
            <p className="text-sm font-black text-emerald-600">
               {Math.max(...trend.map(t => t.efficiency)).toFixed(1)} L/h
            </p>
         </div>
         <div className="w-px bg-slate-100 h-6 my-auto" />
         <div className="text-center flex-1">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">REAL-TIME</p>
         </div>
      </div>
    </div>
  );
};
