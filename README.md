# 🚶 Walking Route Navigator

A fun, bubbly web app for calculating the shortest walking routes using sidewalks. Find the most pleasant pedestrian-friendly paths with beautiful visualization and turn-by-turn directions.

## ✨ Features

### 🎯 Core Features
- **Smart Location Input**
  - Use current geolocation or search for any location
  - Autocomplete with OpenStreetMap Nominatim
  - One-click swap between origin and destination
  - Real-time suggestions

- **Route Calculation Engine**
  - Multiple route options (Shortest, Fastest, Safest, Scenic)
  - Distance, duration, and elevation data
  - Sidewalk-navigable streets filtering
  - Demo routes with simulated data (ready for OSRM integration)

- **Interactive Map Display**
  - Real-time Leaflet.js map
  - Multiple routes shown simultaneously with color-coding
  - Origin (A) and Destination (B) markers
  - Route highlighting and selection
  - Zoom to fit functionality

- **Turn-by-Turn Directions**
  - Step-by-step navigation instructions
  - Emoji directional indicators (⬅️ ➡️ ⬆️ 🔄)
  - Distance and duration for each segment
  - Elevation profile chart

- **User Experience**
  - Save favorite routes (LocalStorage)
  - Share routes via URL or native share
  - Dark/Light theme toggle
  - Fully mobile responsive
  - Smooth animations and transitions
  - Loading states and error handling

### 🎨 Fun & Bubbly UI
- Pastel color palette (Pink, Purple, Blue, Cyan, Green, Yellow, Peach)
- Rounded corners and soft shadows
- Glass-morphism cards with backdrop blur
- Bouncy buttons and smooth interactions
- Gradient backgrounds
- Celebratory animations
- Emoji icons throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with geolocation support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd walking-route-navigator

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
walking-route-navigator/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── LocationInput.tsx   # Location search & input
│   ├── RoutePanel.tsx      # Route list and selection
│   ├── RouteCard.tsx       # Individual route card
│   ├── RouteDetails.tsx    # Directions & elevation
│   ├── RouteMap.tsx        # Map container
│   ├── MapContent.tsx      # Leaflet map implementation
│   └── ThemeToggle.tsx     # Dark/light theme toggle
├── lib/
│   ├── store.ts            # Zustand state management
│   └── routing.ts          # Routing APIs & utilities
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json             # Vercel deployment config
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for API keys (optional for demo):

```env
# OSRM API (Open Route Service) - optional
NEXT_PUBLIC_OSRM_API=https://router.project-osrm.org

# Mapbox (alternative routing) - optional
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### Customization

**Theme Colors:**
Edit `tailwind.config.js` to customize the pastel color palette:
```js
colors: {
  pastel: {
    pink: '#FFB3D9',
    purple: '#D4B3FF',
    blue: '#B3D9FF',
    cyan: '#B3F0FF',
    green: '#B3FFB3',
    yellow: '#FFFAB3',
    peach: '#FFD9B3',
  },
}
```

**Default Map Center:**
Edit `components/MapContent.tsx` to set your preferred default location:
```ts
center: [40.7128, -74.006], // [latitude, longitude]
```

## 🔌 API Integration

### Nominatim (OpenStreetMap)
Currently integrated for location search. No API key required.

### OSRM (Open Route Service)
The app includes demo route generation. To use real OSRM routes, update `lib/routing.ts`:

```ts
// Example OSRM API call
const response = await axios.get(
  `${OSRM_BASE_URL}/route/v1/foot/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
  { params: { steps: true, geometries: 'geojson' } }
);
```

### Mapbox Directions (Alternative)
The setup supports Mapbox API. Add your token to `.env.local` and update routing logic.

## 📱 Mobile Responsive

The app is mobile-first with:
- Vertical layout on mobile (map below routes)
- Horizontal layout on desktop (routes left, map right)
- Touch-friendly buttons and inputs
- Optimized viewport settings
- Meta tags for mobile web app mode

## 🌙 Dark Mode

Dark mode is automatically detected from system preferences and can be toggled via the theme button. Preferences are saved to LocalStorage.

## ⭐ Favorite Routes

Routes are saved to LocalStorage as JSON. Access saved routes:
```js
const favorites = JSON.parse(localStorage.getItem('routeFavorites') || '[]');
```

## 🔗 URL Sharing

Routes can be shared via generated URLs:
```
https://yourapp.com?route=shortest&origin=40.7128,-74.006&destination=40.7580,-73.9855
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Using Vercel CLI
npm i -g vercel
vercel

# Or connect your Git repository via Vercel dashboard
```

### Environment Variables on Vercel
1. Go to Project Settings → Environment Variables
2. Add any required API keys (MAPBOX_TOKEN, etc.)
3. Redeploy

### Other Platforms

**Netlify:**
```bash
npm run build
# Deploy 'out' or '.next' directory
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Development

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Tech Stack
- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** TailwindCSS, CSS animations
- **Maps:** Leaflet.js, OpenStreetMap
- **State:** Zustand
- **HTTP:** Axios
- **Icons:** Lucide React

## 🗺️ Routing Algorithms

The app supports multiple route calculation strategies:

1. **Shortest:** Minimizes total distance
2. **Fastest:** Optimizes for walking speed
3. **Safest:** Prefers well-lit, populated areas
4. **Scenic:** Includes parks and interesting points

Each route includes:
- Total distance (meters)
- Estimated duration (seconds)
- Elevation gain (meters)
- Step-by-step directions
- Visual polyline on map

## 🐛 Troubleshooting

**Geolocation not working?**
- Check browser permissions
- Ensure HTTPS (required for geolocation)
- Some browsers need user interaction first

**Map not displaying?**
- Clear browser cache
- Check console for Leaflet errors
- Ensure Leaflet CSS is loaded

**Routes not calculating?**
- Verify location coordinates are valid
- Check OSRM API availability
- Review console for error messages

## 📝 License

MIT License - Feel free to use and modify for your projects!

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 🎉 Future Enhancements

- [ ] Real OSRM/Mapbox API integration
- [ ] Offline support with service workers
- [ ] Traffic/congestion data
- [ ] Weather conditions
- [ ] Accessibility features (wheelchair routes)
- [ ] Public transit integration
- [ ] User accounts and sync
- [ ] Community route ratings
- [ ] Custom route editing
- [ ] Voice directions

## 💬 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

Made with ❤️ and ☕ for pedestrians everywhere! 🚶‍♀️🚶
