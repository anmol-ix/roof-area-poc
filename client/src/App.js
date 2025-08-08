import React, { useState, useCallback } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { 
  BuildingIcon, 
  AnalyticsIcon, 
  LocationIcon, 
  SearchIcon, 
  SettingsIcon, 
  TargetIcon, 
  WarningIcon, 
  LoadingIcon, 
  HomeIcon, 
  RulerIcon 
} from './components/Icons';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        zoom: 17 // zoom level to show more area around the location
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

  // Show full-screen loading overlay when both footprint and area are loading
  const showFullScreenLoading = isLoading && pin;

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

  // Debug token
  console.log('MAPBOX_TOKEN:', MAPBOX_TOKEN ? 'Loaded' : 'Missing');

  return (
    <div style={{ 
      fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
      height: '100vh', 
      width: '100%', 
      overflow: 'hidden',
      backgroundColor: '#f8fafc'
    }}>
      {/* Professional Header */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '60px',
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px'
      }}>
        {/* Left: Logo + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#3b82f6',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BuildingIcon size={18} color="white" />
            </div>
            <div>
              <h1 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: 'white', 
                margin: '0',
                lineHeight: '1'
              }}>
                RoofScope
              </h1>
              <p style={{ 
                fontSize: '11px', 
                color: '#94a3b8', 
                margin: '0',
                lineHeight: '1'
              }}>
                AI-Powered Roof Analysis
              </p>
            </div>
          </div>
          
          {/* Embedded Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '400px', flex: 1 }}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGeocode()}
              placeholder="Enter U.S. address..."
              disabled={isGeocoding}
              style={{ 
                flex: 1,
                padding: '8px 12px', 
                border: '1px solid #475569', 
                borderRadius: '4px', 
                fontSize: '14px',
                backgroundColor: '#334155',
                color: 'white',
                outline: 'none'
              }}
            />
            <button
              onClick={handleGeocode}
              disabled={isGeocoding || !address.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: (isGeocoding || !address.trim()) ? '#64748b' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: (isGeocoding || !address.trim()) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isGeocoding ? (
                <>
                  <LoadingIcon size={14} color="white" className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon size={14} color="white" />
                  Find
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Right: Mapbox Attribution */}
        <div style={{ 
          fontSize: '11px', 
          color: '#94a3b8', 
          fontWeight: '500'
        }}>
          Powered by Mapbox
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        display: 'flex', 
        marginTop: '60px', 
        height: 'calc(100vh - 60px)' 
      }}>
        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            onClick={handleMapClick}
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/satellite-v9"
            cursor="crosshair"
          >
            {/* Professional Pin Marker */}
            {pin && (
              <Marker
                longitude={pin.longitude}
                latitude={pin.latitude}
                anchor="bottom"
              >
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}></div>
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

        {/* Right Sidebar */}
        <div style={{ 
          width: '280px', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderLeft: '1px solid #e2e8f0',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
          overflow: 'auto',
          display: isMobile ? 'none' : 'block'
        }}>
          <div style={{ padding: '16px' }}>
            <h2 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e293b', 
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AnalyticsIcon size={16} color="#3b82f6" />
              Building Analytics
            </h2>
            
            {error && (
              <div style={{ 
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <WarningIcon size={16} color="#dc2626" />
                {error}
              </div>
            )}
            
            {isLoading && (
              <div style={{ 
                backgroundColor: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <LoadingIcon size={16} color="#2563eb" className="animate-spin" />
                Analyzing building...
              </div>
            )}
            
            {!pin && !isLoading && !error && (
              <div style={{ 
                textAlign: 'center',
                padding: '32px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '4px',
                border: '1px dashed #cbd5e1'
              }}>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  <TargetIcon size={32} color="#94a3b8" />
                </div>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#475569', 
                  margin: '0 0 4px 0' 
                }}>
                  Ready to Analyze
                </h3>
                <p style={{ 
                  fontSize: '12px', 
                  color: '#64748b', 
                  margin: '0'
                }}>
                  Click on any building on the map
                </p>
              </div>
            )}
            
            {pin && !isLoading && !error && !roofArea && (
              <div style={{ 
                textAlign: 'center',
                padding: '24px 16px',
                backgroundColor: '#fef3c7',
                borderRadius: '4px',
                border: '1px solid #fbbf24',
                fontSize: '14px',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <HomeIcon size={16} color="#92400e" />
                No building found at this location
              </div>
            )}
            
            {roofArea && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Main Result */}
                <div style={{ 
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '4px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#166534', margin: '0 0 4px 0' }}>
                    {roofArea.area.toLocaleString()} m²
                  </div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <RulerIcon size={12} color="#16a34a" />
                    Calculated Roof Area
                  </div>
                </div>
                
                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <LocationIcon size={12} color="#64748b" />
                      Source
                    </span>
                    <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600' }}>
                      {buildingFootprint?.properties?.source || 'Unknown'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SettingsIcon size={12} color="#64748b" />
                      Method
                    </span>
                    <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600' }}>
                      {roofArea.calculation_method}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TargetIcon size={12} color="#64748b" />
                      Precision
                    </span>
                    <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '600' }}>
                      {roofArea.precision}
                    </span>
                  </div>
                  
                  {pin && (
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LocationIcon size={12} color="#64748b" />
                        Coordinates
                      </div>
                      <div style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace' }}>
                        <div>Lat: {pin.latitude.toFixed(6)}</div>
                        <div>Lon: {pin.longitude.toFixed(6)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Drawer */}
      {isMobile && (pin || isLoading || error) && (
        <div style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 999,
          maxHeight: '50vh',
          overflow: 'auto'
        }}>
          <div style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AnalyticsIcon size={14} color="#3b82f6" />
              Building Analytics
            </h3>
            
            {error && (
              <div style={{ 
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '14px',
                color: '#dc2626',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <WarningIcon size={14} color="#dc2626" />
                {error}
              </div>
            )}
            
            {isLoading && (
              <div style={{ 
                backgroundColor: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '14px',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <LoadingIcon size={14} color="#2563eb" className="animate-spin" />
                Analyzing building...
              </div>
            )}
            
            {roofArea && (
              <div>
                <div style={{ 
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '4px',
                  padding: '16px',
                  textAlign: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#166534' }}>
                    {roofArea.area.toLocaleString()} m²
                  </div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>
                    Calculated Roof Area
                  </div>
                </div>
                
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Source: {buildingFootprint?.properties?.source || 'Unknown'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {showFullScreenLoading && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          zIndex: 2000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '32px', 
            borderRadius: '4px', 
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{ margin: '0 auto 16px auto', display: 'flex', justifyContent: 'center' }}>
              <LoadingIcon size={32} color="#3b82f6" className="animate-spin" />
            </div>
            <div style={{ fontSize: '16px', fontWeight: '500', color: '#1e293b' }}>
              Analyzing Building
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;