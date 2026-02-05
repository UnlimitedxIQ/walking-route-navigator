'use client';

import { useState } from 'react';
import { useRouteStore } from '@/lib/store';
import { shareRoute } from '@/lib/routing';
import { RouteCard } from './RouteCard';
import { RouteDetails } from './RouteDetails';
import { Heart, Share2, Zap } from 'lucide-react';

export function RoutePanel() {
  const { routes, selectedRouteId, origin, destination, loading, error } = useRouteStore();
  const [showDetails, setShowDetails] = useState(false);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId);

  const handleShare = () => {
    if (selectedRoute && origin && destination) {
      const url = shareRoute(selectedRoute, origin, destination);
      if (navigator.share) {
        navigator.share({
          title: 'Check out this walking route!',
          text: `${selectedRoute.name}: ${(selectedRoute.distance / 1000).toFixed(1)}km`,
          url,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url);
        alert('Route link copied to clipboard!');
      }
    }
  };

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
          <p className="text-red-800 dark:text-red-200 text-sm font-medium">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-200 dark:bg-gray-700 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="p-4 md:p-6 flex flex-col items-center justify-center h-96 text-center">
        <div className="text-6xl mb-4 animate-float">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Ready to explore?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your starting point and destination to see route options
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Routes List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Zap size={20} className="text-yellow-500" />
          Route Options
        </h3>

        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            isSelected={selectedRoute?.id === route.id}
            onSelect={() => setShowDetails(true)}
          />
        ))}
      </div>

      {/* Selected Route Details */}
      {selectedRoute && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            🗺️ {selectedRoute.name}
          </h4>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="p-2 rounded-lg bg-pastel-blue/30 dark:bg-blue-900/30 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Distance</p>
              <p className="font-bold text-sm text-blue-600 dark:text-blue-300">
                {(selectedRoute.distance / 1000).toFixed(1)} km
              </p>
            </div>
            <div className="p-2 rounded-lg bg-pastel-purple/30 dark:bg-purple-900/30 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
              <p className="font-bold text-sm text-purple-600 dark:text-purple-300">
                {Math.round(selectedRoute.duration / 60)} min
              </p>
            </div>
            <div className="p-2 rounded-lg bg-pastel-green/30 dark:bg-green-900/30 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Elevation</p>
              <p className="font-bold text-sm text-green-600 dark:text-green-300">
                {selectedRoute.elevation} m
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 rounded-lg bg-gradient-to-r from-pastel-blue to-pastel-cyan hover:shadow-md transition-all duration-300 text-white font-semibold text-sm active:scale-95"
            >
              {showDetails ? '📍 Hide' : '👣 Directions'}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gradient-to-r from-pastel-pink to-pastel-purple hover:shadow-md transition-all duration-300 text-white font-semibold text-sm flex items-center justify-center gap-1 active:scale-95"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          {/* Directions */}
          {showDetails && (
            <RouteDetails route={selectedRoute} />
          )}
        </div>
      )}
    </div>
  );
}
