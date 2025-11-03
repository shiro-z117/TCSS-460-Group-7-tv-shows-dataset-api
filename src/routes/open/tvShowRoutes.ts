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

// POST /api/shows - create a new show
tvShowRoutes.post('/shows', apiKeyAuth, Validator.validateCreateShow, TV.createShow);

// POST /api/actors - Add an actor to the database
tvShowRoutes.post('/actors', apiKeyAuth, Validator.validateCreateActor, TV.createActor);

// POST /api/networks - Add a network to the database
tvShowRoutes.post('/networks', apiKeyAuth, Validator.validateCreateNetwork, TV.createNetwork);

// POST /api/studios - Add a studio to the database
tvShowRoutes.post('/studios', apiKeyAuth, Validator.validateCreateStudio, TV.createStudio);

// POST /api/creators - Add a creator to the database
tvShowRoutes.post('/creators', apiKeyAuth, Validator.validateCreateCreator, TV.createCreator);

// ============================== PATCH ENDPOINTS ==============================

// PATCH /api/shows/:id/ - Update show data
tvShowRoutes.patch('/shows/:id/status', apiKeyAuth, TV.updateShowStatus);

// PATCH /api/actor/:id/ - Update actor data
tvShowRoutes.patch('/actors/:id/', apiKeyAuth, Validator.validateUpdateActor, TV.updateActor);

// ============================== DELETE ENDPOINTS ==============================

// DELETE /api/shows/:id - delete a show by ID
tvShowRoutes.delete('/shows/:id', apiKeyAuth, Validator.validateDeleteShow, TV.deleteShow);

// DELETE /api/actors/:id - delete an actor by ID
tvShowRoutes.delete('/actors/:id', apiKeyAuth, Validator.validateDeleteActor, TV.deleteActor);

// DELETE /api/networks/:id - delete a network by ID
tvShowRoutes.delete('/networks/:id', apiKeyAuth, Validator.validateDeleteNetwork, TV.deleteNetwork);

// DELETE /api/studios/:id - delete a studio by ID
tvShowRoutes.delete('/studios/:id', apiKeyAuth, Validator.validateDeleteStudio, TV.deleteStudio);

// DELETE /api/creators/:id - delete a creator by ID
tvShowRoutes.delete('/creators/:id', apiKeyAuth, Validator.validateDeleteCreator, TV.deleteCreator);