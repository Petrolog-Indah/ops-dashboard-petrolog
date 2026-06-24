export interface DummyUnit {
  id: string;
  unitId: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  site: string;
  fuelPercent: number;
  speed: number;
  driver: string | null;
  behaviour: 'normal' | 'smoking' | 'fatigue' | 'speeding' | 'none';
  lat: number;
  lng: number;
  lastUpdate: string;
}

export interface DummyAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  unitId?: string;
  timeAgo: string;
  category: 'fuel' | 'geofence' | 'maintenance' | 'behaviour' | 'safety';
}

export interface GeofenceArea {
  id: string;
  name: string;
  coordinates: [number, number][];
  color: string;
}

export interface KpiStripItem {
  label: string;
  value: number | string;
  suffix: string;
  icon: string;
  numericValue: number;
}
