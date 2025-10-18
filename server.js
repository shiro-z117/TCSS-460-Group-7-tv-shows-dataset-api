const express = require('express');
const { getAllShows, getShowsByGenre, getShowsByName, getShowsByStatus, getShowById } = require('./db/queries');

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Get all shows
app.get('/api/shows', async (req, res) => {
  try {
    const shows = await getAllShows();
    res.json({
      success: true,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get shows by genre
app.get('/api/shows/by-genre/:genre', async (req, res) => {
  try {
    const shows = await getShowsByGenre(req.params.genre);
    res.json({
      success: true,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get shows by name (search)
app.get('/api/shows/by-name/:name', async (req, res) => {
  try {
    const shows = await getShowsByName(req.params.name);
    res.json({
      success: true,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get shows by status
app.get('/api/shows/by-status/:status', async (req, res) => {
  try {
    const shows = await getShowsByStatus(req.params.status);
    res.json({
      success: true,
      data: shows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get show by ID
app.get('/api/shows/:id', async (req, res) => {
  try {
    const show = await getShowById(req.params.id);
    res.json({
      success: true,
      data: show
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));