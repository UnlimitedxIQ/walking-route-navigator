# Features Documentation

## 1. Location Input 📍

### Geolocation Detection
- **Automatic:** App requests user's current location on load
- **Fallback:** Manual search if geolocation denied
- **Accuracy:** Approximated based on device/browser capability
- **Updates:** Manually refreshable via navigation button

```typescript
// Usage
const fetchCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setOrigin({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        name: await getReverseGeocode(...)
      });
    }
  );
};
```

### Location Search
- **Provider:** OpenStreetMap Nominatim API
- **Features:**
  - Autocomplete with 5 suggestions
  - Debounced input (300ms)
  - Real-time location suggestions
  - Click to select
  - No API key required

### Swap Functionality
- **Button:** Circular button between origin/destination
- **Behavior:** Swaps both location and text
- **Animation:** Bouncy hover effect
- **Color:** Gradient pink to purple

## 2. Route Calculation Engine 🛣️

### Route Types
The app calculates 4 different route options:

#### 1. **Shortest Route** (Pink)
- Minimizes total distance
- Best for: Quick destination, shortest path
- Pros: Least walking distance
- Cons: Might be crowded, less scenic

#### 2. **Fastest Route** (Purple)
- Optimizes for walking speed
- Best for: Time efficiency
- Pros: Fastest arrival
- Cons: More distance than shortest

#### 3. **Safest Route** (Blue)
- Prefers well-lit, populated areas
- Best for: Safety-conscious walkers
- Pros: More populated routes
- Cons: Longer distance/time

#### 4. **Scenic Route** (Green)
- Includes parks and interesting locations
- Best for: Leisurely walks
- Pros: More interesting scenery
- Cons: Longest distance

### Data Provided for Each Route
```typescript
{
  distance: number;        // In meters
  duration: number;        // In seconds
  elevation: number;       // Total gain in meters
  coordinates: LatLng[];   // Path coordinates
  instructions: [];        // Turn-by-turn directions
  color: string;          // Hex color for map
}
```

### Current Implementation
- **Demo Mode:** Generates simulated routes based on distance
- **Realistic Data:** Mock elevation, duration, and instructions
- **Future:** OSRM/Mapbox API integration ready

## 3. Route Display 🗺️

### Interactive Map (Leaflet.js)
- **Base Map:** OpenStreetMap tiles
- **Interaction:** Zoom, pan, click routes
- **Performance:** Canvas rendering for smooth movement
- **Responsive:** Full-width on all devices

### Multiple Routes Visualization
- **Simultaneous Display:** All 4 routes shown at once
- **Color-Coding:** Each route has unique color
- **Selection:** Click route to highlight
- **Opacity:** Unselected routes at 60% opacity

### Markers
- **Origin (A):** Blue circle with "A" label
- **Destination (B):** Pink circle with "B" label
- **Popups:** Click marker to see location name
- **Auto-Zoom:** Map fits all markers + routes

### Route Highlighting
- **Selected Route:**
  - Thicker line (5px vs 3px)
  - Full opacity (100%)
  - Details panel shows
  - Directions visible

## 4. Turn-by-Turn Directions 👣

### Instruction Display
Each direction includes:
- **Text:** "Turn left on Main Street"
- **Distance:** Segment distance (e.g., "245m")
- **Duration:** Estimated time (e.g., "3 min")
- **Direction:** Cardinal direction (N, NE, E, etc.)
- **Emoji:** Visual indicator (⬅️ ➡️ ⬆️ 🔄 🎉)

### Direction Emojis
```
⬆️  North / Straight
↗️  Northeast / Slight Right
➡️  East / Right
↘️  Southeast
⬇️  South
↙️  Southwest / Slight Left
⬅️  West / Left
↖️  Northwest
🔄  U-turn
🎉  Arrived!
```

### Scroll & View
- **Max Height:** 192px with scroll
- **Styling:** Card-based layout
- **Hover:** Light gray background
- **Count:** Shows step number (1, 2, 3...)

### Elevation Profile Chart
- **Visual:** 8-bar elevation visualization
- **Gradient:** Yellow to orange gradient
- **Animation:** Smooth transitions
- **Simulation:** Generated based on route

## 5. Fun & Bubbly Styling 🎨

### Color Palette
```css
Primary Pastels:
- Pink:   #FFB3D9  (Route 1)
- Purple: #D4B3FF  (Route 2)
- Blue:   #B3D9FF  (Route 3 / Primary)
- Cyan:   #B3F0FF  (Accent)
- Green:  #B3FFB3  (Route 4)
- Yellow: #FFFAB3  (Warning/Info)
- Peach:  #FFD9B3  (Secondary)
```

### Design Elements
- **Rounded Corners:** 8px-12px radius
- **Soft Shadows:** 0 4px 12px rgba(0,0,0,0.1)
- **Glass Morphism:** backdrop-blur-md on panels
- **Gradients:** Linear gradients on buttons
- **Spacing:** 8px/16px/24px grid

### Animations
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  Duration: 600ms
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  Duration: 3s
}

@keyframes celebration {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
  Duration: 600ms
}

