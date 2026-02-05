# Quick Start Guide 🚀

Get Walking Route Navigator up and running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Modern web browser

## Installation

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Leaflet.js
- TailwindCSS
- Zustand
- And more!

### Step 2: Start Development Server
```bash
npm run dev
```

Your app is now running at **[http://localhost:3000](http://localhost:3000)**

Open it in your browser and start navigating! 🎉

## First Steps in the App

1. **Allow Location Access**
   - When prompted, click "Allow" to share your location
   - The app will pin your location as the starting point

2. **Enter Destination**
   - Search for a destination (e.g., "Central Park")
   - Wait for suggestions to appear
   - Click on your desired destination

3. **View Routes**
   - The app calculates 4 different routes:
     - 🎀 **Shortest Route** (pink)
     - 💜 **Fastest Route** (purple)
     - 💙 **Safest Route** (blue)
     - 💚 **Scenic Route** (green)

4. **Select a Route**
   - Click on any route card to select it
   - The route highlights on the map
   - View turn-by-turn directions

5. **Share or Save**
   - Click **Share** to generate a shareable link
   - Click the **❤️** heart to save as favorite

## Useful Features

### 🔄 Swap Origin & Destination
Click the circular button between the two location inputs to swap them.

### 🌙 Toggle Dark Mode
Click the moon/sun icon in the top right to switch themes.

### 📍 Refresh Location
Click the navigation icon next to the starting point to update your current location.

### 👣 View Directions
Click "👣 Directions" on a selected route to see step-by-step navigation.

## Configuration

### Change Default Location
Edit the map's default center in `lib/config.ts`:
```typescript
MAP: {
  DEFAULT_CENTER: [40.7128, -74.006], // [latitude, longitude]
  ...
}
```

### Add Your Own API Keys
Create `.env.local`:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
NEXT_PUBLIC_OSRM_API=https://router.project-osrm.org
```

## Available Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
walking-route-navigator/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/              # Utilities, store, routing logic
├── public/           # Static assets
└── package.json      # Dependencies
```

## Deploying to Vercel

### Option 1: Git Push
```bash
git push origin main
```
Vercel auto-deploys on push.

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 3: Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Click "Deploy"

## Troubleshooting

### "Module not found" error
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Geolocation not working
- Make sure you allow location permission
- Must use HTTPS (or localhost)
- Try Firefox if Chrome is having issues

### Map not displaying
- Clear browser cache
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for errors

## Next Steps

### Learn More
- 📖 [Full README](./README.md) - Complete documentation
- 🔧 [Development Guide](./DEVELOPMENT.md) - Architecture & internals
- ✨ [Features Documentation](./FEATURES.md) - Detailed feature info
- ⚙️ [Configuration](./lib/config.ts) - All config options

### Customize
- Edit `tailwind.config.js` for colors
- Modify components in `components/`
- Update store in `lib/store.ts`
- Add your own logic in `lib/routing.ts`

### Extend
- Integrate real routing API (OSRM/Mapbox)
- Add user authentication
- Connect to database
- Deploy to production

## Need Help?

- 🐛 Check the [DEVELOPMENT.md](./DEVELOPMENT.md) troubleshooting section
- 📚 Review code comments
- 🔍 Check browser console for error messages
- 🤔 Look at the [GitHub Issues](./issues) for common problems

## Ready to Deploy?

When your app is ready:

1. Build for production:
   ```bash
   npm run build
   npm start
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Visit your live app! 🎉

---

**Happy walking! 🚶‍♂️** 

Don't forget to share your favorite routes with friends! 🌍
