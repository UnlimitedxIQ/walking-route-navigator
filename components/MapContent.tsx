'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useRouteStore } from '@/lib/store';
import { generateGoogleMapsUrl } from '@/lib/routing';

// Origin marker icon
const originIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iIzRGQ0FFRiIvPjx0ZXh0IHg9IjI0IiB5PSIzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNiIgZm9udC13ZWlnaHQ9ImJvbGQiPkE8L3RleHQ+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const destIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0ZGNkI5RCIvPjx0ZXh0IHg9IjI0IiB5PSIzMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyNiIgZm9udC13ZWlnaHQ9ImJvbGQiPkI8L3RleHQ+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface MapContentProps {
  darkMode?: boolean;
}

export default function MapContent({ darkMode = false }: MapContentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const markerLayersRef = useRef<L.Marker[]>([]);
  const { origin, destination, routes, selectedRouteId } = useRouteStore();

  // Initialize map with light mode tiles
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [40.7128, -74.006], // NYC default
        zoom: 13,
        zoomControl: true,
        preferCanvas: true,
      });

      // Initialize with light mode tiles
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      // Cleanup
    };
  }, []);

  // Switch tileset based on dark mode
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    // Remove current tile layer
    mapRef.current.removeLayer(tileLayerRef.current);

    if (darkMode) {
      // Use CartoDB Dark Matter tileset for night mode
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(mapRef.current);
    } else {
      // Use standard OpenStreetMap for light mode
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      ).addTo(mapRef.current);
    }
  }, [darkMode]);

  // Update routes on map
  useEffect(() => {
    if (!mapRef.current) {
      console.log('❌ mapRef.current is null, skipping route rendering');
      return;
    }

    console.log('🗺️ Updating routes on map, routes.length:', routes.length, 'selectedRouteId:', selectedRouteId);

    // Clear existing route layers
    routeLayersRef.current.forEach((layer) => layer.remove());
    routeLayersRef.current = [];

    // Add new routes
    routes.forEach((route) => {
      const isSelected = route.id === selectedRouteId;
      console.log(`🎨 Adding route ${route.id} with ${route.coordinates.length} coordinates, color: ${route.color}`);
      console.log(`   First coord:`, route.coordinates[0], `Last coord:`, route.coordinates[route.coordinates.length - 1]);
      
      const polyline = L.polyline(route.coordinates, {
        color: route.color,
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 1 : 0.6,
        smoothFactor: 1.0,
        dashArray: undefined,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(mapRef.current!);

      console.log(`✅ Polyline added for route ${route.id}`);

      // Add click handler to open Google Maps
      polyline.on('click', () => {
        if (origin && destination) {
          const mapsUrl = generateGoogleMapsUrl(origin, destination);
          window.open(mapsUrl, '_blank');
        }
      });

      // Add hover effects
      polyline.on('mouseover', () => {
        polyline.setStyle({
          weight: 6,
          opacity: 1,
        });
      });

      polyline.on('mouseout', () => {
        polyline.setStyle({
          weight: isSelected ? 5 : 3,
          opacity: isSelected ? 1 : 0.6,
        });
      });

      routeLayersRef.current.push(polyline);
    });

    // Fit bounds if we have routes
    if (routes.length > 0 && mapRef.current) {
      const group = new L.FeatureGroup(routeLayersRef.current);
      try {
        mapRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
      } catch (e) {
        console.log('Could not fit bounds');
      }
    }
  }, [routes, selectedRouteId, origin, destination]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markerLayersRef.current.forEach((marker) => marker.remove());
    markerLayersRef.current = [];

    // Add origin marker
    if (origin) {
      const marker = L.marker([origin.lat, origin.lng], { icon: originIcon })
        .bindPopup(`📍 <strong>Start</strong><br>${origin.name}`)
        .addTo(mapRef.current);
      markerLayersRef.current.push(marker);
    }

    // Add destination marker
    if (destination) {
      const marker = L.marker([destination.lat, destination.lng], { icon: destIcon })
        .bindPopup(`🎯 <strong>Destination</strong><br>${destination.name}`)
        .addTo(mapRef.current);
      markerLayersRef.current.push(marker);
    }

    // Fit bounds to show all
    if ((origin || destination) && mapRef.current) {
      const bounds = L.latLngBounds([]);
      if (origin) bounds.extend([origin.lat, origin.lng]);
      if (destination) bounds.extend([destination.lat, destination.lng]);
      if (routes.length > 0) {
        routes.forEach((route) => {
          route.coordinates.forEach((coord) => bounds.extend(coord));
        });
      }
      try {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        console.log('Could not fit bounds');
      }
    }
  }, [origin, destination, routes]);

  return (
    <div 
      id="map" 
      className="w-full h-full rounded-none md:rounded-l-xl relative"
    >
      {/* Map container */}
      <style>{`
        #map .leaflet-interactive {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
