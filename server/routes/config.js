const express = require('express');
const router = express.Router();

/**
 * Configuration endpoint - provides client configuration including Mapbox token
 * GET /config
 */
router.get('/', (req, res) => {
  try {
    // Return configuration needed by the frontend
    res.json({
      success: true,
      config: {
        mapboxToken: process.env.MAPBOX_PUBLIC_TOKEN,
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    console.error('Config endpoint error:', error);
    res.status(500).json({
      error: 'Failed to load configuration',
      message: error.message
    });
  }
});

module.exports = router;
