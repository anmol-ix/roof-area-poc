const express = require('express');
const router = express.Router();

/**
 * Building footprint endpoint - gets building polygon at given coordinates
 * GET /footprint?lat=37.4419&lon=-122.1430
 */
router.get('/', async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Validate input
    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Latitude and longitude parameters are required',
        example: '/footprint?lat=37.4419&lon=-122.1430'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        error: 'Invalid latitude or longitude values'
      });
    }

    // Try Microsoft Building Footprints first
    let footprint = await getMicrosoftFootprint(latitude, longitude);
    
    if (!footprint) {
      console.log('No Microsoft footprint found, trying OpenStreetMap...');
      footprint = await getOSMFootprint(latitude, longitude);
    }

    if (!footprint) {
      return res.status(404).json({
        error: 'No building footprint found',
        message: 'No building found at the specified coordinates',
        coordinates: { latitude, longitude },
        sources_checked: ['Microsoft Building Footprints', 'OpenStreetMap']
      });
    }

    res.json({
      success: true,
      coordinates: { latitude, longitude },
      footprint,
      source: footprint.source
    });

  } catch (error) {
    console.error('Footprint lookup error:', error);
    res.status(500).json({
      error: 'Footprint lookup failed',
      message: error.message,
      coordinates: { lat: req.query.lat, lon: req.query.lon }
    });
  }
});

/**
 * Query Microsoft Building Footprints via Planetary Computer STAC API
 */
async function getMicrosoftFootprint(latitude, longitude) {
  try {
    // Microsoft Building Footprints are available through Planetary Computer
    // Note: This is a simplified approach. In production, you'd want to:
    // 1. Use the STAC API to find the right tile
    // 2. Download and query the actual data
    // For this POC, we'll use a mock response since the actual implementation
    // requires more complex tile-based querying
    
    // Mock implementation - in real scenario you'd query the actual dataset
    console.log(`Querying Microsoft Building Footprints for ${latitude}, ${longitude}`);
    
    // Return null to trigger OSM fallback for this POC
    return null;
    
  } catch (error) {
    console.error('Microsoft API error:', error);
    return null;
  }
}

/**
 * Query OpenStreetMap building footprints via Overpass API
 */
async function getOSMFootprint(latitude, longitude) {
  try {
    const overpassUrl = process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
    
    // Create a small bounding box around the point (approximately 50m radius)
    const buffer = 0.0005; // roughly 50 meters
    const bbox = {
      south: latitude - buffer,
      west: longitude - buffer,
      north: latitude + buffer,
      east: longitude + buffer
    };

    // Overpass QL query to find buildings
    const query = `
      [out:json][timeout:25];
      (
        way["building"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
        relation["building"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
      );
      out geom;
    `;

    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      return null;
    }

    // Find the building closest to our point
    let closestBuilding = null;
    let closestDistance = Infinity;

    for (const element of data.elements) {
      if (element.type === 'way' && element.geometry) {
        // Calculate distance from point to building centroid
        const centroid = calculateCentroid(element.geometry);
        const distance = calculateDistance(latitude, longitude, centroid.lat, centroid.lon);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestBuilding = element;
        }
      }
    }

    if (!closestBuilding) {
      return null;
    }

    // Convert OSM geometry to GeoJSON
    const coordinates = closestBuilding.geometry.map(node => [node.lon, node.lat]);
    
    // Ensure polygon is closed
    if (coordinates.length > 0 && 
        (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
         coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
      coordinates.push(coordinates[0]);
    }

    return {
      type: 'Feature',
      properties: {
        source: 'OpenStreetMap',
        building: closestBuilding.tags?.building || 'yes',
        osm_id: closestBuilding.id,
        distance_meters: Math.round(closestDistance * 111000) // rough conversion to meters
      },
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      }
    };

  } catch (error) {
    console.error('OSM API error:', error);
    return null;
  }
}

/**
 * Calculate centroid of a polygon
 */
function calculateCentroid(geometry) {
  let lat = 0, lon = 0;
  for (const node of geometry) {
    lat += node.lat;
    lon += node.lon;
  }
  return {
    lat: lat / geometry.length,
    lon: lon / geometry.length
  };
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;
