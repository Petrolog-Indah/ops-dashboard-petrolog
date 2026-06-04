import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DETAILED_KPI_DATA } from '../kpi';

type VisibilityMap = Record<string, boolean>;

interface CardVisibilityState {
  visibility: VisibilityMap;
  toggleCard: (id: string) => void;
  setAllVisible: () => void;
  setAllHidden: () => void;
  isVisible: (id: string) => boolean;
  visibleIds: () => string[];
}

const defaultVisibility = (): VisibilityMap => {
  const map: VisibilityMap = {};
  for (const item of DETAILED_KPI_DATA) {
    map[item.id] = true;
  }
  return map;
};

export const useCardVisibility = create<CardVisibilityState>()(
  persist(
    (set, get) => ({
      visibility: defaultVisibility(),

      toggleCard: (id) =>
        set((state) => ({
          visibility: {
            ...state.visibility,
            [id]: !state.visibility[id],
          },
        })),

      setAllVisible: () => set({ visibility: defaultVisibility() }),

      setAllHidden: () => {
        const hidden: VisibilityMap = {};
        for (const item of DETAILED_KPI_DATA) {
          hidden[item.id] = false;
        }
        set({ visibility: hidden });
      },

      isVisible: (id) => get().visibility[id] !== false,

      visibleIds: () => {
        const { visibility } = get();
        return Object.entries(visibility)
          .filter(([, v]) => v !== false)
          .map(([id]) => id);
      },
    }),
    { name: 'card-visibility' }
  )
);
