'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouteStore } from '@/lib/store';

// Dynamic import for Leaflet to avoid SSR issues
const MapContent = dynamic(() => import('./MapContent'), { ssr: false });

interface RouteMapProps {
  darkMode?: boolean;
}

export function RouteMap({ darkMode = false }: RouteMapProps) {
  const { loadFavorites } = useRouteStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-800 dark:to-gray-900">
      <MapContent darkMode={darkMode} />
    </div>
  );
}
