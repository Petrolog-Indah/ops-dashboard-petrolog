import React from 'react';
import { GaugeChart } from '../../shared/ui/GaugeChart';
import { DualGaugeChart } from '../../shared/ui/DualGaugeChart';
import type { KpiItem } from '../../entities/kpi';

interface KpiGridProps {
  items: KpiItem[];
  activeFilter: string;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ items, activeFilter }) => {
  // Konfigurasi Grid kustom per kategori
  const GRID_CONFIG: Record<string, { cols: number, maxWidth: string }> = {
    'ALL': { cols: 8, maxWidth: 'max-w-full' },
    'SOP': { cols: 2, maxWidth: 'max-w-full' },
    'QHSE': { cols: 5, maxWidth: 'max-w-full' },
    'Performance Effectiveness': { cols: 3, maxWidth: 'max-w-full' },
    'Efficiency & Productivity': { cols: 3, maxWidth: 'max-w-full' },
  };

  const currentConfig = GRID_CONFIG[activeFilter] || GRID_CONFIG['ALL'];
  const max_cols = currentConfig.cols;

  // Extract dashcam metrics
  const installedItem = items.find(k => k.label === 'Dashcam Installed');
  const activeItem = items.find(k => k.label === 'Dashcam Online');

  // If we have both, we need to artificially inject the dual-card representation into the flow
  // We'll replace the first dashcam occurrence with the combined card
  const processedItems = [];
  const skipIds = new Set<string>();

  items.forEach((item) => {
    if (skipIds.has(item.id)) return;

    // Hanya gabung Dashcam di view "ALL" atau "Performance Effectiveness" (dimana mereka berada)
    const canGroupDashcam = activeFilter === "ALL";
    
    if (canGroupDashcam && (item.label === 'Dashcam Installed' || item.label === 'Dashcam Online')) {
      if (installedItem && activeItem) {
        processedItems.push({
          isDual: true,
          id: 'dual-dashcam',
          primary: installedItem,
          secondary: activeItem
        });
        skipIds.add(installedItem.id);
        skipIds.add(activeItem.id);
        return;
      }
    }
    processedItems.push(item);
  });

  const remainder = processedItems.length % max_cols;
  const offset = remainder ? Math.floor((max_cols - remainder) / 2) : 0;

  const colStartClasses: { [key: number]: string } = {
    1: "lg:col-start-1",
    2: "lg:col-start-2",
    3: "lg:col-start-3",
    4: "lg:col-start-4",
    5: "lg:col-start-5",
    6: "lg:col-start-6",
    7: "lg:col-start-7",
    8: "lg:col-start-8",
  };
  
  // Memetakan jumlah kolom ke class Tailwind secara dinamis
  const gridResponsiveCols: Record<number, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6",
    7: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-7",
    8: "grid-cols-1 sm:grid-cols-4 lg:grid-cols-8",
  };

  const gridColsClass = gridResponsiveCols[max_cols] || gridResponsiveCols[8];
  
  return (
    <div className={`grid ${gridColsClass} ${currentConfig.maxWidth} gap-6 p-6 mx-auto justify-center`}>
      {processedItems.map((item, index) => {
        const isFirstItemLastRow = index === processedItems.length - remainder;
        
        return (
          <div
            key={item.id}
            className={
              isFirstItemLastRow
                ? colStartClasses[offset + 1]
                : ""
            }
          >
            {item.isDual ? (
              <DualGaugeChart
                primaryValue={item.primary.value}
                primaryLabel={item.primary.label}
                secondaryValue={item.secondary.value}
                secondaryLabel={item.secondary.label}
              />
            ) : (
              <GaugeChart
                value={item.value}
                label={item.label}
                subLabel={item.subLabel}
                isRealTime={item.isRealTime}
              />
            )}
          </div>
        )
      })}
    </div>
  );
};
