// src/routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';
import { validateCreateShow } from '../../core/middleware/tvShowValidation';
import { apiKeyAuth } from '../../core/middleware/apiKeyAuth';

export const tvShowRoutes = Router();

// POST /api/shows - Create a new show (Admin only - requires API key)
tvShowRoutes.post('/shows', apiKeyAuth, validateCreateShow, TV.createShow);

// DELETE /api/shows/:id - Delete a show by ID (Admin only - requires API key)
tvShowRoutes.delete('/shows/:id', apiKeyAuth, TV.deleteShow);

// GET /api/shows - Advanced search with filters, pagination, and sorting
tvShowRoutes.get('/shows', TV.getShows);

// GET /api/shows/random - Get one random show
tvShowRoutes.get('/shows/random', TV.getRandomShow);

// GET /api/shows/:id - Get show by ID
tvShowRoutes.get('/shows/:id', TV.getShowById);

// GET /api/shows/by-genre/:genre
tvShowRoutes.get('/shows/by-genre/:genre', TV.getByGenre);

// GET /api/genres
tvShowRoutes.get('/genres', TV.getGenres);

// GET /api/networks
tvShowRoutes.get('/networks', TV.getNetworks);

// GET /api/statuses
tvShowRoutes.get('/statuses', TV.getStatuses);
