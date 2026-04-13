import React from 'react';
import { GaugeChart } from '../../shared/ui/GaugeChart';
import type { KpiItem } from '../../entities/kpi';

interface KpiGridProps {
  items: KpiItem[];
}

export const KpiGrid: React.FC<KpiGridProps> = ({ items }) => {
  const max_cols = 8;

  const remainder = items.length % max_cols;
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
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-8 gap-6 p-6 justify-center">
      {items.map((kpi, index) => {
        const isFirstItemLastRow = index === items.length - remainder;
        return(
          <div
            key={kpi.id}
            className={
              isFirstItemLastRow
                ? colStartClasses[offset + 1]
                : ""
            }
          >
            <GaugeChart
              value={kpi.value}
              label={kpi.label}
              subLabel={kpi.subLabel}
              isRealTime={kpi.isRealTime}
            />
          </div>
        )
      })}
    </div>
  );
};
