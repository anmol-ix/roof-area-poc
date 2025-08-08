const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import route handlers
const geocodeRoute = require('./routes/geocode');
const footprintRoute = require('./routes/footprint');
const areaRoute = require('./routes/area');
const configRoute = require('./routes/config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'roof-area-calculator-api'
  });
});

// API Routes
app.use('/api/geocode', geocodeRoute);
app.use('/api/footprint', footprintRoute);
app.use('/api/area', areaRoute);
app.use('/api/config', configRoute);

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🗺️  Geocoding: http://localhost:${PORT}/api/geocode?address=...`);
  console.log(`🏠 Footprints: http://localhost:${PORT}/api/footprint?lat=...&lon=...`);
  console.log(`📐 Area calc: http://localhost:${PORT}/api/area?geojson=...`);
});

module.exports = app;
