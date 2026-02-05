'use client';

import { Route } from '@/lib/store';
import { useRouteStore } from '@/lib/store';
import { Heart } from 'lucide-react';

interface RouteCardProps {
  route: Route;
  isSelected: boolean;
  onSelect: () => void;
}

export function RouteCard({ route, isSelected, onSelect }: RouteCardProps) {
  const { selectRoute, toggleFavorite } = useRouteStore();

  const handleSelect = () => {
    selectRoute(route.id);
    onSelect();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(route.id);
  };

  return (
    <button
      onClick={handleSelect}
      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
        isSelected
          ? 'border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700 shadow-lg scale-105'
          : 'border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
      style={{
        backgroundImage: isSelected
          ? `linear-gradient(135deg, ${route.color}20 0%, transparent 100%)`
          : undefined,
      }}
    >
      <div className="space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: route.color }}
              />
              <h3 className="font-bold text-gray-900 dark:text-white">{route.name}</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {route.instructions.length} turns
            </p>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-lg transition-all duration-300 ${
              route.isFavorite
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Heart
              size={18}
              className={route.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Distance</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {(route.distance / 1000).toFixed(1)} km
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Duration</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {Math.round(route.duration / 60)} min
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Elevation</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {route.elevation} m
            </p>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="flex items-center justify-center gap-1 pt-2 text-sm font-semibold text-green-600 dark:text-green-400">
            <span>✓</span>
            <span>Selected Route</span>
          </div>
        )}
      </div>
    </button>
  );
}
