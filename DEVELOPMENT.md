# Development Guide

## Architecture Overview

### State Management (Zustand)
The app uses Zustand for lightweight state management:

```typescript
// lib/store.ts
- origin: Starting location
- destination: Destination location
- routes: Array of calculated routes
- selectedRouteId: Currently selected route
- favorites: Saved favorite routes
- loading/error: UI state
```

### Component Hierarchy
```
page.tsx (Main App)
├── LocationInput
│   ├── Origin search input
│   ├── Destination search input
│   └── Swap button
├── RoutePanel
│   ├── RouteCard (multiple)
│   ├── RouteDetails
│   │   └── Turn-by-turn instructions
│   └── Share button
├── RouteMap
│   └── MapContent (Leaflet)
└── ThemeToggle
```

## Key Workflows

### 1. Location Search
```typescript
1. User types in LocationInput
2. debounce(handleLocationInput, 300ms)
3. searchLocation(query) → Nominatim API
4. Display suggestions dropdown
5. User selects location
6. setOrigin/setDestination() in store
7. calculateRoutes() triggered
```

### 2. Route Calculation
```typescript
1. User has both origin & destination
2. calculateRoutes(origin, destination)
3. Calls OSRM API (or demo generator)
4. Returns array of Route objects
5. setRoutes() updates store
6. RoutePanel displays options
7. Select first route by default
```

### 3. Route Selection
```typescript
1. User clicks RouteCard
2. selectRoute(routeId) → store
3. Update selected: true
4. MapContent re-renders polyline
5. Show route details panel
```

### 4. Favorite Management
```typescript
1. User clicks heart icon
2. toggleFavorite(routeId)
3. Add/remove from favorites array
4. saveFavorites() → localStorage
5. Update isFavorite flag on route
```

## API Integration

### Current Implementation (Demo)
- `calculateRoutes()` generates demo data
- Uses mock distance/duration values
- Generates random coordinates and instructions

### OSRM Integration (Real)
```typescript
// To enable real OSRM routing, update lib/routing.ts:

async function calculateRoutes(origin, destination) {
  const response = await axios.get(
    `https://router.project-osrm.org/route/v1/foot/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
    {
      params: {
        steps: true,
        geometries: 'geojson',
        overview: 'full',
        alternatives: true
      }
    }
  );
  
  // Parse response and convert to Route objects
}
```

### Mapbox Integration
```typescript
// Alternative to OSRM using Mapbox Directions API

async function calculateRoutes(origin, destination) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const response = await axios.get(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
    {
      params: {
        access_token: token,
        steps: true,
        geometries: 'geojson',
        overview: 'full',
        alternatives: true
      }
    }
  );
}
```

## Styling System

### Color Palette
```css
Pastel Colors:
- Pink: #FFB3D9
- Purple: #D4B3FF
- Blue: #B3D9FF
- Cyan: #B3F0FF
- Green: #B3FFB3
- Yellow: #FFFAB3
- Peach: #FFD9B3
```

### Custom Animations
```css
@keyframes celebration {
  0%: scale(0.5), opacity(0)
  50%: scale(1.1)
  100%: scale(1), opacity(1)
}

@keyframes float {
  0%, 100%: translateY(0)
  50%: translateY(-20px)
}

@keyframes slide {
  0%: translateX(-20px), opacity(0)
  100%: translateX(0), opacity(1)
}
```

## Data Models

### Route Object
```typescript
interface Route {
  id: string;              // Unique identifier
  name: string;            // "Shortest Route", "Fastest Route", etc.
  distance: number;        // Meters
  duration: number;        // Seconds
  elevation: number;       // Meters gained
  coordinates: [number, number][]; // LatLng array
  instructions: Instruction[]; // Turn-by-turn
  color: string;           // Hex color for map display
  selected: boolean;       // Is currently selected
  isFavorite: boolean;     // Is in favorites
}
```

### Location Object
```typescript
interface Location {
  lat: number;             // Latitude
  lng: number;             // Longitude
  name: string;            // Display name
}
```

### Instruction Object
```typescript
interface Instruction {
  text: string;            // "Turn left on Main St"
  distance: number;        // Meters
  duration: number;        // Seconds
  direction: string;       // "north", "southwest", etc.
  emoji: string;           // "⬅️", "➡️", etc.
}
```

## Performance Optimization

### Code Splitting
```typescript
// Dynamic imports for heavy components
const MapContent = dynamic(() => import('./MapContent'), { ssr: false });
```

### Memoization
```typescript
// useCallback for stable function references
const calculateAndShowRoutes = useCallback(async () => {
  // Heavy computation
}, [origin, destination]);
```

### Debouncing
```typescript
// Prevent excessive API calls during typing
const handleInput = debounce(async (value) => {
  const results = await searchLocation(value);
}, 300);
```

### Caching
```typescript
// Cache location search results
cache.set('location:NYC', results, 86400000); // 24 hours
const cached = cache.get('location:NYC');
```

## Mobile Optimization

### Responsive Breakpoints
```css
Mobile (< 768px):
- Vertical layout
- Full-width inputs
- Stacked route cards

