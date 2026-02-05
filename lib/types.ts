// Re-export types for convenience
export type { Location, Route, Instruction } from './store';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RoutingRequest {
  origin: [number, number];
  destination: [number, number];
  mode?: 'foot' | 'car' | 'bike';
  alternatives?: boolean;
}

export interface RoutingResponse {
  routes: RouteData[];
  waypoints?: WayPoint[];
}

export interface RouteData {
  distance: number;
  duration: number;
  geometry: GeoJSON.LineString;
  legs: RouteLeg[];
}

export interface RouteLeg {
  distance: number;
  duration: number;
  steps: RouteStep[];
}

export interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  direction: string;
  maneuver?: Maneuver;
}

export interface Maneuver {
  type: string;
  modifier?: string;
  bearing_before?: number;
  bearing_after?: number;
  location: [number, number];
}

export interface WayPoint {
  location: [number, number];
  name: string;
  distance?: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
