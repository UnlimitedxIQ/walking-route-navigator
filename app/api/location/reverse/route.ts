import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export async function GET(request: NextRequest) {
  try {
    const lat = request.nextUrl.searchParams.get('lat');
    const lng = request.nextUrl.searchParams.get('lon');
    
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'lat and lon parameters are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json`,
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
    
    const name = data.address?.city ||
                 data.address?.town ||
                 data.address?.village ||
                 data.address?.suburb ||
                 `${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}`;

    return NextResponse.json({ name });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode location' },
      { status: 500 }
    );
  }
}
