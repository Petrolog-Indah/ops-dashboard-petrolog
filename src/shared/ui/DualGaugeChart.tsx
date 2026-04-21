import React from 'react';

// Extract the SVG rendering logic based on the user's customized design
const renderGaugeSVG = (value: number, isMirrored: boolean) => {
  const radius = 100;
  const strokeWidth = 26; 
  const normalizedRadius = radius - strokeWidth / 2;

  const segments = [
    '#ef4444', 
    '#f97316', 
    '#fcd34d', 
    '#fef08a', 
    '#86efac', 
    '#22c55e'
  ];

  const gapAngle = 2.5;
  const totalGapAngle = gapAngle * (segments.length - 1);
  const segmentAngle = (180 - totalGapAngle) / segments.length;

  const rotation = (value / 100) * 180 - 90; 
  return (
    <svg viewBox={`0 0 ${radius * 2} ${radius + 15}`} className="w-full h-auto drop-shadow-sm" style={isMirrored ? { transform: 'scaleY(-1)' } : {}}>
      {segments.map((color, i) => {
        const startAngle = 180 + i * (segmentAngle + gapAngle);
        const endAngle = startAngle + segmentAngle;
        const x1 = radius + normalizedRadius * Math.cos(startAngle * Math.PI / 180);
        const y1 = radius + normalizedRadius * Math.sin(startAngle * Math.PI / 180);
        const x2 = radius + normalizedRadius * Math.cos(endAngle * Math.PI / 180);
        const y2 = radius + normalizedRadius * Math.sin(endAngle * Math.PI / 180);
        return (
          <path key={i} d={`M ${x1} ${y1} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="butt" />
        );
      })}
      <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${radius}px ${radius}px`, transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <polygon points={`${radius - 3.5},${radius} ${radius + 3.5},${radius} ${radius},${radius - normalizedRadius + 14}`} fill="#1e293b" />
      </g>
      <circle cx={radius} cy={radius} r="7" fill="#1e293b" />
      <circle cx={radius} cy={radius} r="2.5" fill="#fff" />
    </svg>
  )
}

interface DualGaugeChartProps {
  primaryValue: number;
  secondaryValue: number;
  primaryLabel: string;
  secondaryLabel: string;
}

export const DualGaugeChart: React.FC<DualGaugeChartProps> = ({ 
  primaryValue, 
  secondaryValue, 
  primaryLabel, 
  secondaryLabel 
}) => {

  const CRITICAL_TRESSHOLD = 30;
  const isPrimaryCritical = primaryValue <= CRITICAL_TRESSHOLD;
  const isSecondaryCritical = secondaryValue <= CRITICAL_TRESSHOLD;
  
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group w-full h-full">
      
      {/* TOP HALF BORDER → primary */}
      <div className={`absolute top-0 left-0 right-0 h-1/2 border-t border-l border-r rounded-tl-2xl rounded-tr-2xl pointer-events-none transition-colors duration-300 ${isPrimaryCritical ? 'border-red-500 animate-pulse' : 'border-slate-100'}`} />

      {/* BOTTOM HALF BORDER → secondary */}
      <div className={`absolute bottom-0 left-0 right-0 h-1/2 border-b border-l border-r rounded-bl-2xl rounded-br-2xl pointer-events-none transition-colors duration-300 ${isSecondaryCritical ? 'border-red-500 animate-pulse' : 'border-slate-100'}`} />

      {isPrimaryCritical && (
        <div className="absolute top-2 right-3 z-30 animate-blink">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
        </div>
      )}

      {isSecondaryCritical && (
        <div className="absolute bottom-2 right-3 z-30 animate-blink">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/30"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent z-10 pointer-events-none rounded-tr-[24px]"></div>
      {/* <div className="absolute top-4 right-4 w-2 h-2 rounded-full border border-slate-200 bg-white"></div> */}
      
      {/* Decorative colored glow matching original card */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full w-24 h-2.5 blur-[10px] bg-emerald-300 opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div> */}

      <div className="flex flex-col w-full z-10">
        {/* TOP ROW: TEXT (Kiri) - CHART (Kanan) */}
        <div className="flex w-full items-center justify-center gap-2 px-1">
           <div className="flex flex-col items-start pb-2">
              <span className="text-xl font-black tabular-nums text-slate-800 leading-none">{primaryValue}%</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mt-1">{primaryLabel}</span>
           </div>
           
           <div className="flex flex-col items-center w-[140px]">
              {renderGaugeSVG(primaryValue, false)}
           </div>
        </div>

        {/* SATU GARIS PEMISAH TIPIS DI TENGAH */}
        <div className="w-full border-t border-dashed border-slate-200 z-20 my-1 relative">
            {/* Center dot aesthetic */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        </div>

        {/* BOTTOM ROW: TEXT (Kiri) - CHART (Kanan) -> as requested by the user's latest manual tweak */}
        <div className="flex w-full items-center justify-center gap-2 px-1">
           <div className="flex flex-col items-start pt-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mb-1">{secondaryLabel}</span>
              <span className="text-xl font-black tabular-nums text-slate-800 leading-none">{secondaryValue}%</span>
           </div>

           <div className="flex flex-col items-center w-[140px]">
              {renderGaugeSVG(secondaryValue, true)}
           </div>
        </div>
      </div>
    </div>
  );
};
