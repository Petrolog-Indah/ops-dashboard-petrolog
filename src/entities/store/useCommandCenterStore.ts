import { create } from 'zustand';
import type { DummyUnit, DummyAlert } from '../model/commandCenterTypes';
import { DUMMY_UNITS } from '../mock/units';
import { DUMMY_ALERTS } from '../mock/alerts';

interface CommandCenterState {
  units: DummyUnit[];
  alerts: DummyAlert[];
  selectedUnitId: string | null;
  selectedSite: string;
  selectedShift: 'DAY' | 'NIGHT';
  lastUpdate: string;
  dismissedAlertIds: Set<string>;

  selectUnit: (id: string | null) => void;
  setSiteFilter: (site: string) => void;
  setShift: (shift: 'DAY' | 'NIGHT') => void;
  dismissAlert: (id: string) => void;
  updateLastUpdate: () => void;
  updateUnitPosition: (unitId: string, lat: number, lng: number) => void;
  updateUnitFuel: (unitId: string, fuel: number) => void;
}

export const useCommandCenterStore = create<CommandCenterState>((set) => ({
  units: DUMMY_UNITS,
  alerts: DUMMY_ALERTS,
  selectedUnitId: null,
  selectedSite: 'ALL',
  selectedShift: 'DAY',
  lastUpdate: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  dismissedAlertIds: new Set(),

  selectUnit: (id) => set({ selectedUnitId: id }),

  setSiteFilter: (site) => set({ selectedSite: site }),

  setShift: (shift) => set({ selectedShift: shift }),

  dismissAlert: (id) => set((state) => {
    const newDismissed = new Set(state.dismissedAlertIds);
    newDismissed.add(id);
    return { dismissedAlertIds: newDismissed };
  }),

  updateLastUpdate: () => set({
    lastUpdate: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }),

  updateUnitPosition: (unitId, lat, lng) => set((state) => ({
    units: state.units.map(u => u.unitId === unitId ? { ...u, lat, lng } : u)
  })),

  updateUnitFuel: (unitId, fuel) => set((state) => ({
    units: state.units.map(u => u.unitId === unitId ? { ...u, fuelPercent: fuel } : u)
  })),
}));
