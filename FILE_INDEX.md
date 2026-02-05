# 📑 File Index

Complete guide to every file in the Walking Route Navigator project.

## 📚 Documentation Files

### 🎯 Start Here
- **[QUICKSTART.md](./QUICKSTART.md)** - Get running in 5 minutes
- **[README.md](./README.md)** - Complete documentation & setup guide
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Project architecture overview

### 📖 Reference
- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Architecture & development guide
- **[FILE_INDEX.md](./FILE_INDEX.md)** - This file

### ⚙️ Configuration Examples
- **[.env.example](./.env.example)** - Environment variables template
- **[.env.local.example](./.env.local.example)** - Local env example
- **[.gitignore](./.gitignore)** - Git ignore rules

## 🚀 Application Files

### Frontend App
```
app/
├── layout.tsx          # Root layout, metadata, imports
├── page.tsx            # Main app page with layout
└── globals.css         # Global styles, animations, Leaflet fixes
```

**Key Components:**
- `layout.tsx` - Handles theme persistence, metadata setup
- `page.tsx` - Main layout (sidebar + map on desktop, stacked on mobile)
- `globals.css` - TailwindCSS imports, custom animations, scrollbar styling

### React Components
```
components/
├── LocationInput.tsx   # Location search & input (geolocation + autocomplete)
├── RoutePanel.tsx      # Route list & selection interface
├── RouteCard.tsx       # Individual route display card
├── RouteDetails.tsx    # Turn-by-turn directions panel
├── RouteMap.tsx        # Map container (dynamic import)
├── MapContent.tsx      # Leaflet map implementation
└── ThemeToggle.tsx     # Dark/light theme toggle button
```

**Component Responsibilities:**
- `LocationInput` - Handles user location input, autocomplete, geolocation
- `RoutePanel` - Displays list of routes, shows selected route details
- `RouteCard` - Individual route card with stats and favorite button
- `RouteDetails` - Step-by-step directions and elevation chart
- `RouteMap` - Map container with dynamic loading
- `MapContent` - Leaflet map rendering and interaction
- `ThemeToggle` - Simple theme toggle button

### Core Logic
```
lib/
├── store.ts           # Zustand state management (15+ actions)
├── routing.ts         # Routing & location APIs (Nominatim, OSRM-ready)
├── config.ts          # Centralized configuration
├── utils.ts           # Utility functions (format, calculate, cache)
└── types.ts           # TypeScript type definitions
```

**Module Details:**
- `store.ts` - Full app state, persistent favorites, error handling
- `routing.ts` - Location search, reverse geocoding, route calculation
- `config.ts` - API endpoints, map defaults, UI timing, feature flags
- `utils.ts` - Distance/duration formatting, caching, bearing calculations
- `types.ts` - Route, Location, Instruction, API response types

## ⚙️ Configuration Files

### Build & Framework
- **[package.json](./package.json)** - Dependencies (Next.js, React, Leaflet, etc.)
- **[next.config.js](./next.config.js)** - Next.js configuration
- **[tsconfig.json](./tsconfig.json)** - TypeScript configuration
- **[vercel.json](./vercel.json)** - Vercel deployment configuration

### Styling
- **[tailwind.config.js](./tailwind.config.js)** - TailwindCSS config (colors, animations)
- **[postcss.config.js](./postcss.config.js)** - PostCSS configuration

## 📊 Project Statistics

### Code Files
```
Components:         7 TSX files
Utilities:         5 TS files  
Configuration:     4 JS/JSON files
Styles:            2 CSS files
Layouts:           1 TSX file
────────────────────────────
Total:            19 code files
Lines of Code:    ~3,500
```

### Documentation
```
README.md           ~300 lines
DEVELOPMENT.md      ~350 lines
FEATURES.md         ~350 lines
PROJECT_OVERVIEW.md ~400 lines
QUICKSTART.md       ~150 lines
────────────────────────────
Total:             ~1,550 lines
```

