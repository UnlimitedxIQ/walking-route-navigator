# Walking Route Navigator - Testing Guide

## Quick Start

### 1. Start the Development Server
```bash
cd /Users/brysonsmith/agent/openclaw-workspace/walking-route-navigator
npm run dev
```
Server runs at: `http://localhost:3000`

### 2. Stop the Server
```bash
npm stop
# or Ctrl+C in terminal
```

---

## Feature Testing Procedures

### Feature 1: Display Walking Paths on Map 🗺️

#### Test 1a: Routes Display with Correct Colors
1. Open the app at `http://localhost:3000`
2. Enter a start location (e.g., "Central Park, NYC")
3. Enter a destination (e.g., "Times Square, NYC")
4. Click "Get Routes" or press Enter
5. **Expected Result**: 
   - Four colored routes appear on the map
   - **Shortest Route**: Pink (#FF6B9D)
   - **Fastest Route**: Purple (#C06BFF)
   - **Safest Route**: Cyan (#6BC9FF)
   - **Scenic Route**: Green (#6BFFA6)

#### Test 1b: Selected Route Appears More Prominent
1. With routes displayed, click on a route in the "Route Options" panel
2. **Expected Result**:
   - Selected route appears with thicker line (5px)
   - Selected route shows at full opacity (100%)
   - Other routes appear thinner (3px) and semi-transparent (60%)
   - Clear visual distinction between selected and unselected

#### Test 1c: Routes Fit in Map View
1. Generate routes between two locations
2. **Expected Result**:
   - Map automatically zooms and pans to show all routes
   - Both start and end locations are visible
   - Routes fill the map view appropriately without being cut off

#### Test 1d: Hover Effects Work
1. Move mouse cursor over a route polyline
2. **Expected Result**:
   - Line weight increases to 6px
   - Opacity increases to 100%
   - Cursor changes to pointer (clickable icon)
3. Move cursor away:
   - **Expected Result**: Line returns to previous state

---

### Feature 2: Click-to-Open in Google Maps 🌍

#### Test 2a: Routes Are Clickable
1. With routes displayed on the map, click on a route polyline
2. **Expected Result**:
   - New browser tab opens automatically
   - Page navigates to Google Maps
   - URL pattern: `https://www.google.com/maps/dir/?api=1&origin=LAT,LNG&destination=LAT,LNG`

#### Test 2b: Google Maps Shows Correct Route
1. Click a route to open Google Maps
2. **Expected Result**:
   - Start location (A marker) matches your input
   - End location (B marker) matches your destination
   - Google Maps displays routing options
   - Distance and duration match app's data (approximately)

#### Test 2c: Multiple Routes Work
1. Click on different route polylines (shortest, fastest, safest, scenic)
2. **Expected Result**:
   - Each click opens Google Maps with correct coordinates
   - Origin and destination are always the same as app
   - Only the coordinates are used (Google Maps shows its own routing)

#### Test 2d: Cursor Feedback
1. Hover mouse over route polylines
2. **Expected Result**:
   - Cursor changes from default arrow to pointer ⬆️→👆
   - Visual feedback indicates route is clickable
   - Routes are obviously interactive

#### Test 2e: Works Without Google Maps Tab Open
1. Click a route multiple times
2. **Expected Result**:
   - Opens new tab each time
   - Each tab shows Google Maps with current coordinates
   - No errors in console

---

### Feature 3: Dark Mode with Night-Themed Tileset 🌙

#### Test 3a: Dark Mode Toggle Works
1. Open the app with light mode active
2. Look at the map - should show bright, colorful OpenStreetMap tiles
3. Click the theme toggle button (sun/moon icon) in the top right
4. **Expected Result**:
   - Entire UI switches to dark colors
   - Map tiles completely switch to CartoDB Dark Matter tileset
   - Map shows professional dark gray/charcoal colors
   - Roads and landmarks appear in light text
   - Transition is smooth and instant

#### Test 3b: Night-Mode Aesthetic is Professional
1. Toggle dark mode on
2. **Expected Result**:
   - Map has true night-mode appearance
   - Dark gray background with light-colored roads
   - Building outlines and landmarks visible
   - No dimming or filter overlay - actual night-themed tiles
   - Much better for dark mode users (less eye strain)

#### Test 3c: Routes Remain Visible in Dark Mode
1. Generate routes in light mode
2. Toggle dark mode on
3. **Expected Result**:
   - Route colors remain vibrant and visible against dark background
   - Excellent contrast between colored routes and dark tiles
   - All four route colors (pink, purple, cyan, green) stand out
   - Routes remain clickable and fully functional

#### Test 3d: Markers Remain Visible in Dark Mode
1. Generate routes with start and destination locations
2. Toggle dark mode on
3. **Expected Result**:
   - Start marker (A) clearly visible against dark map
   - Destination marker (B) clearly visible against dark map
   - Marker colors (blue A, pink B) stand out nicely
   - Popups display correctly with good contrast

#### Test 3e: Light Mode Shows Bright Tiles
1. Toggle dark mode off
2. **Expected Result**:
   - Map instantly switches to bright OpenStreetMap tiles
   - Full color spectrum visible (greens, blues, yellows, etc.)
   - Complete opposite of dark mode appearance
   - Clean, daytime-optimized tileset

#### Test 3f: Dark Mode Setting Persists
1. Toggle dark mode on
2. **First test**: Refresh the page (Cmd+R or F5)
   - **Expected Result**: Dark mode remains active after refresh
   - Map still shows CartoDB Dark Matter tiles
3. **Second test**: Close the browser tab and reopen the app
   - **Expected Result**: Dark mode setting is remembered (saved in localStorage)
   - Map loads with dark tiles immediately

#### Test 3g: Tileset Switches Smoothly
1. Generate routes
2. Rapidly toggle dark mode multiple times
3. **Expected Result**:
   - Tileset switches instantly without errors
   - No lag or visual artifacts
   - Routes remain visible throughout transitions
   - App responds smoothly to theme changes

#### Test 3h: Dark Mode During Route Interaction
1. Generate routes
2. Toggle dark mode
3. Click on a route to open Google Maps
4. **Expected Result**:
   - Google Maps opens in new tab
   - Original app still shows dark CartoDB tiles
   - All features work seamlessly in dark mode
   - No console errors

---

## Integration Testing

### Test A: Complete User Journey (Light Mode)
1. Open app at `http://localhost:3000`
2. Enter start location: "Times Square, New York"
3. Enter destination: "Brooklyn Bridge, New York"
4. Click "Get Routes"
5. View map with 4 colored routes
6. Click on the purple (fastest) route
7. Verify it opens Google Maps in new tab
8. Return to app tab
9. Click on cyan (safest) route
10. Verify it opens different Google Maps route
11. Check all route colors are visible and distinct
12. **Expected Result**: All actions work smoothly

### Test B: Complete User Journey (Dark Mode)
1. Start with app in light mode
2. Toggle dark mode on
3. Enter locations: "Empire State Building" → "Central Park"
4. Generate routes
5. Observe darkened map tiles
6. Click on a route (safest or scenic)
7. Verify Google Maps opens correctly
8. Return to app
9. Verify dark mode is still active
10. Toggle back to light mode
11. Verify map tiles brighten again
12. **Expected Result**: Seamless transitions and interactions

### Test C: Mobile Responsiveness
1. Open dev tools (F12 or Cmd+Option+I)
2. Toggle device toolbar (Cmd+Shift+M)
3. Select iPhone 12 (390x844)
4. Test all features:
   - Routes display and are clickable
   - Dark mode works and affects map
   - Text is readable
   - Buttons are tappable
5. **Expected Result**: All features work on mobile

---

## Console/Error Checking

### Test D: No Console Errors
1. Open browser DevTools (F12)
2. Go to Console tab
3. Generate routes
4. Click on routes
5. Toggle dark mode
6. **Expected Result**:
   - No red error messages
   - No JavaScript exceptions
   - Only info/warning logs (if any)

### Test E: Network Requests
1. Open DevTools → Network tab
2. Generate routes
3. **Expected Result**:
   - Location search API call succeeds
   - Route calculation completes
   - No failed requests

---

## Edge Cases

### Test F: Multiple Route Clicks
1. Generate routes
2. Click the same route 5 times quickly
3. **Expected Result**: Each opens Google Maps without errors

### Test G: Dark Mode Toggle During Animation
1. Generate routes while they're loading/animating
2. Toggle dark mode
3. **Expected Result**: No broken states, smooth transitions

### Test H: Invalid Locations
1. Try entering "xyznonexistentplace123"
2. Try routing to same location twice
3. **Expected Result**: App handles gracefully with error messages

---

## Build Verification

### Test I: Production Build
```bash
# Clean build
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Generating static pages
# No TypeScript errors
```

### Test J: Production Server
```bash
# Start production server
npm start

# Open http://localhost:3000
# Test all features work in production mode
```

---

## Performance Testing

### Test K: Map Performance with Many Routes
- Note: App currently shows 4 routes (hardcoded)
- Routes render and interact smoothly
- No lag when clicking or hovering
- Dark mode toggle is instant

### Test L: Browser Memory
1. Open DevTools → Memory/Performance
2. Generate routes multiple times
3. Toggle dark mode many times
4. **Expected Result**: No memory leaks visible

---

## Checklist for QA

- [ ] Feature 1: Routes display with correct colors
- [ ] Feature 1: Selected route is more prominent
- [ ] Feature 1: Routes fit in map bounds
- [ ] Feature 1: Hover effects work
- [ ] Feature 2: Routes open Google Maps when clicked
- [ ] Feature 2: Google Maps shows correct locations
- [ ] Feature 2: Multiple routes work
- [ ] Feature 2: Cursor feedback visible
- [ ] Feature 3: Dark mode toggle works
- [ ] Feature 3: Map darkens appropriately (30%)
- [ ] Feature 3: Routes visible in dark mode
- [ ] Feature 3: Markers visible in dark mode
- [ ] Feature 3: Dark mode setting persists
- [ ] Feature 3: Light mode restores normal appearance
- [ ] Integration: Complete light mode journey works
- [ ] Integration: Complete dark mode journey works
- [ ] Mobile: Features work on mobile devices
- [ ] Console: No errors in console
- [ ] Build: Production build succeeds
- [ ] Performance: No lags or stutters

---

## Troubleshooting

### Map Not Displaying
- Check if Leaflet is installed: `npm list leaflet`
- Clear browser cache (Cmd+Shift+Delete)
- Check console for errors

### Routes Not Appearing
- Ensure locations are valid
- Check useRouteStore is providing coordinates
- Verify MapContent is rendering

### Dark Mode Not Working
- Check if darkMode prop is passed through component hierarchy
- Verify CSS filter is applied to `.leaflet-tile`
- Check browser supports CSS filters

### Google Maps Not Opening
- Check if pop-up blocker is enabled
- Verify coordinates are valid (should be numbers)
- Check console for JavaScript errors

---

## Notes for Testers

1. **Location Search**: Uses OpenStreetMap Nominatim service
2. **Routes**: Demo routes with realistic coordinates and styling
3. **Dark Mode**: Uses CSS brightness filter for efficiency
4. **Google Maps**: Opens actual Google Maps routing interface
5. **Responsive**: Works on desktop, tablet, and mobile

Enjoy testing! 🚶✨