@keyframes slide {
  0% { transform: translateX(-20px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
  Duration: 300ms
}
```

### Interactive Elements
- **Buttons:** Bounce on hover, scale on click
- **Cards:** Shadow increase on hover
- **Inputs:** Border color change on focus
- **Routes:** Polyline weight changes on select
- **Transitions:** 300ms smooth duration

### Typography
- **Font Family:** System fonts (San Francisco, Segoe, etc.)
- **Headings:** Bold (700-900 weight)
- **Body:** Regular (400 weight)
- **Small:** 12px for labels
- **Large:** 32px for main heading

## 6. User Experience Features 🎯

### Favorites System
- **Storage:** LocalStorage (JSON array)
- **Heart Icon:** Toggle favorite status
- **Persistence:** Survives page reload
- **Visual Indicator:** Filled heart when favorited
- **Count:** Number of favorites shown

**Storage Format:**
```json
[
  {
    "id": "route-shortest",
    "name": "Shortest Route",
    "distance": 2450,
    ...
  }
]
```

### Share Functionality
- **Native Share:** Uses browser share API if available
- **Fallback:** Copy URL to clipboard
- **Generated URL:** Includes route ID and locations
- **Format:**
  ```
  https://yourapp.com?route=shortest&origin=40.7128,-74.006&destination=40.7580,-73.9855
  ```

### Dark/Light Theme
- **Detection:** System preference + manual toggle
- **Storage:** Saved to localStorage
- **Apply:** Toggled on document element
- **Colors:** Adapted for both themes
- **Smooth:** 300ms transition on toggle

**Dark Mode Colors:**
- Background: Gray-800 to Gray-900
- Text: White
- Cards: Gray-700 with opacity
- Borders: Gray-600

### Real-Time Estimates
- **Duration:** Calculated from distance & speed
- **Formula:** distance (m) / (avgSpeed m/s)
- **Average Walking Speed:** 1.4 m/s (~5 km/h)
- **Updated:** When route selection changes

### Mobile Responsive
- **Layout:** Vertical on mobile, horizontal on desktop
- **Breakpoint:** 768px (md in Tailwind)
- **Touch:** 44px+ minimum touch targets
- **Overflow:** Scrollable panels on small screens
- **Map:** Full height below routes on mobile

### Offline Support
- **Caching:** Route data in localStorage
- **Search Cache:** Location results cached
- **Strategy:** Stale-while-revalidate
- **TTL:** Configurable cache duration (1 hour default)

## 7. Technical Features 🔧

### State Management
- **Tool:** Zustand
- **Size:** Lightweight (2KB)
- **Features:** Devtools integration, persistence
- **Store:** `lib/store.ts`

### Performance
- **Code Splitting:** Dynamic imports for map
- **Memoization:** useCallback for functions
- **Debouncing:** 300ms for input searches
- **Caching:** API results cached locally

### Accessibility (WCAG 2.1)
- **Semantic HTML:** Proper heading hierarchy
- **ARIA Labels:** Input fields labeled
- **Keyboard:** Tab navigation support
- **Focus:** Visible focus indicators
- **Color Contrast:** ≥4.5:1 ratio

### API Integration Ready
- **Nominatim:** Location search (implemented)
- **OSRM:** Route calculation (demo mode)
- **Mapbox:** Alternative routing (ready)
- **None Required:** Works offline with demo data

## 8. Advanced Features (Future) 🚀

### Planned Enhancements
- [ ] Offline PWA support
- [ ] Voice-guided navigation
- [ ] Real-time traffic data
- [ ] Weather conditions display
- [ ] Wheelchair/accessibility routes
- [ ] Public transit integration
- [ ] User accounts & syncing
- [ ] Community route ratings
- [ ] Custom waypoints
- [ ] Route editing
- [ ] Elevation filter
- [ ] Difficulty ratings

### Experimental Features
- [ ] AR navigation
- [ ] Photo sharing on routes
- [ ] Social following
- [ ] Route challenges/badges
- [ ] AI suggestions

---

## Quick Reference

| Feature | Status | Notes |
|---------|--------|-------|
| Geolocation | ✅ | Browser API |
| Location Search | ✅ | Nominatim API |
| Route Calculation | ✅ | Demo mode ready for OSRM |
| Interactive Map | ✅ | Leaflet.js |
| Directions | ✅ | Generated with emoji |
| Favorites | ✅ | LocalStorage |
| Sharing | ✅ | Native/clipboard |
| Dark Mode | ✅ | System + manual |
| Mobile Responsive | ✅ | Mobile-first design |
| Offline Support | ⚠️ | Caching only, no PWA yet |
| Voice Navigation | ❌ | Planned |
| Real-time Traffic | ❌ | Planned |
| User Accounts | ❌ | Planned |

## Configuration

See `lib/config.ts` for all configuration options:
- API endpoints
- Map defaults
- Route settings
- UI timing
- Storage keys
- Feature flags

## Performance Metrics

Target metrics:
- **First Paint:** < 1s
- **Largest Contentful Paint:** < 2s
- **Time to Interactive:** < 3s
- **Bundle Size:** < 200KB (gzipped)

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | 12+ | ✅ Full |
| Chrome Mobile | Latest | ✅ Full |

---

For implementation details, see DEVELOPMENT.md.
For setup instructions, see README.md.
