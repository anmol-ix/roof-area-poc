const express = require('express');
const router = express.Router();

/**
 * Geocoding endpoint - converts address to latitude/longitude
 * GET /geocode?address=1600 Amphitheatre Parkway, Mountain View, CA
 */
router.get('/', async (req, res) => {
  try {
    const { address } = req.query;

    // Validate input
    if (!address) {
      return res.status(400).json({
        error: 'Address parameter is required',
        example: '/geocode?address=1600 Amphitheatre Parkway, Mountain View, CA'
      });
    }

    // Check for Mapbox token
    const mapboxToken = process.env.MAPBOX_SECRET_TOKEN;
    if (!mapboxToken) {
      return res.status(500).json({
        error: 'Mapbox API token not configured'
      });
    }

    // Build Mapbox Geocoding API URL
    const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;
    const params = new URLSearchParams({
      access_token: mapboxToken,
      country: 'US', // Limit to US addresses as per requirements
      types: 'address', // Only return address results
      limit: 1 // We only need the best match
    });

    const response = await fetch(`${geocodingUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Check if we got results
    if (!data.features || data.features.length === 0) {
      return res.status(404).json({
        error: 'Address not found',
        message: 'No results found for the provided address',
        address: address
      });
    }

    const feature = data.features[0];
    const [longitude, latitude] = feature.center;

    // Return structured response
    res.json({
      success: true,
      address: {
        input: address,
        formatted: feature.place_name,
        confidence: feature.relevance || 1
      },
      coordinates: {
        latitude,
        longitude
      },
      bounds: feature.bbox || null, // Bounding box if available
      raw: process.env.NODE_ENV === 'development' ? feature : undefined
    });

  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({
      error: 'Geocoding failed',
      message: error.message,
      address: req.query.address
    });
  }
});

module.exports = router;
