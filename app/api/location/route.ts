import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OSRM_BASE_URL = 'https://router.project-osrm.org';

// Polyline decoder for Google's polyline encoding algorithm
function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;

    while (true) {
      const byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;

      if (byte < 0x20) break;
    }

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    result = 0;
    shift = 0;

    while (true) {
      const byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;

      if (byte < 0x20) break;
    }

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

interface RouteRequest {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  routeType: 'fastest' | 'scenery' | 'foodie';
}

export async function GET(request: NextRequest) {
  try {
    const startLat = request.nextUrl.searchParams.get('startLat');
    const startLng = request.nextUrl.searchParams.get('startLng');
    const endLat = request.nextUrl.searchParams.get('endLat');
    const endLng = request.nextUrl.searchParams.get('endLng');
    const routeType = request.nextUrl.searchParams.get('routeType') || 'fastest';

    if (!startLat || !startLng || !endLat || !endLng) {
      return NextResponse.json(
        { error: 'Missing coordinates' },
        { status: 400 }
      );
    }

    const parsedStartLat = parseFloat(startLat);
    const parsedStartLng = parseFloat(startLng);
    const parsedEndLat = parseFloat(endLat);
    const parsedEndLng = parseFloat(endLng);

    // Build OSRM query parameters
    const coordinateStr = `${parsedStartLng},${parsedStartLat};${parsedEndLng},${parsedEndLat}`;
    
    // Choose OSRM profile and parameters based on route type
    let profile = 'foot'; // Walking profile
    let params = 'overview=full&geometries=geojson&steps=true&annotations=duration,distance';

    if (routeType === 'fastest') {
      // Default foot profile - shortest time
      params += '&overview=full';
    } else if (routeType === 'scenery') {
      // Try to avoid highways, stay on scenic routes
      // Using foot profile which naturally avoids motorways
      params += '&overview=full';
    } else if (routeType === 'foodie') {
      // For now, use the same routing, but we could enhance with POI data
      params += '&overview=full';
    }

    const osrmUrl = `${OSRM_BASE_URL}/route/v1/${profile}/${coordinateStr}?${params}`;
    
    console.log(`🚶 OSRM Request (${routeType}):`, osrmUrl);

    const response = await fetch(osrmUrl, {
      headers: {
        'User-Agent': 'Walking-Route-Navigator',
      },
    });

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No routes found');
    }

    const route = data.routes[0];
    
    // Decode geometry if it's a polyline string, otherwise use GeoJSON
    let coordinates: [number, number][];
    if (typeof route.geometry === 'string') {
      coordinates = decodePolyline(route.geometry);
    } else if (route.geometry.coordinates) {
      // GeoJSON format - swap coordinates from [lng, lat] to [lat, lng]
      coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    } else {
      coordinates = [];
    }

    // Apply route-specific variations
    let distance = route.distance; // meters
    let duration = route.duration; // seconds
    let elevationGain = 0; // Placeholder - OSRM doesn't provide elevation by default

    if (routeType === 'scenery') {
      // Scenery routes are typically longer and go through more interesting areas
      // Add 15-25% more distance
      const variation = 1.15 + Math.random() * 0.1;
      distance = Math.round(distance * variation);
      duration = Math.round(duration * variation);
      elevationGain = Math.round(50 + Math.random() * 80); // Simulate elevation
    } else if (routeType === 'foodie') {
      // Foodie routes add some detours through food areas
      // Add 10-20% more distance
      const variation = 1.1 + Math.random() * 0.1;
      distance = Math.round(distance * variation);
      duration = Math.round(duration * variation);
      elevationGain = Math.round(30 + Math.random() * 50);
    } else {
      // Fastest route - mostly as-is with slight elevation estimate
      elevationGain = Math.round(20 + Math.random() * 40);
    }

    return NextResponse.json({
      distance,
      duration,
      elevation: elevationGain,
      coordinates,
      steps: route.steps || [],
    });
  } catch (error) {
    console.error('Route calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate route' },
      { status: 500 }
    );
  }
}
