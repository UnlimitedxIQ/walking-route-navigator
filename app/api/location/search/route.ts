import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 400 });
    }

    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      {
        headers: {
          'User-Agent': 'Walking-Route-Navigator',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();
    
    const results = data.map((result: any) => ({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.display_name,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Location search error:', error);
    return NextResponse.json(
      { error: 'Failed to search locations' },
      { status: 500 }
    );
  }
}
