# Roof Area Calculator

Calculate building roof areas from satellite imagery using Mapbox and building footprint data.

## How it works

1. Enter a U.S. address → geocoded using Mapbox API
2. Click on a building → fetches footprint from OpenStreetMap 
3. Calculates area in square meters using UTM projection (Turf.js)
4. Displays result with data source info

## Tech Stack

- **Frontend**: React, Mapbox GL JS, Tailwind CSS
- **Backend**: Node.js, Express, Turf.js
- **APIs**: Mapbox Geocoding, OpenStreetMap Overpass

## Quick Start

### Prerequisites
- Node.js 16+
- Mapbox account ([get tokens here](https://account.mapbox.com/access-tokens/))

### Setup

```bash
# Clone and install
git clone https://github.com/anmol-ix/roof-area-poc.git
cd roof-area-poc

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### Environment Variables

**Server** (`server/.env`):
```
MAPBOX_SECRET_TOKEN=sk.your_secret_token_here
MAPBOX_PUBLIC_TOKEN=pk.your_public_token_here
OVERPASS_API_URL=https://overpass-api.de/api/interpreter
PORT=3001
```

**Client** (`client/.env`):
```
REACT_APP_MAPBOX_TOKEN=pk.your_public_token_here
```

### Run

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# → http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
# → http://localhost:3000
```

## Usage

1. Open http://localhost:3000
2. Enter address (e.g. "1600 Amphitheatre Parkway, Mountain View, CA")
3. Click on a building
4. View calculated roof area

## API Endpoints

- `GET /api/geocode?address=...` - Address to coordinates
- `GET /api/footprint?lat=...&lon=...` - Building footprint polygon
- `GET /api/area?geojson=...` - Calculate polygon area

## File Structure

```
roof-area-poc/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.js          # Main component
│   │   └── components/
│   │       └── Icons.jsx   # SVG icons
│   └── public/
├── server/                 # Express backend
│   ├── routes/
│   │   ├── geocode.js      # Mapbox geocoding
│   │   ├── footprint.js    # OpenStreetMap data
│   │   └── area.js         # Area calculation
│   └── index.js            # Server entry
└── README.md
```

## Dependencies

**Backend:**
- `express@4.17.3` - Web server
- `@turf/turf` - Geospatial calculations
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

**Frontend:**
- `react` - UI framework
- `react-map-gl@7.1.9` - Mapbox wrapper
- `axios` - HTTP client
- `tailwindcss` - CSS framework

## Troubleshooting

**Server won't start:**
- Check port 3001 is free: `lsof -i :3001`
- Verify `.env` files exist with correct tokens
- Use Express 4.17.3 (not 4.18+)

**Map not loading:**
- Check browser console for errors
- Verify `REACT_APP_MAPBOX_TOKEN` is set
- Ensure Mapbox token has correct scopes

**No building found:**
- Try urban areas (better OpenStreetMap coverage)
- Rural areas may lack building data
- Check network requests in browser dev tools

## Data Sources

- **Primary**: OpenStreetMap via Overpass API
- **Future**: Microsoft Building Footprints (currently mocked)

## Limitations

- U.S. addresses only
- Depends on OpenStreetMap building data availability
- No authentication or data persistence
- Area calculation accuracy depends on footprint data quality

## License

MIT