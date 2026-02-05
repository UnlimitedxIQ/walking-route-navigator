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
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const markerLayersRef = useRef<L.Marker[]>([]);
  const darkOverlayRef = useRef<HTMLDivElement | null>(null);
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

  // Apply dark mode filter to map
  useEffect(() => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if (darkMode) {
      // Remove existing overlay if any
      const existingOverlay = mapContainer.querySelector('[data-dark-overlay]');
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // Create dark overlay
      const overlay = document.createElement('div');
      overlay.setAttribute('data-dark-overlay', 'true');
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        pointer-events: none;
        z-index: 400;
        border-radius: inherit;
      `;
      mapContainer.appendChild(overlay);
      darkOverlayRef.current = overlay;
    } else {
      // Remove dark overlay
      const overlay = mapContainer.querySelector('[data-dark-overlay]');
      if (overlay) {
        overlay.remove();
      }
      darkOverlayRef.current = null;
    }
  }, [darkMode]);

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
        #map .leaflet-tile {
          filter: ${darkMode ? 'brightness(0.7)' : 'none'};
        }
      `}</style>
    </div>
  );
}
