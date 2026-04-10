import React from 'react';
import { GaugeChart } from '../../shared/ui/GaugeChart';
import type { KpiItem } from '../../entities/kpi';

interface KpiGridProps {
  items: KpiItem[];
}

export const KpiGrid: React.FC<KpiGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 xl:grid-cols-8 2xl:grid-cols-8 gap-6 p-6">
      {items.map((kpi) => (
        <GaugeChart
          key={kpi.id}
          value={kpi.value}
          label={kpi.label}
          subLabel={kpi.subLabel}
        />
      ))}
    </div>
  );
};
