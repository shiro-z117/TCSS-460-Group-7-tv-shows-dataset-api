// src/routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';
import * as Cast from '../../controllers/castController';
import {
    validateCreateShow,
    validateUpdateShow,
    validateAddCastMember,
    validateUpdateCastMember,
    checkShowExists
} from '../../core/middleware/tvShowValidation';
import { apiKeyAuth } from '../../core/middleware/apiKeyAuth';

export const tvShowRoutes = Router();

// ============================== GET ENDPOINTS ==============================

// GET /api/health
tvShowRoutes.get("/health", apiKeyAuth, TV.getHealth);

// GET /api/shows - Advanced search with filters, pagination, and sorting
tvShowRoutes.get("/shows", apiKeyAuth, TV.getShows);

// GET /api/shows/:id/images
tvShowRoutes.get("/shows/:id/images", apiKeyAuth, TV.getShowImages);

// GET /api/shows/:id/cast
tvShowRoutes.get("/shows/:id/cast", apiKeyAuth, TV.getShowCast);

// GET /api/shows/:id - Get show by ID
tvShowRoutes.get("/shows/:id", apiKeyAuth, TV.getShowById);

// PARAMETERS/METADATA

// GET /api/genres
tvShowRoutes.get("/genres", apiKeyAuth, TV.getGenres);

// GET /api/networks
tvShowRoutes.get("/networks", apiKeyAuth, TV.getNetworks);

// GET /api/statuses
tvShowRoutes.get("/statuses", apiKeyAuth, TV.getStatuses);

// GET /api/studios
tvShowRoutes.get("/studios", apiKeyAuth, TV.getStudios);

// GET /api/years/first
tvShowRoutes.get("/years/first", apiKeyAuth, TV.getYearsFirst);

// GET /api/years/last
tvShowRoutes.get("/years/last", apiKeyAuth, TV.getYearsLast);

// GET /api/seasons
tvShowRoutes.get("/seasons", apiKeyAuth, TV.getSeasons);

// ============================== POST ENDPOINTS ==============================

// POST /api/shows - Create a new show (Admin only - requires API key)
tvShowRoutes.post('/shows', apiKeyAuth, validateCreateShow, TV.createShow);

// POST /api/shows/:id/cast - Add a cast member to a show (Admin only - requires API key)
tvShowRoutes.post('/shows/:id/cast', apiKeyAuth, validateAddCastMember, Cast.addCastMember);

// ============================== PATCH ENDPOINTS ==============================

// PATCH /api/shows/:id/status - Update show status (Admin only)
tvShowRoutes.patch('/shows/:id/status', apiKeyAuth, checkShowExists, TV.updateShowStatus);

// PATCH /api/shows/:id/dates - Update show dates (Admin only)
tvShowRoutes.patch('/shows/:id/dates', apiKeyAuth, checkShowExists, TV.updateShowDates);

// PATCH /api/shows/:id/metrics - Update show metrics (Admin only)
tvShowRoutes.patch('/shows/:id/metrics', apiKeyAuth, checkShowExists, TV.updateShowMetrics);

// PATCH /api/shows/:id/cast/:actorId - Update a cast member's character name (Admin only - requires API key)
tvShowRoutes.patch('/shows/:id/cast/:actorId', apiKeyAuth, validateUpdateCastMember, Cast.updateCastMember);

// PATCH /api/shows/:id - Update a show (Admin only - requires API key)
tvShowRoutes.patch('/shows/:id', apiKeyAuth, checkShowExists, validateUpdateShow, TV.updateShow);

// ============================== DELETE ENDPOINTS ==============================

// DELETE /api/shows/:id - Delete a show by ID (Admin only - requires API key)
tvShowRoutes.delete('/shows/:id', apiKeyAuth, checkShowExists, TV.deleteShow);

// DELETE /api/shows/:id/cast/:actorId - Remove a cast member from a show (Admin only - requires API key)
tvShowRoutes.delete('/shows/:id/cast/:actorId', apiKeyAuth, Cast.deleteCastMember);