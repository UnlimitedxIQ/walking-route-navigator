'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useRouteStore } from '@/lib/store';

// Fix for default marker icons in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iIzY0YzhmZiIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjEyIiBmaWxsPSIjZmZmIi8+PC9zdmc+',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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

export default function MapContent() {
  const mapRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const markerLayersRef = useRef<L.Marker[]>([]);
  const { origin, destination, routes, selectedRouteId } = useRouteStore();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        center: [40.7128, -74.006], // NYC default
        zoom: 13,
        zoomControl: true,
        preferCanvas: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    return () => {
      // Cleanup
    };
  }, []);

  // Update routes on map
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing route layers
    routeLayersRef.current.forEach((layer) => layer.remove());
    routeLayersRef.current = [];

    // Add new routes
    routes.forEach((route) => {
      const isSelected = route.id === selectedRouteId;
      const polyline = L.polyline(route.coordinates, {
        color: route.color,
        weight: isSelected ? 5 : 3,
        opacity: isSelected ? 1 : 0.6,
        smoothFactor: 1.0,
        dashArray: undefined,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(mapRef.current!);

      // Add hover effect
      polyline.on('click', () => {
        // Trigger route selection in store
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
  }, [routes, selectedRouteId]);

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
    <div id="map" className="w-full h-full rounded-none md:rounded-l-xl">
      {/* Map container */}
    </div>
  );
}
