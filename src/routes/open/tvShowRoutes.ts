// src/routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';

export const tvShowRoutes = Router();

// GET /api/shows
tvShowRoutes.get('/shows', TV.list);

// GET /api/shows/by-genre/:genre
tvShowRoutes.get('/shows/by-genre/:genre', TV.getByGenre);
