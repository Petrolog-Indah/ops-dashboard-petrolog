import React from 'react';
import { GaugeChart } from '../../shared/ui/GaugeChart';
import { DualGaugeChart } from '../../shared/ui/DualGaugeChart';
import { TrendChart } from '../../shared/ui/TrendChart';
import type { KpiItem } from '../../entities/kpi';

interface KpiGridProps {
  items: KpiItem[];
  activeFilter: string;
}

export const NewKpiGrid: React.FC<KpiGridProps> = ({ items, activeFilter }) => {
  type DualKpiItem = {
    isDual: true;
    id: string;
    primary: KpiItem;
    secondary: KpiItem;
    category: string;
  };

  type ProcessedItem = (KpiItem | DualKpiItem) & { category?: string };

  const processedItems: ProcessedItem[] = [];
  const skipIds = new Set<string>();

  items.forEach((item) => {
    if (skipIds.has(item.id)) return;
    processedItems.push(item);
  });

  // Komponen untuk me-render satu chart individu
  const renderChart = (item: ProcessedItem) => {
    if ('isDual' in item) {
      return (
        <DualGaugeChart
          key={item.id}
          primaryValue={item.primary.value}
          primaryLabel={item.primary.label}
          secondaryValue={item.secondary.value}
          secondaryLabel={item.secondary.label}
        />
      );
    } else if (item.trend) {
      return (
        <div key={item.id} className="h-full">
          <TrendChart
            label={item.label}
            subLabel={item.subLabel}
            trend={item.trend}
          />
        </div>
      );
    } else {
      return (
        <GaugeChart
          key={item.id}
          value={item.value}
          label={item.label}
          subLabel={item.subLabel}
          isRealTime={item.isRealTime}
        />
      );
    }
  };

  if (activeFilter === 'ALL') {
    // Kelompokkan berdasarkan kategori
    const categories = ['SOP', 'QHSE', 'Performance Effectiveness', 'Efficiency & Productivity'];
    const groupedItems: Record<string, ProcessedItem[]> = {};

    const catSOP = categories.filter(cat => cat === "SOP");
    const catQHSE = categories.filter(cat => cat === "QHSE");
    const catPE = categories.filter(cat => cat === "Performance Effectiveness");
    const catEP = categories.filter(cat => cat === "Efficiency & Productivity");

    categories.forEach(cat => {
      groupedItems[cat] = processedItems.filter(item => item.category === cat);
    });

    return (
      <div className="flex flex-col gap-4 max-w-full mx-auto p-4 md:p-6 rounded-3xl min-h-screen">
        <div className='flex gap-4 justify-between items-stretch'>
          <div className='flex flex-col gap-4 w-2/3'>
            <div className='grid grid-cols-2 gap-4'>
              {catSOP.map((category) => {
                const catItems = groupedItems[category];
                if (!catItems || catItems.length === 0) return null;

                  return (
                    <div key={category} className="flex flex-col p-5 rounded-2xl border border-slate-700/50 shadow-lg">
                      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-700/30">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-700">{category}</h2>
                      </div>

                      <div className="grid grid-cols-1 gap-5">
                        {catItems.map(item => (
                          <div key={item.id} className="h-72 transition-transform hover:scale-[1.02]">
                            {renderChart(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
              })}
              {catQHSE.map((category) => {
                const catItems = groupedItems[category];
                if (!catItems || catItems.length === 0) return null;

                  return (
                    <div key={category} className="flex flex-col p-5 rounded-2xl border border-slate-700/50 shadow-lg">
                      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-700/30">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-700">{category}</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-2 gap-5">
                        {catItems.map(item => (
                          <div key={item.id} className="h-72 transition-transform hover:scale-[1.02]">
                            {renderChart(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
              })}
            </div>
            {catPE.map((category) => {
                const catItems = groupedItems[category];
                if (!catItems || catItems.length === 0) return null;

                  return (
                    <div key={category} className="flex flex-col p-5 rounded-2xl border border-slate-700/50 shadow-lg">
                      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-700/30">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-700">{category}</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                        {catItems.map(item => (
                          <div key={item.id} className="h-80 transition-transform hover:scale-[1.02]">
                            {renderChart(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
              })}
          </div>
          <div className='w-1/3 flex flex-col'>
            {catEP.map((category) => {
              const catItems = groupedItems[category];
              if (!catItems || catItems.length === 0) return null;

                return (
                  <div key={category} className="flex flex-col p-5 rounded-2xl border border-slate-700/50 shadow-lg flex-1 h-full">
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-700/30">
                      <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                      <h2 className="text-lg font-bold text-slate-700">{category}</h2>
                    </div>

                    <div className="flex flex-col gap-5 flex-1 min-h-0">
                      {catItems.map(item => (
                        <div key={item.id} className="flex-1 min-h-0 transition-transform hover:scale-[1.02]">
                          {renderChart(item)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Non-ALL filter: identik dengan KpiGrid asli ──────────────────────────
  const GRID_CONFIG: Record<string, { cols: number; maxWidth: string }> = {
    'ALL': { cols: 8, maxWidth: 'max-w-full' },
    'SOP': { cols: 2, maxWidth: 'max-w-full' },
    'QHSE': { cols: 4, maxWidth: 'max-w-full' },
    'Performance Effectiveness': { cols: 5, maxWidth: 'max-w-full' },
    'Efficiency & Productivity': { cols: 3, maxWidth: 'max-w-full' },
  };

  const currentConfig = GRID_CONFIG[activeFilter] || GRID_CONFIG['ALL'];
  const max_cols = currentConfig.cols;

  const remainder = processedItems.length % max_cols;
  const offset = remainder ? Math.floor((max_cols - remainder) / 2) : 0;

  const colStartClasses: { [key: number]: string } = {
    1: 'lg:col-start-1', 2: 'lg:col-start-2', 3: 'lg:col-start-3',
    4: 'lg:col-start-4', 5: 'lg:col-start-5', 6: 'lg:col-start-6',
    7: 'lg:col-start-7', 8: 'lg:col-start-8',
  };

  const gridResponsiveCols: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-6',
    7: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-7',
    8: 'grid-cols-1 sm:grid-cols-4 lg:grid-cols-8',
  };

  const gridColsClass = gridResponsiveCols[max_cols] || gridResponsiveCols[8];

  return (
    <div className={`grid ${gridColsClass} ${currentConfig.maxWidth} gap-6 p-6 mx-auto justify-center`}>
      {processedItems.map((item, index) => {
        const isFirstItemLastRow = index === processedItems.length - remainder;
        return (
          <div
            key={item.id}
            className={isFirstItemLastRow ? colStartClasses[offset + 1] : ''}
          >
            {renderChart(item)}
          </div>
        );
      })}
    </div>
  );
};
