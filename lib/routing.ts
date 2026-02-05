import { Location, Route, Instruction } from './store';

const OSRM_BASE_URL = 'https://router.project-osrm.org';
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Simulated OSRM mock data for demo (replace with real API in production)
const mockRoutes = {
  'shortest': {
    distance: 2450,
    duration: 1800,
    elevation: 45,
  },
  'fastest': {
    distance: 2800,
    duration: 1500,
    elevation: 25,
  },
  'safest': {
    distance: 2650,
    duration: 1950,
    elevation: 30,
  },
};

export async function searchLocation(query: string): Promise<Location[]> {
  try {
    const response = await fetch(`/api/location/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      console.error('Location search failed:', response.status);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
}

export async function getReverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(`/api/location/reverse?lat=${lat}&lon=${lng}`);
    
    if (!response.ok) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    const data = await response.json();
    return data.name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

function generateDemoCoordinates(start: Location, end: Location, variance: number): [number, number][] {
  const points: [number, number][] = [];
  const steps = 20;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const baseLatOffset = Math.sin(i * 0.3) * variance;
    const baseLngOffset = Math.cos(i * 0.3) * variance;
    
    const lat = start.lat + (end.lat - start.lat) * t + baseLatOffset;
    const lng = start.lng + (end.lng - start.lng) * t + baseLngOffset;
    points.push([lat, lng]);
  }
  
  return points;
}

function generateInstructions(distance: number, duration: number): Instruction[] {
  const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  const turns = ['left', 'right', 'straight', 'slight left', 'slight right', 'u-turn'];
  const directionEmojis: { [key: string]: string } = {
    'north': '⬆️',
    'northeast': '↗️',
    'east': '➡️',
    'southeast': '↘️',
    'south': '⬇️',
    'southwest': '↙️',
    'west': '⬅️',
    'northwest': '↖️',
  };
  const turnEmojis: { [key: string]: string } = {
    'left': '⬅️',
    'right': '➡️',
    'straight': '⬆️',
    'slight left': '↙️',
    'slight right': '↗️',
    'u-turn': '🔄',
  };

  const instructions: Instruction[] = [];
  const segmentDistance = distance / 4;
  const segmentDuration = duration / 4;
  
  const streets = ['Main Street', 'Oak Avenue', 'Park Road', 'Market Lane', 'Riverside Path'];
  
  for (let i = 0; i < 4; i++) {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const turn = i === 0 ? 'straight' : turns[Math.floor(Math.random() * turns.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    
    instructions.push({
      text: i === 0 
        ? `Start heading ${direction} on ${street}`
        : `Turn ${turn} onto ${street}`,
      distance: Math.round(segmentDistance),
      duration: Math.round(segmentDuration),
      direction,
      emoji: turn ? turnEmojis[turn] || '⬆️' : directionEmojis[direction],
    });
  }
  
  instructions.push({
    text: 'Arrive at destination',
    distance: 0,
    duration: 0,
    direction: 'arrive',
    emoji: '🎉',
  });

  return instructions;
}

export async function calculateRoutes(origin: Location, destination: Location): Promise<Route[]> {
  try {
    const routes: Route[] = [];
    const colors = ['#FF6B9D', '#C06BFF', '#6BC9FF', '#6BFFA6'];
    
    const routeTypes = [
      { type: 'shortest', color: colors[0], multiplier: 1.0 },
      { type: 'fastest', color: colors[1], multiplier: 1.15 },
      { type: 'safest', color: colors[2], multiplier: 1.08 },
      { type: 'scenic', color: colors[3], multiplier: 1.2 },
    ];

    for (let i = 0; i < routeTypes.length; i++) {
      const { type, color, multiplier } = routeTypes[i];
      const baseMockRoute = mockRoutes[type as keyof typeof mockRoutes] || mockRoutes.shortest;
      
      const distance = Math.round(baseMockRoute.distance * (0.9 + Math.random() * 0.2) * multiplier);
      const duration = Math.round(baseMockRoute.duration * multiplier);
      const elevation = baseMockRoute.elevation + Math.floor(Math.random() * 20);

      const route: Route = {
        id: `route-${type}`,
        name: type.charAt(0).toUpperCase() + type.slice(1) + ' Route',
        distance,
        duration,
        elevation,
        coordinates: generateDemoCoordinates(origin, destination, 0.01 * (i + 1)),
        instructions: generateInstructions(distance, duration),
        color,
        selected: i === 0,
        isFavorite: false,
      };

      routes.push(route);
    }

    return routes;
  } catch (error) {
    console.error('Route calculation error:', error);
    return [];
  }
}

export function shareRoute(route: Route, origin: Location, destination: Location): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    route: route.id,
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
  });
  return `${baseUrl}?${params.toString()}`;
}

export function generateGoogleMapsUrl(origin: Location, destination: Location): string {
  const originStr = `${origin.lat},${origin.lng}`;
  const destinationStr = `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destinationStr}`;
}

export function calculateElevationProfile(coordinates: [number, number][]): { distance: number; elevation: number }[] {
  // Simulated elevation profile
  return coordinates.map((_, i) => ({
    distance: Math.round((i / coordinates.length) * 2450),
    elevation: 50 + Math.sin(i * 0.5) * 30,
  }));
}
