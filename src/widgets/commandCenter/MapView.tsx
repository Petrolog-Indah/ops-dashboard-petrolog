import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCommandCenterStore } from '../../entities/store/useCommandCenterStore';
import { DUMMY_GEOFENCES, MAP_CENTER, MAP_ZOOM } from '../../entities/mock/mapData';

function createStatusIcon(status: string) {
  const colors: Record<string, string> = {
    active: '#22c55e',
    idle: '#eab308',
    maintenance: '#ef4444',
    offline: '#6b7280',
  };
  const color = colors[status] || '#6b7280';
  const isOffline = status === 'offline';

  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        width: 20px; height: 20px;
        background: ${isOffline ? '#e5e7eb' : color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ${status === 'active' ? 'animation: pulse-marker 2s infinite;' : ''}
        ${isOffline ? 'opacity: 0.5;' : ''}
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -20],
  });
}

function MapUpdater() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function getBehaviourInfo(behaviour: string) {
  switch (behaviour) {
    case 'smoking': return { label: 'Smoking', color: '#f97316' };
    case 'fatigue': return { label: 'Fatigue', color: '#a855f7' };
    case 'speeding': return { label: 'Speeding', color: '#ef4444' };
    default: return { label: 'Normal', color: '#22c55e' };
  }
}

export default function MapView() {
  const units = useCommandCenterStore((s) => s.units);
  const selectUnit = useCommandCenterStore((s) => s.selectUnit);
  const selectedUnitId = useCommandCenterStore((s) => s.selectedUnitId);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow-lg relative">
      <style>{`
        @keyframes pulse-marker {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .custom-marker-icon { background: none !important; border: none !important; }
      `}</style>
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapUpdater />

        {DUMMY_GEOFENCES.map((gf) => (
          <Polygon
            key={gf.id}
            positions={gf.coordinates}
            pathOptions={{
              color: gf.color,
              fillColor: gf.color,
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '6 4',
            }}
          />
        ))}

        {units.map((unit) => (
          <Marker
            key={unit.id}
            position={[unit.lat, unit.lng]}
            icon={createStatusIcon(unit.status)}
            eventHandlers={{
              click: () => selectUnit(unit.id),
            }}
          >
            <Popup>
              <div className="text-xs font-sans min-w-[140px]">
                <div className="font-bold text-sm mb-1 text-slate-900">{unit.unitId}</div>
                <div className="space-y-0.5 text-slate-600">
                  <div><span className="font-medium">Driver:</span> {unit.driver || '-'}</div>
                  <div><span className="font-medium">Speed:</span> {unit.speed} km/h</div>
                  <div><span className="font-medium">Fuel:</span> {unit.fuelPercent}%</div>
                  <div><span className="font-medium">Status:</span>
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-white`}
                      style={{
                        backgroundColor:
                          unit.status === 'active' ? '#22c55e' :
                          unit.status === 'idle' ? '#eab308' :
                          unit.status === 'maintenance' ? '#ef4444' : '#6b7280'
                      }}
                    >{unit.status}</span>
                  </div>
                  <div><span className="font-medium">Behaviour:</span>
                    <span className="ml-1" style={{ color: getBehaviourInfo(unit.behaviour).color }}>
                      {getBehaviourInfo(unit.behaviour).label}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-slate-200 text-xs">
        <div className="font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">Legend</div>
        {[
          { label: 'Active', color: '#22c55e' },
          { label: 'Idle', color: '#eab308' },
          { label: 'Maintenance', color: '#ef4444' },
          { label: 'Offline', color: '#6b7280' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 py-0.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Info bar */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg border border-slate-200 text-[10px] text-slate-500 font-medium">
        {units.filter(u => u.status === 'active').length} Active &middot; {units.filter(u => u.status === 'idle').length} Idle &middot; {units.filter(u => u.status === 'maintenance').length} Maintenance
      </div>
    </div>
  );
}
