import React from 'react';

interface GaugeChartProps {
  value: number; // 0 to 100
  label: string;
  subLabel?: string;
  isRealTime?: boolean;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  label, 
  subLabel,
  isRealTime
}) => {
  const radius = 100;
  const strokeWidth = 32; 
  const normalizedRadius = radius - strokeWidth / 2; // 84

  // Needle rotation: 0% is at -90deg, 100% is at 90deg (relative to 12 o'clock)
  const rotation = (value / 100) * 180 - 90; 

  const isCritical = value <= 30;

  const segments = [
    { color: '#ef4444', label: 'Very Low', text: '#ffffff' },
    { color: '#f97316', label: 'Low', text: '#ffffff' },
    { color: '#fcd34d', label: 'Moderate', text: '#111827' },
    { color: '#fef08a', label: 'Good', text: '#111827' },
    { color: '#86efac', label: 'High', text: '#111827' },
    { color: '#22c55e', label: 'Very High', text: '#ffffff' }
  ];

  const gapAngle = 2.5; 
  const totalGapAngle = gapAngle * (segments.length - 1);
  const segmentAngle = (180 - totalGapAngle) / segments.length;

  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-white rounded-2xl border transition-all hover:shadow-md hover:-translate-y-1 group w-full h-full relative overflow-hidden
      ${isCritical 
        ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] animate-[pulse_2s_infinite]' 
        : isRealTime === true ? 'border-green-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-slate-100 shadow-sm'
      }`}
    >
      {isCritical && (
        <div className="absolute top-2 right-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
        </div>
      )}

      <h3 className={`text-[12px] font-semibold transition-colors uppercase tracking-tight leading-4 h-8 flex items-center justify-center text-center
        ${isCritical ? 'text-red-800' : 'text-slate-800 group-hover:text-emerald-700'}`}>
        {segments.map((segment, i) => {
          // Calculate which segment the needle is in based on value
          const activeIndex = Math.min(
            Math.floor((Math.max(0, Math.min(100, value)) / 100) * segments.length), 
            segments.length - 1
          );
          
          if (i !== activeIndex) return null;
          
          return (
            <span key={i} style={{ color: segment.color }}>{segment.label}</span>
          )
        })}
      </h3>

      <div className="relative w-full max-w-[260px] flex items-center justify-center mt-2">

        <svg
          viewBox={`0 0 ${radius * 2} ${radius + 15}`}
          className="w-full h-auto drop-shadow-sm"
        >
          {/* Inner Light Background */}
          <path 
            d={`M ${radius - normalizedRadius + strokeWidth/2} ${radius} A ${normalizedRadius - strokeWidth/2} ${normalizedRadius - strokeWidth/2} 0 0 1 ${radius + normalizedRadius - strokeWidth/2} ${radius}`} 
            fill="#f8fafc" 
          />

          {segments.map((segment, i) => {
            const startAngle = 180 + i * (segmentAngle + gapAngle);
            const endAngle = startAngle + segmentAngle;
            
            const startRad = startAngle * Math.PI / 180;
            const endRad = endAngle * Math.PI / 180;
            
            const x1 = radius + normalizedRadius * Math.cos(startRad);
            const y1 = radius + normalizedRadius * Math.sin(startRad);
            
            const x2 = radius + normalizedRadius * Math.cos(endRad);
            const y2 = radius + normalizedRadius * Math.sin(endRad);

            const pathData = `M ${x1} ${y1} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${x2} ${y2}`;

            return (
              <path
                key={i}
                d={pathData}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
              />
            );
          })}

          {/* Needle Base Knob & Needle */}
          <g style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: `${radius}px ${radius}px`,
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <polygon
              points={`${radius - 3.5},${radius} ${radius + 3.5},${radius} ${radius},${radius - normalizedRadius + 18}`}
              fill="#1e293b"
            />
            <circle cx={radius} cy={radius} r="7" fill="#1e293b" />
            <circle cx={radius} cy={radius} r="2.5" fill="#f8fafc" />
          </g>
        </svg>

        {/* Value Display */}
        <div className="absolute left-0 right-0 bottom-0 flex flex-col items-center">
            <span className={`text-2xl font-black tabular-nums translate-y-[30px] ${isCritical ? 'text-red-700' : 'text-slate-900'}`}>{value}%</span>
        </div>
      </div>
      
      <div className="mt-7 text-center px-1 z-10 relative">
        <h3 className={`text-[11px] font-black transition-colors uppercase tracking-tight leading-4 h-8 flex items-center justify-center 
          ${isCritical ? 'text-red-800' : 'text-slate-800 group-hover:text-emerald-700'}`}>
          {label}
        </h3>
        {subLabel && <p className={`text-[10px] font-bold mt-1 text-center ${isCritical ? 'text-red-400' : 'text-slate-400'}`}>{subLabel}</p>}
      </div>
    </div>
  );
};
