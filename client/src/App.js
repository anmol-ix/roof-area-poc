import React, { useState, useCallback } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import './App.css';

// Mapbox public token from environment
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

function App() {
  const [address, setAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -122.1430,
    latitude: 37.4419,
    zoom: 8
  });
  const [pin, setPin] = useState(null);
  const [buildingFootprint, setBuildingFootprint] = useState(null);
  const [roofArea, setRoofArea] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle address geocoding
  const handleGeocode = async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setIsGeocoding(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/geocode`, {
        params: { address: address.trim() }
      });

      const { coordinates } = response.data;
      
      // Update map view to geocoded location
      setViewState({
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        zoom: 19 // High zoom for satellite detail
      });

      // Clear previous pin and footprint
      setPin(null);
      setBuildingFootprint(null);
      setRoofArea(null);

    } catch (err) {
      console.error('Geocoding error:', err);
      setError(err.response?.data?.message || 'Failed to geocode address');
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle map click to drop pin and fetch building footprint
  const handleMapClick = useCallback(async (event) => {
    const { lng, lat } = event.lngLat;
    
    // Set pin location
    setPin({ longitude: lng, latitude: lat });
    setError(null);
    setIsLoading(true);
    setBuildingFootprint(null);
    setRoofArea(null);

    try {
      // Fetch building footprint
      const footprintResponse = await axios.get('/api/footprint', {
        params: { lat, lon: lng }
      });

      const footprint = footprintResponse.data.footprint;
      setBuildingFootprint(footprint);

      // Calculate area
      const areaResponse = await axios.post('/api/area', footprint);
      setRoofArea(areaResponse.data);

    } catch (err) {
      console.error('Building footprint/area error:', err);
      if (err.response?.status === 404) {
        setError('No building found at this location. Try clicking on a building.');
      } else {
        setError(err.response?.data?.message || 'Failed to get building data');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle Enter key in address input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGeocode();
    }
  };

  // Building footprint layer style
  const buildingLayerStyle = {
    id: 'building-footprint',
    type: 'fill',
    paint: {
      'fill-color': '#ff0000',
      'fill-opacity': 0.3
    }
  };

  const buildingOutlineStyle = {
    id: 'building-outline',
    type: 'line',
    paint: {
      'line-color': '#ff0000',
      'line-width': 2
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>🏠 Roof Area Calculator</h1>
        <p>Enter a U.S. address, then click on a building to calculate its roof area</p>
      </div>

      <div className="controls">
        <div className="address-input">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a U.S. address (e.g., 1600 Amphitheatre Parkway, Mountain View, CA)"
            disabled={isGeocoding}
          />
          <button 
            onClick={handleGeocode} 
            disabled={isGeocoding || !address.trim()}
            className="geocode-btn"
          >
            {isGeocoding ? 'Searching...' : 'Find Location'}
          </button>
        </div>

        {error && (
          <div className="error">
            ⚠️ {error}
          </div>
        )}

        {isLoading && (
          <div className="loading">
            🔄 Analyzing building...
          </div>
        )}

        {roofArea && (
          <div className="results">
            <h3>📐 Roof Area Results</h3>
            <div className="result-item">
              <strong>Area:</strong> {roofArea.area.toLocaleString()} square meters
            </div>
            <div className="result-item">
              <strong>Source:</strong> {buildingFootprint?.properties?.source || 'Unknown'}
            </div>
            <div className="result-item">
              <strong>Coordinates:</strong> {pin?.latitude.toFixed(6)}, {pin?.longitude.toFixed(6)}
            </div>
            <div className="result-item">
              <strong>Method:</strong> {roofArea.calculation_method}
            </div>
            <div className="result-item">
              <strong>Precision:</strong> {roofArea.precision}
            </div>
          </div>
        )}
      </div>

      <div className="map-container">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '600px' }}
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          cursor="crosshair"
        >
          {/* Pin marker */}
          {pin && (
            <Marker
              longitude={pin.longitude}
              latitude={pin.latitude}
              anchor="bottom"
            >
              <div className="pin">📍</div>
            </Marker>
          )}

          {/* Building footprint */}
          {buildingFootprint && (
            <Source type="geojson" data={buildingFootprint}>
              <Layer {...buildingLayerStyle} />
              <Layer {...buildingOutlineStyle} />
            </Source>
          )}
        </Map>
      </div>

      <div className="instructions">
        <h3>📋 Instructions</h3>
        <ol>
          <li>Enter a U.S. street address in the search box above</li>
          <li>Click "Find Location" to center the map on that address</li>
          <li>The map will show high-resolution satellite imagery</li>
          <li>Click on any building to drop a pin and calculate its roof area</li>
          <li>View the calculated area and building information in the results panel</li>
        </ol>
      </div>
    </div>
  );
}

export default App;