/**
 * App Configuration
 * Centralized configuration for the Walking Route Navigator app
 */

export const CONFIG = {
  // App Info
  APP_NAME: 'Walking Route Navigator',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Find the most pleasant walking routes with sidewalks',

  // API Endpoints
  APIS: {
    NOMINATIM: 'https://nominatim.openstreetmap.org',
    OSRM: process.env.NEXT_PUBLIC_OSRM_API || 'https://router.project-osrm.org',
    MAPBOX: 'https://api.mapbox.com',
    MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
  },

  // Map Configuration
  MAP: {
    DEFAULT_CENTER: [
      parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '40.7128'),
      parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '-74.006'),
    ] as [number, number],
    DEFAULT_ZOOM: 13,
    MIN_ZOOM: 10,
    MAX_ZOOM: 19,
    TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },

  // Route Configuration
  ROUTES: {
    MAX_ALTERNATIVES: 4,
    COLORS: ['#FF6B9D', '#C06BFF', '#6BC9FF', '#6BFFA6'],
    TYPES: ['shortest', 'fastest', 'safest', 'scenic'],
  },

  // Geolocation Configuration
  GEOLOCATION: {
    TIMEOUT: 10000,
    ENABLE_HIGH_ACCURACY: false,
    MAXIMUM_AGE: 300000, // 5 minutes
  },

  // Search Configuration
  SEARCH: {
    MIN_CHARS: 2,
    DEBOUNCE_MS: 300,
    MAX_RESULTS: 5,
    CACHE_TTL: 3600000, // 1 hour
  },

  // UI Configuration
  UI: {
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000,
    MODAL_ANIMATION_DURATION: 200,
  },

  // Storage Configuration
  STORAGE: {
    FAVORITES_KEY: 'routeFavorites',
    THEME_KEY: 'darkMode',
    RECENT_SEARCHES_KEY: 'recentSearches',
    CACHE_PREFIX: 'cache:',
  },

  // Accessibility
  A11Y: {
    FOCUS_VISIBLE_OUTLINE: '2px solid #64C8FF',
    REDUCED_MOTION: '@media (prefers-reduced-motion: reduce)',
  },

  // Feature Flags
  FEATURES: {
    ENABLE_OFFLINE: true,
    ENABLE_VOICE_NAVIGATION: false,
    ENABLE_REAL_TIME_UPDATES: false,
    ENABLE_USER_ACCOUNTS: false,
  },

  // Limits & Constraints
  LIMITS: {
    MAX_SEARCH_RADIUS_KM: 100,
    MAX_ROUTE_DISTANCE_KM: 50,
    MIN_WALKING_SPEED: 1.0, // km/h
    MAX_WALKING_SPEED: 5.0, // km/h
    AVERAGE_WALKING_SPEED: 1.4, // m/s = ~5 km/h
  },

  // Strings & Labels
  LABELS: {
    STARTING_POINT: '📍 Starting Point',
    DESTINATION: '🎯 Destination',
    ROUTES: '🗺️ Route Options',
    DIRECTIONS: '👣 Turn-by-turn directions',
    SHARE: 'Share Route',
    FAVORITES: '❤️ Favorites',
  },

  // Emoji Icons
  EMOJI: {
    START: '📍',
    END: '🎯',
    LEFT: '⬅️',
    RIGHT: '➡️',
    STRAIGHT: '⬆️',
    UTURN: '🔄',
    UP: '⬆️',
    DOWN: '⬇️',
    ARRIVE: '🎉',
    FAVORITE: '❤️',
    EMPTY_FAVORITE: '🤍',
  },
};

/**
 * Get route color by index
 */
export function getRouteColor(index: number): string {
  return CONFIG.ROUTES.COLORS[index % CONFIG.ROUTES.COLORS.length];
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof CONFIG.FEATURES): boolean {
  return CONFIG.FEATURES[feature];
}

/**
 * Validate coordinates
 */
export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
