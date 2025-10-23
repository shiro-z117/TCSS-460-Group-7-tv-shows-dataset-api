// src/routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';

export const tvShowRoutes = Router();


// GET /api/shows
tvShowRoutes.get('/shows', TV.list);

// GET /api/shows/by-genre/:genre
tvShowRoutes.get('/shows/by-genre/:genre', TV.getByGenre);

// GET /api/genres
tvShowRoutes.get('/genres', TV.getGenres);

// GET /api/networks
tvShowRoutes.get('/networks', TV.getNetworks);

// GET /api/statuses
tvShowRoutes.get('/statuses', TV.getStatuses);
