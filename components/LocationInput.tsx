'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouteStore } from '@/lib/store';
import { searchLocation, getReverseGeocode, calculateRoutes } from '@/lib/routing';
import { MapPin, Navigation2, Repeat2, Search } from 'lucide-react';

export function LocationInput() {
  const { origin, destination, setOrigin, setDestination, setRoutes, swapOriginDestination, setLoading, setError } =
    useRouteStore();

  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  // Fetch current location
  const fetchCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const name = await getReverseGeocode(latitude, longitude);
          setOrigin({ lat: latitude, lng: longitude, name });
          setOriginInput(name);
          setShowOriginSuggestions(false);
          setLoading(false);
        },
        (err) => {
          setError('Unable to get your location');
          setLoading(false);
        }
      );
    }
  }, [setOrigin, setLoading, setError]);

  // Auto-fetch location on mount
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  // Handle origin input
  const handleOriginInput = async (value: string) => {
    setOriginInput(value);
    if (value.length > 2) {
      const results = await searchLocation(value);
      setOriginSuggestions(results);
      setShowOriginSuggestions(true);
    } else {
      setShowOriginSuggestions(false);
    }
  };

  // Handle destination input
  const handleDestinationInput = async (value: string) => {
    setDestinationInput(value);
    if (value.length > 2) {
      const results = await searchLocation(value);
      setDestinationSuggestions(results);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  // Handle location selection
  const handleSelectOrigin = (location: any) => {
    setOrigin(location);
    setOriginInput(location.name);
    setShowOriginSuggestions(false);
    calculateAndShowRoutes();
  };

  const handleSelectDestination = (location: any) => {
    setDestination(location);
    setDestinationInput(location.name);
    setShowDestinationSuggestions(false);
    calculateAndShowRoutes();
  };

  // Calculate routes when both locations are set
  const calculateAndShowRoutes = useCallback(async () => {
    if (origin && destination) {
      setLoading(true);
      setError(null);
      try {
        const routes = await calculateRoutes(origin, destination);
        setRoutes(routes);
      } catch (err) {
        setError('Failed to calculate routes');
      } finally {
        setLoading(false);
      }
    }
  }, [origin, destination, setRoutes, setLoading, setError]);

  const handleSwap = () => {
    swapOriginDestination();
    [originInput, destinationInput] = [destinationInput, originInput];
    setOriginInput(destination?.name || '');
    setDestinationInput(origin?.name || '');
  };

  return (
    <div className="space-y-4">
      {/* Origin Input */}
      <div className="relative">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
          📍 Starting Point
        </label>
        <div className="relative">
          <input
            type="text"
            value={originInput}
            onChange={(e) => handleOriginInput(e.target.value)}
            onFocus={() => setShowOriginSuggestions(true)}
            placeholder="Enter starting location"
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-pastel-blue dark:focus:border-blue-400 transition-colors"
          />
          <button
            onClick={fetchCurrentLocation}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-600 transition-colors"
            title="Use current location"
          >
            <Navigation2 size={20} />
          </button>

          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
              {originSuggestions.map((location, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOrigin(location)}
                  className="w-full text-left px-4 py-2 hover:bg-pastel-blue/50 dark:hover:bg-gray-600 transition-colors border-b border-gray-200 dark:border-gray-600 last:border-b-0 flex items-center gap-2"
                >
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-sm truncate">{location.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSwap}
          className="p-3 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-purple hover:shadow-lg transition-all duration-300 text-white hover:scale-110 active:scale-95"
          title="Swap origin and destination"
        >
          <Repeat2 size={20} />
        </button>
      </div>

      {/* Destination Input */}
      <div className="relative">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
          🎯 Destination
        </label>
        <div className="relative">
          <input
            type="text"
            value={destinationInput}
            onChange={(e) => handleDestinationInput(e.target.value)}
            onFocus={() => setShowDestinationSuggestions(true)}
            placeholder="Where are you going?"
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-pastel-blue dark:focus:border-blue-400 transition-colors"
          />
          <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />

          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
              {destinationSuggestions.map((location, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectDestination(location)}
                  className="w-full text-left px-4 py-2 hover:bg-pastel-blue/50 dark:hover:bg-gray-600 transition-colors border-b border-gray-200 dark:border-gray-600 last:border-b-0 flex items-center gap-2"
                >
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-sm truncate">{location.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Info */}
      {origin && destination && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-pastel-blue/30 to-pastel-cyan/30 dark:from-blue-900/30 dark:to-cyan-900/30 border border-pastel-blue/50 dark:border-blue-600/50">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            ✨ {origin.name.split(',')[0]} → {destination.name.split(',')[0]}
          </p>
        </div>
      )}
    </div>
  );
}
