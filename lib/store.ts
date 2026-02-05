import { create } from 'zustand';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Route {
  id: string;
  name: string;
  distance: number;
  duration: number;
  elevation: number;
  coordinates: [number, number][];
  instructions: Instruction[];
  color: string;
  selected: boolean;
  isFavorite: boolean;
}

export interface Instruction {
  text: string;
  distance: number;
  duration: number;
  direction: string;
  emoji: string;
}

interface RouteStore {
  origin: Location | null;
  destination: Location | null;
  routes: Route[];
  selectedRouteId: string | null;
  favorites: Route[];
  loading: boolean;
  error: string | null;

  // Actions
  setOrigin: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;
  setRoutes: (routes: Route[]) => void;
  selectRoute: (id: string) => void;
  toggleFavorite: (routeId: string) => void;
  removeFavorite: (routeId: string) => void;
  loadFavorites: () => void;
  saveFavorites: () => void;
  clearRoutes: () => void;
  swapOriginDestination: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRouteStore = create<RouteStore>((set, get) => ({
  origin: null,
  destination: null,
  routes: [],
  selectedRouteId: null,
  favorites: [],
  loading: false,
  error: null,

  setOrigin: (location) => set({ origin: location }),

  setDestination: (location) => set({ destination: location }),

  setRoutes: (routes) => {
    const state = get();
    const routesWithFavorites = routes.map((route) => ({
      ...route,
      isFavorite: state.favorites.some((fav) => fav.id === route.id),
    }));
    set({ routes: routesWithFavorites, selectedRouteId: routesWithFavorites[0]?.id || null });
  },

  selectRoute: (id) => {
    const state = get();
    const routes = state.routes.map((r) => ({
      ...r,
      selected: r.id === id,
    }));
    set({ routes, selectedRouteId: id });
  },

  toggleFavorite: (routeId) => {
    const state = get();
    const route = state.routes.find((r) => r.id === routeId);
    
    if (!route) return;

    if (route.isFavorite) {
      set({
        favorites: state.favorites.filter((r) => r.id !== routeId),
        routes: state.routes.map((r) =>
          r.id === routeId ? { ...r, isFavorite: false } : r
        ),
      });
    } else {
      set({
        favorites: [...state.favorites, { ...route, isFavorite: true }],
        routes: state.routes.map((r) =>
          r.id === routeId ? { ...r, isFavorite: true } : r
        ),
      });
    }
    
    // Save to localStorage
    get().saveFavorites();
  },

  removeFavorite: (routeId) => {
    set({
      favorites: get().favorites.filter((r) => r.id !== routeId),
      routes: get().routes.map((r) =>
        r.id === routeId ? { ...r, isFavorite: false } : r
      ),
    });
    get().saveFavorites();
  },

  loadFavorites: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('routeFavorites');
      if (stored) {
        set({ favorites: JSON.parse(stored) });
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  },

  saveFavorites: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('routeFavorites', JSON.stringify(get().favorites));
    } catch (err) {
      console.error('Failed to save favorites:', err);
    }
  },

  clearRoutes: () => set({ routes: [], selectedRouteId: null }),

  swapOriginDestination: () => {
    const state = get();
    set({
      origin: state.destination,
      destination: state.origin,
    });
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));
