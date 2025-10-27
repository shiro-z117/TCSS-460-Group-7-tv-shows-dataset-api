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

// POST /api/shows - Create a new show (Admin only - requires API key)
tvShowRoutes.post('/shows', apiKeyAuth, validateCreateShow, TV.createShow);

// DELETE /api/shows/:id - Delete a show by ID (Admin only - requires API key)
// Check existence first (404) before auth (401)
tvShowRoutes.delete('/shows/:id', checkShowExists, apiKeyAuth, TV.deleteShow);

// GET /api/shows - Advanced search with filters, pagination, and sorting
tvShowRoutes.get('/shows', TV.getShows);

// GET /api/shows/random - Get one random show
tvShowRoutes.get('/shows/random', TV.getRandomShow);

// GET /api/shows/:id - Get show by ID
tvShowRoutes.get('/shows/:id', TV.getShowById);

// GET /api/shows/by-genre/:genre - Must be before /shows/:id to avoid conflict
tvShowRoutes.get('/shows/by-genre/:genre', TV.getByGenre);

// ===== CAST ROUTES - Must be before /shows/:id to avoid route conflict =====

// POST /api/shows/:id/cast - Add a cast member to a show (Admin only - requires API key)
tvShowRoutes.post('/shows/:id/cast', apiKeyAuth, validateAddCastMember, Cast.addCastMember);

// PATCH /api/shows/:id/cast/:actorId - Update a cast member's character name (Admin only - requires API key)
tvShowRoutes.patch('/shows/:id/cast/:actorId', apiKeyAuth, validateUpdateCastMember, Cast.updateCastMember);

// DELETE /api/shows/:id/cast/:actorId - Remove a cast member from a show (Admin only - requires API key)
tvShowRoutes.delete('/shows/:id/cast/:actorId', apiKeyAuth, Cast.deleteCastMember);

// GET /api/shows/:id - Get a single show by ID (must be after more specific routes like /shows/:id/cast)
tvShowRoutes.get('/shows/:id', TV.getShow);

// PATCH /api/shows/:id - Update a show (Admin only - requires API key)
tvShowRoutes.patch('/shows/:id', checkShowExists, apiKeyAuth, validateUpdateShow, TV.updateShow);

// GET /api/genres
tvShowRoutes.get('/genres', TV.getGenres);

// GET /api/networks
tvShowRoutes.get('/networks', TV.getNetworks);

// GET /api/statuses
tvShowRoutes.get('/statuses', TV.getStatuses);

//Linda: GET /api/studios 
tvShowRoutes.get('/studios', TV.getStudios);

// Linda: GET /api/years/first
tvShowRoutes.get('/years/first', TV.getYearsFirst);

// Linda: GET /api/years/last
tvShowRoutes.get('/years/last', TV.getYearsLast);

// Linda: GET /api/seasons
tvShowRoutes.get('/seasons', TV.getSeasons);

// GET /api/health
tvShowRoutes.get('/health', TV.getHealth);

// GET /api/shows/:id/images
tvShowRoutes.get('/shows/:id/images', TV.getShowImages);

// GET /api/shows/:id/cast
tvShowRoutes.get('/shows/:id/cast', TV.getShowCast);
