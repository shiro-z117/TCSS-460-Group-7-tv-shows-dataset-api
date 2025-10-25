// src/routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';

export const tvShowRoutes = Router();


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

// Shiannel: GET /api/health
tvShowRoutes.get('/health', TV.getHealth);

