const express = require("express");
const {
  getAllShows,
  getShowsByGenre,
  getShowsByName,
  getShowsByStatus,
  getShowById,
  updateShowStatus,
  updateShowDates,
  updateShowMetrics,
} = require("./src/db/queries");
const {
  validateUpdateStatus,
  validateUpdateDates,
  validateUpdateMetrics,
} = require("./core/middleware/tvShowValidation");
const { apiKeyAuth } = require("./core/middleware/apiKeyAuth");
const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "API is running" });
});

// Get all shows
app.get("/api/shows", async (req, res) => {
  try {
    const shows = await getAllShows();
    res.json({
      success: true,
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get shows by genre
app.get("/api/shows/by-genre/:genre", async (req, res) => {
  try {
    const shows = await getShowsByGenre(req.params.genre);
    res.json({
      success: true,
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get shows by name (search)
app.get("/api/shows/by-name/:name", async (req, res) => {
  try {
    const shows = await getShowsByName(req.params.name);
    res.json({
      success: true,
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get shows by status
app.get("/api/shows/by-status/:status", async (req, res) => {
  try {
    const shows = await getShowsByStatus(req.params.status);
    res.json({
      success: true,
      data: shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get show by ID
app.get("/api/shows/:id", async (req, res) => {
  try {
    const show = await getShowById(req.params.id);
    res.json({
      success: true,
      data: show,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

// ===================================================
// ADMIN ENDPOINT: UPDATE SHOW STATUS
// ===================================================
app.patch(
  "/api/admin/shows/:id/status",
  apiKeyAuth,
  validateUpdateStatus,
  async (req, res) => {
    try {
      const showId = parseInt(req.params.id);
      const { status } = req.body;

      const updatedShow = await updateShowStatus(showId, status);

      res.status(200).json({
        success: true,
        message: "1 field(s) updated",
        data: updatedShow,
      });
    } catch (error) {
      if (error.message === "SHOW_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: "Show not found",
        });
      }
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ===================================================
// ADMIN ENDPOINT: UPDATE SHOW DATES
// ===================================================
app.patch(
  "/api/admin/shows/:id/dates",
  apiKeyAuth,
  validateUpdateDates,
  async (req, res) => {
    try {
      const showId = parseInt(req.params.id);
      const { first_air_date, last_air_date } = req.body;

      const dates = {};
      if (first_air_date !== undefined) dates.first_air_date = first_air_date;
      if (last_air_date !== undefined) dates.last_air_date = last_air_date;

      const fieldsUpdated = Object.keys(dates).length;
      const updatedShow = await updateShowDates(showId, dates);

      res.status(200).json({
        success: true,
        message: `${fieldsUpdated} field(s) updated`,
        data: updatedShow,
      });
    } catch (error) {
      if (error.message === "SHOW_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: "Show not found",
        });
      }
      if (error.message === "NO_UPDATES_PROVIDED") {
        return res.status(400).json({
          success: false,
          error: "At least one date field must be provided",
        });
      }
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// ===================================================
// ADMIN ENDPOINT: UPDATE SHOW METRICS
// ===================================================
app.patch(
  "/api/admin/shows/:id/metrics",
  apiKeyAuth,
  validateUpdateMetrics,
  async (req, res) => {
    try {
      const showId = parseInt(req.params.id);
      const { tmdb_rating, popularity, vote_count } = req.body;

      const metrics = {};
      if (tmdb_rating !== undefined) metrics.tmdb_rating = tmdb_rating;
      if (popularity !== undefined) metrics.popularity = popularity;
      if (vote_count !== undefined) metrics.vote_count = vote_count;

      const fieldsUpdated = Object.keys(metrics).length;
      const updatedShow = await updateShowMetrics(showId, metrics);

      res.status(200).json({
        success: true,
        message: `${fieldsUpdated} field(s) updated`,
        data: updatedShow,
      });
    } catch (error) {
      if (error.message === "SHOW_NOT_FOUND") {
        return res.status(404).json({
          success: false,
          error: "Show not found",
        });
      }
      if (error.message === "NO_UPDATES_PROVIDED") {
        return res.status(400).json({
          success: false,
          error: "At least one metric field must be provided",
        });
      }
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
