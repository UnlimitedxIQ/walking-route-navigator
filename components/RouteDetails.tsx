'use client';

import { Route } from '@/lib/store';

interface RouteDetailsProps {
  route: Route;
}

export function RouteDetails({ route }: RouteDetailsProps) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide">
      <h5 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
        👣 Turn-by-turn directions
      </h5>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {route.instructions.map((instruction, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Direction Icon */}
              <div className="text-2xl flex-shrink-0 pt-1">
                {instruction.emoji}
              </div>

              {/* Instruction Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                  {instruction.text}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>📏 {instruction.distance}m</span>
                  <span>•</span>
                  <span>⏱️ {Math.round(instruction.duration / 60)}m</span>
                </div>
              </div>

              {/* Step Number */}
              <div className="text-xs font-bold text-gray-400 dark:text-gray-500 flex-shrink-0 pt-1">
                {idx + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Elevation Chart Placeholder */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">📊 Elevation Profile</p>
        <div className="h-16 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-end justify-around p-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: `${30 + Math.sin(i * 0.8) * 30}%`,
                backgroundColor: `hsl(${40 + i * 8}, 80%, 50%)`,
              }}
              className="w-2 rounded-t-md transition-all"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
