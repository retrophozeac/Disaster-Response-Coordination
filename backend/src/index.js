const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const { initSocket } = require('./websockets/socket');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
const disasterRoutes = require('./services/disaster/disaster.router');
const geocodingRoutes = require('./services/geocoding/geocoding.router');
const { nearbyResourcesRouter } = require('./services/resources/resources.router');
app.use('/api/disasters', disasterRoutes);
app.use('/api/geocode', geocodingRoutes);
app.use('/api/resources/nearby', nearbyResourcesRouter);

// Basic Route
app.get('/', (req, res) => {
  res.send('Disaster Response Coordination Platform API is running...');
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server }; // We no longer export io from here
