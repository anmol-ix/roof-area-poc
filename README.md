# Roof Area Calculator POC

A proof-of-concept web application that calculates building roof areas from satellite imagery using Mapbox and building footprint data.

## Features

- 🗺️ **Address Geocoding**: Enter a U.S. street address to find coordinates
- 🛰️ **High-res Satellite Maps**: Mapbox satellite tiles at zoom levels 19-20
- 📍 **Interactive Pin Dropping**: Click to drop pins on buildings
- 🏠 **Building Footprint Lookup**: Query Microsoft Building Footprints + OpenStreetMap fallback
- 📐 **Accurate Area Calculation**: UTM projection with ±1m² accuracy using Turf.js

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  React Frontend │────│  Express Backend │────│  External APIs  │
│                 │    │                  │    │                 │
│ • Address Input │    │ • /api/geocode   │    │ • Mapbox API    │
│ • Mapbox GL Map │    │ • /api/footprint │    │ • Microsoft     │
│ • Pin Dropping  │    │ • /api/area      │    │ • OpenStreetMap │
│ • Area Display  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Mapbox account with API tokens

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd roof-area-poc
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies  
   cd ../client
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp server/.env.example server/.env
   
   # Edit server/.env with your actual tokens:
   MAPBOX_SECRET_TOKEN=sk.your_secret_token_here
   MAPBOX_PUBLIC_TOKEN=pk.your_public_token_here
   ```

3. **Get Mapbox API tokens:**
   - Go to [Mapbox Account](https://account.mapbox.com/access-tokens/)
   - Create a **Public Token** (for map display)
   - Create a **Secret Token** (for server-side geocoding)

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:3001
   ```

2. **Start the React frontend:**
   ```bash
   cd client  
   npm start
   # Client runs on http://localhost:3000
   ```

3. **Test the application:**
   - Open http://localhost:3000 in your browser
   - Enter a U.S. address (e.g., "1600 Amphitheatre Parkway, Mountain View, CA")
   - Click on a building to drop a pin
   - View the calculated roof area

## API Endpoints

### Backend Server (Port 3001)

- **GET** `/health` - Health check
- **GET** `/api/geocode?address=...` - Convert address to coordinates
- **GET** `/api/footprint?lat=...&lon=...` - Get building footprint polygon
- **GET** `/api/area?geojson=...` - Calculate polygon area in square meters

### Example API Usage

```bash
# Geocode an address
curl "http://localhost:3001/api/geocode?address=1600 Amphitheatre Parkway, Mountain View, CA"

# Get building footprint
curl "http://localhost:3001/api/footprint?lat=37.4220&lon=-122.0841"

# Calculate area
curl "http://localhost:3001/api/area?geojson={...geojson polygon...}"
```

## Dependencies

### Backend
- **express@4.17.3** - Web server framework
- **@turf/turf** - Geospatial analysis and area calculation
- **node-fetch** - HTTP client for external APIs
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend  
- **react** - UI framework
- **react-map-gl** - Mapbox GL JS React wrapper
- **axios** - HTTP client for API calls

## Data Sources

1. **Primary**: [Microsoft U.S. Building Footprints](https://planetarycomputer.microsoft.com/) via Planetary Computer STAC API
2. **Fallback**: [OpenStreetMap](https://www.openstreetmap.org/) via Overpass API

## Limitations & Future Improvements

- Microsoft Building Footprints implementation is mocked (needs real STAC API integration)
- U.S. addresses only (configurable in geocoding)
- No user authentication or data persistence
- Could add building height estimation
- Could integrate computer vision for roof analysis

## Troubleshooting

### Server won't start
- Check that port 3001 is available (`lsof -i :3001`)
- Verify environment variables are set correctly
- Ensure Express version is 4.17.3 (not 4.18+)

### Map not loading
- Verify `MAPBOX_PUBLIC_TOKEN` is set correctly
- Check browser console for API errors
- Ensure token has proper scopes

### Building footprints not found
- Currently using OpenStreetMap fallback only
- Some rural areas may not have building data
- Urban areas typically have better coverage

## License

MIT License - see LICENSE file for details.
