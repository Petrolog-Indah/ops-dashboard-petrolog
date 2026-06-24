import type { GeofenceArea } from '../model/commandCenterTypes';

export const DUMMY_GEOFENCES: GeofenceArea[] = [
  {
    id: 'gf-001',
    name: 'Pit A',
    coordinates: [
      [-7.248, 112.766],
      [-7.248, 112.774],
      [-7.256, 112.774],
      [-7.256, 112.766],
    ],
    color: '#22c55e'
  },
  {
    id: 'gf-002',
    name: 'Pit B',
    coordinates: [
      [-7.253, 112.768],
      [-7.253, 112.776],
      [-7.261, 112.776],
      [-7.261, 112.768],
    ],
    color: '#eab308'
  },
  {
    id: 'gf-003',
    name: 'Workshop',
    coordinates: [
      [-7.245, 112.770],
      [-7.245, 112.774],
      [-7.250, 112.774],
      [-7.250, 112.770],
    ],
    color: '#3b82f6'
  },
];

export const MAP_CENTER: [number, number] = [-7.252, 112.770];
export const MAP_ZOOM = 15;