Desktop (≥ 768px):
- Horizontal layout
- Side panel + map
- 3-column stats
```

### Touch Interactions
```typescript
// Larger touch targets
- Buttons: min-height 44px
- Inputs: min-height 40px
- Draggable route reordering
```

## Testing

### Manual Testing Checklist
- [ ] Location search (type, select, current location)
- [ ] Route calculation (verify multiple routes shown)
- [ ] Route selection (click card, see details)
- [ ] Favorites (heart icon, localStorage persistence)
- [ ] Share (URL generation, clipboard)
- [ ] Dark mode (toggle, localStorage)
- [ ] Mobile layout (responsive, touch)
- [ ] Map interaction (zoom, pan, click)
- [ ] Error states (invalid location, API failure)
- [ ] Geolocation prompt (permission, fallback)

### Unit Testing (Recommended Setup)
```typescript
// Add to package.json
"devDependencies": {
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "vitest": "^0.34.0"
}
```

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile: iOS 12+, Android 8+

## Accessibility

### WCAG 2.1 Level A Compliance
- Semantic HTML
- ARIA labels on inputs
- Keyboard navigation support
- Color contrast ratios ≥ 4.5:1
- Focus indicators

### Improvement Ideas
```typescript
// Add aria-labels
<input aria-label="Starting location" />

// Add semantic buttons
<button type="button">...</button>

// Skip navigation link
<a href="#main-content" className="sr-only">
  Skip to main content
</a>
```

## Debugging

### Console Logging
```typescript
// Enable debug logs
localStorage.setItem('debug', 'true');

// In code:
if (localStorage.getItem('debug')) {
  console.log('Route:', route);
}
```

### React DevTools
```
1. Install React DevTools browser extension
2. Open DevTools → Components
3. Inspect component tree
4. View Zustand store state
```

### Network Requests
```
DevTools → Network
Filter by XHR/Fetch
Monitor API calls to:
- nominatim.openstreetmap.org
- router.project-osrm.org
- api.mapbox.com
```

## Deployment Checklist

- [ ] Remove console.log statements
- [ ] Verify environment variables
- [ ] Test on mobile devices
- [ ] Check accessibility
- [ ] Optimize images
- [ ] Enable compression
- [ ] Set up monitoring
- [ ] Configure CORS if needed
- [ ] Test offline functionality
- [ ] Verify analytics tracking

## Common Issues & Solutions

### Issue: Map not displaying
**Solution:**
1. Check if Leaflet CSS is loaded
2. Verify map div has height: 100%
3. Clear browser cache
4. Check browser console for errors

### Issue: Geolocation permission denied
**Solution:**
1. Check browser settings
2. Ensure HTTPS (required for geolocation)
3. Ask permission again with user action
4. Provide fallback to manual search

### Issue: Routes not calculating
**Solution:**
1. Verify both locations are set
2. Check API rate limits
3. Verify coordinates are valid
4. Check network tab for errors

### Issue: Performance lag with many routes
**Solution:**
1. Limit to 4 route options
2. Use Canvas rendering (Leaflet option)
3. Simplify polyline geometry
4. Debounce map interactions

## Future Enhancements

### Short-term
- [ ] Offline route caching
- [ ] Voice navigation
- [ ] More routing algorithms
- [ ] Route difficulty ratings

### Medium-term
- [ ] User authentication
- [ ] Social sharing
- [ ] Route history
- [ ] Custom markers

### Long-term
- [ ] Community routes
- [ ] Machine learning suggestions
- [ ] Real-time traffic
- [ ] Mobile app (React Native)

---

For more information, see README.md and the inline code comments.
