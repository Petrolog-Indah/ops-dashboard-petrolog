import React from 'react';

// --- IDE 1: DUAL NEEDLE (SINGLE TRACK) ---
// Satu trek warna, tapi punya dua jarum (jarum utama dan jarum sekunder pembantu).
// Sangat bagus untuk membandingkan 2 nilai yang berada pada rentang skala (0-100%) yang sama (misal: Target vs Realiasi)
const DualNeedleGauge = ({ primaryValue, secondaryValue, primaryLabel, secondaryLabel }: { primaryValue: number, secondaryValue: number, primaryLabel: string, secondaryLabel: string }) => {
  const radius = 100;
  const strokeWidth = 32;
  const normalizedRadius = radius - strokeWidth / 2;

  const rotationPrimary = (primaryValue / 100) * 180 - 90;
  const rotationSecondary = (secondaryValue / 100) * 180 - 90;

  const segments = ['#ef4444', '#f97316', '#fcd34d', '#fef08a', '#86efac', '#22c55e'];
  const gapAngle = 2.5;
  const totalGapAngle = gapAngle * (segments.length - 1);
  const segmentAngle = (180 - totalGapAngle) / segments.length;

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm w-full max-w-[320px]">
      <h3 className="text-sm font-bold text-slate-800 mb-2 whitespace-nowrap">Single Track - Dua Jarum</h3>

      <div className="relative w-full flex items-center justify-center mt-2">
        <svg viewBox={`0 0 ${radius * 2} ${radius + 15}`} className="w-full h-auto">
          {/* Track Segment */}
          {segments.map((color, i) => {
            const startAngle = 180 + i * (segmentAngle + gapAngle);
            const endAngle = startAngle + segmentAngle;
            const startRad = startAngle * Math.PI / 180;
            const endRad = endAngle * Math.PI / 180;
            const x1 = radius + normalizedRadius * Math.cos(startRad);
            const y1 = radius + normalizedRadius * Math.sin(startRad);
            const x2 = radius + normalizedRadius * Math.cos(endRad);
            const y2 = radius + normalizedRadius * Math.sin(endRad);
            return (
              <path key={i} d={`M ${x1} ${y1} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="butt" />
            );
          })}

          {/* JARUM 2 (Sekunder/Target) - Warna Biru Transparan misalnya */}
          <g style={{ transform: `rotate(${rotationSecondary}deg)`, transformOrigin: `${radius}px ${radius}px`, transition: 'transform 1s ease' }}>
            {/* Outline needle to represent target */}
            <polygon points={`${radius - 2},${radius} ${radius + 2},${radius} ${radius},${radius - normalizedRadius + 18}`} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 2" />
          </g>

          {/* JARUM 1 (Utama/Realisasi) - Hitam Solid */}
          <g style={{ transform: `rotate(${rotationPrimary}deg)`, transformOrigin: `${radius}px ${radius}px`, transition: 'transform 1s ease' }}>
            <polygon points={`${radius - 3.5},${radius} ${radius + 3.5},${radius} ${radius},${radius - normalizedRadius + 18}`} fill="#1e293b" />
          </g>

          <circle cx={radius} cy={radius} r="7" fill="#1e293b" />
          <circle cx={radius} cy={radius} r="2.5" fill="#f8fafc" />
        </svg>

        <div className="absolute left-0 right-0 bottom-1 flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums translate-y-[28px] text-slate-800">{primaryValue}%</span>
        </div>
      </div>

      <div className="mt-8 flex w-full justify-between px-2">
        <div className="flex flex-col items-start leading-tight">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase"><div className="w-2 border-t-2 border-dashed border-blue-500" />{secondaryLabel}</span>
          <span className="text-sm font-black text-blue-600">{secondaryValue}%</span>
        </div>
        <div className="flex flex-col items-end leading-tight">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">{primaryLabel}<div className="w-2 h-2 rounded-full bg-slate-800" /></span>
          <span className="text-sm font-black text-slate-800">{primaryValue}%</span>
        </div>
      </div>
    </div>
  );
};


// --- IDE 2: SIDE-BY-SIDE MINI GAUGES ---
// Jika dua data beda metrik dan tidak bisa pakai 1 sumbu yang sama.
// Menyatukan 2 gauge kecil tapi full jarum dalam 1 card panjang.
const SideBySideMiniGauges = ({ primaryValue, secondaryValue, primaryLabel, secondaryLabel }: { primaryValue: number, secondaryValue: number, primaryLabel: string, secondaryLabel: string }) => {
  const MiniGauge = ({ value, label }: { value: number, label: string }) => {
    const radius = 60;
    const strokeWidth = 14;
    const normalizedRadius = radius - strokeWidth / 2;
    const rotation = (value / 100) * 180 - 90;

    const segments = ['#ef4444', '#f97316', '#fcd34d', '#fef08a', '#86efac', '#22c55e'];
    const gapAngle = 2.5;
    const totalGapAngle = gapAngle * (segments.length - 1);
    const segmentAngle = (180 - totalGapAngle) / segments.length;

    return (
      <div className="flex flex-col items-center flex-1">
        <svg viewBox={`0 0 ${radius * 2} ${radius + 10}`} className="w-full max-w-[120px] h-auto">
          {segments.map((color, i) => {
            const startAngle = 180 + i * (segmentAngle + gapAngle);
            const endAngle = startAngle + segmentAngle;
            const x1 = radius + normalizedRadius * Math.cos(startAngle * Math.PI / 180);
            const y1 = radius + normalizedRadius * Math.sin(startAngle * Math.PI / 180);
            const x2 = radius + normalizedRadius * Math.cos(endAngle * Math.PI / 180);
            const y2 = radius + normalizedRadius * Math.sin(endAngle * Math.PI / 180);
            return <path key={i} d={`M ${x1} ${y1} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="butt" />
          })}
          <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${radius}px ${radius}px` }}>
            <polygon points={`${radius - 2},${radius} ${radius + 2},${radius} ${radius},${radius - normalizedRadius + 8}`} fill="#1e293b" />
          </g>
          <circle cx={radius} cy={radius} r="4" fill="#1e293b" />
        </svg>
        <div className="mt-1 text-center -translate-y-2">
          <span className="text-lg font-black text-slate-800">{value}%</span>
          <span className="block text-[9px] font-bold text-slate-500 uppercase">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm w-full max-w-[400px]">
      <h3 className="text-sm font-bold text-slate-800 mb-4 whitespace-nowrap text-center">Side-by-Side Detail</h3>
      <div className="flex gap-4 w-full divide-x divide-slate-100 items-center justify-between">
        <MiniGauge value={primaryValue} label={primaryLabel} />
        <MiniGauge value={secondaryValue} label={secondaryLabel} />
      </div>
    </div>
  );
};

// --- IDE 3: MIRRORED GAUGES (ATAS - BAWAH) ---
// Memanfaatkan bentuk sirkular penuh dengan membagi 2 area: Top dan Bottom.
// Sumbu X menjadi pemisah. Jarum bertolak punggung.
// --- IDE 3: MIRRORED GAUGES (TERPISAH ATAS-BAWAH) ---
// Memanfaatkan bentuk sirkular penuh, tapi dipisah dalam 2 blok (konsep Ide 2),
// dan di-mirror saling berhadapan! Jarum akan saling menunjuk titik pusat.
const SplitMirroredGauges = ({ primaryValue, secondaryValue, primaryLabel, secondaryLabel }: { primaryValue: number, secondaryValue: number, primaryLabel: string, secondaryLabel: string }) => {
  const radius = 100;
  const strokeWidth = 26;
  const normalizedRadius = radius - strokeWidth / 2;
  const segments = ['#ef4444', '#f97316', '#fcd34d', '#fef08a', '#86efac', '#22c55e'];
  const gapAngle = 2.5;
  const totalGapAngle = gapAngle * (segments.length - 1);
  const segmentAngle = (180 - totalGapAngle) / segments.length;

  // Single Generic Gauge SVG maker
  const renderGaugeSVG = (value: number, isMirrored: boolean) => {
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

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm w-full max-w-[280px]">
      <h3 className="text-[13px] font-black text-slate-800 mb-5 whitespace-nowrap text-center">Mirrored</h3>
      
      <div className="flex flex-col w-full">
        
        {/* TOP ROW: TEXT (Kiri) - CHART (Kanan) */}
        <div className="flex w-full items-end justify-between px-1">
           <div className="flex flex-col items-start pb-4">
              <span className="text-2xl font-black tabular-nums text-slate-800 leading-none">{primaryValue}%</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-1.5">{primaryLabel}</span>
           </div>
           
           <div className="flex flex-col items-center w-[130px]">
              {renderGaugeSVG(primaryValue, false)}
           </div>
        </div>

        {/* SATU GARIS PEMISAH TIPIS DI TENGAH */}
        <div className="w-full border-t-2 border-dashed border-slate-200 z-20"></div>

        {/* BOTTOM ROW: CHART (Kiri) - TEXT (Kanan) */}
        <div className="flex w-full items-start justify-between px-1">
           <div className="flex flex-col items-end text-right pt-4">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{secondaryLabel}</span>
              <span className="text-2xl font-black tabular-nums text-slate-800 leading-none">{secondaryValue}%</span>
           </div>

           <div className="flex flex-col items-center w-[130px]">
              {renderGaugeSVG(secondaryValue, true)}
           </div>
        </div>

      </div>
    </div>
  );
};


// --- MAIN PAGE ---
export default function DualChartExamplePage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-[100vh] bg-slate-50 p-8 font-sans">
      <button
        onClick={onBack}
        className="mb-8 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
      >
        &larr; Kembali ke Dashboard Utama
      </button>

      <div className="max-w-5xl mx-auto pb-20">
        <h1 className="text-2xl font-black text-slate-800 mb-2">Eksplorasi Ide Dual Chart (Desain Jarum)</h1>
        <p className="text-slate-500 mb-10 text-sm">Desain telah diubah untuk tetap menggunakan jarum secara konsisten.</p>

        <div className="flex flex-wrap gap-8 items-start">

          {/* IDE 1 */}
          <div className="flex flex-col gap-2">
            <DualNeedleGauge
              primaryValue={85} primaryLabel="Realisasi Actual"
              secondaryValue={95} secondaryLabel="Target Plan"
            />
            <p className="text-[11px] text-slate-500 max-w-[320px] mt-2 leading-relaxed">
              <strong>Ide 1: Single Track, Dual Needle.</strong><br />
              Ada dua jarum menunjuk ke trek yang sama. Sangat hemat tempat dan akurat membaca selisih target vs realisasi.
            </p>
          </div>

          {/* IDE 2 */}
          <div className="flex flex-col gap-2">
            <SideBySideMiniGauges
              primaryValue={65} primaryLabel="Utilisasi Alat"
              secondaryValue={80} secondaryLabel="Ketersediaan (Avail)"
            />
            <p className="text-[11px] text-slate-500 max-w-[400px] mt-2 leading-relaxed">
              <strong>Ide 2: Side-by-Side Mini Gauges.</strong><br />
              Menaruh 2 gauge terpisah secara horizontal dalam 1 Card Box. Mempertahankan visual 100% dari chart asli.
            </p>
          </div>

          {/* IDE 3 TERPISAH */}
          <div className="flex flex-col gap-2">
            <SplitMirroredGauges
              primaryValue={92} primaryLabel="Realisasi MTD"
              secondaryValue={68} secondaryLabel="Target MTD"
            />
            <p className="text-[11px] text-slate-500 max-w-[280px] mt-2 leading-relaxed">
              <strong>Ide 3: Separated Mirrored Vertical.</strong><br />
              Gauge dipisah dalam 2 blok berlainan seperti ide 2, namun di-stack Atas dan Bawah lalu direfleksi cermin berhadapan. Lebih lega, tegas memisahkan dua nilai, namun tetap membawa estetika lingkaran kesatuan!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
