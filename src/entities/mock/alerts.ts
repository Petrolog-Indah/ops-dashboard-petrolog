import type { DummyAlert } from '../model/commandCenterTypes';

export const DUMMY_ALERTS: DummyAlert[] = [
  {
    id: 'a-001',
    severity: 'high',
    title: 'Fuel Drop Anomaly',
    description: 'Tank U-042 turun 30% dalam 5 menit',
    unitId: 'U-042',
    timeAgo: '2m ago',
    category: 'fuel'
  },
  {
    id: 'a-002',
    severity: 'medium',
    title: 'Geofence Breach',
    description: 'U-031 keluar area Pit B',
    unitId: 'U-031',
    timeAgo: '15m ago',
    category: 'geofence'
  },
  {
    id: 'a-003',
    severity: 'low',
    title: 'P2H Overdue',
    description: 'U-018 belum submit P2H hari ini',
    unitId: 'U-018',
    timeAgo: '1h ago',
    category: 'maintenance'
  },
  {
    id: 'a-004',
    severity: 'medium',
    title: 'Speeding Detected',
    description: 'U-055 melaju 25 km/h di area pit',
    unitId: 'U-055',
    timeAgo: '5m ago',
    category: 'behaviour'
  },
  {
    id: 'a-005',
    severity: 'high',
    title: 'Engine Temperature',
    description: 'Suhu engine U-018 di atas threshold',
    unitId: 'U-018',
    timeAgo: '30m ago',
    category: 'safety'
  },
  {
    id: 'a-006',
    severity: 'low',
    title: 'Routine Check',
    description: 'Jadwal servis U-033 dalam 2 jam',
    unitId: 'U-033',
    timeAgo: '45m ago',
    category: 'maintenance'
  },
  {
    id: 'a-007',
    severity: 'medium',
    title: 'Fuel Theft Suspected',
    description: 'Pola konsumsi U-101 tidak normal',
    unitId: 'U-101',
    timeAgo: '10m ago',
    category: 'fuel'
  },
  {
    id: 'a-008',
    severity: 'high',
    title: 'Collision Risk',
    description: 'U-042 dan U-055 dalam jarak < 5m',
    unitId: 'U-042',
    timeAgo: '1m ago',
    category: 'safety'
  },
];
