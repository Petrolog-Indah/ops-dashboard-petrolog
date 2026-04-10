import React from 'react';

interface GaugeChartProps {
  value: number; // 0 to 100
  label: string;
  subLabel?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  label, 
  subLabel 
}) => {
  const radius = 70;
  const strokeWidth = 14; 
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI; 

  // Needle rotation: 0% is at -90deg, 100% is at 90deg (relative to 12 o'clock)
  const rotation = (value / 100) * 180 - 90; 
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 group w-full h-full">
      <div className="relative w-full aspect-[3/3] max-w-[220px] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${radius * 2} ${radius + 15}`}
          className="w-full h-auto"
        >
          <defs>
            <linearGradient id="gaugeGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" /> {/* Red 0% */}
              <stop offset="50%" stopColor="#d97706" /> {/* Amber 50% */}
              <stop offset="100%" stopColor="#059669" /> {/* Emerald 100% */}
            </linearGradient>
          </defs>

          {/* Background Track - Bridge shape */}
          <circle
            stroke="#f1f5f9"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
                strokeDashoffset: 0,
                transform: `rotate(-180deg)`,
                transformOrigin: `${radius}px ${radius}px`
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          
          {/* Progress Bar */}
          <circle
            stroke="url(#gaugeGradientLight)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 1s ease-in-out',
              transform: `rotate(-180deg)`,
              transformOrigin: `${radius}px ${radius}px`,
              opacity: value > 0 ? 1 : 0
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Scale Ticks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = (tick / 100) * 180;
            const x = radius + (radius - 20) * Math.cos((angle - 180) * (Math.PI / 180));
            const y = radius + (radius - 20) * Math.sin((angle - 180) * (Math.PI / 180));
            return (
              <text
                key={tick}
                x={x}
                y={y}
                fontSize="7"
                fill="#94a3b8"
                textAnchor="middle"
                alignmentBaseline="middle"
                className="font-bold tabular-nums"
              >
                {tick}
              </text>
            );
          })}

          {/* Pivot Point Circle (Base of Needle) */}
          <circle
            cx={radius}
            cy={radius}
            r="5"
            fill="#1e293b"
          />

          {/* SVG Needle for perfect alignment */}
          <line
            x1={radius}
            y1={radius}
            x2={radius}
            y2={radius - 45}
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: `${radius}px ${radius}px`,
                transition: 'transform 1s ease-in-out'
            }}
          />
        </svg>

        {/* Value Display - Positioned relative to the SVG pivot */}
        <div className="absolute left-0 right-0 bottom-0 flex flex-col items-center">
            <span className="text-2xl font-medium font-black text-slate-900 tabular-nums">{value}%</span>
        </div>
      </div>
      
      <div className="mt-2 text-center px-1">
        <h3 className="text-[11px] font-black text-slate-800 group-hover:text-emerald-700 transition-colors uppercase tracking-tight leading-4 h-8 flex items-center justify-center">
          {label}
        </h3>
        {subLabel && <p className="text-[10px] text-slate-400 font-bold mt-1 text-center">{subLabel}</p>}
      </div>
    </div>
  );
};
