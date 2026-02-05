# Route Display Bug - Debug Summary

## Issue Identified
Routes were not displaying on the map when users entered start/destination locations.

## Root Cause
**State Timing Issue in LocationInput Component**

The original code had a timing problem:
1. User selects origin location → `setOrigin(location)` is called
2. `calculateAndShowRoutes()` is called immediately after
3. BUT: React's setState is asynchronous and batched
4. The `calculateAndShowRoutes()` closure still references the OLD origin/destination values
5. So routes were either calculated with stale data or not calculated at all

### Original Flow (Broken)
```
handleSelectOrigin()
  └─ setOrigin(newLocation)  // Async state update
  └─ calculateAndShowRoutes()  // Called IMMEDIATELY with OLD values from closure
```

### Fixed Flow
```
handleSelectOrigin()
  └─ setOrigin(newLocation)  // Async state update

[Separately]
useEffect watches origin?.lat, origin?.lng, destination?.lat, destination?.lng
  └─ When BOTH are set, calls calculateRoutes() with UPDATED values
  └─ Routes are correctly calculated and passed to setRoutes()
  
[Separately]  
MapContent watches routes array
  └─ When routes change, renders polylines on the map
```

## Changes Made

### 1. LocationInput.tsx
- Removed immediate `calculateAndShowRoutes()` calls from `handleSelectOrigin()` and `handleSelectDestination()`
- Added `useEffect` that watches `origin?.lat, origin?.lng, destination?.lat, destination?.lng`
- When both origin and destination are set, the useEffect calculates routes
- This ensures routes are calculated AFTER state has been updated

### 2. routing.ts
- Added debug console.log statements to track route calculation
- Added logging of generated coordinates

### 3. store.ts
- Added debug console.log statements in `setRoutes()`

### 4. MapContent.tsx
- Added debug console.log statements to track polyline rendering
- Added logging of coordinate information

## Expected Behavior After Fix
1. User selects origin location → state updates
2. User selects destination location → state updates
3. useEffect detects both are set → calls calculateRoutes()
4. Routes are generated and stored
5. MapContent sees routes array update → renders polylines on map
6. User sees colored route lines on the map

## Testing
- Test with hardcoded locations (Times Square button added)
- Check browser console for debug logs
- Verify polylines appear on the map
- Test swap functionality (should trigger recalculation)

## Files Modified
- `/components/LocationInput.tsx` - Main fix
- `/components/MapContent.tsx` - Debug logging
- `/lib/routing.ts` - Debug logging
- `/lib/store.ts` - Debug logging