### Dependencies
```
Production:
- next@14.0.0
- react@18.2.0
- leaflet@1.9.4
- react-leaflet@4.2.1
- tailwindcss@3.3.0
- zustand@4.4.1
- axios@1.6.0
- lucide-react@0.263.1

Development:
- typescript@5.2.0
- @types/* (React, Node, Leaflet)
- autoprefixer@10.4.16
- postcss@8.4.32
```

## 🗂️ Directory Tree

```
walking-route-navigator/
│
├── 📚 Documentation
│   ├── README.md                 # Main documentation
│   ├── QUICKSTART.md            # Quick start guide
│   ├── DEVELOPMENT.md           # Dev guide
│   ├── FEATURES.md              # Feature docs
│   ├── PROJECT_OVERVIEW.md      # Project overview
│   └── FILE_INDEX.md            # This file
│
├── 🚀 App Source
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Main page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/
│   │   ├── LocationInput.tsx    # Location input
│   │   ├── RoutePanel.tsx       # Route panel
│   │   ├── RouteCard.tsx        # Route card
│   │   ├── RouteDetails.tsx     # Directions
│   │   ├── RouteMap.tsx         # Map container
│   │   ├── MapContent.tsx       # Leaflet map
│   │   └── ThemeToggle.tsx      # Theme toggle
│   │
│   └── lib/
│       ├── store.ts             # State management
│       ├── routing.ts           # APIs
│       ├── config.ts            # Configuration
│       ├── utils.ts             # Utilities
│       └── types.ts             # Types
│
├── ⚙️ Configuration
│   ├── package.json             # Dependencies
│   ├── next.config.js           # Next.js config
│   ├── tsconfig.json            # TypeScript config
│   ├── tailwind.config.js       # Tailwind config
│   ├── postcss.config.js        # PostCSS config
│   └── vercel.json              # Vercel config
│
├── 📝 Environment
│   ├── .env.example             # Env template
│   ├── .env.local.example       # Local env example
│   └── .gitignore               # Git ignore
│
└── 📦 Generated (after npm install)
    └── node_modules/            # Installed packages
```

## 🔍 File Dependencies

### Component Dependencies
```
page.tsx
├── imports: LocationInput, RoutePanel, RouteMap, ThemeToggle, useRouteStore
├── depends: app/globals.css
└── uses: Dark mode, responsive layout

LocationInput.tsx
├── imports: useRouteStore, searchLocation, getReverseGeocode, calculateRoutes
├── depends: lib/store.ts, lib/routing.ts
└── handles: User location input, search

RoutePanel.tsx
├── imports: useRouteStore, shareRoute, RouteCard, RouteDetails
├── depends: lib/store.ts, lib/routing.ts
└── handles: Route selection, sharing, favorites

RouteMap.tsx
├── imports: MapContent (dynamic)
├── depends: lib/store.ts
└── handles: Map loading, data passing

MapContent.tsx
├── imports: Leaflet, L (leaflet)
├── depends: lib/store.ts
└── handles: Map rendering, routes, markers
```

### Utility Dependencies
```
store.ts (Zustand)
└── No external dependencies

routing.ts
├── imports: axios
├── depends: store (indirectly via callbacks)
└── provides: Location search, route calculation

config.ts
└── No external dependencies (pure config object)

utils.ts
└── No external dependencies (pure functions)

types.ts
└── No external dependencies (TypeScript only)
```

## 🎯 File Purposes Quick Reference

| File | Purpose | Language |
|------|---------|----------|
| page.tsx | Main app component | TypeScript/React |
| layout.tsx | Root layout & metadata | TypeScript/React |
| globals.css | Global styles | CSS |
| LocationInput.tsx | Location search UI | TypeScript/React |
| RoutePanel.tsx | Route selection UI | TypeScript/React |
| RouteCard.tsx | Route display card | TypeScript/React |
| RouteDetails.tsx | Directions display | TypeScript/React |
| RouteMap.tsx | Map container | TypeScript/React |
| MapContent.tsx | Leaflet map | TypeScript/React |
| ThemeToggle.tsx | Theme switch button | TypeScript/React |
| store.ts | State management | TypeScript |
| routing.ts | Location & routing APIs | TypeScript |
| config.ts | App configuration | TypeScript |
| utils.ts | Helper functions | TypeScript |
| types.ts | Type definitions | TypeScript |
| tailwind.config.js | Tailwind configuration | JavaScript |
| next.config.js | Next.js configuration | JavaScript |
| tsconfig.json | TypeScript configuration | JSON |
| postcss.config.js | PostCSS configuration | JavaScript |
| package.json | Dependencies & scripts | JSON |
| vercel.json | Vercel deployment config | JSON |

