import { Location, Route, Instruction } from './store';

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

async function fetchRouteFromOSRM(
  origin: Location,
  destination: Location,
  routeType: 'fastest' | 'scenery' | 'foodie'
): Promise<{ distance: number; duration: number; elevation: number; coordinates: [number, number][] } | null> {
  try {
    const response = await fetch(
      `/api/location/route?startLat=${origin.lat}&startLng=${origin.lng}&endLat=${destination.lat}&endLng=${destination.lng}&routeType=${routeType}`
    );

    if (!response.ok) {
      console.error('OSRM route fetch failed:', response.status);
      return null;
    }

    const data = await response.json();
    return {
      distance: data.distance,
      duration: data.duration,
      elevation: data.elevation,
      coordinates: data.coordinates,
    };
  } catch (error) {
    console.error('OSRM route fetch error:', error);
    return null;
  }
}

function generateInstructions(distance: number, duration: number, routeType?: string): Instruction[] {
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
  
  const streets = ['Main Street', 'Oak Avenue', 'Park Road', 'Market Lane', 'Riverside Path', 'Garden Way', 'Tree Lane'];
  
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
    console.log('🚶 calculateRoutes called with origin:', origin, 'destination:', destination);
    const routes: Route[] = [];
    
    const routeTypes = [
      { 
        id: 'fastest',
        name: 'Fastest Route',
        emoji: '⚡',
        color: '#FF6B9D',
        description: 'Shortest walking time'
      },
      { 
        id: 'scenery',
        name: 'Scenery Route',
        emoji: '🌳',
        color: '#6BFFA6',
        description: 'Beautiful scenic views'
      },
      { 
        id: 'foodie',
        name: 'Foodie Route',
        emoji: '🍽️',
        color: '#FFD93D',
        description: 'Pass through food areas'
      },
    ];

    for (let i = 0; i < routeTypes.length; i++) {
      const { id, name, emoji, color, description } = routeTypes[i];
      
      const osrmRoute = await fetchRouteFromOSRM(origin, destination, id as 'fastest' | 'scenery' | 'foodie');
      
      if (!osrmRoute || osrmRoute.coordinates.length === 0) {
        console.warn(`⚠️ Failed to fetch route for ${id}, skipping`);
        continue;
      }

      const { distance, duration, elevation, coordinates } = osrmRoute;
      
      console.log(`📍 Route ${id} fetched with ${coordinates.length} coordinates:`, 
        coordinates.slice(0, 2), '...', coordinates.slice(-1));

      const route: Route = {
        id: `route-${id}`,
        name: `${emoji} ${name}`,
        distance,
        duration,
        elevation,
        coordinates,
        instructions: generateInstructions(distance, duration, description),
        color,
        selected: i === 0,
        isFavorite: false,
      };

      routes.push(route);
    }

    console.log('✅ Routes calculated:', routes.length, 'routes');
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
