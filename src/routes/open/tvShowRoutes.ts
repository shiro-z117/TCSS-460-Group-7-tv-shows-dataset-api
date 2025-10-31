// src/routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';
import * as Validator from '../../core/middleware/tvShowValidation';
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

// GET /api/genres - a list of genres in the database
tvShowRoutes.get("/genres", apiKeyAuth, TV.getGenres);

// GET /api/networks - a list of networks in the database
tvShowRoutes.get("/networks", apiKeyAuth, TV.getNetworks);

// GET /api/statuses - a list of statuses in the database
tvShowRoutes.get("/statuses", apiKeyAuth, TV.getStatuses);

// GET /api/studios - a list of studios in the database
tvShowRoutes.get("/studios", apiKeyAuth, TV.getStudios);

// GET /api/years/first - a range of years from the minimum and maximum first air dates in the database
tvShowRoutes.get("/years/first", apiKeyAuth, TV.getYearsFirst);

// GET /api/years/last - a range of years from the minimum and maximum last air dates in the database
tvShowRoutes.get("/years/last", apiKeyAuth, TV.getYearsLast);

// GET /api/episodes - a range of numbers from the minimum and maximum episode counts in the database
tvShowRoutes.get("/episodes", apiKeyAuth, TV.getEpisodes);

// ============================== DATA MODIFICATION (POST/PATCH/DELETE) ==============================

// ============================== POST ENDPOINTS ==============================

// POST /api/shows - Create a new show (Admin only - requires API key)
tvShowRoutes.post('/shows', apiKeyAuth, Validator.validateCreateShow, TV.createShow);

// POST /api/shows/:id/cast - Add a cast member to a show (Admin only - requires API key)
tvShowRoutes.post('/shows/:id/cast', apiKeyAuth, Validator.validateAddCastMember, TV.addCastMember);

// ============================== PATCH ENDPOINTS ==============================

// PATCH /api/shows/:id/status - Update show status (Admin only)
tvShowRoutes.patch('/shows/:id/status', apiKeyAuth, Validator.checkShowExists, TV.updateShowStatus);

// PATCH /api/shows/:id/dates - Update show dates (Admin only)
tvShowRoutes.patch('/shows/:id/dates', apiKeyAuth, Validator.checkShowExists, TV.updateShowDates);

// PATCH /api/shows/:id/metrics - Update show metrics (Admin only)
tvShowRoutes.patch('/shows/:id/metrics', apiKeyAuth, Validator.checkShowExists, TV.updateShowMetrics);

// PATCH /api/shows/:id/cast/:actorId - Update a cast member's character name (Admin only - requires API key)
tvShowRoutes.patch('/shows/:id/cast/:actorId', apiKeyAuth, Validator.validateUpdateCastMember, TV.updateCastMember);

// PATCH /api/shows/:id - Update a show (Admin only - requires API key)
tvShowRoutes.patch('/shows/:id', apiKeyAuth, Validator.checkShowExists, Validator.validateUpdateShow, TV.updateShow);

// ============================== DELETE ENDPOINTS ==============================

// DELETE /api/shows/:id - Delete a show by ID
tvShowRoutes.delete('/shows/:id', apiKeyAuth, Validator.checkShowExists, TV.deleteShow);

// DELETE /api/ - delete an actor
tvShowRoutes.delete('/actors/:id', apiKeyAuth, Validator.checkActorExists, TV.deleteActor);

// DELETE /api/ - delete a network


// DELETE /api/ - delete a studio


// DELETE /api/ - delete a creator