## 📂 How Files Connect

### Data Flow
```
User Input
    ↓
LocationInput.tsx
    ↓
lib/routing.ts (searchLocation)
    ↓
store.ts (setOrigin/setDestination)
    ↓
calculateRoutes() in routing.ts
    ↓
store.ts (setRoutes)
    ↓
RoutePanel.tsx & MapContent.tsx (consume state)
    ↓
Display routes on map
```

### Component Hierarchy
```
page.tsx (root)
├── LocationInput.tsx
├── RoutePanel.tsx
│   ├── RouteCard.tsx (multiple)
│   └── RouteDetails.tsx
├── RouteMap.tsx
│   └── MapContent.tsx
└── ThemeToggle.tsx
```

### State Management
```
store.ts (Zustand)
    ↑↓
All components access/update
    ↑↓
Persisted to localStorage (favorites, theme)
```

## 🔧 How to Modify

### Change Colors
Edit: `tailwind.config.js` → `colors.pastel`

### Change Map Center
Edit: `lib/config.ts` → `MAP.DEFAULT_CENTER`

### Change Route Types
Edit: `lib/config.ts` → `ROUTES.TYPES` and `lib/routing.ts` → `calculateRoutes()`

### Add New Component
1. Create file in `components/`
2. Import in `page.tsx` or other components
3. Add styles inline or in `globals.css`

### Add New API
1. Add function in `lib/routing.ts`
2. Update types in `lib/types.ts`
3. Call from component via store action

### Change Styling
1. Update `app/globals.css` for global styles
2. Use Tailwind classes in components (preferred)
3. Custom CSS in `tailwind.config.js` animations

## 📋 Checklist for Understanding the Codebase

- [ ] Read QUICKSTART.md (5 min)
- [ ] Read PROJECT_OVERVIEW.md (10 min)
- [ ] Review page.tsx (main app structure)
- [ ] Check lib/store.ts (state management)
- [ ] Look at lib/config.ts (all settings)
- [ ] Review components/ folder (UI components)
- [ ] Check lib/routing.ts (API integration)
- [ ] Read DEVELOPMENT.md (architecture details)
- [ ] Review FEATURES.md (feature details)
- [ ] Explore THEMES.md (design system) - if present

## 🚀 Where to Start Developing

### For Small Changes
1. **Colors:** Edit `tailwind.config.js`
2. **Text/Labels:** Edit `lib/config.ts`
3. **Map Center:** Edit `lib/config.ts`

### For Component Changes
1. **UI:** Edit relevant file in `components/`
2. **Behavior:** Update `lib/store.ts` actions
3. **Styles:** Add Tailwind classes or CSS

### For Feature Additions
1. **New route option:** Update `lib/routing.ts` & `lib/config.ts`
2. **New UI:** Create component in `components/`
3. **New state:** Add to store in `lib/store.ts`

### For API Integration
1. **Add endpoint:** Update `lib/routing.ts`
2. **Handle response:** Add types to `lib/types.ts`
3. **Use in component:** Call from component via store

---

## Quick Links

- 📖 [README](./README.md) - Full documentation
- 🚀 [QUICKSTART](./QUICKSTART.md) - Get started
- 🎯 [FEATURES](./FEATURES.md) - Feature details
- 🔧 [DEVELOPMENT](./DEVELOPMENT.md) - Architecture
- 📋 [PROJECT_OVERVIEW](./PROJECT_OVERVIEW.md) - Project info
- ⚙️ [Config](./lib/config.ts) - All settings

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready ✅
